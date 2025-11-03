// Medical Records Blockchain Frontend
// Contract ABI
const contractABI = [
    {
        "inputs": [
            {"internalType": "string", "name": "id", "type": "string"},
            {"internalType": "string", "name": "hash", "type": "string"}
        ],
        "name": "uploadRecord",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "string", "name": "id", "type": "string"},
            {"internalType": "address", "name": "doctor", "type": "address"}
        ],
        "name": "grantAccess",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "string", "name": "id", "type": "string"},
            {"internalType": "address", "name": "doctor", "type": "address"}
        ],
        "name": "revokeAccess",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "string", "name": "id", "type": "string"},
            {"internalType": "address", "name": "user", "type": "address"}
        ],
        "name": "checkAccess",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "id", "type": "string"}],
        "name": "getRecordInfo",
        "outputs": [
            {"internalType": "string", "name": "recordId", "type": "string"},
            {"internalType": "string", "name": "hash", "type": "string"},
            {"internalType": "address", "name": "owner", "type": "address"},
            {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "address", "name": "owner", "type": "address"},
            {"indexed": true, "internalType": "string", "name": "id", "type": "string"},
            {"indexed": false, "internalType": "uint256", "name": "time", "type": "uint256"}
        ],
        "name": "RecordUploaded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "string", "name": "id", "type": "string"},
            {"indexed": true, "internalType": "address", "name": "doctor", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "time", "type": "uint256"}
        ],
        "name": "AccessGranted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "string", "name": "id", "type": "string"},
            {"indexed": true, "internalType": "address", "name": "doctor", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "time", "type": "uint256"}
        ],
        "name": "AccessRevoked",
        "type": "event"
    }
];

// Global variables
let provider;
let signer;
let contract;
let currentAccount;

// DOM Elements
const connectWalletBtn = document.getElementById('connect-wallet');
const contractAddressInput = document.getElementById('contract-address');
const networkStatus = document.getElementById('network-status');
const accountAddress = document.getElementById('account-address');
const rolePatientBtn = document.getElementById('role-patient');
const roleDoctorBtn = document.getElementById('role-doctor');
const patientSection = document.getElementById('patient-section');
const doctorSection = document.getElementById('doctor-section');
const transactionStatus = document.getElementById('transaction-status');
const statusMessage = document.getElementById('status-message');
const eventLog = document.getElementById('event-log');
const metamaskDetection = document.getElementById('metamask-detection');
const metamaskStatus = document.getElementById('metamask-status');
const switchNetworkBtn = document.getElementById('switch-network');

// Check if ethers.js is loaded
function checkEthersAvailable() {
    if (typeof ethers === 'undefined') {
        throw new Error('ethers.js library is not loaded. Please check your internet connection or CDN availability.');
    }
    return true;
}

// Initialize - wait for ethers.js to be ready
window.appReady = async function() {
    console.log('App ready - ethers.js loaded');
    checkEthersAvailable();
    
    // Wait a bit for MetaMask to inject provider
    await waitForMetaMask();
    await checkWalletConnection();
    setupEventListeners();
};

