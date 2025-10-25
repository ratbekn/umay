// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title InvestmentToken
/// @notice Токен-доля для инвесторов конкретного пула.
/// @dev Выпускается автоматически при инвестировании в пул и сжигается при возврате или выкупе.
/// Каждый пул создаёт свой отдельный токен.
contract InvestmentToken is ERC20, Ownable {
    /// @notice Адрес пула, который имеет право выпускать и сжигать токены
    address public immutable pool;

    /// @notice Количество знаков после запятой (например, 6 для USDT)
    uint8 private immutable _customDecimals;

    /// @param name_ имя токена (например, "HMP Token")
    /// @param symbol_ символ токена (например, "HMP")
    /// @param decimals_ количество десятичных знаков
    /// @param pool_ адрес контракта пула, который будет выпускать и сжигать токены
    /// @param admin_ адрес администратора (владельца токена)
    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        address pool_,
        address admin_
    ) ERC20(name_, symbol_) Ownable(admin_) {
        require(pool_ != address(0), "Pool addr zero");   // проверка адреса пула
        require(admin_ != address(0), "Admin addr zero"); // проверка адреса админа

        pool = pool_;                  // сохраняем адрес пула
        _customDecimals = decimals_;   // фиксируем количество десятичных знаков

        // передаём права владения токеном админу (платформе)
        _transferOwnership(admin_);
    }

    /// @dev Ограничитель — вызывать можно только из контракта пула
    modifier onlyPool() {
        require(msg.sender == pool, "Not pool");
        _;
    }

    /// @notice Возвращает количество знаков после запятой у токена
    function decimals() public view override returns (uint8) {
        return _customDecimals;
    }

    /// @notice Выпуск токенов (только для контракта пула)
    /// @param to адрес инвестора
    /// @param amount количество токенов для выпуска
    function mint(address to, uint256 amount) external onlyPool {
        _mint(to, amount);
    }

    /// @notice Сжигание токенов инвестора (только для пула)
    /// @param account адрес, у которого сжигаются токены
    /// @param amount количество токенов для сжигания
    function poolBurn(address account, uint256 amount) external onlyPool {
        _burn(account, amount);
    }
}
