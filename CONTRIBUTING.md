# Contributing to OnMint BNPL

First off, thank you for considering contributing to OnMint! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)

---

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inspiring community for all. Please be respectful and constructive.

### Our Standards

✅ **Positive behavior:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

❌ **Unacceptable behavior:**
- Trolling, insulting/derogatory comments
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected vs actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, Node version, etc.)

**Bug Report Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. macOS 13]
- Node Version: [e.g. 18.17.0]
- Browser: [e.g. Chrome 120]
```

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear title**
- **Provide detailed description** of the suggested enhancement
- **Explain why this would be useful** to most users
- **List any similar features** in other projects

### 🔧 Code Contributions

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Make your changes**
4. **Write/update tests**
5. **Ensure tests pass** (`npm test`)
6. **Commit your changes** (see commit guidelines below)
7. **Push to your fork** (`git push origin feature/AmazingFeature`)
8. **Open a Pull Request**

---

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- MetaMask (for testing)

### Setup Steps

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/OnMint.git
cd OnMint

# 2. Install dependencies
npm install
cd frontend && npm install && cd ..

# 3. Setup environment
cp .env.example .env
cp frontend/.env.example frontend/.env.local
# Fill in your values

# 4. Compile contracts
npx hardhat compile

# 5. Run tests
npx hardhat test

# 6. Start frontend
cd frontend && npm run dev
```

### Running Tests

```bash
# All tests
npm test

# Specific test file
npx hardhat test test/BNPL.test.ts

# With coverage
npx hardhat coverage

# With gas report
REPORT_GAS=true npx hardhat test
```

---

## Pull Request Process

### Before Submitting

- ✅ Ensure all tests pass
- ✅ Update documentation if needed
- ✅ Follow coding standards
- ✅ Write clear commit messages
- ✅ Rebase on latest main branch

### PR Title Format

```
<type>(<scope>): <subject>

Examples:
feat(contracts): Add wallet age scoring
fix(frontend): Fix repayment button disabled state
docs(api): Update API documentation
test(bnpl): Add edge case tests
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Existing tests pass
- [ ] New tests added
- [ ] Tested on Amoy testnet

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex logic
- [ ] Updated documentation
- [ ] No new warnings
```

### Review Process

1. **Automated checks** run (tests, linting)
2. **Code review** by maintainer(s)
3. **Discussion/changes** if needed
4. **Approval and merge**

---

## Coding Standards

### Solidity Contracts

```solidity
// ✅ Good
contract BNPLCore {
    // Use NatSpec comments
    /// @notice Creates a new BNPL loan
    /// @param merchant Approved merchant address
    /// @param amount Loan amount in USDC
    /// @return loanId The ID of the created loan
    function createLoan(address merchant, uint256 amount) 
        external 
        returns (uint256) 
    {
        // Clear variable names
        // Descriptive comments for complex logic
        // Emit events
    }
}

// ❌ Bad
contract bnpl {
    function c(address m,uint a) external returns(uint) {
        // No comments, unclear names
    }
}
```

**Solidity Guidelines:**
- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use NatSpec comments for public functions
- Emit events for state changes
- Use descriptive variable names
- Add require/revert messages

### TypeScript/React

```typescript
// ✅ Good
interface LoanData {
  id: number
  amount: bigint
  remainingAmount: bigint
}

export function RepayPage() {
  const { address } = useAccount()
  
  // Descriptive hook names
  const { data: loanData, isLoading } = useReadContract({
    address: BNPL_CORE_ADDRESS,
    abi: BNPLCoreABI,
    functionName: 'getLoan',
    args: [address]
  })
  
  // Clear error handling
  if (isLoading) return <LoadingSpinner />
  if (!loanData) return <NoLoanMessage />
  
  return <RepayForm loan={loanData} />
}

// ❌ Bad
export function Page() {
  const a = useAccount()
  const d = useReadContract(/* ... */)
  return <div>{d}</div> // No error handling
}
```

**TypeScript Guidelines:**
- Use TypeScript strictly (no `any`)
- Define interfaces for data structures
- Use React hooks properly
- Handle loading/error states
- Use meaningful variable names

### File Organization

```
contracts/
  ├── BNPLCore.sol           # Main contracts
  ├── TrustScoreManager.sol
  └── mocks/                 # Test utilities
      └── MockUSDC.sol

frontend/
  ├── app/                   # Next.js pages
  ├── components/            # React components
  ├── hooks/                 # Custom hooks
  └── lib/                   # Utilities

test/
  └── BNPL.test.ts          # Test files

scripts/
  ├── deploy.ts             # Deployment scripts
  └── verify.ts
```

---

## Commit Message Guidelines

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Build process, dependencies

### Examples

```bash
# Good commits
feat(contracts): Add wallet history scoring
fix(frontend): Resolve USDC approval issue
docs(api): Add ZK-proof documentation
test(bnpl): Add default scenario tests

# Bad commits
❌ "fixed stuff"
❌ "update"
❌ "changes"
```

### Commit Body (Optional)

For complex changes, add details:

```
feat(contracts): Add installment payment support

- Allow users to make partial payments
- Track payment progress
- Update trust score on full repayment
- Add events for payment milestones

Closes #42
```

---

## Testing Requirements

### Smart Contracts

- ✅ Write tests for all new functions
- ✅ Test happy paths and edge cases
- ✅ Test access control
- ✅ Test events emission
- ✅ Aim for >90% coverage

```typescript
describe("createLoan", () => {
  it("should create loan with valid params", async () => {
    // Test happy path
  })
  
  it("should revert if user has active loan", async () => {
    // Test edge case
  })
  
  it("should emit LoanCreated event", async () => {
    // Test events
  })
})
```

### Frontend

- ✅ Test critical user flows
- ✅ Test error handling
- ✅ Test loading states
- ✅ Manual testing on testnet

---

## Documentation Requirements

When adding features, update:

- ✅ **README.md** - If setup changes
- ✅ **API.md** - If contract API changes
- ✅ **TESTING.md** - If new tests added
- ✅ **Code comments** - For complex logic

---

## Getting Help

- **GitHub Discussions:** Ask questions
- **GitHub Issues:** Report bugs, suggest features
- **Discord:** Join Polygon community
- **Documentation:** Check `docs/` folder

---

## Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

Thank you for contributing! 🙏
