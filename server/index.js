const express = require('express'); 
const cors = require('cors'); 
const http = require('http'); 
const socketIo = require('socket.io'); 
const os = require('os');
const { networkSpeedMonitor } = require('./services/networkSpeedMonitor');

const app = express(); 
const server = http.createServer(app); 
const io = socketIo(server, { 
  cors: { 
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"] 
  } 
}); 

const PORT = process.env.PORT || 5000; 

// Initialize network speed monitoring
const speedMonitor = new networkSpeedMonitor();

app.use(cors()); 
app.use(express.json()); 

// Get real-time network information
app.get('/api/network-info', async (req, res) => { 
  try {
    const networkInfo = await speedMonitor.getNetworkInfo();
    res.json(networkInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get network speed data
app.get('/api/network-speed', async (req, res) => {
  try {
    const speedData = await speedMonitor.getSpeedData();
    res.json(speedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start/stop speed monitoring
app.post('/api/speed-monitoring', (req, res) => {
  const { action } = req.body;
  
  if (action === 'start') {
    speedMonitor.startMonitoring();
    res.json({ message: 'Speed monitoring started' });
  } else if (action === 'stop') {
    speedMonitor.stopMonitoring();
    res.json({ message: 'Speed monitoring stopped' });
  } else {
    res.status(400).json({ error: 'Invalid action. Use "start" or "stop"' });
  }
}); 
 
app.post('/api/scan-network', (req, res) => { 
  res.json({ 
    scanTime: new Date().toISOString(), 
    totalHosts: 254, 
    aliveHosts: 3, 
    hosts: [ 
      { 
        ip: '192.168.1.1', 
        state: 'up', 
        hostname: 'router.local', 
        macAddress: '00:11:22:33:44:55', 
        openPorts: [ 
          { port: 80, protocol: 'tcp', service: 'http', state: 'open' } 
        ], 
        lastSeen: new Date().toISOString() 
      }, 
      { 
        ip: '192.168.1.100', 
        state: 'up', 
        hostname: 'desktop-pc', 
        macAddress: 'AA:BB:CC:DD:EE:FF', 
        openPorts: [ 
          { port: 22, protocol: 'tcp', service: 'ssh', state: 'open' } 
        ], 
        lastSeen: new Date().toISOString() 
      } 
    ] 
  }); 
}); 
 
io.on('connection', (socket) => { 
  console.log('Client connected'); 
  
  socket.on('start-monitoring', () => { 
    console.log('Starting network monitoring');
    speedMonitor.startMonitoring();
    
    // Send real-time updates every 2 seconds
    const updateInterval = setInterval(async () => {
      try {
        const networkInfo = await speedMonitor.getNetworkInfo();
        const speedData = await speedMonitor.getSpeedData();
        socket.emit('network-update', { networkInfo, speedData });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    }, 2000);
    
    socket.on('disconnect', () => {
      clearInterval(updateInterval);
      console.log('Client disconnected');
    });
  });
  
  socket.on('stop-monitoring', () => {
    speedMonitor.stopMonitoring();
    console.log('Network monitoring stopped');
  });
}); 
 
server.listen(PORT, () => { 
  console.log(`Server running on port ${PORT}`); 
}); 
