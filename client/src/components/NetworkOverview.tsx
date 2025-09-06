import React from 'react';
import { NetworkData } from '../types';
import { Wifi, WifiOff, Clock, Users } from 'lucide-react';

interface NetworkOverviewProps {
  networkData: NetworkData | null;
}

const NetworkOverview: React.FC<NetworkOverviewProps> = ({ networkData }) => {
  if (!networkData) {
    return (
      <div className="bg-dark-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-dark-100">Network Overview</h2>
        <div className="text-center py-8">
          <WifiOff className="mx-auto h-12 w-12 text-dark-400 mb-4" />
          <p className="text-dark-400">No network scan data available</p>
        </div>
      </div>
    );
  }

  const { totalHosts, aliveHosts, scanTime } = networkData;
  const offlineHosts = totalHosts - aliveHosts;

  const stats = [
    {
      label: 'Total Hosts',
      value: totalHosts,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Online Hosts',
      value: aliveHosts,
      icon: Wifi,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Offline Hosts',
      value: offlineHosts,
      icon: WifiOff,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      label: 'Last Scan',
      value: new Date(scanTime).toLocaleTimeString(),
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    }
  ];

  return (
    <div className="bg-dark-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6 text-dark-100">Network Overview</h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-dark-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-dark-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-dark-100">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Network Health Indicator */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-dark-400">Network Health</span>
          <span className="text-sm font-medium text-dark-200">
            {aliveHosts > 0 ? `${Math.round((aliveHosts / totalHosts) * 100)}%` : '0%'}
          </span>
        </div>
        <div className="w-full bg-dark-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${aliveHosts > 0 ? (aliveHosts / totalHosts) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default NetworkOverview;
