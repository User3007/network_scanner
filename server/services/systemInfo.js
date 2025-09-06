const os = require('os'); 
 
async function getSystemInfo() { 
  return { 
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
    activeConnections: [] 
  }; 
} 
 
module.exports = { getSystemInfo }; 
