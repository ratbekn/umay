const { ethers } = require("hardhat");

async function main() {
    const HMP_ADDR = process.env.HMP_ADDRESS;      // адрес уже задеплоенного контракта
    const SAFE_ADDR = process.env.SAFE_ADDRESS;    // адрес Gnosis Safe (в Polygon)
    if (!HMP_ADDR || !SAFE_ADDR) throw new Error("HMP_ADDRESS and SAFE_ADDRESS required");

    const HMP = await ethers.getContractAt("HMPToken", HMP_ADDR);

    const owner = await HMP.owner();
    console.log("Current owner:", owner);

    const tx = await HMP.transferOwnership(SAFE_ADDR);
    console.log("transferOwnership tx sent:", tx.hash);
    await tx.wait();

    const newOwner = await HMP.owner();
    console.log("New owner:", newOwner);
}

main().catch((e) => { console.error(e); process.exit(1); });