// Also try on window load as fallback
window.addEventListener('load', async () => {
    // Wait a bit for ethers if not already ready
    if (typeof ethers === 'undefined') {
        console.log('Waiting for ethers.js to load...');
        let attempts = 0;
        while (typeof ethers === 'undefined' && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (typeof ethers === 'undefined') {
            console.error('ethers.js failed to load');
            if (metamaskStatus) {
                metamaskStatus.innerHTML = '❌ ethers.js library failed to load. Please check console for details.';
            }
            return;
        }
    }
    
    if (!window.appInitialized) {
        window.appInitialized = true;
        await window.appReady();
    }
});

// Wait for MetaMask to be available
async function waitForMetaMask() {
    // Show detection status
    if (metamaskDetection) {
        metamaskDetection.style.display = 'block';
        metamaskStatus.textContent = 'Checking for MetaMask...';
    }
    
    let attempts = 0;
    const maxAttempts = 20; // Increased attempts
    
    while (attempts < maxAttempts) {
        if (window.ethereum && window.ethereum.isMetaMask) {
            console.log('MetaMask detected!');
            if (metamaskDetection) {
                metamaskDetection.style.background = '#d4edda';
                metamaskStatus.textContent = '✅ MetaMask detected and ready!';
            }
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, 200));
        attempts++;
    }
    
    // MetaMask not found
    if (metamaskDetection) {
        metamaskDetection.style.background = '#f8d7da';
        
        if (window.location.protocol === 'file:') {
            metamaskStatus.innerHTML = '❌ File protocol detected. Please use a local server. <br><small>Run: <code>python3 -m http.server 8000</code> then visit <code>http://localhost:8000</code></small>';
        } else if (typeof window.ethereum !== 'undefined') {
            metamaskStatus.textContent = '⚠️ Web3 provider found but not MetaMask';
        } else {
            metamaskStatus.textContent = '❌ MetaMask not found. Please install MetaMask extension.';
        }
    }
    
    return false;
}

// Check if wallet is already connected
async function checkWalletConnection() {
    if (isMetaMaskAvailable()) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                await connectWallet();
            }
        } catch (error) {
            console.error('Error checking wallet:', error);
        }
    }
}

// Check if MetaMask is available
function isMetaMaskAvailable() {
    return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
}

// Setup event listeners
function setupEventListeners() {
    connectWalletBtn.addEventListener('click', connectWallet);
    switchNetworkBtn.addEventListener('click', switchToSepolia);
    
    // Role switching
    rolePatientBtn.addEventListener('click', () => switchRole('patient'));
    roleDoctorBtn.addEventListener('click', () => switchRole('doctor'));
    
    // Patient functions
    document.getElementById('upload-record').addEventListener('click', uploadRecord);
    document.getElementById('grant-access').addEventListener('click', grantAccess);
    document.getElementById('revoke-access').addEventListener('click', revokeAccess);
    document.getElementById('view-record').addEventListener('click', viewRecord);
    
    // Doctor functions
    document.getElementById('check-access').addEventListener('click', checkAccess);
    document.getElementById('doctor-view-record').addEventListener('click', doctorViewRecord);
    
    // Listen for account changes
    if (isMetaMaskAvailable()) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', () => window.location.reload());
    }
}

// Handle account changes
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        resetConnection();
    } else {
        connectWallet();
    }
}

// Reset connection
function resetConnection() {
    provider = null;
    signer = null;
    contract = null;
    currentAccount = null;
    networkStatus.textContent = 'Not Connected';
    accountAddress.textContent = 'Not Connected';
}

