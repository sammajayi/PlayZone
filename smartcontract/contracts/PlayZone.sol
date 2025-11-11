// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract PredictionMarket is ReentrancyGuard, Ownable {
    // Market status enum
    enum MarketStatus {
        Open,
        Locked,
        Resolved,
        Disputed,
        Finalized
    }

    // Resolution type enum
    enum ResolutionType {
        Manual, // Trusted resolver decides
        PriceThreshold // Oracle price above/below threshold
    }

    // Market structure
    struct Market {
        uint256 id;
        address creator;
        string title;
        string description;
        string[] outcomes;
        uint256 stakingDeadline;
        uint256 resolutionDeadline;
        uint256 disputeWindow;
        MarketStatus status;
        uint256 winningOutcome;
        address resolver;
        uint256 createdAt;
        uint256 totalPool;
        bool feesCollected;
        ResolutionType resolutionType;
        address oracleAddress;
        int256 thresholdPrice;
        uint8 oracleDecimals;
    }

    // Stake structure
    struct Stake {
        uint256 amount;
        uint256 outcomeIndex;
        bool claimed;
    }

    // State variables
    IERC20 public usdcToken;
    uint256 public marketCounter;
    uint256 public platformFeePercent = 200; // 2% (basis points)
    uint256 public creatorFeePercent = 100; // 1% (basis points)
    address public feeCollector;

    // Mappings
    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(uint256 => uint256)) public outcomePoolSizes;
    mapping(uint256 => mapping(address => Stake)) public userStakes;
    mapping(address => string) public referralCodes;
    mapping(address => address) public referrers;
    mapping(address => uint256) public referralPoints;

    // Events
    event MarketCreated(
        uint256 indexed marketId,
        address indexed creator,
        string title,
        uint256 stakingDeadline,
        uint256 resolutionDeadline,
        ResolutionType resolutionType
    );

    event StakePlaced(
        uint256 indexed marketId,
        address indexed user,
        uint256 outcomeIndex,
        uint256 amount,
        address referrer
    );

    event MarketResolved(
        uint256 indexed marketId,
        uint256 winningOutcome,
        address resolver,
        int256 oraclePrice
    );

    event WinningsClaimed(
        uint256 indexed marketId,
        address indexed user,
        uint256 amount
    );

    event MarketDisputed(uint256 indexed marketId, address disputer);
    event ReferralRegistered(address indexed user, string referralCode);

    // Constructor
    constructor(address _usdcToken, address _feeCollector) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcToken);
        feeCollector = _feeCollector;
    }

    // Create a manual resolution market
    function createMarket(
        string memory _title,
        string memory _description,
        string[] memory _outcomes,
        uint256 _stakingDuration,
        uint256 _resolutionDuration,
        uint256 _disputeWindow,
        address _resolver
    ) external returns (uint256) {
        require(_outcomes.length >= 2, "Need at least 2 outcomes");
        require(_stakingDuration > 0, "Invalid staking duration");
        require(_resolutionDuration > 0, "Invalid resolution duration");

        uint256 marketId = marketCounter++;
        uint256 stakingEnd = block.timestamp + _stakingDuration;
        uint256 resolutionEnd = stakingEnd + _resolutionDuration;

        markets[marketId] = Market({
            id: marketId,
            creator: msg.sender,
            title: _title,
            description: _description,
            outcomes: _outcomes,
            stakingDeadline: stakingEnd,
            resolutionDeadline: resolutionEnd,
            disputeWindow: _disputeWindow,
            status: MarketStatus.Open,
            winningOutcome: 0,
            resolver: _resolver,
            createdAt: block.timestamp,
            totalPool: 0,
            feesCollected: false,
            resolutionType: ResolutionType.Manual,
            oracleAddress: address(0),
            thresholdPrice: 0,
            oracleDecimals: 0
        });

        emit MarketCreated(
            marketId,
            msg.sender,
            _title,
            stakingEnd,
            resolutionEnd,
            ResolutionType.Manual
        );

        return marketId;
    }

    // Create an oracle-based market with price threshold
    function createOracleMarket(
        string memory _title,
        string memory _description,
        string[] memory _outcomes,
        uint256 _stakingDuration,
        uint256 _resolutionDuration,
        uint256 _disputeWindow,
        address _oracleAddress,
        int256 _thresholdPrice
    ) external returns (uint256) {
        require(
            _outcomes.length == 2,
            "Oracle markets need exactly 2 outcomes"
        );
        require(_stakingDuration > 0, "Invalid staking duration");
        require(_resolutionDuration > 0, "Invalid resolution duration");
        require(_oracleAddress != address(0), "Invalid oracle address");

        // Validate oracle
        AggregatorV3Interface oracle = AggregatorV3Interface(_oracleAddress);
        uint8 decimals = oracle.decimals();

        // Test oracle accessibility
        oracle.latestRoundData();

        uint256 marketId = marketCounter++;
        uint256 stakingEnd = block.timestamp + _stakingDuration;
        uint256 resolutionEnd = stakingEnd + _resolutionDuration;

        markets[marketId] = Market({
            id: marketId,
            creator: msg.sender,
            title: _title,
            description: _description,
            outcomes: _outcomes,
            stakingDeadline: stakingEnd,
            resolutionDeadline: resolutionEnd,
            disputeWindow: _disputeWindow,
            status: MarketStatus.Open,
            winningOutcome: 0,
            resolver: msg.sender,
            createdAt: block.timestamp,
            totalPool: 0,
            feesCollected: false,
            resolutionType: ResolutionType.PriceThreshold,
            oracleAddress: _oracleAddress,
            thresholdPrice: _thresholdPrice,
            oracleDecimals: decimals
        });

        emit MarketCreated(
            marketId,
            msg.sender,
            _title,
            stakingEnd,
            resolutionEnd,
            ResolutionType.PriceThreshold
        );

        return marketId;
    }

    // Place a stake on an outcome
    function placeStake(
        uint256 _marketId,
        uint256 _outcomeIndex,
        uint256 _amount,
        address _referrer
    ) external nonReentrant {
        Market storage market = markets[_marketId];

        require(market.status == MarketStatus.Open, "Market not open");
        require(
            block.timestamp < market.stakingDeadline,
            "Staking period ended"
        );
        require(_outcomeIndex < market.outcomes.length, "Invalid outcome");
        require(_amount > 0, "Amount must be > 0");
        require(
            userStakes[_marketId][msg.sender].amount == 0,
            "Already staked"
        );

        // Handle referral
        if (
            _referrer != address(0) &&
            _referrer != msg.sender &&
            referrers[msg.sender] == address(0)
        ) {
            referrers[msg.sender] = _referrer;
            referralPoints[_referrer] += 1;
        }

        // Transfer USDC from user to contract
        require(
            usdcToken.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );

        // Update stake records
        userStakes[_marketId][msg.sender] = Stake({
            amount: _amount,
            outcomeIndex: _outcomeIndex,
            claimed: false
        });

        outcomePoolSizes[_marketId][_outcomeIndex] += _amount;
        market.totalPool += _amount;

        emit StakePlaced(
            _marketId,
            msg.sender,
            _outcomeIndex,
            _amount,
            _referrer
        );
    }

    // Resolve market manually
    function resolveMarket(
        uint256 _marketId,
        uint256 _winningOutcome
    ) external {
        Market storage market = markets[_marketId];

        require(
            market.status == MarketStatus.Open ||
                market.status == MarketStatus.Locked,
            "Invalid status"
        );
        require(
            msg.sender == market.resolver || msg.sender == owner(),
            "Not authorized"
        );
        require(
            block.timestamp >= market.stakingDeadline,
            "Staking still ongoing"
        );
        require(
            block.timestamp <= market.resolutionDeadline,
            "Resolution deadline passed"
        );
        require(_winningOutcome < market.outcomes.length, "Invalid outcome");

        market.status = MarketStatus.Resolved;
        market.winningOutcome = _winningOutcome;

        emit MarketResolved(_marketId, _winningOutcome, msg.sender, 0);

        if (market.disputeWindow == 0) {
            market.status = MarketStatus.Finalized;
        }
    }

    // Resolve market using Chainlink oracle
    function resolveMarketWithOracle(uint256 _marketId) external {
        Market storage market = markets[_marketId];

        require(
            market.status == MarketStatus.Open ||
                market.status == MarketStatus.Locked,
            "Invalid status"
        );
        require(
            market.resolutionType != ResolutionType.Manual,
            "Use resolveMarket for manual markets"
        );
        require(
            block.timestamp >= market.stakingDeadline,
            "Staking still ongoing"
        );
        require(
            block.timestamp <= market.resolutionDeadline,
            "Resolution deadline passed"
        );

        // Get price from oracle
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            market.oracleAddress
        );
        (
            uint80 roundId,
            int256 price,
            ,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();

        require(price > 0, "Invalid oracle price");
        require(updatedAt > 0, "Oracle data stale");
        require(answeredInRound >= roundId, "Stale oracle round");
        require(block.timestamp - updatedAt < 1 hours, "Oracle data too old");

        // Determine winner: outcomes[0] = "Yes/Above", outcomes[1] = "No/Below"
        uint256 winningOutcome = price >= market.thresholdPrice ? 0 : 1;

        market.status = MarketStatus.Resolved;
        market.winningOutcome = winningOutcome;

        emit MarketResolved(_marketId, winningOutcome, msg.sender, price);

        if (market.disputeWindow == 0) {
            market.status = MarketStatus.Finalized;
        }
    }

    // Get current oracle price
    function getCurrentOraclePrice(
        uint256 _marketId
    ) external view returns (int256 price, uint256 updatedAt) {
        Market storage market = markets[_marketId];
        require(
            market.resolutionType != ResolutionType.Manual,
            "Not an oracle market"
        );

        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            market.oracleAddress
        );
        (, price, , updatedAt, ) = priceFeed.latestRoundData();
    }

    // Dispute a market resolution
    function disputeMarket(uint256 _marketId) external {
        Market storage market = markets[_marketId];

        require(market.status == MarketStatus.Resolved, "Market not resolved");
        require(
            block.timestamp < market.resolutionDeadline + market.disputeWindow,
            "Dispute window closed"
        );
        require(
            userStakes[_marketId][msg.sender].amount > 0,
            "Not a participant"
        );

        market.status = MarketStatus.Disputed;
        emit MarketDisputed(_marketId, msg.sender);
    }

    // Finalize market after dispute window
    function finalizeMarket(uint256 _marketId) external {
        Market storage market = markets[_marketId];

        require(market.status == MarketStatus.Resolved, "Market not resolved");
        require(
            block.timestamp >= market.resolutionDeadline + market.disputeWindow,
            "Dispute window not ended"
        );

        market.status = MarketStatus.Finalized;
    }

    // Claim winnings
    function claimWinnings(uint256 _marketId) external nonReentrant {
        Market storage market = markets[_marketId];
        Stake storage userStake = userStakes[_marketId][msg.sender];

        require(
            market.status == MarketStatus.Finalized,
            "Market not finalized"
        );
        require(userStake.amount > 0, "No stake found");
        require(!userStake.claimed, "Already claimed");
        require(
            userStake.outcomeIndex == market.winningOutcome,
            "Not a winner"
        );

        uint256 winningPool = outcomePoolSizes[_marketId][
            market.winningOutcome
        ];
        uint256 losingPool = market.totalPool - winningPool;

        // Collect fees on first claim
        if (!market.feesCollected) {
            uint256 platformFee = (losingPool * platformFeePercent) / 10000;
            uint256 creatorFee = (losingPool * creatorFeePercent) / 10000;

            usdcToken.transfer(feeCollector, platformFee);
            usdcToken.transfer(market.creator, creatorFee);

            market.feesCollected = true;
            losingPool -= (platformFee + creatorFee);
        } else {
            uint256 totalFees = (losingPool *
                (platformFeePercent + creatorFeePercent)) / 10000;
            losingPool -= totalFees;
        }

        uint256 userShare = (userStake.amount * losingPool) / winningPool;
        uint256 totalPayout = userStake.amount + userShare;

        userStake.claimed = true;

        require(
            usdcToken.transfer(msg.sender, totalPayout),
            "Payout transfer failed"
        );

        emit WinningsClaimed(_marketId, msg.sender, totalPayout);
    }

    // Refund if market is disputed
    function refundStake(uint256 _marketId) external nonReentrant {
        Market storage market = markets[_marketId];
        Stake storage userStake = userStakes[_marketId][msg.sender];

        require(market.status == MarketStatus.Disputed, "Market not disputed");
        require(
            block.timestamp >
                market.resolutionDeadline + market.disputeWindow + 7 days,
            "Wait for resolution period"
        );
        require(userStake.amount > 0, "No stake found");
        require(!userStake.claimed, "Already claimed");

        uint256 refundAmount = userStake.amount;
        userStake.claimed = true;

        require(usdcToken.transfer(msg.sender, refundAmount), "Refund failed");
    }

    // Register referral code
    function registerReferralCode(string memory _code) external {
        require(
            bytes(referralCodes[msg.sender]).length == 0,
            "Already registered"
        );
        require(bytes(_code).length > 0, "Invalid code");

        referralCodes[msg.sender] = _code;
        emit ReferralRegistered(msg.sender, _code);
    }

    // View functions
    function getMarket(
        uint256 _marketId
    ) external view returns (Market memory) {
        return markets[_marketId];
    }

    function getUserStake(
        uint256 _marketId,
        address _user
    ) external view returns (Stake memory) {
        return userStakes[_marketId][_user];
    }

    function getOutcomePool(
        uint256 _marketId,
        uint256 _outcomeIndex
    ) external view returns (uint256) {
        return outcomePoolSizes[_marketId][_outcomeIndex];
    }

    function calculatePotentialWinnings(
        uint256 _marketId,
        address _user
    ) external view returns (uint256) {
        Market storage market = markets[_marketId];
        Stake storage userStake = userStakes[_marketId][_user];

        if (userStake.amount == 0 || market.status != MarketStatus.Finalized) {
            return 0;
        }

        if (userStake.outcomeIndex != market.winningOutcome) {
            return 0;
        }

        uint256 winningPool = outcomePoolSizes[_marketId][
            market.winningOutcome
        ];
        uint256 losingPool = market.totalPool - winningPool;
        uint256 totalFees = (losingPool *
            (platformFeePercent + creatorFeePercent)) / 10000;
        uint256 distributablePool = losingPool - totalFees;

        uint256 userShare = (userStake.amount * distributablePool) /
            winningPool;
        return userStake.amount + userShare;
    }

    // Admin functions
    function updateFees(
        uint256 _platformFee,
        uint256 _creatorFee
    ) external onlyOwner {
        require(_platformFee + _creatorFee < 1000, "Total fees too high");
        platformFeePercent = _platformFee;
        creatorFeePercent = _creatorFee;
    }

    function updateFeeCollector(address _newCollector) external onlyOwner {
        require(_newCollector != address(0), "Invalid address");
        feeCollector = _newCollector;
    }

    function emergencyLockMarket(uint256 _marketId) external onlyOwner {
        markets[_marketId].status = MarketStatus.Locked;
    }
}
