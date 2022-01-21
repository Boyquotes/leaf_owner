// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LeafNft is ERC721Enumerable, Ownable {
  using Strings for uint;

  /// @dev uri of ipfs
  string baseURI;
  string baseExtension = ".json";

  /// @dev supply of first level
  uint firstLevelSupply;

  /// @dev ids of nft, maximum 4 for each address (ex: 27, 10027, 20027, 30027)
  mapping(address => uint[]) idsNft;

  /// @dev mint first 10 NFTs with NFT levels for owner
  /// @param _name name of token ERC721
  /// @param _symbol symbol of token ERC721
  /// @param _initBaseURI base URI of ipfs files
  constructor(
    string memory _name,
    string memory _symbol,
    string memory _initBaseURI
  ) ERC721(_name, _symbol) {
    setBaseURI(_initBaseURI);
    mintOwner(1);
  }

  /// @dev player receives his first NFT
  /// @param _to receiver address
  /// @return minted NFT ipfs address
  function firstMint(address _to) external onlyOwner returns(string memory)  {
    require(_to != address(0), "LeafNFT : must not be equal to address 0");
    require(idsNft[_to].length == 0, "LeafNFT : has already done first mint");

    firstLevelSupply++;
    _safeMint(_to, firstLevelSupply);
    idsNft[_to].push(firstLevelSupply);

    return tokenURIIpfs(firstLevelSupply);
  }

  /// @dev player receives his auther NFTs
  /// @param _to receiver address
  /// @param _level new NFT level, can be 10000, 20000 or 30000
  /// @return minted NFT ipfs address
  function nextMint(address _to, uint _level) external onlyOwner returns(string memory)  {
    uint id = idsNft[_to][0];
    require(id != 0);

    uint newNftId = id + _level;
    _safeMint(_to, newNftId);
    idsNft[_to].push(newNftId);

    return tokenURIIpfs(newNftId);
  }

  /// @dev mint _nbNft NFTs of each level for owner
  /// @param _nbNft number of mint of each level
  function mintOwner(uint _nbNft) public onlyOwner {
    require(_nbNft > 0);

    for (uint i = 1; i <= _nbNft; i++) {
      firstLevelSupply++;
      _safeMint(msg.sender, firstLevelSupply);
    }
    for (uint i = 10001; i <= 10000 + _nbNft; i++) {
      _safeMint(msg.sender, i);
    }
    for (uint i = 20001; i <= 20000 + _nbNft; i++) {
      _safeMint(msg.sender, i);
    }
    for (uint i = 30001; i <= 30000 + _nbNft; i++) {
      _safeMint(msg.sender, i);
    }
  }

  /// @dev ex: nftId = 45 => ipfs://BASE_URI/45.json
  /// @param _nftId identifier of token ERC721
  /// @return send json file link in ipfs 
  function tokenURIIpfs(uint _nftId) internal view returns (string memory) {
    require(_exists(_nftId));

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, _nftId.toString(), baseExtension))
        : "";
  }

  /// @return return base uri
  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  /// @dev for players the table can contain a maximum of 4 elements, for owner more
  /// @param _address a player address
  /// @return return list of identifiers of _address
  function getIdsNftByAddress(address _address) external view onlyOwner returns(uint[] memory) {
    return idsNft[_address]; 
  }

  /// @dev change base URL by _newBaseURI
  /// @param _newBaseURI new base URI
  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }

  /// @dev change base extension .json by _newBaseExtension
  /// @param _newBaseExtension new base extension
  function setBaseExtension(string memory _newBaseExtension) external onlyOwner {
    baseExtension = _newBaseExtension;
  }

  /// @dev return parameter firstLevelSupply
  /// @return firstLevelSupply
  function getSupply() external view  onlyOwner returns(uint) {
    return firstLevelSupply;
  }

}
