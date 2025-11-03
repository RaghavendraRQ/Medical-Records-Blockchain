# Medical Records Blockchain - Deployment Guide

## Contract Overview

The `MedicalRecords` contract provides a blockchain-based access control system for medical records. Patients can upload record metadata and manage doctor access permissions with a complete audit trail.

## Prerequisites

1. **MetaMask Wallet**: Install MetaMask browser extension
2. **Sepolia Test ETH**: Get test ETH from a Sepolia faucet:
   - https://sepoliafaucet.com/
   - https://faucet.quicknode.com/ethereum/sepolia
   - https://www.alchemy.com/faucets/ethereum-sepolia

## Deployment Steps

### 1. Open Remix IDE

1. Go to https://remix.ethereum.org/
2. Create a new file or workspace
3. Copy the `MedicalRecords.sol` contract code

### 2. Configure MetaMask

1. Connect MetaMask to Sepolia Test Network:
   - Network Name: Sepolia
   - RPC URL: https://rpc.sepolia.org or https://sepolia.infura.io/v3/YOUR-PROJECT-ID
   - Chain ID: 11155111
   - Currency Symbol: ETH
2. Import or switch to an account with Sepolia test ETH

### 3. Compile the Contract

1. In Remix, go to the "Solidity Compiler" tab (third icon on left)
2. Set compiler version to `0.8.19` or higher
3. Click "Compile MedicalRecords.sol"
4. Check for any compilation errors

### 4. Deploy the Contract

1. Go to "Deploy & Run Transactions" tab (fourth icon on left)
2. Select "Injected Provider - MetaMask" as environment
3. Ensure MetaMask is connected to Sepolia network
4. Click "Deploy"
5. Confirm the transaction in MetaMask
6. Wait for deployment confirmation
7. Copy the contract address (you'll need this for Etherscan)

### 5. Verify on Etherscan

1. Go to https://sepolia.etherscan.io/
2. Search for your contract address
3. Click "Contract" tab → "Verify and Publish"
4. Enter contract details and verify

## Testing the Contract

### Setup Test Accounts

- **Account 1 (Patient)**: Deployer account or first MetaMask account
- **Account 2 (Doctor)**: Second MetaMask account

### Test Scenarios

#### 1. Upload a Medical Record (Patient)

```solidity
// In Remix, under deployed contract:
uploadRecord("REC001", "0x1234567890abcdef...")
```

**Expected Result:**
- Transaction succeeds
- `RecordUploaded` event emitted
- View on Etherscan: Check "Events" tab for `RecordUploaded`

#### 2. Grant Access to Doctor

```solidity
// Switch to Patient account
grantAccess("REC001", "0xDoctorAddressHere")
```

**Expected Result:**
- Transaction succeeds
- `AccessGranted` event emitted
- View on Etherscan: Check "Events" tab for `AccessGranted`

#### 3. Check Access (Anyone can call)

```solidity
// Use Remix "call" (no gas cost)
checkAccess("REC001", "0xDoctorAddressHere")
// Returns: true
```

#### 4. Revoke Access

```solidity
// Switch to Patient account
revokeAccess("REC001", "0xDoctorAddressHere")
```

**Expected Result:**
- Transaction succeeds
- `AccessRevoked` event emitted
- View on Etherscan: Check "Events" tab for `AccessRevoked`
- Verify: `checkAccess` now returns `false`

## Contract Functions Reference

| Function | Description | Gas Cost | Who Can Call |
|----------|-------------|----------|--------------|
| `uploadRecord(string id, string hash)` | Upload new medical record | Yes | Anyone (becomes owner) |
| `grantAccess(string id, address doctor)` | Grant doctor access | Yes | Record owner only |
| `revokeAccess(string id, address doctor)` | Revoke doctor access | Yes | Record owner only |
| `checkAccess(string id, address user)` | Check if user has access | No (view) | Anyone |
| `getRecordInfo(string id)` | Get record metadata | No (view) | Anyone |

## Events to Monitor on Etherscan

1. **RecordUploaded**: Fired when a patient uploads a record
   - Parameters: `owner`, `id`, `time`

2. **AccessGranted**: Fired when access is granted
   - Parameters: `id`, `doctor`, `time`

3. **AccessRevoked**: Fired when access is revoked
   - Parameters: `id`, `doctor`, `time`

## Security Notes

- Each record has its own owner who controls access
- Only the record owner can grant/revoke access
- All actions are permanently recorded on the blockchain
- Records only store metadata (hash), actual files should be stored off-chain
- Anyone can view access permissions (public audit trail)

## Troubleshooting

**Issue**: Transaction fails with "insufficient funds"
- **Solution**: Get more Sepolia test ETH from faucet

**Issue**: Contract deployment fails
- **Solution**: Check compiler version matches (0.8.19+), ensure MetaMask is on Sepolia network

**Issue**: "Only record owner can grant access" error
- **Solution**: Make sure you're using the account that uploaded the record

## Contract Address

After deployment, save your contract address here:
```
Contract Address: 0x...
Deployed on: Sepolia Testnet
```

