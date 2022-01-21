// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./LeafToken.sol";
import "./LeafNft.sol";

contract LeafDapp is Ownable {

  /// @dev value to go to the next level
  uint constant NEW_LEVEL_VALUE = 10000;
  uint constant OWNER_LEAFS = 1000000*(10 ** 18);
  uint constant MIN_NB_STEPS = 1000;
  uint constant MAX_LEVEL = 3;

  /// @dev the NFT price
  uint cost = 0.01 ether;
  /// @dev max supply for 1st level NFTs
  uint maxSupplyNft = 10000;
  /// @dev max supply for token LEAF
  uint maxSupplyLeaf = 150000000 * (10**18);
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
    uint32 oldNbStep;
    uint32 nbDaySuccess;
    uint32 level;
    uint totalNbStep;
    uint lastUpdateDate;
    string[] uriIpfs;
  }

  /// @dev return player from his address
  mapping (address => Player) players;
  /// @dev returns player validity from his address
  mapping(address => bool) whitelisted;

  /// @dev when new NFT was buyed
  event NftBuyed(address _address, string uriIpfs);
  /// @dev when LEAF was transfered
  event LeafTransfer(address _address, uint amountLeaf);

  /// @param _leaf the ERC20 LEAF token contract address
  /// @param _nft the ERC721 LNFT token contract address
  constructor(address _leaf, address _nft) {
    leaf = LeafToken(_leaf);
    nft = LeafNft(_nft);
  }

  modifier onlyPlayer() {
    require (isPlayer(msg.sender), "LeafDapp : caller is not a player");
    _;
  }

  modifier onlyOwnerOrPlayer() {
    require (owner() == msg.sender ||
      isPlayer(msg.sender), "LeafDapp : caller is not a player");
    _;
  }

  /// @dev mint million LEAF for owner
  function mintLeaf() external onlyOwner {
    leaf.mint(maxSupplyLeaf);
    leaf.transfer(msg.sender, OWNER_LEAFS);
  }

  /// @dev to play you have to buy the first NFT
  function buyNft() payable external {
    require(! isPlayer(msg.sender), "LeafDapp : this address already has an nft");
    require(! whitelisted[msg.sender], "LeafDapp : this address already has an nft");
    require(!paused, "LeafDapp : is paused");
    uint amountTobuy = msg.value;
    uint supply = nftSupply();
    require(amountTobuy == cost, "LeafDApp : must be aqual to 0.01ETH");
    require(supply < maxSupplyNft, "LeafDApp : the LNFT reserve is empty");

    string memory newNft = nft.firstMint(msg.sender);
    players[msg.sender].uriIpfs.push(newNft);
    whitelisted[msg.sender] = true;

    emit NftBuyed(msg.sender, newNft);
  }



  /// @dev update player data related to the number of steps
  /// @param _nbStep number of steps per day
  function stepToLeaf(uint32 _nbStep) external onlyPlayer {
    require(block.timestamp - players[msg.sender].lastUpdateDate >= 1 days,
      "LeafDApp : a day has not passed yet");
    require(!paused, "LeafDapp : is paused");
    
    uint amountLeaf = _nbStep / 10;

    if(_nbStep >= MIN_NB_STEPS) {
      players[msg.sender].lastUpdateDate = block.timestamp;
      players[msg.sender].nbDaySuccess++;
      players[msg.sender].oldNbStep = _nbStep;
      players[msg.sender].totalNbStep += _nbStep;
      if(players[msg.sender].level < MAX_LEVEL) {
        setNewLevel(msg.sender);
      } else {
        leaf.transfer(msg.sender, amountLeaf);
      }
    } else {
      players[msg.sender].nbDaySuccess = 0;
    }

    emit LeafTransfer(msg.sender, amountLeaf);
  }

  function stepToLeafWithoutTimestamp(uint32 _nbStep) external onlyPlayer {
    require(test);
    // require(block.timestamp - players[msg.sender].lastUpdateDate >= 1 days,
    //   "LeafDApp : a day has not passed yet");
    require(!paused, "LeafDapp : is paused");
    require(isPlayer(msg.sender), "LeafDApp : not a player");
    
    uint amountLeaf = _nbStep / 10;

    if(_nbStep >= MIN_NB_STEPS) {
      players[msg.sender].lastUpdateDate = block.timestamp;
      players[msg.sender].nbDaySuccess++;
      players[msg.sender].oldNbStep = _nbStep;
      players[msg.sender].totalNbStep += _nbStep;
      if(players[msg.sender].level < MAX_LEVEL) {
        setNewLevel(msg.sender);
      } else {
        leaf.transfer(msg.sender, amountLeaf);
      }
    } else {
      players[msg.sender].nbDaySuccess = 0;
    }

    emit LeafTransfer(msg.sender, amountLeaf);
  }


  //////////////////////////////////////////////////////////////////////////
  //   INTERNAL FUNCTIONS
  //////////////////////////////////////////////////////////////////////////

  /// @dev the player levels up and receives a new NFT
  /// @param _player address of player
  function setNewLevel(address _player) internal {
    require(isPlayer(_player));

    players[_player].level++;
    uint newLevel = players[_player].level * NEW_LEVEL_VALUE;
    string memory newNft = nft.nextMint(_player, newLevel);
    players[_player].uriIpfs.push(newNft);
  }

  /// @return supply for one level
  function nftSupply() internal view returns(uint) {
    return nft.getSupply();
  }

  /// @dev show if player or not
  function isPlayer(address _player) internal view returns(bool) {
    require(_player != address(0), "LeafDapp : must not be equal to address 0");
    return whitelisted[_player];
  }


  //////////////////////////////////////////////////////////////////////////
  //   EXTERNAL FUNCTIONS
  //////////////////////////////////////////////////////////////////////////


  /// @dev withdraw for only owner
  /// @param _amount the desired amount
  function withdraw(uint _amount) external onlyOwner {
    payable(msg.sender).transfer(_amount);
  }

  /// @return player 
  function getPlayer() external view onlyOwnerOrPlayer returns(Player memory){
    return players[msg.sender];
  }

  /// @dev set pause/start the dapp
  function setPause(bool _state) external onlyOwner {
    paused = _state;
  }

  /// @dev get pause/start the dapp
  function getPause() external view onlyOwner returns(bool) {
    return paused;
  }

  /// @dev set on/off test mode 
  function setTest(bool _state) external onlyOwner {
    test = _state;
  }

  /// @dev get on/off test mode 
  function getTest() external view onlyOwner returns(bool) {
    return test;
  }

  /// @dev change the cost
  function setCost(uint _newCost) external onlyOwner {
    cost = _newCost;
  }

  /// @dev add to whitelist
  /// @param _player the address of player
  function whitelistPlayer(address _player) external onlyOwner {
    require(_player != address(0), "LeafDapp : must not be equal to address 0");
    whitelisted[_player] = true;
  }

  /// @dev remove frome whitelist
  /// @param _player the address of player
  function removeWhitelistPlayer(address _player) external onlyOwner {
    require(_player != address(0), "LeafDapp : must not be equal to address 0");
    whitelisted[_player] = false;
  }

  /// @return balance of _player in LEAF
  /// @param _player address of player
  function balancePlayer(address _player) external view onlyOwner returns(uint) {
    return leaf.balanceOf(_player);
  }

  /// @return balance of appellant in LEAF
  function balance() external view onlyPlayer returns(uint) {
    return leaf.balanceOf(address(msg.sender));
  }

  /// @return supply of NFTs
  function balanceNft() external view onlyOwnerOrPlayer returns (uint) {
    return nftSupply();
  }

  /// @return contract balance in LEAF
  function balanceDappLeaf() external view onlyOwnerOrPlayer returns(uint) {
    return leaf.balanceOf(address(this));
  }

  /// @return contract balance in ETH
  function balanceDappEth() external view onlyOwner returns(uint) {
    return address(this).balance;
  }

  /// @return leaf
  function getLeaf() external view onlyOwner returns(LeafToken) {
    return leaf;
  }

  /// @return nft
  function getNft() external view onlyOwner returns(LeafNft) {
    return nft;
  }

}
