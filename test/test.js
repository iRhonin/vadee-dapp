const { expect } = require("chai");
const hardhat = require("hardhat");
const { Voucher } = require("../app/src/voucher");
const { ethers } = hardhat;


async function deploy() {
  const [artist, redeemer, _] = await ethers.getSigners()
  
  const fee = ethers.utils.parseUnits(
    '0.025',
    'ether'
  );

  const marketFactory = await ethers.getContractFactory("MarketPlace")
  const marketContract = await marketFactory.deploy()
  await marketContract.deployed()
  const marketAddress = marketContract.address

  let storeFactory = await ethers.getContractFactory("LazyFactory",artist)
  const storeContract = await storeFactory.deploy(marketAddress, 'VADEE', 'myStore', artist.address)
  await storeContract.deployed()
  const factoryAddress = storeContract.address

  // the redeemerContract is an instance of the contract that's wired up to the redeemer's signing key
  const redeemerFactory = storeFactory.connect(redeemer)
  const redeemerContract = redeemerFactory.attach(factoryAddress)

  return {
    artist,
    redeemer,
    storeContract,
    redeemerContract,
    marketContract,
    fee
  }
}

describe("MarketPlace", function () {
  it("Should deploy MarketPlace", async function () {
    const marketFactory = await ethers.getContractFactory("MarketPlace")
    const marketContract = await marketFactory.deploy()
    await marketContract.deployed()
    const marketPlaceAddress = marketContract.address
    expect(marketPlaceAddress).not.to.equal(0)
  })


  it("Should artist deploy their gallery and sign a voucher", async function () {
    const { artist, storeContract } = await deploy()
    const price = ethers.utils.parseUnits(
      '0.054',
      'ether'
    );

    const theVoucher = new Voucher({ contract: storeContract, signer: artist });
    const voucher = await theVoucher.signTransaction(1, 'title', price, 'Ehsan', 'tokenUri')
    expect(voucher.signature).not.to.equal(0)
  })
  


  it("Should redeem and mint an NFT from a signed voucher", async function () {
    const { artist, redeemer, storeContract, redeemerContract, fee } = await deploy()
    const price = ethers.utils.parseUnits(
      '0.054',
      'ether'
    );

    const theVoucher = new Voucher({ contract: storeContract, signer: artist });
    const voucher = await theVoucher.signTransaction(1, 'title', price, 'Ehsan', 'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi')
    console.log(artist.address)
    console.log(redeemer.address)
    console.log(voucher)

    await expect(redeemerContract.redeem(redeemer.address, voucher, fee, {value: price}))
      .to.emit(storeContract, 'Transfer')  // transfer from null address to artist
      .withArgs('0x0000000000000000000000000000000000000000', artist.address, voucher.artworkId)
      .and.to.emit(storeContract, 'Transfer') // transfer from artist to redeemer
      .withArgs(artist.address, redeemer.address, voucher.artworkId);
  });

});
