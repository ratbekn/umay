const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    const FACTORY = process.env.FACTORY_ADDRESS;  // адрес фабрики
    const COMPANY = process.env.COMPANY_WALLET;

    if (!FACTORY || !COMPANY) {
        throw new Error("FACTORY_ADDRESS and COMPANY_WALLET are required");
    }

    // Подключаемся к фабрике
    const factory = await ethers.getContractAt("InvestmentFactory", FACTORY);

    // === параметры пула ===
    const targetAmount = ethers.parseUnits("0.1", 6); // 🎯 цель — 0.1 USDT
    const deadline = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
    const successReturnBps = 15000; // 💰 150% при успехе
    const failReturnBps = 5000;     // 💸 50% при неудаче
    const tokenName = "SHIP Test Token"; // 🌾 токен агро-тематики
    const tokenSymbol = "SHIP";
    const tokenDecimals = 18;
    const tokenPrice = 100; // 💵 0.0001 USDT (100 микросентов)

    console.log("🚜 Creating AGRO Seed investment pool...");

    const tx = await factory.createInvestmentPool(
        COMPANY,
        targetAmount,
        deadline,
        successReturnBps,
        failReturnBps,
        tokenName,
        tokenSymbol,
        tokenDecimals,
        tokenPrice
    );

    const receipt = await tx.wait();
    console.log("✅ Pool created successfully!");
    console.log("Transaction hash:", receipt.hash);

    // Получаем адрес нового пула
    const allPools = await factory.getAllPools();
    const lastPool = allPools[allPools.length - 1];
    console.log("📦 New pool address:", lastPool);

    // Проверяем адрес токена пула
    const pool = await ethers.getContractAt("InvestmentPool", lastPool);
    const shareTokenAddr = await pool.shareToken();
    console.log("💎 Token address:", shareTokenAddr);

    console.log("🌱 AGRO Seed Pool ready for investments!");
}

main().catch((err) => {
    console.error("❌ Deployment failed:", err);
    process.exit(1);
});
