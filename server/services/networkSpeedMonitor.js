const os = require('os');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class NetworkSpeedMonitor {
  constructor() {
    this.isMonitoring = false;
    this.previousStats = null;
    this.speedHistory = [];
    this.maxHistoryLength = 100; // Keep last 100 measurements
    this.monitoringInterval = null;
  }

  async getNetworkInfo() {
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
        networkStats: await this.getNetworkStats(),
        activeConnections: await this.getActiveConnections()
      };

      // Process network interfaces
      for (const [name, interfaces] of Object.entries(networkInterfaces)) {
        for (const iface of interfaces) {
          if (iface.family === 'IPv4' && !iface.internal) {
            systemInfo.networkInterfaces.push({
              name: name,
              address: iface.address,
              netmask: iface.netmask,
              mac: iface.mac,
              family: iface.family,
              internal: iface.internal,
              cidr: this.getCIDR(iface.address, iface.netmask)
            });
          }
        }
      }

      return systemInfo;
    } catch (error) {
      throw new Error(`Failed to get network info: ${error.message}`);
    }
  }

  async getNetworkStats() {
    try {
      const platform = os.platform();
      let command;
      
      if (platform === 'win32') {
        command = 'netstat -e';
      } else {
        command = 'cat /proc/net/dev';
      }
      
      const { stdout } = await execAsync(command);
      return this.parseNetworkStats(stdout, platform);
    } catch (error) {
      return {
        bytesReceived: 0,
        bytesSent: 0,
        packetsReceived: 0,
        packetsSent: 0,
        errors: 0
      };
    }
  }

  parseNetworkStats(output, platform) {
    const stats = {
      bytesReceived: 0,
      bytesSent: 0,
      packetsReceived: 0,
      packetsSent: 0,
      errors: 0
    };

    if (platform === 'win32') {
      const lines = output.split('\n');
      for (const line of lines) {
        if (line.includes('Bytes')) {
          const parts = line.trim().split(/\s+/);
          if (parts.length >= 2) {
            stats.bytesReceived = parseInt(parts[0]) || 0;
            stats.bytesSent = parseInt(parts[1]) || 0;
          }
        }
      }
    }

    return stats;
  }

  async getActiveConnections() {
    try {
      const platform = os.platform();
      let command;
      
      if (platform === 'win32') {
        command = 'netstat -an';
      } else {
        command = 'netstat -tuln';
      }
      
      const { stdout } = await execAsync(command);
      return this.parseActiveConnections(stdout, platform);
    } catch (error) {
      return [];
    }
  }

  parseActiveConnections(output, platform) {
    const connections = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.includes('LISTEN') || line.includes('ESTABLISHED')) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 4) {
          const protocol = parts[0];
          const localAddress = parts[1];
          const foreignAddress = parts[2];
          const state = parts[3];
          
          connections.push({
            protocol,
            localAddress,
            foreignAddress,
            state,
            timestamp: new Date().toISOString()
          });
        }
      }
    }
    
    return connections;
  }

  async getSpeedData() {
    const currentStats = await this.getNetworkStats();
    const timestamp = new Date().toISOString();
    
    let speedData = {
      timestamp,
      downloadSpeed: 0,
      uploadSpeed: 0,
      downloadSpeedMbps: 0,
      uploadSpeedMbps: 0,
      isMonitoring: this.isMonitoring,
      history: this.speedHistory.slice(-20) // Last 20 measurements
    };

    if (this.previousStats) {
      const timeDiff = 1; // 1 second interval
      
      // Calculate speed in bytes per second
      const downloadSpeed = (currentStats.bytesReceived - this.previousStats.bytesReceived) / timeDiff;
      const uploadSpeed = (currentStats.bytesSent - this.previousStats.bytesSent) / timeDiff;
      
      // Convert to Mbps
      const downloadSpeedMbps = (downloadSpeed * 8) / (1024 * 1024);
      const uploadSpeedMbps = (uploadSpeed * 8) / (1024 * 1024);
      
      speedData = {
        timestamp,
        downloadSpeed: Math.max(0, downloadSpeed),
        uploadSpeed: Math.max(0, uploadSpeed),
        downloadSpeedMbps: Math.max(0, downloadSpeedMbps),
        uploadSpeedMbps: Math.max(0, uploadSpeedMbps),
        isMonitoring: this.isMonitoring,
        history: this.speedHistory.slice(-20)
      };

      // Add to history
      this.speedHistory.push({
        timestamp,
        downloadSpeed: speedData.downloadSpeed,
        uploadSpeed: speedData.uploadSpeed,
        downloadSpeedMbps: speedData.downloadSpeedMbps,
        uploadSpeedMbps: speedData.uploadSpeedMbps
      });

      // Keep only last maxHistoryLength measurements
      if (this.speedHistory.length > this.maxHistoryLength) {
        this.speedHistory = this.speedHistory.slice(-this.maxHistoryLength);
      }
    }

    this.previousStats = { ...currentStats };
    return speedData;
  }

  startMonitoring() {
    if (!this.isMonitoring) {
      this.isMonitoring = true;
      console.log('Network speed monitoring started');
      
      // Initialize with current stats
      this.getNetworkStats().then(stats => {
        this.previousStats = stats;
      });
    }
  }

  stopMonitoring() {
    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    console.log('Network speed monitoring stopped');
  }

  getCIDR(address, netmask) {
    const ip = address.split('.').map(Number);
    const mask = netmask.split('.').map(Number);
    
    let cidr = 0;
    for (let i = 0; i < 4; i++) {
      cidr += (mask[i] >>> 0).toString(2).split('1').length - 1;
    }
    
    return `${address}/${cidr}`;
  }

  // Get average speeds over time
  getAverageSpeeds(minutes = 5) {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    const recentHistory = this.speedHistory.filter(entry => 
      new Date(entry.timestamp) > cutoffTime
    );

    if (recentHistory.length === 0) {
      return { avgDownloadMbps: 0, avgUploadMbps: 0 };
    }

    const avgDownloadMbps = recentHistory.reduce((sum, entry) => 
      sum + entry.downloadSpeedMbps, 0) / recentHistory.length;
    
    const avgUploadMbps = recentHistory.reduce((sum, entry) => 
      sum + entry.uploadSpeedMbps, 0) / recentHistory.length;

    return {
      avgDownloadMbps: Math.round(avgDownloadMbps * 100) / 100,
      avgUploadMbps: Math.round(avgUploadMbps * 100) / 100
    };
  }
}

module.exports = {
  networkSpeedMonitor: NetworkSpeedMonitor
};