// Connect wallet
async function connectWallet() {
    // First check if ethers.js is available
    try {
        checkEthersAvailable();
    } catch (error) {
        showStatus('Error: ethers.js library not loaded. Please refresh the page.', 'error');
        console.error(error);
        return;
    }
    
    // Try to detect MetaMask again if not available
    if (!isMetaMaskAvailable()) {
        console.log('MetaMask not detected, attempting to wait...');
        await waitForMetaMask();
    }
    
    // Check if MetaMask is available
    if (!isMetaMaskAvailable()) {
        // Provide detailed error message
        let errorMsg = 'MetaMask not detected. ';
        
        // Debug information
        console.error('MetaMask detection debug:', {
            ethereum: typeof window.ethereum,
            ethereumValue: window.ethereum,
            isMetaMask: window.ethereum?.isMetaMask,
            protocol: window.location.protocol,
            userAgent: navigator.userAgent
        });
        
        if (window.location.protocol === 'file:') {
            errorMsg += 'The page is opened as a file. Please use a local server (e.g., python -m http.server 8000) then visit http://localhost:8000';
        } else if (typeof window.ethereum === 'undefined') {
            errorMsg += 'Please install MetaMask extension from https://metamask.io/ and refresh the page.';
        } else if (window.ethereum && !window.ethereum.isMetaMask) {
            errorMsg += 'A Web3 provider is detected but it is not MetaMask. Please use MetaMask.';
        } else {
            errorMsg += 'Please ensure MetaMask is unlocked and refresh the page.';
        }
        
        showStatus(errorMsg, 'error');
        return;
    }
    
    try {
        console.log('Requesting account access...');
        
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (!accounts || accounts.length === 0) {
            showStatus('No accounts found. Please unlock MetaMask.', 'error');
            return;
        }
        
        console.log('Account accessed:', accounts[0]);
        
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        currentAccount = await signer.getAddress();
        
        console.log('Connected account:', currentAccount);
        
        // Check network
        const network = await provider.getNetwork();
        const sepoliaChainId = 11155111;
        const currentChainId = network.chainId.toString();
        
        if (currentChainId !== sepoliaChainId.toString()) {
            // Show network name
            const networkNames = {
                '1': 'Ethereum Mainnet',
                '137': 'Polygon',
                '56': 'BSC',
                '43114': 'Avalanche',
                '42161': 'Arbitrum'
            };
            const currentNetworkName = networkNames[currentChainId] || `Network ${currentChainId}`;
            
            networkStatus.textContent = `${currentNetworkName} (Switch Required)`;
            networkStatus.style.color = '#dc3545';
            
            // Show switch button
            if (switchNetworkBtn) {
                switchNetworkBtn.style.display = 'inline-block';
            }
            
            showStatus(`You're on ${currentNetworkName}. Click "Switch to Sepolia" button to switch automatically!`, 'error');
            return;
        }
        
        // On correct network
        networkStatus.textContent = 'Sepolia Testnet';
        networkStatus.style.color = '#28a745';
        if (switchNetworkBtn) {
            switchNetworkBtn.style.display = 'none';
        }
        
        accountAddress.textContent = `${currentAccount.substring(0, 6)}...${currentAccount.substring(38)}`;
        
        // Initialize contract
        const contractAddress = contractAddressInput.value.trim();
        if (!contractAddress) {
            showStatus('Please enter contract address!', 'error');
            return;
        }
        
        contract = new ethers.Contract(contractAddress, contractABI, signer);
        
        // Listen to events
        listenToEvents();
        
        showStatus('Wallet connected successfully!', 'success');
        
    } catch (error) {
        console.error('Error connecting wallet:', error);
        showStatus('Failed to connect wallet: ' + error.message, 'error');
    }
}

// Switch to Sepolia network
async function switchToSepolia() {
    if (!isMetaMaskAvailable()) {
        showStatus('MetaMask not detected. Please install MetaMask first.', 'error');
        return;
    }
    
    const sepoliaChainId = '0xaa36a7'; // 11155111 in hex
    
    try {
        showStatus('Switching to Sepolia network...', 'pending');
        
        // Try to switch to Sepolia
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: sepoliaChainId }],
        });
        
        showStatus('Successfully switched to Sepolia! Reconnecting...', 'success');
        networkStatus.textContent = 'Sepolia Testnet';
        networkStatus.style.color = '#28a745';
        if (switchNetworkBtn) {
            switchNetworkBtn.style.display = 'none';
        }
        
        // Wait a moment then reconnect
        setTimeout(async () => {
            await connectWallet();
        }, 500);
        
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
            try {
                showStatus('Adding Sepolia network to MetaMask...', 'pending');
                
                // Add Sepolia network
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: sepoliaChainId,
                        chainName: 'Sepolia',
                        nativeCurrency: {
                            name: 'ETH',
                            symbol: 'ETH',
                            decimals: 18
                        },
                        rpcUrls: ['https://rpc.sepolia.org', 'https://sepolia.infura.io/v3/'],
                        blockExplorerUrls: ['https://sepolia.etherscan.io']
                    }],
                });
                
                showStatus('Sepolia network added successfully! Reconnecting...', 'success');
                networkStatus.textContent = 'Sepolia Testnet';
                networkStatus.style.color = '#28a745';
                if (switchNetworkBtn) {
                    switchNetworkBtn.style.display = 'none';
                }
                
                // Wait a moment then reconnect
                setTimeout(async () => {
                    await connectWallet();
                }, 500);
                
            } catch (addError) {
                console.error('Error adding Sepolia network:', addError);
                showStatus('Failed to add Sepolia network. Please add it manually in MetaMask.', 'error');
            }
        } else if (switchError.code === 4001) {
            // User rejected the request
            showStatus('Network switch rejected. Please switch to Sepolia manually in MetaMask.', 'error');
        } else {
            console.error('Error switching network:', switchError);
            showStatus('Failed to switch network: ' + switchError.message, 'error');
        }
    }
}

