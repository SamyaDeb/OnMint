# 📜 OnMint BNPL - Smart Contract API Documentation

## Contract Addresses (Polygon Amoy)

```solidity
TrustScoreManager: 0x3ef1456a5AbA04eFd979be0a49232211C88Df014
BNPLCore: 0x0B8e9E0278Fe46647E9C4876586Ece93e8Ec1F65
USDC (Testnet): 0x8B0180f2101c8260d49339abfEe87927412494B4
```

---

## TrustScoreManager Contract

### Overview
Manages user credit scores and calculates dynamic credit limits based on repayment behavior.

### State Variables

```solidity
mapping(address => uint256) public trustScores;
address public bnplCore;
address public owner;
```

### Functions

#### `getTrustScore(address user) public view returns (uint256)`
**Description:** Get the current trust score for a user.

**Parameters:**
- `user` (address): User's wallet address

**Returns:**
- `uint256`: Trust score (0-100+)

**Example:**
```javascript
const score = await trustScoreManager.getTrustScore(userAddress)
console.log("Trust Score:", score.toString())
```

---

#### `getCreditLimit(address user) public view returns (uint256)`
**Description:** Calculate credit limit based on trust score.

**Formula:** `10 USDC + (trustScore / 10) * 5 USDC`

**Parameters:**
- `user` (address): User's wallet address

**Returns:**
- `uint256`: Credit limit in USDC (with 6 decimals)

**Example:**
```javascript
const limit = await trustScoreManager.getCreditLimit(userAddress)
console.log("Credit Limit:", ethers.formatUnits(limit, 6), "USDC")
```

---

#### `recordOnTimeRepayment(address user) external onlyBNPLCore`
**Description:** Increase trust score by 10 points for on-time repayment.

**Access:** Only callable by BNPLCore contract

**Parameters:**
- `user` (address): User who repaid

**Events:**
- `ScoreUpdated(address indexed user, uint256 newScore, string reason)`

---

#### `recordEarlyRepayment(address user) external onlyBNPLCore`
**Description:** Increase trust score by 15 points for early repayment (within 4 days).

**Access:** Only callable by BNPLCore contract

**Parameters:**
- `user` (address): User who repaid early

**Events:**
- `ScoreUpdated(address indexed user, uint256 newScore, string reason)`

---

#### `setBNPLCore(address _bnplCore) external onlyOwner`
**Description:** Set the BNPLCore contract address (admin only).

**Access:** Only owner

**Parameters:**
- `_bnplCore` (address): Address of BNPLCore contract

---

## BNPLCore Contract

### Overview
Core lending protocol contract that manages loans, payments, and protocol liquidity.

### Constants

```solidity
uint256 public constant REPAYMENT_PERIOD_DAYS = 7;
uint256 public constant EARLY_REPAYMENT_THRESHOLD_DAYS = 4;
```

### State Variables

```solidity
IERC20 public usdc;
TrustScoreManager public trustScoreManager;
mapping(address => Loan) public loans;
mapping(address => bool) public merchants;
uint256 public protocolLiquidity;
uint256 public nextLoanId;
```

### Structures

#### Loan
```solidity
struct Loan {
    uint256 id;
    address borrower;
    address merchant;
    uint256 amount;
    uint256 amountPaid;
    uint256 remainingAmount;
    uint256 createdAt;
    uint256 dueDate;
    bool isActive;
}
```

### Functions

#### `createLoan(address merchant, uint256 amount) external returns (uint256)`
**Description:** Create a new BNPL loan if user has sufficient credit.

**Parameters:**
- `merchant` (address): Approved merchant address
- `amount` (uint256): Loan amount in USDC (6 decimals)

**Returns:**
- `uint256`: Loan ID

**Requirements:**
- No active loan
- Merchant must be approved
- Amount ≤ credit limit
- Sufficient protocol liquidity

**Events:**
- `LoanCreated(uint256 indexed loanId, address indexed borrower, address indexed merchant, uint256 amount, uint256 dueDate)`

**Example:**
```javascript
const tx = await bnplCore.createLoan(merchantAddress, ethers.parseUnits("0.99", 6))
await tx.wait()
```

---

#### `makePayment(uint256 amount) external`
**Description:** Make a payment towards active loan (full or partial).

**Parameters:**
- `amount` (uint256): Payment amount in USDC (6 decimals)

**Requirements:**
- Must have active loan
- Amount > 0
- Amount ≤ remaining balance
- User must approve USDC first

**Events:**
- `PaymentMade(uint256 indexed loanId, address indexed borrower, uint256 amount, uint256 remainingAmount)`
- `LoanFullyRepaid(uint256 indexed loanId, address indexed borrower)` (if fully paid)

**Example:**
```javascript
// Step 1: Approve USDC
await usdc.approve(bnplCoreAddress, ethers.parseUnits("0.99", 6))

// Step 2: Make payment
await bnplCore.makePayment(ethers.parseUnits("0.99", 6))
```

---

#### `getLoan(address borrower) public view returns (Loan memory)`
**Description:** Get loan details for a user.

**Parameters:**
- `borrower` (address): User's wallet address

**Returns:**
- `Loan`: Struct containing loan information

**Example:**
```javascript
const loan = await bnplCore.getLoan(userAddress)
console.log("Loan Amount:", ethers.formatUnits(loan.amount, 6))
console.log("Remaining:", ethers.formatUnits(loan.remainingAmount, 6))
```

---

