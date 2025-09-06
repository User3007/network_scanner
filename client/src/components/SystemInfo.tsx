import React from 'react';
import { SystemData } from '../types';
import SystemStats from './SystemStats';
import NetworkCharts from './NetworkCharts';
import ActiveConnections from './ActiveConnections';

interface SystemInfoProps {
  systemData: SystemData | null;
}

const SystemInfo: React.FC<SystemInfoProps> = ({ systemData }) => {
  if (!systemData) {
    return (
      <div className="space-y-6">
        <div className="bg-dark-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-dark-100">System Information</h2>
          <div className="text-center py-12">
            <div className="text-dark-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-dark-200 mb-2">No System Data Available</h3>
            <p className="text-dark-400">System information will appear here when available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SystemStats systemData={systemData} />
        </div>
        
        {/* Network Interfaces */}
        <div className="bg-dark-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-dark-100">Network Interfaces</h2>
          <div className="space-y-3">
            {systemData.networkInterfaces.map((iface, index) => (
              <div key={index} className="p-4 bg-dark-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-dark-100">{iface.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    iface.internal 
                      ? 'bg-yellow-500/20 text-yellow-400' 
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {iface.internal ? 'Internal' : 'External'}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-dark-400">Address:</span>
                    <span className="text-dark-200 font-mono">{iface.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Netmask:</span>
                    <span className="text-dark-200 font-mono">{iface.netmask}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">MAC:</span>
                    <span className="text-dark-200 font-mono">{iface.mac}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">CIDR:</span>
                    <span className="text-dark-200 font-mono">{iface.cidr}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Network Statistics and Charts */}
      <div className="bg-dark-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-dark-100">Network Statistics</h2>
        <NetworkCharts systemData={systemData} />
      </div>

      {/* Active Connections */}
      <div className="bg-dark-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-dark-100">Active Connections</h2>
        <ActiveConnections connections={systemData.activeConnections} />
      </div>
    </div>
  );
};

export default SystemInfo;
