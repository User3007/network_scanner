import React from 'react';
import { SystemData } from '../types';
import { Cpu, HardDrive, Clock, Server, Wifi } from 'lucide-react';

interface SystemStatsProps {
  systemData: SystemData | null;
}

const SystemStats: React.FC<SystemStatsProps> = ({ systemData }) => {
  if (!systemData) {
    return (
      <div className="bg-dark-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-dark-100">System Information</h2>
        <div className="text-center py-8">
          <Server className="mx-auto h-12 w-12 text-dark-400 mb-4" />
          <p className="text-dark-400">No system data available</p>
        </div>
      </div>
    );
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const memoryUsagePercent = ((systemData.totalMemory - systemData.freeMemory) / systemData.totalMemory) * 100;
  const cpuCount = systemData.cpuInfo.length;
  const cpuModel = systemData.cpuInfo[0]?.model || 'Unknown';

  const stats = [
    {
      label: 'Hostname',
      value: systemData.hostname,
      icon: Server,
      color: 'text-blue-500'
    },
    {
      label: 'Platform',
      value: `${systemData.platform} (${systemData.architecture})`,
      icon: HardDrive,
      color: 'text-green-500'
    },
    {
      label: 'Uptime',
      value: formatUptime(systemData.uptime),
      icon: Clock,
      color: 'text-yellow-500'
    },
    {
      label: 'CPU',
      value: `${cpuCount} cores - ${cpuModel}`,
      icon: Cpu,
      color: 'text-purple-500'
    },
    {
      label: 'Memory Usage',
      value: `${memoryUsagePercent.toFixed(1)}%`,
      icon: HardDrive,
      color: memoryUsagePercent > 80 ? 'text-red-500' : 'text-green-500'
    },
    {
      label: 'Network Interfaces',
      value: systemData.networkInterfaces.length,
      icon: Wifi,
      color: 'text-cyan-500'
    }
  ];

  return (
    <div className="bg-dark-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6 text-dark-100">System Information</h2>
      
      <div className="space-y-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="flex items-center space-x-3 p-3 bg-dark-700 rounded-lg">
              <div className={`p-2 rounded-lg bg-dark-600`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-dark-400">{stat.label}</p>
                <p className="text-sm font-medium text-dark-100 truncate">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Memory Usage Bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-dark-400">Memory Usage</span>
          <span className="text-sm font-medium text-dark-200">
            {formatBytes(systemData.totalMemory - systemData.freeMemory)} / {formatBytes(systemData.totalMemory)}
          </span>
        </div>
        <div className="w-full bg-dark-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              memoryUsagePercent > 80 ? 'bg-red-500' : 
              memoryUsagePercent > 60 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${memoryUsagePercent}%` }}
          />
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-4 pt-4 border-t border-dark-700">
        <p className="text-xs text-dark-400">
          Last updated: {new Date(systemData.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default SystemStats;
