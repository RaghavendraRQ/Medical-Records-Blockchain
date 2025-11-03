# Troubleshooting - MetaMask Connection Issues

## Problem: "Please install MetaMask!" but MetaMask is already installed

This is a common issue. Here are step-by-step solutions:

### Solution 1: Use a Local Server (MOST COMMON FIX)

**If you opened `index.html` directly by double-clicking**, MetaMask won't work because it requires HTTP/HTTPS protocol.

**Fix:**
1. Open terminal/command prompt
2. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
3. Start a local server:
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # OR Python 2
   python -m SimpleHTTPServer 8000
   
   # OR Node.js (if you have http-server installed)
   npx http-server
   ```
4. Open browser and visit: `http://localhost:8000`
5. Now try connecting MetaMask again

### Solution 2: Check MetaMask Installation

1. **Verify MetaMask is installed:**
   - Check browser extensions (chrome://extensions/ or about:addons)
   - MetaMask should be enabled
   - Make sure it's the official MetaMask (not a fake copy)

2. **Unlock MetaMask:**
   - Open MetaMask extension
   - Enter your password to unlock
   - Make sure at least one account is visible

3. **Refresh the page** after unlocking

### Solution 3: Browser Compatibility

**Recommended Browsers:**
- ✅ Chrome/Chromium (Best)
- ✅ Brave
- ✅ Firefox
- ✅ Edge
- ⚠️ Safari (may have issues)

**If using Safari:**
- Make sure MetaMask is installed
- Try Chrome or Firefox instead

### Solution 4: Clear Browser Cache

1. Press `Ctrl+Shift+Delete` (Windows/Linux) or `Cmd+Shift+Delete` (Mac)
2. Clear cache and cookies
3. Refresh the page

### Solution 5: Check Browser Console

1. Press `F12` or `Ctrl+Shift+I` to open Developer Tools
2. Go to "Console" tab
3. Look for error messages
4. The console will show detailed debug information about MetaMask detection

**Common Console Messages:**
- ✅ "MetaMask detected!" - MetaMask is found
- ❌ "MetaMask not detected" - Check solutions above
- ⚠️ "File protocol detected" - Use local server (Solution 1)

### Solution 6: Reinstall MetaMask

If nothing else works:

1. **Backup your seed phrase** (IMPORTANT!)
2. Remove MetaMask extension
3. Restart browser
4. Install MetaMask again from: https://metamask.io/
5. Restore using seed phrase
6. Try connecting again

### Solution 7: Check Network Requirements

The frontend specifically checks for MetaMask:

1. **Check if other Web3 wallets are interfering:**
   - Disable other wallet extensions temporarily
   - Some wallets conflict with MetaMask detection

2. **Check if MetaMask is set as default:**
   - In MetaMask settings, ensure it's enabled
   - Some browsers ask which wallet to use

### Solution 8: Manual Refresh

1. **Hard refresh the page:**
   - Windows/Linux: `Ctrl+F5` or `Ctrl+Shift+R`
   - Mac: `Cmd+Shift+R`

2. **Close and reopen browser tab**

3. **Restart browser completely**

### Solution 9: Check MetaMask Status

Look at the yellow/green status box at the top of the connection section:

- ✅ **Green with "MetaMask detected and ready!"** - Everything is OK, try connecting
- ❌ **Red with error message** - Follow the specific instructions shown
- ⚠️ **Yellow with "Checking..."** - Wait a moment, it's still detecting

### Solution 10: Verify Sepolia Network

After connecting:

1. Make sure MetaMask shows "Sepolia" network (not Mainnet)
2. If not on Sepolia:
   - Click MetaMask extension
   - Click network dropdown (top of MetaMask)
   - Select "Sepolia"
   - If Sepolia not listed, add it manually:
     - Network Name: Sepolia
     - RPC URL: https://rpc.sepolia.org
     - Chain ID: 11155111
     - Currency: ETH

## Still Not Working?

### Debug Steps:

1. **Open Browser Console** (F12)
2. **Check what's logged:**
   ```javascript
   // Run these in console:
   typeof window.ethereum
   window.ethereum
   window.ethereum?.isMetaMask
   ```
3. **Expected output:**
   - `typeof window.ethereum` should be `"object"`
   - `window.ethereum.isMetaMask` should be `true`

### Contact/Report:

If none of the above works:
1. Note your browser and version
2. Note MetaMask version
3. Copy console error messages
4. Check if you're using any privacy/VPN extensions that might block Web3

## Quick Checklist

- [ ] Using local server (not file://)
- [ ] MetaMask is installed and enabled
- [ ] MetaMask is unlocked
- [ ] Using Chrome/Edge/Brave/Firefox (not Safari)
- [ ] No conflicting wallet extensions
- [ ] Page refreshed after unlocking MetaMask
- [ ] On Sepolia network in MetaMask
- [ ] Browser console shows no blocking errors

---

**Most common fix: Use a local server instead of opening the file directly!**

