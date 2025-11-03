# Medical Records Blockchain - Frontend Usage Guide

## Overview

This frontend provides a user-friendly web interface to interact with the MedicalRecords smart contract on Sepolia testnet. It supports two distinct roles: **Patient** and **Doctor**, each with specific functionalities.

## Prerequisites

1. **MetaMask Browser Extension**
   - Install from: https://metamask.io/
   - Create or import a wallet account

2. **Sepolia Test ETH**
   - Get test ETH from faucets:
     - https://sepoliafaucet.com/
     - https://faucet.quicknode.com/ethereum/sepolia
     - https://www.alchemy.com/faucets/ethereum-sepolia

3. **Deployed Contract Address**
   - Deploy the MedicalRecords contract on Sepolia (see DEPLOYMENT.md)
   - Copy the deployed contract address

## Setup Instructions

### Option 1: Local File (Quick Start)

1. **Download/Clone the frontend files:**
   ```
   frontend/
   ├── index.html
   ├── styles.css
   ├── app.js
   └── README.md
   ```

2. **Open the HTML file:**
   - Simply double-click `index.html` to open in your browser
   - Or right-click → "Open with" → Your browser

3. **Note:** For local files, you may need to enable local file access in your browser settings if MetaMask doesn't connect.

### Option 2: Local Web Server (Recommended)

1. **Using Python:**
   ```bash
   cd frontend
   python3 -m http.server 8000
   ```
   Then open: http://localhost:8000

2. **Using Node.js (http-server):**
   ```bash
   npm install -g http-server
   cd frontend
   http-server
   ```

3. **Using VS Code Live Server:**
   - Install "Live Server" extension
   - Right-click on `index.html` → "Open with Live Server"

## Step-by-Step Usage

### 1. Connect Your Wallet

1. **Open the frontend** in your browser
2. **Enter your contract address** in the "Contract" field
3. **Click "Connect Wallet"**
4. **Approve MetaMask connection** if prompted
5. **Ensure you're on Sepolia network:**
   - If not, MetaMask will prompt you to switch
   - Or manually switch in MetaMask settings

**Expected Result:**
- Network status shows "Sepolia Testnet"
- Your account address is displayed (shortened format)

### 2. Select Your Role

- **Click "👤 Patient"** if you're uploading/managing records
- **Click "👨‍⚕️ Doctor"** if you're checking access permissions

### 3. Patient Role - Upload a Record

1. **Switch to Patient role** (if not already)
2. **Fill in the "Upload Medical Record" form:**
   - **Record ID:** Enter a unique identifier (e.g., "REC001", "PATIENT123")
   - **Record Hash:** Enter the hash of your medical record file
     - This can be any hash string (e.g., "0x1234567890abcdef...")
     - In production, this would be the hash of your actual medical file
3. **Click "Upload Record"**
4. **Confirm transaction in MetaMask**
5. **Wait for confirmation** (watch the status message)

**Expected Result:**
- Transaction success message appears
- Event appears in "Recent Events" section
- Form fields are cleared

### 4. Patient Role - Grant Access to Doctor

1. **Fill in the "Grant Doctor Access" form:**
   - **Record ID:** Enter the ID of the record you uploaded
   - **Doctor Address:** Enter the MetaMask address of the doctor
     - You can get this from the doctor's MetaMask wallet
2. **Click "Grant Access"**
3. **Confirm transaction in MetaMask**

**Expected Result:**
- "AccessGranted" event appears in Recent Events
- Doctor can now check their access (see Doctor section)

### 5. Patient Role - Revoke Access

1. **Fill in the "Revoke Doctor Access" form:**
   - **Record ID:** Enter the record ID
   - **Doctor Address:** Enter the doctor's address to revoke
2. **Click "Revoke Access"**
3. **Confirm transaction**

**Expected Result:**
- "AccessRevoked" event appears
- Doctor's access is now denied

### 6. Patient Role - View Record Information

1. **Enter a Record ID** in the "View Record Information" section
2. **Click "View Record"**
3. **View the details:**
   - Record ID
   - Hash
   - Owner address
   - Upload timestamp

**Note:** This is a view function (no gas cost, no transaction needed)

### 7. Doctor Role - Check Access Permission

1. **Switch to Doctor role** (click "👨‍⚕️ Doctor")
2. **Fill in the "Check Access Permission" form:**
   - **Record ID:** Enter the record ID you want to check
   - **Your Address:** Leave empty to use current account, or enter another address
3. **Click "Check Access"**

