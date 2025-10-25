const { ethers } = require("hardhat");

async function main() {
    // === 1. Основные параметры ===
    const USDT = process.env.USDT_ADDRESS || "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Polygon USDT (USDC.e)
    const ADMIN = process.env.ADMIN_WALLET; // твой адрес, который будет владельцем фабрики

    if (!ADMIN) throw new Error("ADMIN_WALLET is required");

    // === 2. Получаем фабрику контракта ===
    const Factory = await ethers.getContractFactory("InvestmentFactory");

    console.log("Deploying InvestmentFactory...");
    const factory = await Factory.deploy(USDT, ADMIN);

    // === 3. Ожидаем деплой ===
    await factory.waitForDeployment();

    console.log("✅ InvestmentFactory deployed at:", factory.target);
    console.log("   USDT address:", USDT);
    console.log("   Admin wallet:", ADMIN);
}

main().catch((e) => {
    console.error("❌ Deployment failed:", e);
    process.exit(1);
});
