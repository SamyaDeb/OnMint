# OnMint - Web3 BNPL Protocol

![OnMint Logo](./docs/logo.png)

**Build Credit, Unlock Freedom** - Web3's First Trust-Based Payment Layer

## 🎯 Project Overview

OnMint is a decentralized Buy Now, Pay Later (BNPL) protocol that enables users to build credit scores in Web3 through responsible repayment behavior. Users start with 10 USDC credit at Trust Score 0 and grow their purchasing power by repaying on time.

### Key Features

- ✅ **Truly Under-Collateralized**: No collateral required, pure reputation-based lending
- ✅ **Instant Credit**: Start with 10 USDC credit limit immediately
- ✅ **Trust Score System**: Build credit through on-time/early repayments
- ✅ **Real USDC Payments**: Actual USDC transactions on Polygon Amoy testnet
- ✅ **Admin Controls**: Protocol liquidity management and merchant approval
- ✅ **Transparent**: All rules on-chain, fully auditable

### Technology Stack

**Smart Contracts:**
- Solidity 0.8.20
- Hardhat
- OpenZeppelin
- Polygon Amoy Testnet

**Frontend:**
- Next.js 14+ (App Router)
- TypeScript
- TailwindCSS
- wagmi + viem
- RainbowKit

## 📦 Project Structure

```
OnMint/
├── contracts/          # Solidity smart contracts
├── scripts/            # Deployment scripts
├── test/               # Contract tests
├── frontend/           # Next.js frontend application
├── docs/               # Documentation
├── IMPLEMENTATION_GUIDE.md
├── USER_WORKFLOW.md
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MetaMask or other Web3 wallet
- Polygon Amoy testnet MATIC (for gas)
- Polygon Amoy testnet USDC

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourteam/onmint.git
cd onmint
```

2. **Install smart contract dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd frontend
npm install
```

4. **Configure environment variables**

Root directory `.env`:
```bash
cp .env.example .env
# Edit .env with your private key and RPC URL
```

Frontend `.env.local`:
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with WalletConnect Project ID
```

### Development

**Compile smart contracts:**
```bash
npm run compile
```

**Run tests:**
```bash
npm run test
```

**Deploy to Amoy testnet:**
```bash
npm run deploy
```

**Start frontend development server:**
```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📋 Contract Addresses

### Polygon Amoy Testnet

- **Admin Address**: `0x74E36d4A7b33057e3928CE4bf4C8C53A93361C34`
- **Merchant Address**: `0xF92e0D914c6Bbd5a1B51eB2C023a2c3977b7f4C4`
- **USDC Token**: `0x8B0180f2101c8260d49339abfEe87927412494B4`
- **TrustScoreManager**: `TBD (after deployment)`
- **BNPLCore**: `TBD (after deployment)`

## 🎮 Demo Products

| Product | Price | Description |
|---------|-------|-------------|
| Web3 Starter Pack | 0.99 USDC | Entry-level Web3 tools bundle |
| NFT Collection Access | 1.99 USDC | Premium NFT marketplace membership |
| Premium DeFi Tools | 2.99 USDC | Advanced DeFi analytics suite |

## 📚 Documentation

- [Implementation Guide](./IMPLEMENTATION_GUIDE.md) - Complete build guide from scratch
- [User Workflow](./USER_WORKFLOW.md) - Detailed user and admin workflows
- [Architecture Documentation](./docs/ARCHITECTURE.md) - Technical deep-dive

## 🧪 Testing

Run the full test suite:
```bash
npm test
```

Check test coverage:
```bash
npm run coverage
```

## 🔐 Security

- Smart contracts use OpenZeppelin battle-tested libraries
- Access control with `onlyAdmin` modifiers
- USDC integration with proper approval checks
- One active loan per user restriction
- Credit limit enforcement on-chain

## 🗺️ Roadmap

### Phase 1 (Current - Hackathon)
- ✅ Basic BNPL with Trust Score
- ✅ Admin merchant approval
- ✅ Polygon Amoy deployment

### Phase 2 (Next 3 Months)
- On-chain identity integration (Gitcoin Passport)
- Credit Score NFT with dynamic metadata
- Multi-chain deployment
- Merchant self-service onboarding

### Phase 3 (6 Months)
- ZK-proof credit verification
- Advanced risk models
- Credit delegation
- Secondary debt market

### Phase 4 (12 Months)
- Mainnet launch
- Fiat on/off-ramps
- B2B merchant partnerships
- Cross-protocol integration

## 👥 Team

- **Developer**: [Your Name]
- **Role**: Full-stack Web3 Developer

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## 📞 Support

- GitHub Issues: [github.com/yourteam/onmint/issues](https://github.com/yourteam/onmint/issues)
- Discord: [Join our community](#)
- Twitter: [@OnMintProtocol](#)

## 🙏 Acknowledgments

- Polygon for Amoy testnet infrastructure
- Circle for USDC stablecoin
- OpenZeppelin for secure contract libraries
- RainbowKit for wallet connection UI

---

**Built with ❤️ for Web3 Hackathon 2026**

*OnMint - Building the FICO score of Web3*
