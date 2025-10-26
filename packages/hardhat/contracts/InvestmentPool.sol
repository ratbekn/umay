pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./IUSDT.sol";
import "./InvestmentToken.sol";

/// @title InvestmentPool
/// @notice Контракт инвестиционного пула — отдельный проект для сбора средств.
/// @dev Управляет инвестированием, возвратами, переводом компании и выплатами по сценариям.
// SPDX-License-Identifier: MIT
contract InvestmentPool is Ownable, ReentrancyGuard {
    using SafeERC20 for IUSDT;

    enum State { Funding, Succeeded, Failed, Released }
    enum Scenario { SuccessPayout, FailurePartial }

    IUSDT public immutable usdt;
    InvestmentToken public immutable shareToken;
    uint256 public immutable targetAmount;
    uint256 public immutable deadline;
    address public immutable companyWallet;
    uint16 public immutable successReturnBps;
    uint16 public immutable failReturnBps;

    /// @notice Цена одного токена в USDT (с 6 десятичными знаками)
    uint256 public immutable tokenPrice;

    State public state;
    bool public finalized;
    bool public successPayoutActive;
    bool public failPayoutActive;
    uint256 public totalInvested;

    address[] private _investors;
    mapping(address => bool) public isInvestor;
    mapping(address => uint256) public investedAmount;

    event InvestorAdded(address indexed investor);
    event Invested(address indexed investor, uint256 usdtAmount, uint256 tokensMinted, uint256 newTotal);
    event Finalized(State result);
    event ReleasedToCompany(address indexed company, uint256 amount);
    event Refunded(address indexed investor, uint256 amount);
    event ScenarioActivated(Scenario scenario, bool active);
    event ScenarioRedeemed(address indexed investor, Scenario scenario, uint256 burned, uint256 payout);
    event USDTDeposited(address indexed from, uint256 amount);

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
        uint8 tokenDecimals_,
        uint256 tokenPrice_ // 👈 добавили цену токена
    ) Ownable(admin_) {
        require(usdt_ != address(0), "USDT zero");
        require(admin_ != address(0), "Admin zero");
        require(companyWallet_ != address(0), "Company zero");
        require(targetAmount_ > 0, "Target zero");
        require(deadline_ > block.timestamp, "Deadline past");
        require(tokenPrice_ > 0, "Price zero");

        usdt = IUSDT(usdt_);
        companyWallet = companyWallet_;
        targetAmount = targetAmount_;
        deadline = deadline_;
        successReturnBps = successReturnBps_;
        failReturnBps = failReturnBps_;
        tokenPrice = tokenPrice_; // 👈 сохраняем
        state = State.Funding;

        shareToken = new InvestmentToken(tokenName_, tokenSymbol_, tokenDecimals_, address(this), admin_);
        _transferOwnership(admin_);
    }

    function invest(uint256 amount) external nonReentrant {
        require(state == State.Funding, "Not funding");
        require(block.timestamp < deadline, "Deadline passed");
        require(amount > 0, "Zero amount");

        // ✅ amount передаётся в “USDT с 6 decimals”
        usdt.safeTransferFrom(msg.sender, address(this), amount);

        totalInvested += amount;
        investedAmount[msg.sender] += amount;

        if (!isInvestor[msg.sender]) {
            isInvestor[msg.sender] = true;
            _investors.push(msg.sender);
            emit InvestorAdded(msg.sender);
        }

        // ✅ Пересчёт токенов с учётом разницы decimals
        // amount (6 decimals), tokenPrice (6 decimals), токен = 18 decimals
        uint256 tokensToMint = (amount * 1e18) / tokenPrice;
        shareToken.mint(msg.sender, tokensToMint);

        emit Invested(msg.sender, amount, tokensToMint, totalInvested);
    }


    // ================= Основные действия =================

    /// @notice Завершает сбор — определяет, достигнута ли цель
    function finalize() external {
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

        uint256 tokenAmt = shareToken.balanceOf(msg.sender);
        require(tokenAmt > 0, "No tokens");

        // ✅ Рассчитываем эквивалент в USDT (обратная формула invest)
        uint256 refundAmount = (tokenAmt * tokenPrice) / 1e18;

        shareToken.poolBurn(msg.sender, tokenAmt);
        usdt.safeTransfer(msg.sender, refundAmount);

        emit Refunded(msg.sender, refundAmount);
    }

    /// @notice Админ может внести USDT на контракт для будущих выплат инвесторам (выкуп или компенсация)
    function depositUSDT(uint256 amount) external onlyOwner {
        require(amount > 0, "Zero amount");
        usdt.safeTransferFrom(msg.sender, address(this), amount);
        emit USDTDeposited(msg.sender, amount);
    }

    /// @notice Активировать сценарий успеха (выплаты прибыли)
    function setSuccessPayoutActive(bool active) external onlyOwner {
        successPayoutActive = active;
        emit ScenarioActivated(Scenario.SuccessPayout, active);
    }

    /// @notice Активировать сценарий частичного возврата (при убытке компании)
    function setFailPayoutActive(bool active) external onlyOwner {
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
    function _burnByScenario(Scenario scenario, uint256 tokenAmt) internal {
        require(tokenAmt > 0, "Zero burn");
        require(shareToken.balanceOf(msg.sender) >= tokenAmt, "Insufficient tokens");

        // ✅ сначала считаем базовую USDT сумму по цене токена
        uint256 baseAmountUSDT = (tokenAmt * tokenPrice) / 1e18;

        uint256 payout;
        if (scenario == Scenario.SuccessPayout) {
            payout = (tokenAmt * tokenPrice) / 1e18;
        } else if (scenario == Scenario.FailurePartial) {
            payout = (tokenAmt * tokenPrice) / 1e18;
        } else {
            revert("Invalid scenario");
        }

        require(usdt.balanceOf(address(this)) >= payout, "Insufficient pool USDT");

        shareToken.poolBurn(msg.sender, tokenAmt);
        usdt.safeTransfer(msg.sender, payout);

        emit ScenarioRedeemed(msg.sender, scenario, tokenAmt, payout);
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
        return true;
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
    function previewPayout(address account, Scenario scenario, uint256 tokenAmt)
    external
    view
    returns (uint256 payout)
    {
        uint256 bal = shareToken.balanceOf(account);
        if (tokenAmt == 0 || tokenAmt > bal) tokenAmt = bal;

        uint256 baseAmountUSDT = (tokenAmt * tokenPrice) / 1e18;

        if (scenario == Scenario.SuccessPayout) {
            payout = (baseAmountUSDT * uint256(successReturnBps)) / 10_000;
        } else if (scenario == Scenario.FailurePartial) {
            payout = (baseAmountUSDT * uint256(failReturnBps)) / 10_000;
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
