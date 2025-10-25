// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title AgriProject
 * @dev Manages individual agricultural investment projects in Kyrgyzstan
 */
contract AgriProject is Ownable, ReentrancyGuard {
    enum ProjectStatus {
        Pending,
        Active,
        Completed,
        Cancelled
    }

    struct Project {
        uint256 id;
        string name;
        string description;
        string location;
        address projectOwner;
        uint256 fundingGoal;
        uint256 totalFunded;
        uint256 minInvestment;
        uint256 expectedReturn; // in basis points (100 = 1%)
        uint256 deadline;
        uint256 duration; // in days
        ProjectStatus status;
        bool fundsWithdrawn;
    }

    struct Investment {
        address investor;
        uint256 amount;
        uint256 timestamp;
        bool withdrawn;
    }

    // State variables
    uint256 public projectCounter;
    mapping(uint256 => Project) public projects;
    mapping(uint256 => Investment[]) public projectInvestments;
    mapping(uint256 => mapping(address => uint256)) public investorAmounts;
    
    IERC20 public stableCoin;
    uint256 public platformFee; // in basis points (100 = 1%)

    // Events
    event ProjectCreated(
        uint256 indexed projectId,
        string name,
        address indexed projectOwner,
        uint256 fundingGoal
    );
    event InvestmentMade(
        uint256 indexed projectId,
        address indexed investor,
        uint256 amount
    );
    event ProjectFunded(uint256 indexed projectId, uint256 totalAmount);
    event FundsWithdrawn(uint256 indexed projectId, uint256 amount);
    event ProjectCompleted(uint256 indexed projectId);
    event ProjectCancelled(uint256 indexed projectId);
    event ReturnsDistributed(uint256 indexed projectId, uint256 totalAmount);

    constructor(address _stableCoin, uint256 _platformFee) {
        require(_stableCoin != address(0), "Invalid stablecoin address");
        require(_platformFee <= 1000, "Fee too high"); // Max 10%
        stableCoin = IERC20(_stableCoin);
        platformFee = _platformFee;
    }

    /**
     * @dev Create a new agricultural project
     */
    function createProject(
        string memory _name,
        string memory _description,
        string memory _location,
        uint256 _fundingGoal,
        uint256 _minInvestment,
        uint256 _expectedReturn,
        uint256 _deadline,
        uint256 _duration
    ) external returns (uint256) {
        require(_fundingGoal > 0, "Invalid funding goal");
        require(_minInvestment > 0, "Invalid min investment");
        require(_deadline > block.timestamp, "Invalid deadline");
        require(_duration > 0, "Invalid duration");

        uint256 projectId = projectCounter++;

        projects[projectId] = Project({
            id: projectId,
            name: _name,
            description: _description,
            location: _location,
            projectOwner: msg.sender,
            fundingGoal: _fundingGoal,
            totalFunded: 0,
            minInvestment: _minInvestment,
            expectedReturn: _expectedReturn,
            deadline: _deadline,
            duration: _duration,
            status: ProjectStatus.Pending,
            fundsWithdrawn: false
        });

        emit ProjectCreated(projectId, _name, msg.sender, _fundingGoal);
        return projectId;
    }

    /**
     * @dev Invest in a project
     */
    function invest(uint256 _projectId, uint256 _amount) external nonReentrant {
        Project storage project = projects[_projectId];
        
        require(project.status == ProjectStatus.Pending, "Project not open for investment");
        require(block.timestamp < project.deadline, "Deadline passed");
        require(_amount >= project.minInvestment, "Below minimum investment");
        require(project.totalFunded + _amount <= project.fundingGoal, "Exceeds funding goal");

        // Transfer stablecoins from investor
        require(
            stableCoin.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );

        // Record investment
        projectInvestments[_projectId].push(
            Investment({
                investor: msg.sender,
                amount: _amount,
                timestamp: block.timestamp,
                withdrawn: false
            })
        );

        investorAmounts[_projectId][msg.sender] += _amount;
        project.totalFunded += _amount;

        emit InvestmentMade(_projectId, msg.sender, _amount);

        // Check if funding goal is reached
        if (project.totalFunded >= project.fundingGoal) {
            project.status = ProjectStatus.Active;
            emit ProjectFunded(_projectId, project.totalFunded);
        }
    }

    /**
     * @dev Project owner withdraws funds after successful funding
     */
    function withdrawFunds(uint256 _projectId) external nonReentrant {
        Project storage project = projects[_projectId];
        
        require(msg.sender == project.projectOwner, "Not project owner");
        require(project.status == ProjectStatus.Active, "Project not active");
        require(!project.fundsWithdrawn, "Funds already withdrawn");
        require(project.totalFunded >= project.fundingGoal, "Goal not reached");

        project.fundsWithdrawn = true;

        // Calculate platform fee
        uint256 feeAmount = (project.totalFunded * platformFee) / 10000;
        uint256 projectAmount = project.totalFunded - feeAmount;

        // Transfer funds
        if (feeAmount > 0) {
            require(stableCoin.transfer(owner(), feeAmount), "Fee transfer failed");
        }
        require(stableCoin.transfer(project.projectOwner, projectAmount), "Transfer failed");

        emit FundsWithdrawn(_projectId, projectAmount);
    }

    /**
     * @dev Distribute returns to investors
     */
    function distributeReturns(uint256 _projectId, uint256 _totalReturns) external nonReentrant {
        Project storage project = projects[_projectId];
        
        require(msg.sender == project.projectOwner, "Not project owner");
        require(project.status == ProjectStatus.Active, "Project not active");
        require(_totalReturns > 0, "Invalid return amount");

        // Transfer returns from project owner
        require(
            stableCoin.transferFrom(msg.sender, address(this), _totalReturns),
            "Transfer failed"
        );

        Investment[] storage investments = projectInvestments[_projectId];
        uint256 totalDistributed = 0;

        // Distribute proportionally to all investors
        for (uint256 i = 0; i < investments.length; i++) {
            if (!investments[i].withdrawn) {
                uint256 investorReturn = (_totalReturns * investments[i].amount) / project.totalFunded;
                uint256 totalAmount = investments[i].amount + investorReturn;
                
                require(stableCoin.transfer(investments[i].investor, totalAmount), "Distribution failed");
                
                investments[i].withdrawn = true;
                totalDistributed += totalAmount;
            }
        }

        project.status = ProjectStatus.Completed;
        emit ReturnsDistributed(_projectId, totalDistributed);
        emit ProjectCompleted(_projectId);
    }

    /**
     * @dev Cancel project and refund investors (if funding goal not reached)
     */
    function cancelProject(uint256 _projectId) external nonReentrant {
        Project storage project = projects[_projectId];
        
        require(
            msg.sender == project.projectOwner || msg.sender == owner(),
            "Not authorized"
        );
        require(
            project.status == ProjectStatus.Pending,
            "Cannot cancel active project"
        );

        project.status = ProjectStatus.Cancelled;

        // Refund all investors
        Investment[] storage investments = projectInvestments[_projectId];
        for (uint256 i = 0; i < investments.length; i++) {
            if (!investments[i].withdrawn) {
                require(
                    stableCoin.transfer(investments[i].investor, investments[i].amount),
                    "Refund failed"
                );
                investments[i].withdrawn = true;
            }
        }

        emit ProjectCancelled(_projectId);
    }

    /**
     * @dev Get project details
     */
    function getProject(uint256 _projectId) external view returns (Project memory) {
        return projects[_projectId];
    }

    /**
     * @dev Get all investments for a project
     */
    function getProjectInvestments(uint256 _projectId) external view returns (Investment[] memory) {
        return projectInvestments[_projectId];
    }

    /**
     * @dev Get investor's investment amount in a project
     */
    function getInvestorAmount(uint256 _projectId, address _investor) external view returns (uint256) {
        return investorAmounts[_projectId][_investor];
    }

    /**
     * @dev Update platform fee (only owner)
     */
    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee too high"); // Max 10%
        platformFee = _newFee;
    }
}
