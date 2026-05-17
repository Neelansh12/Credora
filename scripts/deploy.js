const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying CredoraCertificate to Polygon Amoy...");

  // Get the deployer wallet
  const [deployer] = await hre.ethers.getSigners();
  console.log("📋 Deploying from wallet:", deployer.address);

  // Check balance before deploying
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Wallet balance:", hre.ethers.formatEther(balance), "POL");

  // Deploy the contract
  const CredoraCertificate = await hre.ethers.getContractFactory("CredoraCertificate");
  const contract = await CredoraCertificate.deploy();

  // Wait for deployment to be mined
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();

  console.log("✅ CredoraCertificate deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🔗 View on Polygonscan:", `https://amoy.polygonscan.com/address/${contractAddress}`);
  console.log("");
  console.log("=========================================");
  console.log("⚠️  SAVE THIS — add to your .env files:");
  console.log(`CONTRACT_ADDRESS=${contractAddress}`);
  console.log("=========================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error.message);
    process.exit(1);
  });