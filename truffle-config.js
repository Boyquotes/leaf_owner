const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "5777",       // Any network (default: none)
    },

    ropsten: {
      provider: () => new HDWalletProvider(`${process.env.MNEMONIC}`, `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`, 1),
      network_id: 3,
      from:'0x22DE065B7911e79f3bC4d6EC17A57496a531af98'
    }
  },
  plugins: ["solidity-coverage"],
  mocha: {
    timeout: 100000
  },
  compilers: {
    solc: {
      version: "0.8.10",    // Fetch exact version from solc-bin (default: truffle's version)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
         enabled: false,
         runs: 5000
        },
      }
    }
  }
};
