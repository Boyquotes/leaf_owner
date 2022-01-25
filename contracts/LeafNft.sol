// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Token ERC721 LNFT
 * @notice This token allows players to enter the game
 */
contract LeafNft is ERC721Enumerable, Ownable {
    using Strings for uint256;

    /// @dev value of first level
    uint256 constant LEVEL_1 = 10000;
    /// @dev value of second level
    uint256 constant LEVEL_2 = 20000;
    /// @dev value of third level
    uint256 constant LEVEL_3 = 30000;

    /// @dev uri of ipfs
    string baseURI;
    string baseExtension = ".json";

    /// @dev supply of first level
    uint256 firstLevelSupply;

    /// @dev ids of nft, maximum 4 for each address (ex: 27, 10027, 20027, 30027)
    /// @dev owner can have more NFTs
    mapping(address => uint256[]) idsNft;

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
    function firstMint(address _to) external onlyOwner returns (string memory) {
        require(_to != address(0), "LeafNFT : must not be equal to address 0");
        require(
            idsNft[_to].length == 0,
            "LeafNFT : has already done first mint"
        );

        firstLevelSupply++;
        _safeMint(_to, firstLevelSupply);
        idsNft[_to].push(firstLevelSupply);

        return tokenURIIpfs(firstLevelSupply);
    }

    /// @dev player receives his auther NFTs
    /// @param _to receiver address
    /// @param _level new NFT level, can be 10000, 20000 or 30000
    /// @return minted NFT ipfs address
    function nextMint(address _to, uint256 _level)
        external
        onlyOwner
        returns (string memory)
    {
        bool firstExists = (idsNft[_to].length != 0);
        require(firstExists, "LeafNFT : must exist first id");

        uint256 id = idsNft[_to][0];
        uint256 newNftId = id + _level;
        _safeMint(_to, newNftId);
        idsNft[_to].push(newNftId);

        return tokenURIIpfs(newNftId);
    }

    /// @dev mint _nbNft NFTs of each level for owner
    /// @param _nbNft number of mint of each level
    function mintOwner(uint256 _nbNft) public onlyOwner {
        require(_nbNft > 0, "LeafNFT : must be greater than 0");
        require(
            _nbNft + firstLevelSupply <= 10000,
            "LeafNFT : must be less than 10000"
        );

        for (uint256 i = 1; i <= _nbNft; i++) {
            firstLevelSupply++;
            _safeMint(msg.sender, firstLevelSupply);
            _safeMint(msg.sender, LEVEL_1 + firstLevelSupply);
            _safeMint(msg.sender, LEVEL_2 + firstLevelSupply);
            _safeMint(msg.sender, LEVEL_3 + firstLevelSupply);

            idsNft[msg.sender].push(firstLevelSupply);
            idsNft[msg.sender].push(LEVEL_1 + firstLevelSupply);
            idsNft[msg.sender].push(LEVEL_2 + firstLevelSupply);
            idsNft[msg.sender].push(LEVEL_3 + firstLevelSupply);
        }
    }

    /// @dev ex: nftId = 45 => ipfs://BASE_URI/45.json
    /// @param _nftId identifier of token ERC721
    /// @return send json file link in ipfs
    function tokenURIIpfs(uint256 _nftId)
        internal
        view
        returns (string memory)
    {
        require(_exists(_nftId), "LeafNFT : not exists");

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        _nftId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    /// @return return base uri
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    /// @dev for players the table can contain a maximum of 4 elements, for owner more
    /// @param _address a player address
    /// @return return list of identifiers of token ERC721
    function getIdsNftByAddress(address _address)
        external
        view
        onlyOwner
        returns (uint256[] memory)
    {
        return idsNft[_address];
    }

    /// @dev change base URL by _newBaseURI
    /// @param _newBaseURI new base URI
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    /// @return return parameter baseURI
    function getBaseURI() external view onlyOwner returns (string memory) {
        return baseURI;
    }

    /// @dev change base extension .json by _newBaseExtension
    /// @param _newBaseExtension new base extension
    function setBaseExtension(string memory _newBaseExtension)
        external
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    /// @return return parameter baseExtension
    function getBaseExtension()
        external
        view
        onlyOwner
        returns (string memory)
    {
        return baseExtension;
    }

    /// @dev return parameter firstLevelSupply
    /// @return firstLevelSupply
    function getSupply() external view onlyOwner returns (uint256) {
        return firstLevelSupply;
    }
}
