// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title IUSDT
/// @notice Интерфейс для взаимодействия с токеном USDT (или любым другим ERC-20 токеном со стандартом совместимым с USDT)
/// @dev Наследует базовый интерфейс IERC20 и добавляет функцию получения количества десятичных знаков
interface IUSDT is IERC20 {
    /// @notice Возвращает количество знаков после запятой у токена USDT
    /// @dev Например, у USDT — 6, у большинства ERC-20 — 18
    function decimals() external view returns (uint8);
}
