// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LeafToken is ERC20, Ownable {
  uint totalLeaf;
  bool mintOnce;

  constructor() ERC20("Token Leaf", "LEAF") {
    totalLeaf = 150000000 * (10**decimals());
  }

  /// @dev mint just once with total supply to owner (LeafDapp) address
  function mint(
    uint _totalLeaf 
  ) external onlyOwner{
    require(!mintOnce, "LEAF: you can mint once");
    require(_totalLeaf > 0, "LEAF: must be greater than 0");

    totalLeaf = _totalLeaf;
    _mint(msg.sender, _totalLeaf);
    mintOnce = true;
  }

  /// @dev verification of amount/balance is done in _burn
  function burn(uint _amount) external onlyOwner {
    require(_amount <= totalLeaf, "LEAF: cant burn");
   _burn(msg.sender, _amount);
  }

}
