const hre = require("hardhat");

async function main() {
  const WritToken = await hre.ethers.getContractFactory("WritToken");
  const token = await WritToken.deploy();

  await token.waitForDeployment();

  console.log(`WritToken deployed to: ${await token.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
