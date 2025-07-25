// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  const leaderNames = ["Jagan", "Rajesh", "Devaraj"]; // ✅ Your custom leaders

  const Voting = await hre.ethers.getContractFactory("VillageVoting");
  const voting = await Voting.deploy(leaderNames);

  await voting.waitForDeployment();

  console.log(`VillageVoting deployed to: ${voting.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
