// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./InvestmentPool.sol";

/// @title InvestmentFactory
/// @notice Контракт-фабрика для создания инвестиционных пулов (отдельных проектов)
/// @dev Каждый пул создаётся по шаблону InvestmentPool и хранит собственные параметры
contract InvestmentFactory is Ownable {
    /// @notice Адрес токена USDT, который используется для инвестиций
    address public immutable usdt;

    /// @notice Список всех созданных пулов
    address[] public allPools;

    /// @notice Сопоставление компании с её пулами
    /// company => [pool1, pool2, ...]
    mapping(address => address[]) public poolsByCompany;

    /// @notice Событие при создании нового пула
    /// @param pool адрес нового контракта пула
    /// @param company адрес компании, для которой создан пул
    /// @param shareToken адрес токена-доли инвестора
    /// @param index индекс пула в общем списке
    /// @param target целевая сумма сбора
    /// @param deadline дедлайн по сбору средств
    event PoolCreated(
        address indexed pool,
        address indexed company,
        address indexed shareToken,
        uint256 index,
        uint256 target,
        uint256 deadline
    );

    /// @param usdt_ адрес контракта токена USDT
    /// @param admin_ адрес администратора (владельца фабрики)
    constructor(address usdt_, address admin_) Ownable(admin_) {
        require(usdt_ != address(0), "USDT zero");   // проверка: адрес USDT не должен быть нулевым
        require(admin_ != address(0), "Admin zero"); // проверка: адрес админа не должен быть нулевым
        usdt = usdt_;
        _transferOwnership(admin_); // передаём права админа на внешний адрес
    }

    /// @notice Создаёт новый инвестиционный пул для компании
    /// @param companyWallet кошелёк компании, получающей средства при успешном сборе
    /// @param targetAmount цель сбора в USDT
    /// @param deadline дата (timestamp), до которой идёт сбор
    /// @param successReturnBps процент возврата при успехе (в базисных пунктах, 10000 = 100%)
    /// @param failReturnBps процент возврата при неудаче (в базисных пунктах)
    /// @param tokenName имя токена-доли (например, "HMP Token")
    /// @param tokenSymbol символ токена (например, "HMP")
    /// @param tokenDecimals количество знаков после запятой у токена
    /// @return poolAddr адрес созданного пула
    function createInvestmentPool(
        address companyWallet,
        uint256 targetAmount,
        uint256 deadline,
        uint16 successReturnBps,
        uint16 failReturnBps,
        string memory tokenName,
        string memory tokenSymbol,
        uint8 tokenDecimals
    ) external onlyOwner returns (address poolAddr) {
        // создаём новый контракт InvestmentPool
        InvestmentPool pool = new InvestmentPool(
            usdt,
            owner(),              // владелец пула — текущий админ платформы
            companyWallet,        // адрес компании
            targetAmount,         // цель по сбору
            deadline,             // дедлайн
            successReturnBps,     // процент возврата при успехе
            failReturnBps,        // процент возврата при провале
            tokenName,            // имя токена
            tokenSymbol,          // символ токена
            tokenDecimals         // количество десятичных знаков
        );

        poolAddr = address(pool);

        // сохраняем в общие списки
        allPools.push(poolAddr);
        poolsByCompany[companyWallet].push(poolAddr);

        uint256 idx = allPools.length - 1;

        // вызываем событие для отслеживания в логах блокчейна
        emit PoolCreated(
            poolAddr,
            companyWallet,
            address(pool.shareToken()), // токен-доля инвестора
            idx,
            targetAmount,
            deadline
        );
    }

    /// @notice Возвращает общее количество пулов
    function totalPools() external view returns (uint256) {
        return allPools.length;
    }

    /// @notice Возвращает адрес последнего созданного пула
    function latestPool() external view returns (address) {
        require(allPools.length > 0, "No pools"); // проверка, что пулы существуют
        return allPools[allPools.length - 1];
    }

    /// @notice Возвращает массив всех пулов
    function getAllPools() external view returns (address[] memory) {
        return allPools;
    }

    /// @notice Возвращает все пулы конкретной компании
    function getCompanyPools(address company) external view returns (address[] memory) {
        return poolsByCompany[company];
    }

    /// @notice Возвращает количество пулов, созданных для конкретной компании
    function poolsCountByCompany(address company) external view returns (uint256) {
        return poolsByCompany[company].length;
    }
}
