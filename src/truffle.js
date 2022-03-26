module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*', // Match any network id
      websockets: true,
    },
    rinkeby: {
      host: '127.0.0.1',
      port: 8545,
      network_id: 4,
      gas: 4700000,
    },
  },
  compilers: {
    solc: {
      version: '0.8.13',
    },
  },
};
