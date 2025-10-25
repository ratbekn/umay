const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    const FACTORY = process.env.FACTORY_ADDRESS;  // адрес, полученный после деплоя InvestmentFactory
    const COMPANY = process.env.COMPANY_WALLET;

    if (!FACTORY || !COMPANY) throw new Error("FACTORY_ADDRESS and COMPANY_WALLET are required");

    const factory = await ethers.getContractAt("InvestmentFactory", FACTORY);

    // === параметры пула ===
    const targetAmount = ethers.parseUnits("10000", 6); // цель 10 000 USDT
    const deadline = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // +7 дней
    const successReturnBps = 15000; // 150% возврат при успехе
    const failReturnBps = 5000;     // 50% при частичном возврате
    const tokenName = "HMP Test Token";  // 👈 вот тут указываешь имя токена
    const tokenSymbol = "HMP";           // 👈 и символ токена
    const tokenDecimals = 6;             // для USDT обычно 6

    console.log("Creating pool...");
    const tx = await factory.createInvestmentPool(
        COMPANY,
        targetAmount,
        deadline,
        successReturnBps,
        failReturnBps,
        tokenName,
        tokenSymbol,
        tokenDecimals
    );

    const receipt = await tx.wait();

    console.log("✅ Pool created!");
    console.log("Transaction hash:", receipt.hash);

    // Если хочешь — можно получить адрес нового пула
    const allPools = await factory.getAllPools();
    console.log("Last pool address:", allPools[allPools.length - 1]);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