**Expected Result:**
- Shows "✅ GRANTED" if you have access
- Shows "❌ NO ACCESS" if access is denied
- Displays record ID and user address

**Note:** This is a view function (no gas cost)

### 8. Doctor Role - View Record Information

1. **Enter a Record ID** in the "View Record Information" section
2. **Click "View Record"**
3. **View the record metadata**

**Note:** Doctors can view record metadata, but actual access depends on access permissions.

## Role Comparison

| Feature | Patient | Doctor |
|---------|---------|--------|
| Upload Records | ✅ Yes | ❌ No |
| Grant Access | ✅ Yes | ❌ No |
| Revoke Access | ✅ Yes | ❌ No |
| Check Access | ✅ Yes | ✅ Yes |
| View Record Info | ✅ Yes | ✅ Yes |

## Testing with Two Accounts

To fully test the system, use two MetaMask accounts:

### Setup:

1. **Account 1 (Patient):**
   - Connect as Patient
   - Upload a record
   - Grant access to Account 2

2. **Account 2 (Doctor):**
   - Switch MetaMask to Account 2
   - Connect to frontend
   - Switch to Doctor role
   - Check access using the record ID from Account 1

### Quick Test Flow:

1. **Patient Account:**
   ```
   Upload: ID="REC001", Hash="0xabc123..."
   Grant Access: ID="REC001", Doctor="0xDoctorAddress"
   ```

2. **Switch to Doctor Account in MetaMask**

3. **Doctor Account:**
   ```
   Check Access: ID="REC001" → Should show GRANTED
   ```

4. **Switch back to Patient Account**

5. **Patient Account:**
   ```
   Revoke Access: ID="REC001", Doctor="0xDoctorAddress"
   ```

6. **Switch to Doctor Account**

7. **Doctor Account:**
   ```
   Check Access: ID="REC001" → Should show NO ACCESS
   ```

## Features

### Real-time Event Monitoring
- All blockchain events are displayed in the "Recent Events" section
- Events include links to Etherscan for verification
- Events update automatically when transactions are confirmed

### Transaction Status
- Real-time feedback for all transactions
- Shows pending, success, and error states
- Auto-dismisses after 5 seconds for completed transactions

### Responsive Design
- Works on desktop and mobile devices
- Modern, clean interface
- Color-coded status indicators

## Troubleshooting

### Issue: "Please install MetaMask!"
**Solution:** Install MetaMask browser extension and reload the page

### Issue: "Please switch to Sepolia testnet!"
**Solution:** 
1. Open MetaMask
2. Click network dropdown (top)
3. Select "Sepolia" network
4. If not listed, add it manually (see MetaMask documentation)

### Issue: "Please connect wallet first!"
**Solution:** 
1. Make sure MetaMask is unlocked
2. Click "Connect Wallet" button
3. Approve the connection request

### Issue: Transaction fails with "insufficient funds"
**Solution:** Get more Sepolia test ETH from a faucet

### Issue: "Record does not exist" error
**Solution:** Make sure you're using the correct record ID that was uploaded

### Issue: "Only record owner can grant access"
**Solution:** Make sure you're using the Patient account that uploaded the record

### Issue: Events not showing
**Solution:** 
1. Ensure contract address is correct
2. Make sure wallet is connected
3. Try refreshing the page and reconnecting

### Issue: Browser console shows errors
**Solution:**
- Check that ethers.js is loading (inspect Network tab)
- Ensure contract address is valid
- Make sure you're on Sepolia network

## Security Notes

⚠️ **Important:**
- This is for **testnet only** (Sepolia)
- Never use real funds or sensitive data
- Contract addresses are public - anyone can view records
- Record hashes are public on blockchain
- Always verify contract address before connecting

## Advanced Usage

### Viewing Events on Etherscan

1. Copy a transaction hash from Recent Events
2. Click the "View on Etherscan" link
3. Or visit: https://sepolia.etherscan.io/tx/[TX_HASH]

### Connecting to a Different Contract

1. Enter new contract address in "Contract" field
2. Click "Connect Wallet" again
3. Contract will reinitialize with new address

### Multiple Records Management

- Upload multiple records with different IDs
- Manage access for each record independently
- Track all events in the Recent Events log

## Support

For issues or questions:
1. Check the contract deployment guide (DEPLOYMENT.md)
2. Verify your MetaMask is configured correctly
3. Ensure you have Sepolia test ETH
4. Check browser console for detailed error messages

## Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Brave
- ⚠️ Safari (may have MetaMask compatibility issues)

---

**Happy Testing! 🏥🔗**

