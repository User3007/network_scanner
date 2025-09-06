@echo off 
echo Creating server files... 
 
REM Create server/index.js 
( 
const express = require('express'); 
const cors = require('cors'); 
const http = require('http'); 
const socketIo = require('socket.io'); 
const { getSystemInfo } = require('./services/systemInfo'); 
 
const app = express(); 
const server = http.createServer(app); 
const io = socketIo(server, { 
  cors: { 
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"] 
  } 
}); 
 
const PORT = process.env.PORT || 5000; 
 
// Middleware 
app.use(cors()); 
app.use(express.json()); 
 
// Routes 
app.get('/api/network-info', async (req, res) => { 
  try { 
    const networkInfo = await getSystemInfo(); 
    res.json(networkInfo); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}); 
 
app.post('/api/scan-network', async (req, res) => { 
  try { 
    const { ipRange, ports } = req.body; 
    const scanResults = await mockNetworkScan(ipRange, ports); 
    res.json(scanResults); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}); 
 
// Mock network scan function 
async function mockNetworkScan(ipRange = '192.168.1.0/24', ports = '1-1000') { 
  const mockHosts = [ 
    { 
      ip: '192.168.1.1', 
      state: 'up', 
      hostname: 'router.local', 
      macAddress: '00:11:22:33:44:55', 
      openPorts: [ 
        { port: 80, protocol: 'tcp', service: 'http', state: 'open' }, 
        { port: 443, protocol: 'tcp', service: 'https', state: 'open' } 
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
  ]; 
 
  return { 
    scanTime: new Date().toISOString(), 
    totalHosts: 254, 
    aliveHosts: mockHosts.length, 
    hosts: mockHosts 
  }; 
} 
 
// Socket.io for real-time updates 
io.on('connection', (socket) => { 
  console.log('Client connected'); 
 
  socket.on('start-monitoring', async () => { 
    console.log('Starting network monitoring'); 
    const monitoringInterval = setInterval(async () => { 
      try { 
        const networkInfo = await getSystemInfo(); 
        socket.emit('network-update', networkInfo); 
      } catch (error) { 
        socket.emit('error', { message: error.message }); 
      } 
    }, 5000); 
 
    socket.on('disconnect', () => { 
      clearInterval(monitoringInterval); 
      console.log('Client disconnected'); 
    }); 
  }); 
}); 
 
server.listen(PORT, () => { 
  console.log(`Server running on port ${PORT}`); 
}); 
) 
 
REM Create server/services/systemInfo.js 
( 
const os = require('os'); 
 
async function getSystemInfo() { 
  try { 
    const networkInterfaces = os.networkInterfaces(); 
    const systemInfo = { 
      timestamp: new Date().toISOString(), 
      hostname: os.hostname(), 
      platform: os.platform(), 
      architecture: os.arch(), 
      uptime: os.uptime(), 
      totalMemory: os.totalmem(), 
      freeMemory: os.freemem(), 
      cpuInfo: os.cpus(), 
      networkInterfaces: [], 
      networkStats: { 
        bytesReceived: Math.floor(Math.random() * 1000000), 
        bytesSent: Math.floor(Math.random() * 1000000), 
        packetsReceived: Math.floor(Math.random() * 10000), 
        packetsSent: Math.floor(Math.random() * 10000), 
        errors: 0 
      }, 
      activeConnections: [ 
        { 
          protocol: 'tcp', 
          localAddress: '0.0.0.0:80', 
          foreignAddress: '0.0.0.0:0', 
          state: 'LISTENING', 
          timestamp: new Date().toISOString() 
        } 
      ] 
    }; 
 
    for (const [name, interfaces] of Object.entries(networkInterfaces)) { 
      for (const iface of interfaces) { 
          systemInfo.networkInterfaces.push({ 
            name: name, 
            address: iface.address, 
            netmask: iface.netmask, 
            mac: iface.mac, 
            family: iface.family, 
            internal: iface.internal, 
            cidr: getCIDR(iface.address, iface.netmask) 
          }); 
        } 
      } 
    } 
 
    return systemInfo; 
  } catch (error) { 
    throw new Error(`Failed to get system info: ${error.message}`); 
  } 
} 
 
function getCIDR(address, netmask) { 
  const ip = address.split('.').map(Number); 
  const mask = netmask.split('.').map(Number); 
 
  let cidr = 0; 
  for (let i = 0; i < 4; i++) { 
    cidr += (mask[i] >>> 0).toString(2).split('1').length - 1; 
  } 
 
  return `${address}/${cidr}`; 
} 
 
module.exports = { 
  getSystemInfo 
}; 
) 
 
echo Server files created successfully! 
pause 
