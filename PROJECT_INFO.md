# Network Scanner - Local Project

## 📁 Project Structure

```
network_scanner/
├── server/                          # Backend server files
│   ├── index.js                    # Main server file
│   └── services/                   # Server services
│       ├── networkSpeedMonitor.js  # Speed monitoring service
│       ├── networkScanner.js       # Network scanning service
│       └── systemInfo.js          # System information service
├── client/                         # React frontend (optional)
│   ├── src/                       # React source files
│   ├── public/                    # Public assets
│   └── package.json              # Frontend dependencies
├── index.html                     # Main web application
├── package.json                   # Backend dependencies
├── start-with-speed-monitoring.bat # Windows startup script
├── setup.bat                      # Windows setup script
├── setup.sh                       # Unix setup script
└── demo.html                      # Demo page
```

## 🚀 Quick Start

1. **Start the application:**
   ```cmd
   start-with-speed-monitoring.bat
   ```

2. **Or manually:**
   ```cmd
   node server/index.js
   start index.html
   ```

## ✨ Features

- Real-time network speed monitoring
- Network device scanning
- System information dashboard
- Interactive speed charts
- Auto-start monitoring
- Modern dark theme UI

## 🔧 Configuration

- Modify `autoStartDelay` in `index.html` to change auto-start timing
- Edit scan presets in the Network Scanner section
- Customize speed monitoring intervals in the backend

## 📱 Usage

1. **Speed Monitoring**: Starts automatically when page loads
2. **Network Scanning**: Click "Scan Network" to discover devices
3. **System Info**: View real-time system statistics
4. **Charts**: Watch live speed graphs update

## 🛠️ Development

- Backend: Node.js with Express
- Frontend: HTML5, CSS3, JavaScript
- Real-time: WebSocket communication
- Charts: Canvas API for speed visualization

This is a local development project for network monitoring and analysis.

