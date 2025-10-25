import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("\n🌾 Deploying Umay Agricultural Investment Platform...\n");

  // Deploy Mock USDT for testing
  console.log("📌 Deploying MockUSDT...");
  const mockUSDT = await deploy("MockUSDT", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
  console.log("✅ MockUSDT deployed to:", mockUSDT.address);

  // Deploy AgriProject with 2.5% platform fee (250 basis points)
  const platformFee = 250; // 2.5%

  console.log("\n📌 Deploying AgriProject...");
  const agriProject = await deploy("AgriProject", {
    from: deployer,
    args: [mockUSDT.address, platformFee],
    log: true,
    autoMine: true,
  });
  console.log("✅ AgriProject deployed to:", agriProject.address);

  console.log("\n🎉 Deployment complete!\n");
  console.log("Contract Addresses:");
  console.log("==================");
  console.log("MockUSDT:", mockUSDT.address);
  console.log("AgriProject:", agriProject.address);
  console.log("Platform Fee:", platformFee / 100, "%");

  // Verify contracts on Etherscan (if not on localhost)
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("\n⏳ Waiting for block confirmations...");
    await mockUSDT.receipt?.wait(5);
    await agriProject.receipt?.wait(5);

    console.log("\n🔍 Verifying contracts on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: mockUSDT.address,
        constructorArguments: [],
      });
      await hre.run("verify:verify", {
        address: agriProject.address,
        constructorArguments: [mockUSDT.address, platformFee],
      });
      console.log("✅ Contracts verified!");
    } catch (error) {
      console.log("❌ Verification failed:", error);
    }
  }
};

export default deployContracts;
deployContracts.tags = ["all", "umay"];
