// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./IUSDT.sol";
import "./InvestmentToken.sol";

/// @title InvestmentPool
/// @notice Контракт инвестиционного пула — отдельный проект для сбора средств.
/// @dev Управляет инвестированием, возвратами, переводом компании и выплатами по сценариям.
contract InvestmentPool is Ownable, ReentrancyGuard {
    using SafeERC20 for IUSDT;

    /// @notice Возможные состояния пула
    enum State { Funding, Succeeded, Failed, Released }

    /// @notice Возможные сценарии выплат (для выкупа или частичного возврата)
    enum Scenario { SuccessPayout, FailurePartial }

    /// @notice Стабильная валюта (USDT), используемая для инвестиций
    IUSDT public immutable usdt;

    /// @notice Токен-доля, выпускаемый для инвесторов данного пула
    InvestmentToken public immutable shareToken;

    /// @notice Целевая сумма инвестиций
    uint256 public immutable targetAmount;

    /// @notice Дата дедлайна (timestamp)
    uint256 public immutable deadline;

    /// @notice Адрес компании, получающей средства при успешном сборе
    address public immutable companyWallet;

    /// @notice Процент возврата при успехе (в базисных пунктах, 15000 = 1.5x)
    uint16 public immutable successReturnBps;

    /// @notice Процент возврата при неудаче бизнеса (например 5000 = 0.5x)
    uint16 public immutable failReturnBps;

    /// @notice Текущее состояние пула
    State public state;

    /// @notice Был ли пул финализирован после дедлайна
    bool public finalized;

    /// @notice Активирован ли сценарий успеха (выплата прибыли)
    bool public successPayoutActive;

    /// @notice Активирован ли сценарий частичной компенсации при неудаче
    bool public failPayoutActive;

    /// @notice Общая сумма инвестиций
    uint256 public totalInvested;

    // === Инвесторы ===
    address[] private _investors;                  // список адресов инвесторов
    mapping(address => bool) public isInvestor;    // метка, что инвестор уже есть
    mapping(address => uint256) public investedAmount; // сколько USDT инвестировал каждый инвестор

    // === События ===
    event InvestorAdded(address indexed investor);
    event Invested(address indexed investor, uint256 amount, uint256 newTotal);
    event Finalized(State result);
    event ReleasedToCompany(address indexed company, uint256 amount);
    event Refunded(address indexed investor, uint256 amount);
    event ScenarioActivated(Scenario scenario, bool active);
    event ScenarioRedeemed(address indexed investor, Scenario scenario, uint256 burned, uint256 payout);
    event USDTDeposited(address indexed from, uint256 amount);

    /// @param usdt_ адрес контракта токена USDT
    /// @param admin_ адрес администратора (владельца платформы)
    /// @param companyWallet_ адрес компании, куда будут перечислены средства
    /// @param targetAmount_ целевая сумма сбора
    /// @param deadline_ дата дедлайна
    /// @param successReturnBps_ процент возврата при успехе (в bps)
    /// @param failReturnBps_ процент возврата при неудаче (в bps)
    /// @param tokenName_ имя токена инвестора
    /// @param tokenSymbol_ символ токена инвестора
    /// @param tokenDecimals_ количество десятичных знаков у токена
    constructor(
        address usdt_,
        address admin_,
        address companyWallet_,
        uint256 targetAmount_,
        uint256 deadline_,
        uint16 successReturnBps_,
        uint16 failReturnBps_,
        string memory tokenName_,
        string memory tokenSymbol_,
        uint8 tokenDecimals_
    ) Ownable(admin_) {
        require(usdt_ != address(0), "USDT zero");
        require(admin_ != address(0), "Admin zero");
        require(companyWallet_ != address(0), "Company zero");
        require(targetAmount_ > 0, "Target zero");
        require(deadline_ > block.timestamp, "Deadline past");

        usdt = IUSDT(usdt_);
        companyWallet = companyWallet_;
        targetAmount = targetAmount_;
        deadline = deadline_;
        successReturnBps = successReturnBps_;
        failReturnBps = failReturnBps_;
        state = State.Funding;

        // Разворачиваем токен-долю для этого пула
        shareToken = new InvestmentToken(tokenName_, tokenSymbol_, tokenDecimals_, address(this), admin_);

        // Передаём права на контракт платформе (админу)
        _transferOwnership(admin_);
    }

    // ================= Основные действия =================

    /// @notice Вложить средства в пул
    function invest(uint256 amount) external nonReentrant {
        require(state == State.Funding, "Not funding");
        require(block.timestamp < deadline, "Deadline passed");
        require(amount > 0, "Zero amount");

        // Перевод USDT на контракт
        usdt.safeTransferFrom(msg.sender, address(this), amount);
        totalInvested += amount;
        investedAmount[msg.sender] += amount;

        // Добавление нового инвестора, если его ещё не было
        if (!isInvestor[msg.sender]) {
            isInvestor[msg.sender] = true;
            _investors.push(msg.sender);
            emit InvestorAdded(msg.sender);
        }

        // Выпуск токенов-долей
        shareToken.mint(msg.sender, amount);
        emit Invested(msg.sender, amount, totalInvested);
    }

    /// @notice Завершает сбор — определяет, достигнута ли цель
    function finalize() external {
        require(!finalized, "Finalized");
        require(block.timestamp >= deadline, "Too early");
        finalized = true;

        if (totalInvested >= targetAmount) {
            state = State.Succeeded;  // цель достигнута
        } else {
            state = State.Failed;     // цель не достигнута
        }
        emit Finalized(state);
    }

    /// @notice Перевод средств компании при успешном сборе
    /// @dev Только админ платформы может вызвать
    function releaseToCompany() external onlyOwner nonReentrant {
        require(finalized, "Not finalized");
        require(state == State.Succeeded, "Not succeeded");

        uint256 bal = usdt.balanceOf(address(this));
        require(bal > 0, "No funds");

        usdt.safeTransfer(companyWallet, bal);
        state = State.Released;

        emit ReleasedToCompany(companyWallet, bal);
    }

    /// @notice Возврат инвестиций при неудачном сборе (1:1)
    function refund() external nonReentrant {
        require(finalized, "Not finalized");
        require(state == State.Failed, "Not failed");

        uint256 amt = shareToken.balanceOf(msg.sender);
        require(amt > 0, "No tokens");

        // Сжигаем токены инвестора и возвращаем USDT
        shareToken.poolBurn(msg.sender, amt);
        usdt.safeTransfer(msg.sender, amt);

        emit Refunded(msg.sender, amt);
    }

    /// @notice Админ может внести USDT на контракт для будущих выплат инвесторам (выкуп или компенсация)
    function depositUSDT(uint256 amount) external onlyOwner {
        require(amount > 0, "Zero amount");
        usdt.safeTransferFrom(msg.sender, address(this), amount);
        emit USDTDeposited(msg.sender, amount);
    }

    /// @notice Активировать сценарий успеха (выплаты прибыли)
    function setSuccessPayoutActive(bool active) external onlyOwner {
        require(state == State.Released, "Not released");
        successPayoutActive = active;
        emit ScenarioActivated(Scenario.SuccessPayout, active);
    }

    /// @notice Активировать сценарий частичного возврата (при убытке компании)
    function setFailPayoutActive(bool active) external onlyOwner {
        require(state == State.Released, "Not released");
        failPayoutActive = active;
        emit ScenarioActivated(Scenario.FailurePartial, active);
    }

    /// @notice Сжечь все токены инвестора по определённому сценарию (успех / неудача)
    function burnByScenario(Scenario scenario) external nonReentrant {
        uint256 bal = shareToken.balanceOf(msg.sender);
        _burnByScenario(scenario, bal);
    }

    /// @notice Сжечь указанное количество токенов для выплаты по сценарию
    function burnByScenarioAmount(Scenario scenario, uint256 amount) external nonReentrant {
        _burnByScenario(scenario, amount);
    }

    /// @dev Внутренняя логика для расчёта выплаты и сжигания токенов
    function _burnByScenario(Scenario scenario, uint256 amount) internal {
        require(amount > 0, "Zero burn");
        require(shareToken.balanceOf(msg.sender) >= amount, "Insufficient tokens");

        uint256 payout;
        if (scenario == Scenario.SuccessPayout) {
            require(successPayoutActive, "Success not active");
            payout = (amount * uint256(successReturnBps)) / 10_000;
        } else if (scenario == Scenario.FailurePartial) {
            require(failPayoutActive, "Failure not active");
            payout = (amount * uint256(failReturnBps)) / 10_000;
        } else {
            revert("Invalid scenario");
        }

        require(usdt.balanceOf(address(this)) >= payout, "Insufficient pool USDT");

        shareToken.poolBurn(msg.sender, amount);
        usdt.safeTransfer(msg.sender, payout);

        emit ScenarioRedeemed(msg.sender, scenario, amount, payout);
    }

    // ================= Просмотровые функции =================

    /// @notice Проверяет, открыт ли сбор
    function isFundingOpen() public view returns (bool) {
        return state == State.Funding && block.timestamp < deadline;
    }

    /// @notice Проверяет, достигнута ли цель по сбору
    function goalReached() public view returns (bool) {
        return totalInvested >= targetAmount;
    }

    /// @notice Можно ли перевести деньги компании
    function canRelease() external view returns (bool) {
        return finalized && state == State.Succeeded;
    }

    /// @notice Можно ли делать возврат инвесторам
    function canRefund() external view returns (bool) {
        return finalized && state == State.Failed;
    }

    /// @notice Сколько времени осталось до дедлайна
    function timeLeft() external view returns (uint256) {
        if (block.timestamp >= deadline) return 0;
        return deadline - block.timestamp;
    }

    /// @notice Возвращает прогресс сбора (в bps, 10000 = 100%)
    function progressBps() external view returns (uint256) {
        if (targetAmount == 0) return 0;
        uint256 p = (totalInvested * 10_000) / targetAmount;
        if (p > 10_000) return 10_000;
        return p;
    }

    /// @notice Сколько осталось собрать до цели
    function remainingToTarget() external view returns (uint256) {
        return totalInvested >= targetAmount ? 0 : (targetAmount - totalInvested);
    }

    /// @notice Баланс USDT на контракте пула
    function poolUSDTBalance() external view returns (uint256) {
        return usdt.balanceOf(address(this));
    }

    /// @notice Баланс токенов инвестора
    function investorTokenBalance(address account) external view returns (uint256) {
        return shareToken.balanceOf(account);
    }

    /// @notice Просмотр возможной выплаты по сценарию (не выполняет перевод)
    function previewPayout(address account, Scenario scenario, uint256 amount) external view returns (uint256 payout) {
        uint256 bal = shareToken.balanceOf(account);
        if (amount == 0 || amount > bal) amount = bal;

        if (scenario == Scenario.SuccessPayout) {
            payout = (amount * uint256(successReturnBps)) / 10_000;
        } else if (scenario == Scenario.FailurePartial) {
            payout = (amount * uint256(failReturnBps)) / 10_000;
        } else {
            payout = 0;
        }
    }

    /// @notice Возвращает массив всех инвесторов пула
    function investors() external view returns (address[] memory) {
        return _investors;
    }

    /// @notice Количество инвесторов
    function investorsCount() external view returns (uint256) {
        return _investors.length;
    }
}
