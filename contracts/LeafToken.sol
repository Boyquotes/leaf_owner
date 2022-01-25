// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Token ERC20 LEAF
 * @notice This token is used to reward players
 */
contract LeafToken is ERC20, Ownable {
    bool mintOnce;

    constructor() ERC20("Token Leaf", "LEAF") {}

    /// @dev mint just once with total supply to owner (LeafDapp) address
    function mint(uint256 _totalLeaf) external onlyOwner {
        require(!mintOnce, "LeafToken: you can mint once");
        require(_totalLeaf > 0, "LeafToken: must be greater than 0");

        _mint(msg.sender, _totalLeaf);
        mintOnce = true;
    }

    /// @dev verification of address(0) is done in _burn of ERC20
    function burn(uint256 _amount) external onlyOwner {
        require(_amount <= totalSupply(), "LeafToken: cant burn");
        _burn(msg.sender, _amount);
    }
}
