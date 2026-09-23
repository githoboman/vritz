const { ethers } = require("ethers");
const fs = require("fs");

const wallet = ethers.Wallet.createRandom();

console.log("====================================");
console.log("New Deployer Wallet Generated:");
console.log("Address:", wallet.address);
console.log("Private Key:", wallet.privateKey);
console.log("====================================");

fs.writeFileSync(".env", `PRIVATE_KEY=${wallet.privateKey}\n`, { flag: 'a' });
console.log("Saved to .env");
