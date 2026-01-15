// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TrustScoreManager
 * @author OnMint Team
 * @notice Manages trust scores for the BNPL protocol
 * @dev Trust scores determine credit limits for users
 */
contract TrustScoreManager is Ownable {
    // ============ State Variables ============
    
    /// @notice Mapping of user addresses to their trust scores
    mapping(address => uint256) private trustScores;
    
    /// @notice Address of the BNPL Core contract (authorized to update scores)
    address public bnplCore;
    
    /// @notice Base credit limit for all users (10 USDC with 6 decimals)
    uint256 public constant BASE_CREDIT_LIMIT = 10 * 1e6;
    
    /// @notice Points awarded for on-time repayment
    uint256 public constant ON_TIME_POINTS = 10;
    
    /// @notice Points awarded for early repayment (bonus)
    uint256 public constant EARLY_POINTS = 15;
    
    /// @notice Credit increment per 10 score points (5 USDC with 6 decimals)
    uint256 public constant CREDIT_INCREMENT = 5 * 1e6;
    
    /// @notice Score threshold for each credit increment
    uint256 public constant SCORE_THRESHOLD = 10;
    
    // ============ Events ============
    
    /// @notice Emitted when a user's trust score is updated
    event ScoreUpdated(
        address indexed user,
        uint256 oldScore,
        uint256 newScore,
        bool wasEarly
    );
    
    /// @notice Emitted when the BNPL Core address is set
    event BNPLCoreUpdated(address indexed oldCore, address indexed newCore);
    
    // ============ Errors ============
    
    error OnlyBNPLCore();
    error ZeroAddress();
    error BNPLCoreNotSet();
    
    // ============ Modifiers ============
    
    /// @notice Restricts function to only the BNPL Core contract
    modifier onlyBNPLCore() {
        if (msg.sender != bnplCore) revert OnlyBNPLCore();
        _;
    }
    
    // ============ Constructor ============
    
    /// @param _admin The admin address that will own this contract
    constructor(address _admin) Ownable(_admin) {}
    
    // ============ External Functions ============
    
    /**
     * @notice Sets the BNPL Core contract address
     * @param _bnplCore The address of the BNPL Core contract
     */
    function setBNPLCore(address _bnplCore) external onlyOwner {
        if (_bnplCore == address(0)) revert ZeroAddress();
        
        address oldCore = bnplCore;
        bnplCore = _bnplCore;
        
        emit BNPLCoreUpdated(oldCore, _bnplCore);
    }
    
    /**
     * @notice Updates a user's trust score after loan repayment
     * @param _user The user whose score to update
     * @param _wasEarly Whether the repayment was early (bonus points)
     */
    function updateScore(address _user, bool _wasEarly) external onlyBNPLCore {
        if (bnplCore == address(0)) revert BNPLCoreNotSet();
        
        uint256 oldScore = trustScores[_user];
        uint256 pointsToAdd = _wasEarly ? EARLY_POINTS : ON_TIME_POINTS;
        uint256 newScore = oldScore + pointsToAdd;
        
        trustScores[_user] = newScore;
        
        emit ScoreUpdated(_user, oldScore, newScore, _wasEarly);
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Gets the trust score for a user
     * @param _user The user address
     * @return The user's trust score
     */
    function getTrustScore(address _user) external view returns (uint256) {
        return trustScores[_user];
    }
    
    /**
     * @notice Calculates the credit limit for a user based on their trust score
     * @dev Formula: BASE_CREDIT_LIMIT + (score / SCORE_THRESHOLD) * CREDIT_INCREMENT
     * @dev All values in USDC (6 decimals)
     * @param _user The user address
     * @return The user's credit limit in USDC (6 decimals)
     */
    function getCreditLimit(address _user) external view returns (uint256) {
        uint256 score = trustScores[_user];
        // Formula: 10 USDC + (score / 10) * 5 USDC
        uint256 bonusCredit = (score / SCORE_THRESHOLD) * CREDIT_INCREMENT;
        return BASE_CREDIT_LIMIT + bonusCredit;
    }
    
    /**
     * @notice Gets both trust score and credit limit for a user
     * @param _user The user address
     * @return score The user's trust score
     * @return creditLimit The user's credit limit in USDC (6 decimals)
     */
    function getUserCreditInfo(address _user) external view returns (
        uint256 score,
        uint256 creditLimit
    ) {
        score = trustScores[_user];
        uint256 bonusCredit = (score / SCORE_THRESHOLD) * CREDIT_INCREMENT;
        creditLimit = BASE_CREDIT_LIMIT + bonusCredit;
    }
}
