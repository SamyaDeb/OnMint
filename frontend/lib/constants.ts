/**
 * Frontend Configuration Constants
 * OnMint BNPL Protocol
 */

// Contract Addresses on Polygon Amoy
export const ADMIN_ADDRESS = "0x74E36d4A7b33057e3928CE4bf4C8C53A93361C34";
export const MERCHANT_ADDRESS = "0xF92e0D914c6Bbd5a1B51eB2C023a2c3977b7f4C4";
export const USDC_ADDRESS = "0x8B0180f2101c8260d49339abfEe87927412494B4";

// Deployed Contract Addresses (fill after deployment)
export const TRUST_SCORE_MANAGER_ADDRESS = process.env.NEXT_PUBLIC_TRUST_SCORE_MANAGER_ADDRESS || "";
export const BNPL_CORE_ADDRESS = process.env.NEXT_PUBLIC_BNPL_CORE_ADDRESS || "";

// Network Configuration
export const POLYGON_AMOY_CHAIN_ID = 80002;

// Product Configuration
export const PRODUCTS = [
  {
    id: 1,
    name: "Web3 Starter Pack",
    price: "0.99",
    priceUSDC: 990000, // 0.99 USDC with 6 decimals
    description: "Entry-level Web3 tools bundle for beginners",
    image: "/products/starter-pack.svg",
  },
  {
    id: 2,
    name: "NFT Collection Access",
    price: "1.99",
    priceUSDC: 1990000,
    description: "Premium NFT marketplace membership with exclusive access",
    image: "/products/nft-access.svg",
  },
  {
    id: 3,
    name: "Premium DeFi Tools",
    price: "2.99",
    priceUSDC: 2990000,
    description: "Advanced DeFi analytics suite with real-time data",
    image: "/products/defi-tools.svg",
  },
];

// Credit Score Configuration
export const BASE_CREDIT_LIMIT = 10; // 10 USDC
export const ON_TIME_POINTS = 10;
export const EARLY_POINTS = 15;
export const REPAYMENT_PERIOD_DAYS = 7;
export const EARLY_REPAYMENT_THRESHOLD_DAYS = 3; // Early = within first 4 days

// UI Configuration
export const APP_NAME = "OnMint";
export const APP_DESCRIPTION = "Build Credit, Unlock Freedom - Web3's First Trust-Based Payment Layer";
