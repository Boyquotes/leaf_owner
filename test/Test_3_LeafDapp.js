const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

const ContractLeafToken = artifacts.require("LeafToken");
const ContractLeafNft = artifacts.require("LeafNft");
const ContractLeafDapp = artifacts.require("LeafDapp");

contract("LeafDapp", function (accounts) {
  const OWNER = accounts[0];
  const PLAYER_1 = accounts[1];
  const NOT_PLAYER = accounts[2];

  const NAME = "name";
  const SYMBOL = "symbol";
  const BASE_URI = "base_uri/";

  const MAX_SUPPLY_LEAF = new BN("150000000000000000000000000"); // 150.000.000 * (10 ** 18)
  const OWNER_LEAFS = new BN("1000000000000000000000000"); // 1.000.000 * (10 ** 18);
  const MAX_SUPPLY_NFT = new BN(10000);
  const COST = new BN("10000000000000000"); // 0.01 ETH

  context("Testing the contract LeafDapp", function () {
    before(async function () {
      leaf = await ContractLeafToken.new({ from: OWNER });
      nft = await ContractLeafNft.new(NAME, SYMBOL, BASE_URI, { from: OWNER });

      leafAddress = leaf.address;
      nftAddress = nft.address;

      dapp = await ContractLeafDapp.new(leafAddress, nftAddress, {
        from: OWNER,
      });

      await leaf.transferOwnership(dapp.address, { from: OWNER });
      await nft.transferOwnership(dapp.address, { from: OWNER });

      await dapp.mintLeaf({ from: OWNER });
    });

    it("... test the constructor and the functions getLeaf and getNft", async () => {
      await expectRevert(
        dapp.getLeaf({ from: PLAYER_1 }),
        "Ownable: caller is not the owner"
      );
      await expectRevert(
        dapp.getNft({ from: NOT_PLAYER }),
        "Ownable: caller is not the owner"
      );

      const dappLeafAddress = await dapp.getLeaf.call({ from: OWNER });
      const dappNftAddress = await dapp.getNft.call({ from: OWNER });

      expect(dappLeafAddress).to.equal(leafAddress);
      expect(dappNftAddress).to.equal(nftAddress);
    });

    it("... test the functions mintLeaf, balance and balanceDappLeaf", async () => {
      await expectRevert(
        dapp.balance({ from: NOT_PLAYER }),
        "LeafDapp : caller is not a owner or player"
      );
      await expectRevert(
        dapp.balanceDappLeaf({ from: NOT_PLAYER }),
        "LeafDapp : caller is not a owner or player"
      );

      const balanceOwner = await dapp.balance.call({ from: OWNER });
      const balanceDappLeaf = await dapp.balanceDappLeaf.call({ from: OWNER });

      expect(balanceOwner).to.be.bignumber.equal(OWNER_LEAFS);
      expect(balanceDappLeaf).to.be.bignumber.equal(
        MAX_SUPPLY_LEAF.sub(OWNER_LEAFS)
      );
    });

    it("... test the functions whitelistPlayer, removeWhitelistPlayer and getWhitelistPlayer", async () => {
      await expectRevert(
        dapp.whitelistPlayer(NOT_PLAYER, { from: NOT_PLAYER }),
        "Ownable: caller is not the owner"
      );
      await expectRevert(
        dapp.removeWhitelistPlayer(NOT_PLAYER, { from: NOT_PLAYER }),
        "Ownable: caller is not the owner"
      );
      await expectRevert(
        dapp.getWhitelistPlayer(NOT_PLAYER, { from: NOT_PLAYER }),
        "Ownable: caller is not the owner"
      );

      let notPlayer = await dapp.getWhitelistPlayer(NOT_PLAYER, {
        from: OWNER,
      });
      expect(notPlayer).to.equal(false);

      await dapp.whitelistPlayer(NOT_PLAYER, { from: OWNER });
      let player = await dapp.getWhitelistPlayer(NOT_PLAYER, { from: OWNER });
      expect(player).to.equal(true);

      await dapp.removeWhitelistPlayer(NOT_PLAYER, { from: OWNER });
      notPlayer = await dapp.getWhitelistPlayer(NOT_PLAYER, { from: OWNER });
      expect(notPlayer).to.equal(false);
    });

    it("... test the functions setCost and getCost", async () => {
      const newCost = new BN("20000000000000000"); // 0.02 ETH

      await expectRevert(
        dapp.setCost(newCost, { from: PLAYER_1 }),
        "Ownable: caller is not the owner"
      );
      await expectRevert(
        dapp.getCost({ from: PLAYER_1 }),
        "Ownable: caller is not the owner"
      );

      let cost = await dapp.getCost({ from: OWNER });
      expect(cost).to.be.bignumber.equal(COST);

      await dapp.setCost(newCost, { from: OWNER });
      const newCostDapp = await dapp.getCost({ from: OWNER });
      expect(newCostDapp).to.be.bignumber.equal(newCost);

      await dapp.setCost(COST, { from: OWNER });
      cost = await dapp.getCost({ from: OWNER });
      expect(cost).to.be.bignumber.equal(COST);
    });

    it("... test the functions setTest and getTest", async () => {
      await expectRevert(
        dapp.setTest(false, { from: PLAYER_1 }),
        "Ownable: caller is not the owner"
      );
      await expectRevert(
        dapp.getTest({ from: PLAYER_1 }),
        "Ownable: caller is not the owner"
      );

      let test = await dapp.getTest({ from: OWNER });
      expect(test).to.equal(true);

      await dapp.setTest(false, { from: OWNER });
      let newTest = await dapp.getTest({ from: OWNER });
      expect(newTest).to.equal(false);

      await dapp.setTest(true, { from: OWNER });
      test = await dapp.getTest({ from: OWNER });
      expect(test).to.equal(true);
    });

    it("... test the functions setPause and getPause", async () => {
      await expectRevert(
        dapp.setPause(true, { from: PLAYER_1 }),
        "Ownable: caller is not the owner"
      );
      await expectRevert(
        dapp.getPause({ from: PLAYER_1 }),
        "Ownable: caller is not the owner"
      );

      let paused = await dapp.getPause({ from: OWNER });
      expect(paused).to.equal(false);

      await dapp.setPause(true, { from: OWNER });
      let newPaused = await dapp.getPause({ from: OWNER });
      expect(newPaused).to.equal(true);

      await dapp.setPause(false, { from: OWNER });
      paused = await dapp.getPause({ from: OWNER });
      expect(paused).to.equal(false);
    });

    it("... test the functions buyNft, getPlayer and getPlayerWithAddress", async () => {
      const notCoast = new BN("20000000000000000"); // 0.02 ETH

      await expectRevert(
        dapp.buyNft({ from: PLAYER_1, value: notCoast }),
        "LeafDApp : must be aqual to 0.01 ETH"
      );

      await dapp.setPause(true, { from: OWNER });
      await expectRevert(
        dapp.buyNft({ from: PLAYER_1, value: COST }),
        "LeafDapp : is paused"
      );
      await dapp.setPause(false, { from: OWNER });

      const buyNftTransaction = await dapp.buyNft({
        from: PLAYER_1,
        value: COST,
      });
      const getWhitelistPlayer = await dapp.getWhitelistPlayer.call(PLAYER_1, {
        from: OWNER,
      });
      const getPlayer = await dapp.getPlayer.call({ from: PLAYER_1 });
      const getPlayerWithAddress = await dapp.getPlayerWithAddress.call(
        PLAYER_1,
        { from: OWNER }
      );

      expect(getWhitelistPlayer).to.equal(true);
      expect(getPlayer.uriIpfs.length).to.equal(1);
      expect(getPlayer.uriIpfs[0]).to.equal(BASE_URI + "2.json");
      expect(getPlayerWithAddress.uriIpfs.length).to.equal(1);
      expect(getPlayerWithAddress.uriIpfs[0]).to.equal(BASE_URI + "2.json");

      await expectRevert(
        dapp.buyNft({ from: PLAYER_1, value: COST }),
        "LeafDapp : this address already has an nft"
      );

      expectEvent(buyNftTransaction, "NftBuyed", {
        player: PLAYER_1,
        uriIpfs: getPlayer.uriIpfs[0],
      });
    });

    it("... test the function stepToLeaf LEVEL_1", async () => {
      const NB_STEP = new BN(10000);

      await expectRevert(
        dapp.stepToLeaf(NB_STEP, { from: NOT_PLAYER }),
        "LeafDapp : caller is not a player"
      );

      await dapp.setPause(true, { from: OWNER });
      await expectRevert(
        dapp.stepToLeaf(NB_STEP, { from: PLAYER_1 }),
        "LeafDapp : is paused"
      );
      await dapp.setPause(false, { from: OWNER });

      const stepToLeafTransaction = await dapp.stepToLeaf(NB_STEP, {
        from: PLAYER_1,
      });
      const player1 = await dapp.getPlayer.call({ from: PLAYER_1 });

      expect(player1.nbDaySuccess).to.be.bignumber.equal(new BN(1));
      expect(player1.oldNbStep).to.be.bignumber.equal(NB_STEP);
      expect(player1.totalNbStep).to.be.bignumber.equal(NB_STEP);
      expect(player1.level).to.be.bignumber.equal(new BN(1));
      expect(player1.uriIpfs.length).to.equal(2);
      expect(player1.uriIpfs[0]).to.equal(BASE_URI + "2.json");
      expect(player1.uriIpfs[1]).to.equal(BASE_URI + "10002.json");

      await expectRevert(
        dapp.stepToLeaf(NB_STEP, { from: PLAYER_1 }),
        "LeafDApp : a day has not passed yet"
      );

      expectEvent(stepToLeafTransaction, "NftTransfer", {
        player: PLAYER_1,
        uriIpfs: BASE_URI + "10002.json",
      });
    });

    it("... test the function stepToLeafWithoutTimestamp LEVEL_2", async () => {
      const NB_STEP = new BN(10000);

      const stepToLeafTransaction = await dapp.stepToLeafWithoutTimestamp(
        NB_STEP,
        { from: PLAYER_1 }
      );
      const player1 = await dapp.getPlayer.call({ from: PLAYER_1 });

      expect(player1.nbDaySuccess).to.be.bignumber.equal(new BN(2));
      expect(player1.oldNbStep).to.be.bignumber.equal(NB_STEP);
      expect(player1.totalNbStep).to.be.bignumber.equal(new BN(20000));
      expect(player1.level).to.be.bignumber.equal(new BN(2));
      expect(player1.uriIpfs.length).to.equal(3);
      expect(player1.uriIpfs[0]).to.equal(BASE_URI + "2.json");
      expect(player1.uriIpfs[1]).to.equal(BASE_URI + "10002.json");
      expect(player1.uriIpfs[2]).to.equal(BASE_URI + "20002.json");

      expectEvent(stepToLeafTransaction, "NftTransfer", {
        player: PLAYER_1,
        uriIpfs: BASE_URI + "20002.json",
      });
    });

    it("... test the function stepToLeafWithoutTimestamp LEVEL_3", async () => {
      const NB_STEP = new BN(10000);

      const stepToLeafTransaction = await dapp.stepToLeafWithoutTimestamp(
        NB_STEP,
        { from: PLAYER_1 }
      );
      const player1 = await dapp.getPlayer.call({ from: PLAYER_1 });

      expect(player1.nbDaySuccess).to.be.bignumber.equal(new BN(3));
      expect(player1.oldNbStep).to.be.bignumber.equal(NB_STEP);
      expect(player1.totalNbStep).to.be.bignumber.equal(new BN(30000));
      expect(player1.level).to.be.bignumber.equal(new BN(3));
      expect(player1.uriIpfs.length).to.equal(4);
      expect(player1.uriIpfs[0]).to.equal(BASE_URI + "2.json");
      expect(player1.uriIpfs[1]).to.equal(BASE_URI + "10002.json");
      expect(player1.uriIpfs[2]).to.equal(BASE_URI + "20002.json");
      expect(player1.uriIpfs[3]).to.equal(BASE_URI + "30002.json");

      expectEvent(stepToLeafTransaction, "NftTransfer", {
        player: PLAYER_1,
        uriIpfs: BASE_URI + "30002.json",
      });
    });

    it("... test the function stepToLeafWithoutTimestamp LEVEL_4 WIN LEAFs", async () => {
      const NB_STEP = new BN(10000);
      const LEAF_10 = new BN("10000000000000000000");

      const stepToLeafTransaction = await dapp.stepToLeafWithoutTimestamp(
        NB_STEP,
        { from: PLAYER_1 }
      );
      const player1 = await dapp.getPlayer.call({ from: PLAYER_1 });

      expect(player1.nbDaySuccess).to.be.bignumber.equal(new BN(4));
      expect(player1.oldNbStep).to.be.bignumber.equal(NB_STEP);
      expect(player1.totalNbStep).to.be.bignumber.equal(new BN(40000));
      expect(player1.level).to.be.bignumber.equal(new BN(3));
      expect(player1.uriIpfs.length).to.equal(4);
      expect(player1.uriIpfs[0]).to.equal(BASE_URI + "2.json");
      expect(player1.uriIpfs[1]).to.equal(BASE_URI + "10002.json");
      expect(player1.uriIpfs[2]).to.equal(BASE_URI + "20002.json");
      expect(player1.uriIpfs[3]).to.equal(BASE_URI + "30002.json");

      expectEvent(stepToLeafTransaction, "LeafTransfer", {
        player: PLAYER_1,
        amountLeaf: LEAF_10,
      });

      const balance = await dapp.balance.call({ from: PLAYER_1 });
      expect(balance).to.be.bignumber.equal(LEAF_10);
    });

    it("... test the function balanceNft", async () => {
      await expectRevert(
        dapp.balanceNft({ from: NOT_PLAYER }),
        "LeafDapp : caller is not a owner or player"
      );

      const balanceNft = await dapp.balanceNft.call({ from: PLAYER_1 });
      expect(balanceNft).to.be.bignumber.equal(new BN(2));
    });

    it("... test the function balancePlayer", async () => {
      const LEAF_10 = new BN("10000000000000000000");

      await expectRevert(
        dapp.balancePlayer(PLAYER_1, { from: NOT_PLAYER }),
        "Ownable: caller is not the owner"
      );

      const balancePlayer = await dapp.balancePlayer(PLAYER_1, { from: OWNER });
      expect(balancePlayer).to.be.bignumber.equal(LEAF_10);
    });

    it("... test the functions withdraw and balanceDappEth", async () => {
      const ETH_0_005 = new BN("5000000000000000"); // 0.005 EYH

      await expectRevert(
        dapp.withdraw(ETH_0_005, { from: NOT_PLAYER }),
        "Ownable: caller is not the owner"
      );
      await expectRevert(
        dapp.withdraw(new BN(0), { from: OWNER }),
        "LeafDapp : must be greater than 0"
      );
      await expectRevert(
        dapp.balanceDappEth({ from: NOT_PLAYER }),
        "Ownable: caller is not the owner"
      );

      let balance = await dapp.balanceDappEth.call({ from: OWNER });
      expect(balance).to.be.bignumber.equal(COST);

      await dapp.withdraw(ETH_0_005, { from: OWNER });
      balance = await dapp.balanceDappEth.call({ from: OWNER });
      expect(balance).to.be.bignumber.equal(ETH_0_005);
    });
  });
});
