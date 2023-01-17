const main = async () => {
    // grabbed the wallet address of contract owner and I also grabbed a random wallet address and called it randomPerson
    const [owner, randomPerson] = await hre.ethers.getSigners();

    // compile our contract and generate the necessary files we need to work with our contract under the artifacts directory.
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");

    // Hardhat will create a local Ethereum network for us, but just for this contract. Then, after the script completes it'll destroy that local network.
    const waveContract = await waveContractFactory.deploy();

    // wait until our contract is officially deployed to our local blockchain!
    await waveContract.deployed();

    // waveContract.address  will basically give us the address of the deployed contract. This address is how we can actually find our contract on the blockchain
    console.log(`Contract deployed to: ${waveContract.address}`);

    // see the address of the person deploying our contract
    console.log("Contract deployed by:", owner.address);

    // call the function to grab the # of total waves
    await waveContract.getTotalWaves();

    // wave and wait for the transaction to finish
    const waveTxn = await waveContract.wave();
    await waveTxn.wait();

    // call the function to grab the # of total waves
    await waveContract.getTotalWaves();

    // random person wave and wait for the transaction to finish
    const secondWaveTxn = await waveContract.connect(randomPerson).wave();
    await secondWaveTxn.wait();

    // call the function to grab the # of total waves
    await waveContract.getTotalWaves();
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