#### `getProtocolLiquidity() public view returns (uint256)`
**Description:** Get current protocol liquidity available for loans.

**Returns:**
- `uint256`: Available USDC in protocol pool (6 decimals)

**Example:**
```javascript
const liquidity = await bnplCore.getProtocolLiquidity()
console.log("Pool Balance:", ethers.formatUnits(liquidity, 6), "USDC")
```

---

#### `depositLiquidity(uint256 amount) external onlyOwner`
**Description:** Admin deposits USDC into protocol pool.

**Access:** Only owner

**Parameters:**
- `amount` (uint256): USDC amount to deposit (6 decimals)

**Requirements:**
- Admin must approve USDC first

**Events:**
- `LiquidityDeposited(address indexed depositor, uint256 amount)`

---

#### `withdrawLiquidity(uint256 amount) external onlyOwner`
**Description:** Admin withdraws USDC from protocol pool.

**Access:** Only owner

**Parameters:**
- `amount` (uint256): USDC amount to withdraw (6 decimals)

**Requirements:**
- Amount ≤ protocol liquidity

**Events:**
- `LiquidityWithdrawn(address indexed recipient, uint256 amount)`

---

#### `addMerchant(address merchant) external onlyOwner`
**Description:** Add approved merchant to whitelist.

**Access:** Only owner

**Parameters:**
- `merchant` (address): Merchant wallet address

**Events:**
- `MerchantAdded(address indexed merchant)`

---

#### `removeMerchant(address merchant) external onlyOwner`
**Description:** Remove merchant from whitelist.

**Access:** Only owner

**Parameters:**
- `merchant` (address): Merchant wallet address

**Events:**
- `MerchantRemoved(address indexed merchant)`

---

## Events Reference

### TrustScoreManager Events

```solidity
event ScoreUpdated(
    address indexed user,
    uint256 newScore,
    string reason
)
```

### BNPLCore Events

```solidity
event LoanCreated(
    uint256 indexed loanId,
    address indexed borrower,
    address indexed merchant,
    uint256 amount,
    uint256 dueDate
)

event PaymentMade(
    uint256 indexed loanId,
    address indexed borrower,
    uint256 amount,
    uint256 remainingAmount
)

event LoanFullyRepaid(
    uint256 indexed loanId,
    address indexed borrower
)

event LiquidityDeposited(
    address indexed depositor,
    uint256 amount
)

event LiquidityWithdrawn(
    address indexed recipient,
    uint256 amount
)

event MerchantAdded(address indexed merchant)
event MerchantRemoved(address indexed merchant)
```

---

## Integration Examples

### Frontend Integration (wagmi + React)

#### 1. Read User Trust Score

```typescript
import { useReadContract } from 'wagmi'

const { data: trustScore } = useReadContract({
  address: '0x3ef1456a5AbA04eFd979be0a49232211C88Df014',
  abi: TrustScoreManagerABI,
  functionName: 'getTrustScore',
  args: [userAddress]
})
```

#### 2. Create BNPL Loan

```typescript
import { useWriteContract } from 'wagmi'

const { writeContract } = useWriteContract()

const createLoan = async () => {
  await writeContract({
    address: '0x0B8e9E0278Fe46647E9C4876586Ece93e8Ec1F65',
    abi: BNPLCoreABI,
    functionName: 'createLoan',
    args: [merchantAddress, parseUnits("0.99", 6)]
  })
}
```

#### 3. Repay Loan

```typescript
// Step 1: Approve USDC
await writeContract({
  address: USDC_ADDRESS,
  abi: ERC20_ABI,
  functionName: 'approve',
  args: [BNPL_CORE_ADDRESS, parseUnits("0.99", 6)]
})

// Step 2: Make payment
await writeContract({
  address: BNPL_CORE_ADDRESS,
  abi: BNPLCoreABI,
  functionName: 'makePayment',
  args: [parseUnits("0.99", 6)]
})
```

---

## Error Codes & Handling

### Common Errors

```solidity
// TrustScoreManager
"Only BNPLCore can call this function"
"Only owner can call this function"

// BNPLCore
"User already has an active loan"
"Merchant not approved"
"Amount exceeds credit limit"
"Insufficient protocol liquidity"
"Loan amount must be greater than 0"
"No active loan"
"Payment amount exceeds remaining balance"
"Insufficient USDC balance"
"USDC transfer failed"
```

### Error Handling Example

```typescript
try {
  await bnplCore.createLoan(merchant, amount)
} catch (error) {
  if (error.message.includes("already has an active loan")) {
    toast.error("Please repay your existing loan first")
  } else if (error.message.includes("exceeds credit limit")) {
    toast.error("Insufficient credit limit")
  } else {
    toast.error("Transaction failed")
  }
}
```

---

## Gas Optimization Tips

1. **Batch Operations:** Group multiple reads in a single multicall
2. **Approve Once:** Set maximum USDC allowance to avoid repeated approvals
3. **Off-Chain Calculations:** Calculate values client-side before transaction
4. **Event Listening:** Use events instead of repeated polling

---

## Security Considerations

1. **Always approve USDC before payment**
2. **Verify merchant address before creating loan**
3. **Check credit limit client-side to avoid failed transactions**
4. **Monitor transaction status and handle timeouts**
5. **Never expose private keys in frontend code**

---

## Support & Resources

- **PolygonScan:** View verified contracts and transactions
- **GitHub Issues:** Report bugs or request features
- **Documentation:** See README.md for setup instructions
- **Testing Guide:** See TESTING.md for test scenarios
