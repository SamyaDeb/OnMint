import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * Setup Script - Deposit Initial Liquidity
 * 
 * Run this script after deployment to deposit initial USDC liquidity.
 * The admin must have testnet USDC in their wallet.
 * 
 * Usage:
 *   npx hardhat run scripts/setup-liquidity.ts --network amoy
 */

async function main() {
  console.log("\n💰 OnMint - Deposit Initial Liquidity\n");
  console.log("═══════════════════════════════════════════════════════\n");

  // Load deployment info
  const deploymentsDir = path.join(__dirname, "../deployments");
  const latestPath = path.join(deploymentsDir, "latest.json");

  if (!fs.existsSync(latestPath)) {
    throw new Error("No deployment found. Run deploy.ts first.");
  }

  const deployment = JSON.parse(fs.readFileSync(latestPath, "utf-8"));
  console.log("📄 Loaded deployment from:", latestPath);
  console.log("   BNPLCore:", deployment.contracts.BNPLCore);
  console.log("   USDC:", deployment.contracts.USDC);

  // Get signer
  const [admin] = await ethers.getSigners();
  console.log("\n👤 Admin wallet:", admin.address);

  // Get contracts
  const usdc = await ethers.getContractAt("IERC20", deployment.contracts.USDC);
  const bnplCore = await ethers.getContractAt("BNPLCore", deployment.contracts.BNPLCore);

  // Check USDC balance
  const usdcBalance = await usdc.balanceOf(admin.address);
  console.log("💵 Admin USDC balance:", ethers.formatUnits(usdcBalance, 6), "USDC");

  if (usdcBalance === 0n) {
    console.log("\n⚠️  No USDC in wallet. Get testnet USDC from:");
    console.log("   - Circle Faucet: https://faucet.circle.com/");
    console.log("   - Use the Polygon Amoy network option");
    return;
  }

  // Deposit amount (use all available or specified amount)
  const depositAmount = usdcBalance; // Deposit all USDC
  console.log("\n📥 Depositing:", ethers.formatUnits(depositAmount, 6), "USDC");

  // Step 1: Approve USDC
  console.log("\n🔐 Step 1: Approving USDC...");
  const approveTx = await usdc.approve(deployment.contracts.BNPLCore, depositAmount);
  await approveTx.wait();
  console.log("   ✅ USDC approved for BNPLCore");

  // Step 2: Deposit liquidity
  console.log("\n💸 Step 2: Depositing liquidity...");
  const depositTx = await bnplCore.depositLiquidity(depositAmount);
  await depositTx.wait();
  console.log("   ✅ Liquidity deposited successfully");

  // Verify
  const protocolLiquidity = await bnplCore.getProtocolLiquidity();
  console.log("\n═══════════════════════════════════════════════════════");
  console.log("🎉 LIQUIDITY SETUP COMPLETE!");
  console.log("   Protocol Liquidity:", ethers.formatUnits(protocolLiquidity, 6), "USDC");
  console.log("═══════════════════════════════════════════════════════\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  });