// Switch role
function switchRole(role) {
    if (role === 'patient') {
        rolePatientBtn.classList.add('active');
        roleDoctorBtn.classList.remove('active');
        patientSection.style.display = 'block';
        doctorSection.style.display = 'none';
    } else {
        roleDoctorBtn.classList.add('active');
        rolePatientBtn.classList.remove('active');
        patientSection.style.display = 'none';
        doctorSection.style.display = 'block';
    }
}

// Upload record (Patient)
async function uploadRecord() {
    if (!contract) {
        showStatus('Please connect wallet first!', 'error');
        return;
    }
    
    const recordId = document.getElementById('record-id').value.trim();
    const recordHash = document.getElementById('record-hash').value.trim();
    
    if (!recordId || !recordHash) {
        showStatus('Please fill all fields!', 'error');
        return;
    }
    
    try {
        showStatus('Uploading record...', 'pending');
        const tx = await contract.uploadRecord(recordId, recordHash);
        showStatus('Transaction submitted. Waiting for confirmation...', 'pending');
        
        await tx.wait();
        showStatus('Record uploaded successfully!', 'success');
        
        // Clear form
        document.getElementById('record-id').value = '';
        document.getElementById('record-hash').value = '';
        
    } catch (error) {
        console.error('Error uploading record:', error);
        showStatus('Error: ' + (error.reason || error.message), 'error');
    }
}

// Grant access (Patient)
async function grantAccess() {
    if (!contract) {
        showStatus('Please connect wallet first!', 'error');
        return;
    }
    
    const recordId = document.getElementById('grant-record-id').value.trim();
    const doctorAddress = document.getElementById('doctor-address').value.trim();
    
    if (!recordId || !doctorAddress) {
        showStatus('Please fill all fields!', 'error');
        return;
    }
    
    if (!ethers.utils.isAddress(doctorAddress)) {
        showStatus('Invalid doctor address!', 'error');
        return;
    }
    
    try {
        showStatus('Granting access...', 'pending');
        const tx = await contract.grantAccess(recordId, doctorAddress);
        showStatus('Transaction submitted. Waiting for confirmation...', 'pending');
        
        await tx.wait();
        showStatus('Access granted successfully!', 'success');
        
        // Clear form
        document.getElementById('grant-record-id').value = '';
        document.getElementById('doctor-address').value = '';
        
    } catch (error) {
        console.error('Error granting access:', error);
        showStatus('Error: ' + (error.reason || error.message), 'error');
    }
}

// Revoke access (Patient)
async function revokeAccess() {
    if (!contract) {
        showStatus('Please connect wallet first!', 'error');
        return;
    }
    
    const recordId = document.getElementById('revoke-record-id').value.trim();
    const doctorAddress = document.getElementById('revoke-doctor-address').value.trim();
    
    if (!recordId || !doctorAddress) {
        showStatus('Please fill all fields!', 'error');
        return;
    }
    
    if (!ethers.utils.isAddress(doctorAddress)) {
        showStatus('Invalid doctor address!', 'error');
        return;
    }
    
    try {
        showStatus('Revoking access...', 'pending');
        const tx = await contract.revokeAccess(recordId, doctorAddress);
        showStatus('Transaction submitted. Waiting for confirmation...', 'pending');
        
        await tx.wait();
        showStatus('Access revoked successfully!', 'success');
        
        // Clear form
        document.getElementById('revoke-record-id').value = '';
        document.getElementById('revoke-doctor-address').value = '';
        
    } catch (error) {
        console.error('Error revoking access:', error);
        showStatus('Error: ' + (error.reason || error.message), 'error');
    }
}

