export interface Host {
  ip: string;
  state: 'up' | 'down';
  hostname: string;
  macAddress: string;
  openPorts: OpenPort[];
  lastSeen: string;
  error?: string;
}

export interface OpenPort {
  port: number;
  protocol: string;
  service: string;
  state: string;
}

export interface NetworkData {
  scanTime: string;
  totalHosts: number;
  aliveHosts: number;
  hosts: Host[];
}

export interface NetworkInterface {
  name: string;
  address: string;
  netmask: string;
  mac: string;
  family: string;
  internal: boolean;
  cidr: string;
}

export interface NetworkStats {
  bytesReceived: number;
  bytesSent: number;
  packetsReceived: number;
  packetsSent: number;
  errors: number;
}

export interface Connection {
  protocol: string;
  localAddress: string;
  foreignAddress: string;
  state: string;
  timestamp: string;
}

export interface SystemData {
  timestamp: string;
  hostname: string;
  platform: string;
  architecture: string;
  uptime: number;
  totalMemory: number;
  freeMemory: number;
  cpuInfo: any[];
  networkInterfaces: NetworkInterface[];
  networkStats: NetworkStats;
  activeConnections: Connection[];
}

export interface ScanOptions {
  ipRange?: string;
  ports?: string;
}

