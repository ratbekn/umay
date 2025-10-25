require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,  // включаем оптимизацию
                runs: 200       // число итераций оптимизатора (200 — оптимальный баланс)
            },
        },
    },

    networks: {
        polygon: {
            url: process.env.POLYGON_RPC,          // RPC URL для Polygon
            accounts: [process.env.PRIVATE_KEY],   // приватный ключ для деплоя
        },
    },

    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,   // ключ для верификации на polygonscan
    },
};
