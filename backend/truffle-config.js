const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

const mnemonic = process.env.MNEMONIC;
const alchemyApiKey = process.env.ALCHEMY_API_KEY;

module.exports = {
  networks: {
    holesky: {
      provider: () => new HDWalletProvider(
        mnemonic,
        `https://eth-holesky.g.alchemy.com/v2/${alchemyApiKey}`
      ),
      network_id: 17000, // Holesky's network id
      gas: 4500000, // Adjust as necessary
      gasPrice: 10000000000, // Adjust as necessary
      timeoutBlocks: 200, // Increase the number of blocks to wait for a deployment to be mined
      networkCheckTimeout: 10000000, // Increase the network check timeout
      confirmations: 2, // Number of confirmations to wait between deployments
      skipDryRun: true // Skip dry run before migrations
    },
  },
  compilers: {
    solc: {
      version: "0.8.20", // Fetch exact version from solc-bin
    },
  },
};
