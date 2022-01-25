// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./LeafToken.sol";
import "./LeafNft.sol";

/**
 * @title DApp Leaf
 * @notice With this dapp you buy an LNFT and while walking you receive LEAFs
 */
contract LeafDapp is Ownable {
    /// @dev value to go to the next level
    uint256 constant NEW_LEVEL_VALUE = 10000;
    /// @dev number of LEAFs that owner receives after deploying contracts
    uint256 constant OWNER_LEAFS = 1000000 * (10**18);
    /// @dev minimum steps a player can do
    uint256 constant MIN_NB_STEPS = 10000;
    /// @dev maximum steps a player can do
    uint256 constant MAX_NB_STEPS = 25000;
    /// @dev maximum level a player can become
    uint256 constant MAX_LEVEL = 3;
    /// @dev max supply for token LEAF
    uint256 constant MAX_SUPPLY_LEAF = 150000000 * (10**18);
    /// @dev max supply for 1st level NFTs
    uint256 constant MAX_SUPPLY_NFT = 10000;

    /// @dev the NFT price
    uint256 cost = 0.01 ether;
    /// @dev to pause the dapp
    bool paused = false;
    /// @dev if can do test without time restriction
    bool test = true;
    /// @dev the token ERC20 LEAF
    LeafToken leaf;
    /// @dev the token ERC721 LNFT
    LeafNft nft;

    /// @param oldNbStep yesterday's step count
    /// @param nbDaySuccess number of days success (+10000 steps)
    /// @param level level of player 0, 1, 2 or 3
    /// @param totalNbStep total number of steps
    /// @param lastUpdateDate last update when player had more than 10000 steps
    /// @param uriIpfs list of ipfs URIs
    struct Player {
        uint32 nbDaySuccess;
        uint32 level;
        uint256 oldNbStep;
        uint256 totalNbStep;
        uint256 lastUpdateDate;
        string[] uriIpfs;
    }

    /// @dev return player from his address
    mapping(address => Player) players;
    /// @dev returns player validity from his address
    mapping(address => bool) whitelisted;

    /// @dev when new NFT was buyed
    event NftBuyed(address player, string uriIpfs);
    /// @dev when LEAF was transfered
    event LeafTransfer(address player, uint256 amountLeaf);
    /// @dev when LNFT was transfered
    event NftTransfer(address player, string uriIpfs);

    /// @param _leaf the ERC20 LEAF token contract address
    /// @param _nft the ERC721 LNFT token contract address
    constructor(address _leaf, address _nft) {
        leaf = LeafToken(_leaf);
        nft = LeafNft(_nft);
    }

    /// @dev Throws if called by any account other than the players.
    modifier onlyPlayer() {
        require(isPlayer(msg.sender), "LeafDapp : caller is not a player");
        _;
    }

    /// @dev Throws if called by any account other than the owner or players.
    modifier onlyOwnerOrPlayer() {
        require(
            owner() == msg.sender || isPlayer(msg.sender),
            "LeafDapp : caller is not a owner or player"
        );
        _;
    }

    /// @dev mint million LEAF for owner
    function mintLeaf() external onlyOwner {
        leaf.mint(MAX_SUPPLY_LEAF);
        leaf.transfer(msg.sender, OWNER_LEAFS);
    }

    /// @dev to play you have to buy the first NFT
    function buyNft() external payable {
        require(
            !isPlayer(msg.sender),
            "LeafDapp : this address already has an nft"
        );
        require(!paused, "LeafDapp : is paused");
        uint256 amountTobuy = msg.value;
        uint256 supply = nftSupply();
        require(amountTobuy == cost, "LeafDApp : must be aqual to 0.01 ETH");
        require(
            supply < MAX_SUPPLY_NFT,
            "LeafDApp : the LNFT reserve is empty"
        );

        string memory newNft = nft.firstMint(msg.sender);
        players[msg.sender].uriIpfs.push(newNft);
        whitelisted[msg.sender] = true;

        emit NftBuyed(msg.sender, newNft);
    }

    /// @dev update player data related to the number of steps
    /// @param _nbStep number of steps per day
    function stepToLeaf(uint256 _nbStep) external onlyPlayer {
        require(
            block.timestamp - players[msg.sender].lastUpdateDate >= 1 days,
            "LeafDApp : a day has not passed yet"
        );
        require(!paused, "LeafDapp : is paused");

        uint256 amountLeaf = (_nbStep * (10**15));

        if (_nbStep >= MIN_NB_STEPS && _nbStep <= MAX_NB_STEPS) {
            players[msg.sender].lastUpdateDate = block.timestamp;
            players[msg.sender].nbDaySuccess++;
            players[msg.sender].oldNbStep = _nbStep;
            players[msg.sender].totalNbStep += _nbStep;
            if (players[msg.sender].level < MAX_LEVEL) {
                setNewLevel(msg.sender);
            } else {
                leaf.transfer(msg.sender, amountLeaf);
                emit LeafTransfer(msg.sender, amountLeaf);
            }
        } else {
            players[msg.sender].nbDaySuccess = 0;
        }
    }

    function stepToLeafWithoutTimestamp(uint256 _nbStep) external onlyPlayer {
        require(test);
        // require(block.timestamp - players[msg.sender].lastUpdateDate >= 1 days,
        //   "LeafDApp : a day has not passed yet");
        // require(!paused, "LeafDapp : is paused");

        uint256 amountLeaf = (_nbStep * (10**15));

        if (_nbStep >= MIN_NB_STEPS && _nbStep <= MAX_NB_STEPS) {
            players[msg.sender].lastUpdateDate = block.timestamp;
            players[msg.sender].nbDaySuccess++;
            players[msg.sender].oldNbStep = _nbStep;
            players[msg.sender].totalNbStep += _nbStep;
            if (players[msg.sender].level < MAX_LEVEL) {
                setNewLevel(msg.sender);
            } else {
                leaf.transfer(msg.sender, amountLeaf);
                emit LeafTransfer(msg.sender, amountLeaf);
            }
        } else {
            players[msg.sender].nbDaySuccess = 0;
        }
    }

    //////////////////////////////////////////////////////////////////////////
    //   INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////////////////

    /// @dev the player levels up and receives a new NFT
    /// @param _player address of player
    function setNewLevel(address _player) internal {
        require(isPlayer(_player), "LeafDapp : not a player");

        players[_player].level++;
        uint256 newLevel = players[_player].level * NEW_LEVEL_VALUE;
        string memory newNft = nft.nextMint(_player, newLevel);
        players[_player].uriIpfs.push(newNft);

        emit NftTransfer(_player, newNft);
    }

    /// @return supply for one level
    function nftSupply() internal view returns (uint256) {
        return nft.getSupply();
    }

    /// @dev show if player or not
    function isPlayer(address _player) internal view returns (bool) {
        require(
            _player != address(0),
            "LeafDapp : must not be equal to address 0"
        );
        return whitelisted[_player];
    }

    //////////////////////////////////////////////////////////////////////////
    //   EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////////////////

    /// @dev withdraw for only owner
    /// @param _amount the desired amount
    function withdraw(uint256 _amount) external onlyOwner {
        require(_amount > 0, "LeafDapp : must be greater than 0");

        payable(msg.sender).transfer(_amount);
    }

    /// @return player who calls this function
    function getPlayer() external view onlyPlayer returns (Player memory) {
        return players[msg.sender];
    }

    /// @return player who calls this function
    function getPlayerWithAddress(address _player)
        external
        view
        onlyOwner
        returns (Player memory)
    {
        require(isPlayer(_player), "LeafDapp : not a player");
        return players[_player];
    }

    /// @dev set pause/start the dapp
    function setPause(bool _state) external onlyOwner {
        paused = _state;
    }

    /// @dev get pause/start the dapp
    function getPause() external view onlyOwner returns (bool) {
        return paused;
    }

    /// @dev set on/off test mode
    function setTest(bool _state) external onlyOwner {
        test = _state;
    }

    /// @dev get on/off test mode
    function getTest() external view onlyOwner returns (bool) {
        return test;
    }

    /// @dev change the cost
    function setCost(uint256 _newCost) external onlyOwner {
        cost = _newCost;
    }

    /// @dev get the cost
    function getCost() external view onlyOwner returns (uint256) {
        return cost;
    }

    /// @dev add to whitelist
    /// @param _player the address of player
    function whitelistPlayer(address _player) external onlyOwner {
        require(
            _player != address(0),
            "LeafDapp : must not be equal to address 0"
        );
        whitelisted[_player] = true;
    }

    /// @dev remove frome whitelist
    /// @param _player the address of player
    function removeWhitelistPlayer(address _player) external onlyOwner {
        require(
            _player != address(0),
            "LeafDapp : must not be equal to address 0"
        );
        whitelisted[_player] = false;
    }

    /// @dev get the player in whitelist
    function getWhitelistPlayer(address _player)
        external
        view
        onlyOwner
        returns (bool)
    {
        require(
            _player != address(0),
            "LeafDapp : must not be equal to address 0"
        );
        return whitelisted[_player];
    }

    /// @return balance of _player in LEAF
    /// @param _player address of player
    function balancePlayer(address _player)
        external
        view
        onlyOwner
        returns (uint256)
    {
        require(
            _player != address(0),
            "LeafDapp : must not be equal to address 0"
        );
        return leaf.balanceOf(_player);
    }

    /// @return balance of appellant in LEAF
    function balance() external view onlyOwnerOrPlayer returns (uint256) {
        return leaf.balanceOf(address(msg.sender));
    }

    /// @return supply of NFTs
    function balanceNft() external view onlyOwnerOrPlayer returns (uint256) {
        return nftSupply();
    }

    /// @return contract balance in LEAF
    function balanceDappLeaf()
        external
        view
        onlyOwnerOrPlayer
        returns (uint256)
    {
        return leaf.balanceOf(address(this));
    }

    /// @return contract balance in ETH
    function balanceDappEth() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    /// @return leaf
    function getLeaf() external view onlyOwner returns (LeafToken) {
        return leaf;
    }

    /// @return nft
    function getNft() external view onlyOwner returns (LeafNft) {
        return nft;
    }
}
