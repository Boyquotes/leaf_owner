const { BN, expectRevert } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

const ContractLeafNft = artifacts.require("LeafNft");

contract("LeafNft", function (accounts) {
  const OWNER = accounts[0];
  const PLAYER_1 = accounts[1];
  const NOT_PLAYER = accounts[2];

  const NAME = "name";
  const SYMBOL = "symbol";
  const BASE_URI = "base_uri/";
  const NEW_BASE_URI = "new_base_uri/";
  const EXTENSION = ".json";
  const NEW_EXTENSION = ".html";

  context("Testing the contract LeafNft", function () {
    before(async function () {
      nft = await ContractLeafNft.new(NAME, SYMBOL, BASE_URI, { from: OWNER });
    });

    it("... test the constructor and the function getSupply", async () => {
      await expectRevert(
        nft.getSupply({ from: PLAYER_1 }),
        "Ownable: caller is not the owner"
      );
      const supply = await nft.getSupply.call({ from: OWNER });
      expect(supply).to.be.bignumber.equal(
        new BN(1),
        "Must be equal to supply"
      );
    });

    it("... test the functions setBaseExtension and getBaseExtension", async () => {
      await expectRevert(
        nft.getBaseExtension({ from: PLAYER_1 }),
        "Ownable: caller is not the owner"
      );
      const extension = await nft.getBaseExtension.call({ from: OWNER });
      expect(extension).to.equal(EXTENSION, "Must be equal to extension");

      await expectRevert(
        nft.setBaseExtension(NEW_EXTENSION, { from: PLAYER_1 }),
        "Ownable: caller is not the owner"
      );
      await nft.setBaseExtension(NEW_EXTENSION, { from: OWNER });
      const newExtension = await nft.getBaseExtension.call({ from: OWNER });
      expect(newExtension).to.equal(
        NEW_EXTENSION,
        "Must be equal to newExtension"
      );
    });

    it("... test the functions setBaseURI and getBaseURI", async () => {
      await expectRevert(
        nft.getBaseURI({ from: PLAYER_1 }),
        "Ownable: caller is not the owner"
      );
      const uri = await nft.getBaseURI.call({ from: OWNER });
      expect(uri).to.equal(BASE_URI, "Must be equal to uri");

      await expectRevert(
        nft.setBaseURI(NEW_BASE_URI, { from: PLAYER_1 }),
        "Ownable: caller is not the owner"
      );
      await nft.setBaseURI(NEW_BASE_URI, { from: OWNER });
      const newUri = await nft.getBaseURI.call({ from: OWNER });
      expect(newUri).to.equal(NEW_BASE_URI, "Must be equal to newUri");
    });

    it("... test the function getIdsNftByAddress", async () => {
      await expectRevert(
        nft.getIdsNftByAddress(PLAYER_1, { from: PLAYER_1 }),
        "Ownable: caller is not the owner"
      );
      const idsOwner = await nft.getIdsNftByAddress.call(OWNER, {
        from: OWNER,
      });

      expect(idsOwner.length).to.equal(4, "Must be equal 4");
      expect(idsOwner[0]).to.be.bignumber.equal(
        new BN(1),
        "Must be equal to 1"
      );
      expect(idsOwner[1]).to.be.bignumber.equal(
        new BN(10001),
        "Must be equal to 10001"
      );
      expect(idsOwner[2]).to.be.bignumber.equal(
        new BN(20001),
        "Must be equal to 20001"
      );
      expect(idsOwner[3]).to.be.bignumber.equal(
        new BN(30001),
        "Must be equal to 30001"
      );
    });

    it("... test the function mintOwner", async () => {
      await expectRevert(
        nft.mintOwner(1, { from: PLAYER_1 }),
        "Ownable: caller is not the owner"
      );
      await expectRevert(
        nft.mintOwner(0, { from: OWNER }),
        "LeafNFT : must be greater than 0"
      );
      await expectRevert(
        nft.mintOwner(10004, { from: OWNER }),
        "LeafNFT : must be less than 10000"
      );

      await nft.mintOwner(1, { from: OWNER });
      const idsOwner = await nft.getIdsNftByAddress.call(OWNER, {
        from: OWNER,
      });

      expect(idsOwner.length).to.equal(8, "Must be equal 8");
      expect(idsOwner[4]).to.be.bignumber.equal(
        new BN(2),
        "Must be equal to 2"
      );
      expect(idsOwner[5]).to.be.bignumber.equal(
        new BN(10002),
        "Must be equal to 10002"
      );
      expect(idsOwner[6]).to.be.bignumber.equal(
        new BN(20002),
        "Must be equal to 20002"
      );
      expect(idsOwner[7]).to.be.bignumber.equal(
        new BN(30002),
        "Must be equal to 30002"
      );

      const supply = await nft.getSupply.call({ from: OWNER });
      expect(supply).to.be.bignumber.equal(new BN(2), "Must be equal to 2");
    });

    it("... test the function firstMint", async () => {
      const ADDR_IPFS_LEVEL_0 = "new_base_uri/3.html";

      await expectRevert(
        nft.firstMint(PLAYER_1, { from: PLAYER_1 }),
        "Ownable: caller is not the owner"
      );

      const ipfsPlayer = await nft.firstMint.call(PLAYER_1, { from: OWNER });
      await nft.firstMint(PLAYER_1, { from: OWNER });
      const idsPlayer = await nft.getIdsNftByAddress.call(PLAYER_1, {
        from: OWNER,
      });

      expect(ipfsPlayer).to.equal(
        ADDR_IPFS_LEVEL_0,
        "Must be equal new_base_uri/3.html"
      );
      expect(idsPlayer.length).to.equal(1, "Must be equal 1");
      expect(idsPlayer[0]).to.be.bignumber.equal(
        new BN(3),
        "Must be equal to 3"
      );

      const supply = await nft.getSupply.call({ from: OWNER });
      expect(supply).to.be.bignumber.equal(new BN(3), "Must be equal to 3");

      await expectRevert(
        nft.firstMint(PLAYER_1, { from: OWNER }),
        "LeafNFT : has already done first mint"
      );
    });

    it("... test the function nextMint LEVEL_1", async () => {
      const LEVEL_1 = new BN(10000);
      const ADDR_IPFS_LEVEL_1 = "new_base_uri/10003.html";

      await expectRevert(
        nft.nextMint(PLAYER_1, LEVEL_1, { from: PLAYER_1 }),
        "Ownable: caller is not the owner"
      );
      await expectRevert(
        nft.nextMint(NOT_PLAYER, LEVEL_1, { from: OWNER }),
        "LeafNFT : must exist first id"
      );

      const ipfsPlayer = await nft.nextMint.call(PLAYER_1, LEVEL_1, {
        from: OWNER,
      });
      await nft.nextMint(PLAYER_1, LEVEL_1, { from: OWNER });
      const idsPlayer = await nft.getIdsNftByAddress.call(PLAYER_1, {
        from: OWNER,
      });

      expect(ipfsPlayer).to.equal(
        ADDR_IPFS_LEVEL_1,
        "Must be equal new_base_uri/10003.html"
      );
      expect(idsPlayer.length).to.equal(2, "Must be equal 2");
      expect(idsPlayer[0]).to.be.bignumber.equal(
        new BN(3),
        "Must be equal to 3"
      );
      expect(idsPlayer[1]).to.be.bignumber.equal(
        new BN(10003),
        "Must be equal to 10003"
      );

      const supply = await nft.getSupply.call({ from: OWNER });
      expect(supply).to.be.bignumber.equal(new BN(3), "Must be equal to 3");
    });

    it("... test the function nextMint LEVEL_2", async () => {
      const LEVEL_2 = new BN(20000);
      const ADDR_IPFS_LEVEL_2 = "new_base_uri/20003.html";

      await expectRevert(
        nft.nextMint(PLAYER_1, LEVEL_2, { from: PLAYER_1 }),
        "Ownable: caller is not the owner"
      );
      await expectRevert(
        nft.nextMint(NOT_PLAYER, LEVEL_2, { from: OWNER }),
        "LeafNFT : must exist first id"
      );

      const ipfsPlayer = await nft.nextMint.call(PLAYER_1, LEVEL_2, {
        from: OWNER,
      });
      await nft.nextMint(PLAYER_1, LEVEL_2, { from: OWNER });
      const idsPlayer = await nft.getIdsNftByAddress.call(PLAYER_1, {
        from: OWNER,
      });

      expect(ipfsPlayer).to.equal(
        ADDR_IPFS_LEVEL_2,
        "Must be equal new_base_uri/20003.html"
      );
      expect(idsPlayer.length).to.equal(3, "Must be equal 3");
      expect(idsPlayer[0]).to.be.bignumber.equal(
        new BN(3),
        "Must be equal to 3"
      );
      expect(idsPlayer[1]).to.be.bignumber.equal(
        new BN(10003),
        "Must be equal to 10003"
      );
      expect(idsPlayer[2]).to.be.bignumber.equal(
        new BN(20003),
        "Must be equal to 20003"
      );

      const supply = await nft.getSupply.call({ from: OWNER });
      expect(supply).to.be.bignumber.equal(new BN(3), "Must be equal to 3");
    });

    it("... test the function nextMint LEVEL_3", async () => {
      const LEVEL_3 = new BN(30000);
      const ADDR_IPFS_LEVEL_3 = "new_base_uri/30003.html";

      await expectRevert(
        nft.nextMint(PLAYER_1, LEVEL_3, { from: PLAYER_1 }),
        "Ownable: caller is not the owner"
      );
      await expectRevert(
        nft.nextMint(NOT_PLAYER, LEVEL_3, { from: OWNER }),
        "LeafNFT : must exist first id"
      );

      const ipfsPlayer = await nft.nextMint.call(PLAYER_1, LEVEL_3, {
        from: OWNER,
      });
      await nft.nextMint(PLAYER_1, LEVEL_3, { from: OWNER });
      const idsPlayer = await nft.getIdsNftByAddress.call(PLAYER_1, {
        from: OWNER,
      });

      expect(ipfsPlayer).to.equal(
        ADDR_IPFS_LEVEL_3,
        "Must be equal new_base_uri/30003.html"
      );
      expect(idsPlayer.length).to.equal(4, "Must be equal 4");
      expect(idsPlayer[0]).to.be.bignumber.equal(
        new BN(3),
        "Must be equal to 3"
      );
      expect(idsPlayer[1]).to.be.bignumber.equal(
        new BN(10003),
        "Must be equal to 10003"
      );
      expect(idsPlayer[2]).to.be.bignumber.equal(
        new BN(20003),
        "Must be equal to 20003"
      );
      expect(idsPlayer[3]).to.be.bignumber.equal(
        new BN(30003),
        "Must be equal to 30003"
      );

      const supply = await nft.getSupply.call({ from: OWNER });
      expect(supply).to.be.bignumber.equal(new BN(3), "Must be equal to 3");
    });
  });
});
