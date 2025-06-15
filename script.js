let provider, signer, contract;

const contractAddress = "0xb5ae1b76d28e48a6eed2dd9801da9803494b0ece";
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "player", "type": "address" },
      { "indexed": false, "internalType": "uint8", "name": "dice1", "type": "uint8" },
      { "indexed": false, "internalType": "uint8", "name": "dice2", "type": "uint8" },
      { "indexed": false, "internalType": "uint8", "name": "dice3", "type": "uint8" },
      { "indexed": false, "internalType": "bool", "name": "win", "type": "bool" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "BetPlaced",
    "type": "event"
  },
  {
    "inputs": [{ "internalType": "uint8", "name": "guess", "type": "uint8" }],
    "name": "rollDice",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
];

document.getElementById("connectBtn").addEventListener("click", async () => {
  if (window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    contract = new ethers.Contract(contractAddress, contractABI, signer);

    const balance = await provider.getBalance(userAddress);

    document.getElementById("walletAddress").textContent = `Wallet: ${userAddress}`;
    document.getElementById("balance").textContent = `Balance: ${ethers.formatEther(balance)} MON`;
  } else {
    alert("Please install MetaMask!");
  }
});

async function placeBet(guess) {
  if (!signer || !contract) {
    alert("Connect your wallet first.");
    return;
  }

  try {
    const tx = await contract.rollDice(guess, {
      value: ethers.parseEther("0.01")
    });
    document.getElementById("status").textContent = "Transaction sent. Waiting for confirmation...";
    await tx.wait();
    document.getElementById("status").textContent = "Bet placed!";
  } catch (error) {
    console.error(error);
    document.getElementById("status").textContent = "Transaction failed.";
  }
       }