// View record (Patient)
async function viewRecord() {
    if (!contract) {
        showStatus('Please connect wallet first!', 'error');
        return;
    }
    
    const recordId = document.getElementById('view-record-id').value.trim();
    
    if (!recordId) {
        showStatus('Please enter record ID!', 'error');
        return;
    }
    
    try {
        const recordInfo = await contract.getRecordInfo(recordId);
        
        // Check if current user is the owner
        if (recordInfo.owner.toLowerCase() !== currentAccount.toLowerCase()) {
            const resultBox = document.getElementById('record-info');
            resultBox.className = 'result-box show error';
            resultBox.innerHTML = `
                <strong>❌ Access Denied</strong><br>
                You are not the owner of this record.<br>
                <strong>Record Owner:</strong> ${recordInfo.owner}<br>
                <strong>Your Address:</strong> ${currentAccount}
            `;
            return;
        }
        
        // Handle BigInt timestamp conversion
        const timestampValue = typeof recordInfo.timestamp === 'bigint' 
            ? Number(recordInfo.timestamp) 
            : recordInfo.timestamp.toNumber ? recordInfo.timestamp.toNumber() : recordInfo.timestamp;
        const timestamp = new Date(timestampValue * 1000).toLocaleString();
        
        const resultBox = document.getElementById('record-info');
        resultBox.className = 'result-box show success';
        resultBox.innerHTML = `
            <strong>✅ Record Access Granted</strong><br>
            <strong>Record ID:</strong> ${recordInfo.recordId}<br>
            <strong>Hash:</strong> ${recordInfo.hash}<br>
            <strong>Owner:</strong> ${recordInfo.owner}<br>
            <strong>Uploaded:</strong> ${timestamp}
        `;
        
    } catch (error) {
        console.error('Error viewing record:', error);
        const resultBox = document.getElementById('record-info');
        resultBox.className = 'result-box show error';
        resultBox.textContent = 'Error: ' + (error.reason || error.message);
    }
}

// Check access (Doctor)
async function checkAccess() {
    if (!contract) {
        showStatus('Please connect wallet first!', 'error');
        return;
    }
    
    const recordId = document.getElementById('check-record-id').value.trim();
    let userAddress = document.getElementById('check-user-address').value.trim();
    
    if (!recordId) {
        showStatus('Please enter record ID!', 'error');
        return;
    }
    
    if (!userAddress) {
        userAddress = currentAccount;
    }
    
    if (!ethers.utils.isAddress(userAddress)) {
        showStatus('Invalid address!', 'error');
        return;
    }
    
    try {
        const hasAccess = await contract.checkAccess(recordId, userAddress);
        
        const resultBox = document.getElementById('access-result');
        resultBox.className = 'result-box show ' + (hasAccess ? 'success' : 'info');
        resultBox.innerHTML = `
            <strong>Access Status:</strong> ${hasAccess ? '✅ GRANTED' : '❌ NO ACCESS'}<br>
            <strong>Record ID:</strong> ${recordId}<br>
            <strong>User Address:</strong> ${userAddress}
        `;
        
    } catch (error) {
        console.error('Error checking access:', error);
        const resultBox = document.getElementById('access-result');
        resultBox.className = 'result-box show error';
        resultBox.textContent = 'Error: ' + (error.reason || error.message);
    }
}

