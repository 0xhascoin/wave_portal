import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import abi from '../utils/WavePortal.json';

export default function Home() {
  const getEthereumObject = () => window.ethereum;
  const [currentAccount, setCurrentAccount] = useState("");
  const [waveCount, setWaveCount] = useState(null);
  const [allWaves, setAllWaves] = useState([]);


  const contractAddress = "0xB10b4BdE5C1EF034817f1778277100A540aF89Cf";
  const contractABI = abi.abi;

  const findMetaMaskAccount = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        console.log("Make sure you have MetaMask.");
        return null;
      }

      console.log("We have the ethereum object: ", ethereum);
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.error("No authorized account found.");
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("Download MetaMask to use this dApp.")
        return;
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

    } catch (error) {
      console.error(error);
    }
  }



  const getAllWaves = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        // "Provider" is what we use to actually talk to Ethereum nodes.
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let allWaves = await wavePortalContract.getAllWaves();
        console.log("allWaves: ", allWaves);

        let wavesCleaned = [];
        allWaves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        setAllWaves(wavesCleaned);


        await getTotalWaveCount();

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        // "Provider" is what we use to actually talk to Ethereum nodes.
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave("Random message");
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        await getAllWaves();

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getTotalWaveCount = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        // "Provider" is what we use to actually talk to Ethereum nodes.
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        setWaveCount(count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    findMetaMaskAccount();
    getAllWaves();
  }, []);

  useEffect(() => {
    if (currentAccount !== "") console.log("ACCOUNT: ", currentAccount);
  }, [currentAccount]);

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          I am Hascoin? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {waveCount !== null && (
          <div className="header" style={{ marginTop: '20px' }}>
            {waveCount} Total Wave
          </div>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  )
}
