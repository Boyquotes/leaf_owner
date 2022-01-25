const { BN, expectRevert } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

const ContractLeafToken = artifacts.require("LeafToken");

contract("LeafToken", function (accounts) {
  const OWNER = accounts[0];
  const ADDRESS_1 = accounts[1];
  const TOTAL_SUPPLY = new BN(15000000000);
  const BURN_AMOUNT = new BN(5000000000);
  const BURN_REST = new BN(10000000000);
  const BN_0 = new BN(0);

  context("Testing the contract LeafToken", function () {
    before(async function () {
      leaf = await ContractLeafToken.new({ from: OWNER });
    });

    it("... test the function mint", async () => {
      await expectRevert(
        leaf.mint(BN_0, { from: OWNER }),
        "LeafToken: must be greater than 0"
      );

      await leaf.mint(TOTAL_SUPPLY, { from: OWNER });

      await expectRevert(
        leaf.mint(TOTAL_SUPPLY, { from: OWNER }),
        "LeafToken: you can mint once"
      );
      await expectRevert(
        leaf.mint(TOTAL_SUPPLY, { from: ADDRESS_1 }),
        "Ownable: caller is not the owner"
      );
    });

    it("... test the function burn", async () => {
      await leaf.burn(BURN_AMOUNT, { from: OWNER });
      const ownerBalance = await leaf.balanceOf.call(OWNER, { from: OWNER });

      expect(ownerBalance).to.be.bignumber.equal(
        BURN_REST,
        "Must be equal to ownerBalance"
      );
      await expectRevert(
        leaf.burn(BURN_AMOUNT, { from: ADDRESS_1 }),
        "Ownable: caller is not the owner"
      );
      await expectRevert(
        leaf.burn(new BN(16000000000), { from: OWNER }),
        "LeafToken: cant burn"
      );
    });
  });
});
