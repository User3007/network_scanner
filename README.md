
TEST

# 🌐 Network Scanner Web Application

A comprehensive network scanner web application with real-time speed monitoring, device discovery, and system information dashboard.

## ✨ Features

### 🔍 **Network Discovery**
- **IP Range Scanning**: Scan custom IP ranges or use presets
- **Port Scanning**: Detect open ports and services
- **Host Discovery**: Find active devices on the network
- **MAC Address Detection**: Identify device MAC addresses
- **Hostname Resolution**: Resolve IP addresses to hostnames

### 📊 **Real-time Speed Monitoring**
- **Live Speed Tracking**: Real-time download/upload speed monitoring
- **Interactive Charts**: Visual representation of network speeds over time
- **Average Calculations**: 5-minute rolling averages
- **Auto-Start Monitoring**: Automatically begins monitoring when app loads
- **Historical Data**: Track speed trends and patterns

### 🎨 **Modern Dashboard**
- **Dark Theme**: Professional dark interface
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Live data updates via WebSocket
- **Interactive Components**: Expandable host details and connection info
- **System Monitoring**: CPU, memory, and network interface monitoring

## 🚀 Quick Start

### **Prerequisites**
- Node.js (v16 or higher)
- Nmap (for network scanning functionality)
- Administrator/root privileges (for some network operations)

### **Installation**

1. **Navigate to the project directory**
   ```bash
   cd C:\Users\thien\Desktop\network_scanner
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies (if using React version)
   cd client
   npm install
   cd ..
   ```

3. **Start the application**
   ```bash
   # Option 1: Use the batch file (Windows)
   start-with-speed-monitoring.bat
   
   # Option 2: Manual start
   node server/index.js
   # Then open index.html in your browser
   ```

4. **Access the application**
   - Open your browser and go to `http://localhost:3000` (React version)
   - Or open `index.html` directly (Simple HTML version)

## 📱 Usage

### **Network Scanning**
1. Click on the **"Network Scanner"** tab
2. Click **"Quick Scan"** for fast scanning
3. Click **"Deep Scan"** for comprehensive scanning
4. Use **"Custom Scan"** for specific IP ranges and ports

### **Speed Monitoring**
1. Speed monitoring starts automatically when the page loads
2. View real-time download/upload speeds
3. Monitor 5-minute averages
4. Watch the live speed chart
5. Click **"Stop Speed Monitoring"** to pause

### **System Information**
1. Click on the **"System Info"** tab
2. View real-time system statistics
3. Monitor network interfaces
4. Track active connections

## 🛠️ Technology Stack

### **Backend**
- **Node.js** with Express.js
- **Socket.io** for real-time communication
- **Custom network monitoring** for speed tracking
- **System information APIs**

### **Frontend**
- **HTML5** with modern CSS
- **JavaScript (ES6+)** for interactivity
- **Canvas API** for speed charts
- **WebSocket** for real-time updates

## 📊 API Endpoints

### **Network Information**
- `GET /api/network-info` - Get current system and network information
- `GET /api/network-speed` - Get real-time network speed data

### **Network Scanning**
- `POST /api/scan-network` - Initiate network scan
- `POST /api/speed-monitoring` - Start/stop speed monitoring

### **Example API Usage**
```javascript
// Get network information
fetch('http://localhost:5000/api/network-info')
  .then(response => response.json())
  .then(data => console.log(data));

// Start speed monitoring
fetch('http://localhost:5000/api/speed-monitoring', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'start' })
});
```

## 🔧 Configuration

### **Speed Monitoring Settings**
```javascript
// In index.html, modify these variables:
let autoStartDelay = 2000; // Auto-start delay in milliseconds
let speedPollingInterval = 2000; // Update interval in milliseconds
```

### **Scan Presets**
The application includes several scan presets:
- **Local Network**: 192.168.1.0/24 with common ports
- **Web Services**: HTTP/HTTPS ports only
- **SSH Only**: Port 22 scanning
- **Database Ports**: Common database service ports
- **Full Scan**: Complete port range scan

## 📁 Project Structure

```
network_scanner/
├── server/
│   ├── index.js                    # Main server file
│   └── services/
│       ├── networkSpeedMonitor.js  # Speed monitoring service
│       └── systemInfo.js          # System information service
├── client/                         # React frontend (optional)
├── index.html                     # Main web application
├── package.json                   # Backend dependencies
├── start-with-speed-monitoring.bat # Windows startup script
└── README.md                      # This file
```

## 🚨 Security Considerations

⚠️ **Important Security Notes:**
- This tool performs network scanning which may be detected by security systems
- Only scan networks you own or have explicit permission to scan
- Some features require administrator/root privileges
- Be aware of your organization's network policies

## 📝 License

This project is for educational and personal use.

## 🆘 Troubleshooting

### **Common Issues**

1. **Port already in use**
   ```bash
   # Find what's using the port
   netstat -ano | findstr :5000
   # Kill the process
   taskkill /PID <PID_NUMBER> /F
   ```

2. **Permission denied errors**
   - Run with administrator privileges on Windows
   - Use `sudo` on Unix-like systems

3. **Speed monitoring not working**
   - Ensure the backend server is running
   - Check browser console for errors
   - Verify network connectivity

### **Performance Tips**
- Use smaller IP ranges for faster scans
- Limit port ranges to necessary ports only
- Consider network latency when scanning remote networks
- Monitor system resources during large scans

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review the API documentation

---

**Note**: This application is for educational and authorized network administration purposes only. Always ensure you have proper authorization before scanning any network.

## 🎯 Roadmap

- [ ] Add more network scanning protocols
- [ ] Implement network topology visualization
- [ ] Add alerting system for network changes
- [ ] Create mobile app version
- [ ] Add database storage for historical data
- [ ] Implement user authentication
- [ ] Add more detailed port scanning options

---

Made with ❤️ for network administrators and security professionals.