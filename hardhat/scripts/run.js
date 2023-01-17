const main = async () => {
    // compile our contract and generate the necessary files we need to work with our contract under the artifacts directory.
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    // Hardhat will create a local Ethereum network for us, but just for this contract. Then, after the script completes it'll destroy that local network.
    const waveContract = await waveContractFactory.deploy();
    // wait until our contract is officially deployed to our local blockchain!
    await waveContract.deployed();
    // waveContract.address  will basically give us the address of the deployed contract. This address is how we can actually find our contract on the blockchain
    console.log(`Contract deployed to: ${waveContract.address}`);
    
    let waveCount;
    waveCount = await waveContract.getTotalWaves();
    console.log(waveCount.toNumber());

    let waveTxn = await waveContract.wave("A message!");
    await waveTxn.wait(); // Wait for the transaction to be mined

    const [_, randomPerson] = await hre.ethers.getSigners();
    waveTxn = await waveContract.connect(randomPerson).wave("Another message!");
    await waveTxn.wait(); // Wait for the transaction to be mined

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(`Error: ${error}`);
        process.exit(1);
    }
};

runMain();