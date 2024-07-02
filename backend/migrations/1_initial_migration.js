const Migrations = artifacts.require("Migrations");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};

const SupplyChain = artifacts.require("SupplyChain");

module.exports = function (deployer, network, accounts) {
    // Deploy the SupplyChain contract and set the first account as the initial owner
    deployer.deploy(SupplyChain, accounts[0]);
};

