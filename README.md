# Medical Records Blockchain

A blockchain-based system for managing medical records with secure access control.

## What is this?

This project uses blockchain technology to give patients control over their medical records. Patients can upload their medical record information and grant or revoke access to doctors. All actions are permanently recorded on the blockchain for transparency and security.

## Key Features

- **Patient Control**: Patients own their medical records and control who can access them
- **Access Management**: Grant and revoke doctor access permissions anytime
- **Audit Trail**: All actions are recorded on the blockchain with timestamps
- **Secure**: Built on Ethereum blockchain using Solidity smart contracts
- **Web Interface**: Easy-to-use frontend for patients and doctors

## How it Works

1. **Patient** uploads medical record metadata to the blockchain
2. **Patient** grants access to specific doctors using their wallet address
3. **Doctor** can check if they have access to a patient's record
4. **Patient** can revoke access at any time

## Getting Started

- **Quick Start**: See [QUICKSTART.md](QUICKSTART.md) for a 5-minute setup guide
- **Deployment Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed contract deployment
- **Frontend Guide**: See [frontend/README.md](frontend/README.md) for using the web interface

## Technology Stack

- **Blockchain**: Ethereum (Sepolia Testnet)
- **Smart Contract**: Solidity 0.8.19
- **Frontend**: HTML, CSS, JavaScript (ethers.js)
- **Wallet**: MetaMask

## Project Structure

```
├── contracts/          # Smart contract files
├── frontend/          # Web interface
├── QUICKSTART.md      # Quick setup guide
└── DEPLOYMENT.md      # Deployment instructions
```

## License

MIT
