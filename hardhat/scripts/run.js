const main = async () => {
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.001")
    });
    await waveContract.deployed();
    console.log(`Contract deployed to: ${waveContract.address}`);

    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log(`Contract balance: ${hre.ethers.utils.formatEther(contractBalance)} ETH`)

    /*
    * Let's try two waves now
    */
    const waveTxn = await waveContract.wave("This is wave #1");
    await waveTxn.wait();


    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log(
        "Contract balance:",
        hre.ethers.utils.formatEther(contractBalance)
    );

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