import { expect } from "chai";
import { ethers } from "hardhat";
import { AgriProject, MockUSDT } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("AgriProject", function () {
  let agriProject: AgriProject;
  let mockUSDT: MockUSDT;
  let owner: HardhatEthersSigner;
  let projectOwner: HardhatEthersSigner;
  let investor1: HardhatEthersSigner;
  let investor2: HardhatEthersSigner;

  const PLATFORM_FEE = 250; // 2.5%
  const FUNDING_GOAL = ethers.parseUnits("10000", 6); // 10,000 USDT
  const MIN_INVESTMENT = ethers.parseUnits("100", 6); // 100 USDT
  const EXPECTED_RETURN = 1500; // 15%

  beforeEach(async function () {
    [owner, projectOwner, investor1, investor2] = await ethers.getSigners();

    // Deploy MockUSDT
    const MockUSDTFactory = await ethers.getContractFactory("MockUSDT");
    mockUSDT = await MockUSDTFactory.deploy();
    await mockUSDT.waitForDeployment();

    // Deploy AgriProject
    const AgriProjectFactory = await ethers.getContractFactory("AgriProject");
    agriProject = await AgriProjectFactory.deploy(await mockUSDT.getAddress(), PLATFORM_FEE);
    await agriProject.waitForDeployment();

    // Mint USDT to investors
    await mockUSDT.mint(investor1.address, ethers.parseUnits("50000", 6));
    await mockUSDT.mint(investor2.address, ethers.parseUnits("50000", 6));

    // Approve AgriProject to spend USDT
    await mockUSDT.connect(investor1).approve(await agriProject.getAddress(), ethers.MaxUint256);
    await mockUSDT.connect(investor2).approve(await agriProject.getAddress(), ethers.MaxUint256);
  });

  describe("Project Creation", function () {
    it("Should create a new project", async function () {
      const deadline = (await time.latest()) + 86400 * 30; // 30 days from now
      const duration = 90; // 90 days

      const tx = await agriProject.connect(projectOwner).createProject(
        "Wheat Farming Project",
        "Growing organic wheat in Issyk-Kul region",
        "Issyk-Kul, Kyrgyzstan",
        FUNDING_GOAL,
        MIN_INVESTMENT,
        EXPECTED_RETURN,
        deadline,
        duration,
      );

      await expect(tx)
        .to.emit(agriProject, "ProjectCreated")
        .withArgs(0, "Wheat Farming Project", projectOwner.address, FUNDING_GOAL);

      const project = await agriProject.getProject(0);
      expect(project.name).to.equal("Wheat Farming Project");
      expect(project.fundingGoal).to.equal(FUNDING_GOAL);
      expect(project.projectOwner).to.equal(projectOwner.address);
    });

    it("Should fail with invalid parameters", async function () {
      const pastDeadline = (await time.latest()) - 86400;

      await expect(
        agriProject.connect(projectOwner).createProject(
          "Invalid Project",
          "Description",
          "Location",
          0, // Invalid funding goal
          MIN_INVESTMENT,
          EXPECTED_RETURN,
          pastDeadline,
          90,
        ),
      ).to.be.revertedWith("Invalid funding goal");
    });
  });

  describe("Investment", function () {
    let projectId: number;
    let deadline: number;

    beforeEach(async function () {
      deadline = (await time.latest()) + 86400 * 30;
      const tx = await agriProject.connect(projectOwner).createProject(
        "Test Project",
        "Description",
        "Location",
        FUNDING_GOAL,
        MIN_INVESTMENT,
        EXPECTED_RETURN,
        deadline,
        90,
      );
      const receipt = await tx.wait();
      projectId = 0;
    });

    it("Should allow investment", async function () {
      const investAmount = ethers.parseUnits("1000", 6);

      await expect(agriProject.connect(investor1).invest(projectId, investAmount))
        .to.emit(agriProject, "InvestmentMade")
        .withArgs(projectId, investor1.address, investAmount);

      const project = await agriProject.getProject(projectId);
      expect(project.totalFunded).to.equal(investAmount);

      const investorAmount = await agriProject.getInvestorAmount(projectId, investor1.address);
      expect(investorAmount).to.equal(investAmount);
    });

    it("Should activate project when funding goal is reached", async function () {
      await agriProject.connect(investor1).invest(projectId, ethers.parseUnits("6000", 6));
      await agriProject.connect(investor2).invest(projectId, ethers.parseUnits("4000", 6));

      const project = await agriProject.getProject(projectId);
      expect(project.status).to.equal(1); // Active
      expect(project.totalFunded).to.equal(FUNDING_GOAL);
    });

    it("Should reject investment below minimum", async function () {
      const lowAmount = ethers.parseUnits("50", 6);

      await expect(agriProject.connect(investor1).invest(projectId, lowAmount)).to.be.revertedWith(
        "Below minimum investment",
      );
    });

    it("Should reject investment exceeding funding goal", async function () {
      const excessAmount = ethers.parseUnits("15000", 6);

      await expect(agriProject.connect(investor1).invest(projectId, excessAmount)).to.be.revertedWith(
        "Exceeds funding goal",
      );
    });
  });

  describe("Fund Withdrawal", function () {
    let projectId: number;

    beforeEach(async function () {
      const deadline = (await time.latest()) + 86400 * 30;
      await agriProject.connect(projectOwner).createProject(
        "Test Project",
        "Description",
        "Location",
        FUNDING_GOAL,
        MIN_INVESTMENT,
        EXPECTED_RETURN,
        deadline,
        90,
      );
      projectId = 0;

      // Fully fund the project
      await agriProject.connect(investor1).invest(projectId, ethers.parseUnits("6000", 6));
      await agriProject.connect(investor2).invest(projectId, ethers.parseUnits("4000", 6));
    });

    it("Should allow project owner to withdraw funds", async function () {
      const balanceBefore = await mockUSDT.balanceOf(projectOwner.address);

      await agriProject.connect(projectOwner).withdrawFunds(projectId);

      const balanceAfter = await mockUSDT.balanceOf(projectOwner.address);
      const feeAmount = (FUNDING_GOAL * BigInt(PLATFORM_FEE)) / 10000n;
      const expectedAmount = FUNDING_GOAL - feeAmount;

      expect(balanceAfter - balanceBefore).to.equal(expectedAmount);
    });

    it("Should prevent non-owner from withdrawing", async function () {
      await expect(agriProject.connect(investor1).withdrawFunds(projectId)).to.be.revertedWith("Not project owner");
    });

    it("Should prevent double withdrawal", async function () {
      await agriProject.connect(projectOwner).withdrawFunds(projectId);

      await expect(agriProject.connect(projectOwner).withdrawFunds(projectId)).to.be.revertedWith(
        "Funds already withdrawn",
      );
    });
  });

  describe("Return Distribution", function () {
    let projectId: number;

    beforeEach(async function () {
      const deadline = (await time.latest()) + 86400 * 30;
      await agriProject.connect(projectOwner).createProject(
        "Test Project",
        "Description",
        "Location",
        FUNDING_GOAL,
        MIN_INVESTMENT,
        EXPECTED_RETURN,
        deadline,
        90,
      );
      projectId = 0;

      // Fully fund the project
      await agriProject.connect(investor1).invest(projectId, ethers.parseUnits("6000", 6));
      await agriProject.connect(investor2).invest(projectId, ethers.parseUnits("4000", 6));

      // Withdraw funds
      await agriProject.connect(projectOwner).withdrawFunds(projectId);

      // Mint returns to project owner
      const returns = ethers.parseUnits("1500", 6); // 15% return
      await mockUSDT.mint(projectOwner.address, returns);
      await mockUSDT.connect(projectOwner).approve(await agriProject.getAddress(), ethers.MaxUint256);
    });

    it("Should distribute returns proportionally", async function () {
      const returns = ethers.parseUnits("1500", 6);
      
      const investor1BalanceBefore = await mockUSDT.balanceOf(investor1.address);
      const investor2BalanceBefore = await mockUSDT.balanceOf(investor2.address);

      await agriProject.connect(projectOwner).distributeReturns(projectId, returns);

      const investor1BalanceAfter = await mockUSDT.balanceOf(investor1.address);
      const investor2BalanceAfter = await mockUSDT.balanceOf(investor2.address);

      // Investor1 invested 6000 USDT (60%), should get 6000 + 900 = 6900 USDT
      // Investor2 invested 4000 USDT (40%), should get 4000 + 600 = 4600 USDT
      expect(investor1BalanceAfter - investor1BalanceBefore).to.equal(ethers.parseUnits("6900", 6));
      expect(investor2BalanceAfter - investor2BalanceBefore).to.equal(ethers.parseUnits("4600", 6));

      const project = await agriProject.getProject(projectId);
      expect(project.status).to.equal(2); // Completed
    });
  });

  describe("Project Cancellation", function () {
    let projectId: number;

    beforeEach(async function () {
      const deadline = (await time.latest()) + 86400 * 30;
      await agriProject.connect(projectOwner).createProject(
        "Test Project",
        "Description",
        "Location",
        FUNDING_GOAL,
        MIN_INVESTMENT,
        EXPECTED_RETURN,
        deadline,
        90,
      );
      projectId = 0;

      // Partial funding
      await agriProject.connect(investor1).invest(projectId, ethers.parseUnits("2000", 6));
    });

    it("Should cancel project and refund investors", async function () {
      const balanceBefore = await mockUSDT.balanceOf(investor1.address);

      await agriProject.connect(projectOwner).cancelProject(projectId);

      const balanceAfter = await mockUSDT.balanceOf(investor1.address);
      expect(balanceAfter - balanceBefore).to.equal(ethers.parseUnits("2000", 6));

      const project = await agriProject.getProject(projectId);
      expect(project.status).to.equal(3); // Cancelled
    });
  });
});
