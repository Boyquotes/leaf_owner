var LeafToken = artifacts.require("LeafToken");
var LeafNft = artifacts.require("LeafNft");
var LeafDapp = artifacts.require("LeafDapp");

module.exports = async function(deployer) {
  const ipfsBaseURI = "ipfs://Qmdw1zGjqvdLfaUe4AY7rnwxmtQ7j6xYKbXzkDkXDgCPum/";

  await deployer.deploy(LeafToken);
  await deployer.deploy(LeafNft, 
    "Leaf NFT",
    "LNFT",
    ipfsBaseURI);

  const leaf = await LeafToken.deployed();
  const nft = await LeafNft.deployed();
  
  await deployer.deploy(LeafDapp, leaf.address, nft.address);
  const dapp = await LeafDapp.deployed();
  
  await leaf.transferOwnership(dapp.address);
  await nft.transferOwnership(dapp.address);

  await dapp.mintLeaf();

  // console.log(leaf.address);
  // console.log(nft.address);
  // console.log(dapp.address);
};