// View record (Doctor)
async function doctorViewRecord() {
    if (!contract) {
        showStatus('Please connect wallet first!', 'error');
        return;
    }
    
    const recordId = document.getElementById('doctor-view-record-id').value.trim();
    
    if (!recordId) {
        showStatus('Please enter record ID!', 'error');
        return;
    }
    
    try {
        // First check if doctor has access
        const hasAccess = await contract.checkAccess(recordId, currentAccount);
        
        if (!hasAccess) {
            const resultBox = document.getElementById('doctor-record-info');
            resultBox.className = 'result-box show error';
            resultBox.innerHTML = `
                <strong>❌ Access Denied</strong><br>
                You do not have permission to view this record.<br>
                <strong>Record ID:</strong> ${recordId}<br>
                <strong>Your Address:</strong> ${currentAccount}<br><br>
                <em>Please request access from the record owner.</em>
            `;
            return;
        }
        
        // If access is granted, fetch and display record info
        const recordInfo = await contract.getRecordInfo(recordId);
        
        // Handle BigInt timestamp conversion
        const timestampValue = typeof recordInfo.timestamp === 'bigint' 
            ? Number(recordInfo.timestamp) 
            : recordInfo.timestamp.toNumber ? recordInfo.timestamp.toNumber() : recordInfo.timestamp;
        const timestamp = new Date(timestampValue * 1000).toLocaleString();
        
        const resultBox = document.getElementById('doctor-record-info');
        resultBox.className = 'result-box show success';
        resultBox.innerHTML = `
            <strong>✅ Access Granted</strong><br>
            <strong>Record ID:</strong> ${recordInfo.recordId}<br>
            <strong>Hash:</strong> ${recordInfo.hash}<br>
            <strong>Owner:</strong> ${recordInfo.owner}<br>
            <strong>Uploaded:</strong> ${timestamp}
        `;
        
    } catch (error) {
        console.error('Error viewing record:', error);
        const resultBox = document.getElementById('doctor-record-info');
        resultBox.className = 'result-box show error';
        resultBox.textContent = 'Error: ' + (error.reason || error.message);
    }
}

// Listen to contract events
function listenToEvents() {
    if (!contract) return;
    
    // Record Uploaded
    contract.on('RecordUploaded', (owner, id, time, event) => {
        const timeValue = typeof time === 'bigint' ? Number(time) : (time.toNumber ? time.toNumber() : time);
        addEventLog('RecordUploaded', {
            type: 'upload',
            owner: owner,
            id: id,
            time: new Date(timeValue * 1000).toLocaleString(),
            txHash: event.transactionHash
        });
    });
    
    // Access Granted
    contract.on('AccessGranted', (id, doctor, time, event) => {
        const timeValue = typeof time === 'bigint' ? Number(time) : (time.toNumber ? time.toNumber() : time);
        addEventLog('AccessGranted', {
            type: 'grant',
            id: id,
            doctor: doctor,
            time: new Date(timeValue * 1000).toLocaleString(),
            txHash: event.transactionHash
        });
    });
    
    // Access Revoked
    contract.on('AccessRevoked', (id, doctor, time, event) => {
        const timeValue = typeof time === 'bigint' ? Number(time) : (time.toNumber ? time.toNumber() : time);
        addEventLog('AccessRevoked', {
            type: 'revoke',
            id: id,
            doctor: doctor,
            time: new Date(timeValue * 1000).toLocaleString(),
            txHash: event.transactionHash
        });
    });
}

// Add event to log
function addEventLog(eventName, data) {
    const noEvents = eventLog.querySelector('.no-events');
    if (noEvents) {
        noEvents.remove();
    }
    
    const eventItem = document.createElement('div');
    eventItem.className = `event-item ${data.type}`;
    
    let content = `<strong>${eventName}</strong>`;
    if (data.id) content += `<br>Record ID: ${data.id}`;
    if (data.owner) content += `<br>Owner: ${data.owner}`;
    if (data.doctor) content += `<br>Doctor: ${data.doctor}`;
    content += `<br><span class="event-time">Time: ${data.time}</span>`;
    if (data.txHash) {
        content += `<br><a href="https://sepolia.etherscan.io/tx/${data.txHash}" target="_blank" style="color: #667eea; text-decoration: none;">View on  →</a>`;
    }
    
    eventItem.innerHTML = content;
    eventLog.insertBefore(eventItem, eventLog.firstChild);
}

// Show transaction status
function showStatus(message, type) {
    transactionStatus.style.display = 'block';
    statusMessage.textContent = message;
    statusMessage.className = `status-${type}`;
    
    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            transactionStatus.style.display = 'none';
        }, 5000);
    }
}

