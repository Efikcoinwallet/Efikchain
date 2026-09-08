// faucet.js
const express = require('express');
const Web3 = require('web3');
const app = express();
const web3 = new Web3('http://localhost:8547'); // testnet RPC

const PRIVATE_KEY = '0x...'; // private key of the funded address
const FROM = '0xa1F02e6CF46827497922Ea93F198B01894f7088e';
const AMOUNT = web3.utils.toWei('100', 'ether');

app.use(express.json());

app.post('/faucet', async (req, res) => {
  const { address } = req.body;
  if (!web3.utils.isAddress(address)) {
    return res.status(400).json({ error: 'Invalid address' });
  }
  try {
    const tx = {
      from: FROM,
      to: address,
      value: AMOUNT,
      gas: 21000,
      gasPrice: await web3.eth.getGasPrice(),
    };
    const signed = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
    res.json({ success: true, txHash: receipt.transactionHash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Faucet running on port 3000'));
