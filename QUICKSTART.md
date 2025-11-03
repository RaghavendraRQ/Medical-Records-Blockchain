# Quick Start Guide - Medical Records Blockchain

## 🚀 Getting Started in 5 Minutes

### Step 1: Deploy the Contract (3 minutes)

1. **Open Remix IDE:** https://remix.ethereum.org/
2. **Create new file:** `MedicalRecords.sol`
3. **Copy contract code** from `contracts/MedicalRecords.sol`
4. **Compile:** Solidity Compiler tab → Version 0.8.19 → Compile
5. **Deploy:**
   - Deploy & Run tab
   - Environment: Injected Provider - MetaMask
   - Ensure MetaMask is on Sepolia network
   - Click Deploy
   - **Copy the contract address** (you'll need this!)

### Step 2: Setup Frontend (1 minute)

1. **Open `frontend/index.html`** in your browser
   - Option A: Double-click the file
   - Option B: Use a local server: `python3 -m http.server 8000` then visit `http://localhost:8000`

2. **Enter your contract address** in the "Contract" field

3. **Click "Connect Wallet"** and approve in MetaMask

### Step 3: Test as Patient (1 minute)

1. **Select "👤 Patient" role**
2. **Upload a record:**
   - Record ID: `REC001`
   - Hash: `0xabc123def456...`
   - Click "Upload Record"
   - Confirm in MetaMask

3. **View result:**
   - ✅ Status message appears
   - ✅ Event appears in "Recent Events"

### Step 4: Test Access Control

**As Patient:**
- Grant access: Record ID: `REC001`, Doctor Address: `0xDoctorAddress...`
- Click "Grant Access"

**As Doctor:**
- Switch MetaMask to doctor account
- Select "👨‍⚕️ Doctor" role in frontend
- Check Access: Record ID: `REC001`
- ✅ Should show "GRANTED"

## 📋 Checklist

- [ ] MetaMask installed and connected to Sepolia
- [ ] Have Sepolia test ETH (get from faucet)
- [ ] Contract deployed on Sepolia
- [ ] Contract address copied
- [ ] Frontend opened in browser
- [ ] Wallet connected in frontend
- [ ] Tested upload record
- [ ] Tested grant access
- [ ] Tested check access (with 2 accounts)

## 🎯 Testing Scenarios

### Scenario 1: Basic Upload
```
Patient → Upload Record → ID: "TEST001", Hash: "0x123..."
Expected: RecordUploaded event appears
```

### Scenario 2: Grant and Check
```
Patient → Grant Access → REC001 → Doctor: 0xABC...
Doctor → Check Access → REC001 → Should show ✅ GRANTED
```

### Scenario 3: Revoke Access
```
Patient → Revoke Access → REC001 → Doctor: 0xABC...
Doctor → Check Access → REC001 → Should show ❌ NO ACCESS
```

## 🆘 Quick Troubleshooting

**Problem:** "Please switch to Sepolia"
- **Fix:** In MetaMask, switch network to Sepolia (Chain ID: 11155111)

**Problem:** "Insufficient funds"
- **Fix:** Get Sepolia ETH from https://sepoliafaucet.com/

**Problem:** "Record does not exist"
- **Fix:** Make sure you uploaded the record first, check the ID spelling

**Problem:** "Only record owner can grant access"
- **Fix:** Use the same account that uploaded the record

## 📚 Full Documentation

- **Frontend Usage:** See `frontend/README.md`
- **Contract Deployment:** See `DEPLOYMENT.md`
- **Contract Code:** See `contracts/MedicalRecords.sol`

## 🎓 Learning Path

1. ✅ Deploy contract
2. ✅ Test upload record
3. ✅ Test grant/revoke access
4. ✅ View events on Etherscan
5. ✅ Test with 2 accounts (Patient + Doctor)
6. ✅ Explore frontend features
7. ✅ Read contract code
8. ✅ Customize for your needs

---

**Happy Coding! 🏥🔗**

