const nmap = require('node-nmap');
const ping = require('ping');
const os = require('os');

class NetworkScanner {
  constructor() {
    this.scanning = false;
  }

  async scanNetwork(ipRange = null, ports = '1-1000') {
    if (this.scanning) {
      throw new Error('Scan already in progress');
    }

    this.scanning = true;
    
    try {
      // Get local network range if not provided
      if (!ipRange) {
        ipRange = this.getLocalNetworkRange();
      }

      console.log(`Scanning network: ${ipRange}`);
      
      // Use nmap for comprehensive scanning
      const quickscan = new nmap.QuickScan(ipRange, ports);
      
      return new Promise((resolve, reject) => {
        quickscan.on('complete', (data) => {
          this.scanning = false;
          const results = this.processScanResults(data);
          resolve(results);
        });

        quickscan.on('error', (error) => {
          this.scanning = false;
          reject(error);
        });

        quickscan.startScan();
      });
    } catch (error) {
      this.scanning = false;
      throw error;
    }
  }

  async scanPorts(ip, portRange = '1-1000') {
    try {
      const quickscan = new nmap.QuickScan(ip, portRange);
      
      return new Promise((resolve, reject) => {
        quickscan.on('complete', (data) => {
          const results = this.processScanResults(data);
          resolve(results);
        });

        quickscan.on('error', (error) => {
          reject(error);
        });

        quickscan.startScan();
      });
    } catch (error) {
      throw error;
    }
  }

  async pingHost(ip) {
    try {
      const result = await ping.promise.probe(ip);
      return {
        ip: ip,
        alive: result.alive,
        time: result.time,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        ip: ip,
        alive: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async scanHosts(ipRange) {
    const hosts = this.generateHostList(ipRange);
    const results = [];
    
    // Ping all hosts in parallel
    const pingPromises = hosts.map(ip => this.pingHost(ip));
    const pingResults = await Promise.all(pingPromises);
    
    // Filter alive hosts and get detailed info
    const aliveHosts = pingResults.filter(host => host.alive);
    
    for (const host of aliveHosts) {
      try {
        const hostInfo = await this.getHostInfo(host.ip);
        results.push({
          ...host,
          ...hostInfo
        });
      } catch (error) {
        results.push({
          ...host,
          error: error.message
        });
      }
    }
    
    return results;
  }

  async getHostInfo(ip) {
    try {
      // Get hostname
      const hostname = await this.getHostname(ip);
      
      // Get MAC address (if possible)
      const macAddress = await this.getMacAddress(ip);
      
      // Get open ports
      const openPorts = await this.getOpenPorts(ip);
      
      return {
        hostname: hostname || 'Unknown',
        macAddress: macAddress || 'Unknown',
        openPorts: openPorts,
        lastSeen: new Date().toISOString()
      };
    } catch (error) {
      return {
        hostname: 'Unknown',
        macAddress: 'Unknown',
        openPorts: [],
        error: error.message
      };
    }
  }

  async getHostname(ip) {
    try {
      const { promisify } = require('util');
      const dns = require('dns');
      const reverse = promisify(dns.reverse);
      const hostnames = await reverse(ip);
      return hostnames[0] || null;
    } catch (error) {
      return null;
    }
  }

  async getMacAddress(ip) {
    // This is a simplified version - in practice, you'd need platform-specific implementations
    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);
      
      const platform = os.platform();
      let command;
      
      if (platform === 'win32') {
        command = `arp -a ${ip}`;
      } else {
        command = `arp -n ${ip}`;
      }
      
      const { stdout } = await execAsync(command);
      const macMatch = stdout.match(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/);
      return macMatch ? macMatch[0] : null;
    } catch (error) {
      return null;
    }
  }

  async getOpenPorts(ip) {
    try {
      const quickscan = new nmap.QuickScan(ip, '1-1000');
      
      return new Promise((resolve) => {
        quickscan.on('complete', (data) => {
          const openPorts = [];
          if (data && data.length > 0) {
            data.forEach(host => {
              if (host.openPorts) {
                host.openPorts.forEach(port => {
                  openPorts.push({
                    port: port.port,
                    protocol: port.protocol,
                    service: port.service || 'Unknown',
                    state: port.state
                  });
                });
              }
            });
          }
          resolve(openPorts);
        });

        quickscan.on('error', () => {
          resolve([]);
        });

        quickscan.startScan();
      });
    } catch (error) {
      return [];
    }
  }

  processScanResults(data) {
    const results = {
      scanTime: new Date().toISOString(),
      totalHosts: 0,
      aliveHosts: 0,
      hosts: []
    };

    if (data && data.length > 0) {
      data.forEach(host => {
        results.totalHosts++;
        if (host.state === 'up') {
          results.aliveHosts++;
        }
        
        results.hosts.push({
          ip: host.ip,
          state: host.state,
          hostname: host.hostname || 'Unknown',
          macAddress: host.mac || 'Unknown',
          openPorts: host.openPorts || [],
          lastSeen: new Date().toISOString()
        });
      });
    }

    return results;
  }

  getLocalNetworkRange() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          const ip = iface.address;
          const subnet = ip.substring(0, ip.lastIndexOf('.'));
          return `${subnet}.0/24`;
        }
      }
    }
    return '192.168.1.0/24'; // Default fallback
  }

  generateHostList(ipRange) {
    const hosts = [];
    const [network, prefix] = ipRange.split('/');
    const [a, b, c, d] = network.split('.').map(Number);
    
    if (prefix === '24') {
      for (let i = 1; i <= 254; i++) {
        hosts.push(`${a}.${b}.${c}.${i}`);
      }
    }
    
    return hosts;
  }
}

module.exports = {
  networkScanner: new NetworkScanner()
};


