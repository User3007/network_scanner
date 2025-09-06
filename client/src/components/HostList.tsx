import React, { useState } from 'react';
import { Host } from '../types';
import { Wifi, WifiOff, ChevronDown, ChevronRight, Server, Shield } from 'lucide-react';

interface HostListProps {
  hosts: Host[];
}

const HostList: React.FC<HostListProps> = ({ hosts }) => {
  const [expandedHosts, setExpandedHosts] = useState<Set<string>>(new Set());

  const toggleExpanded = (ip: string) => {
    const newExpanded = new Set(expandedHosts);
    if (newExpanded.has(ip)) {
      newExpanded.delete(ip);
    } else {
      newExpanded.add(ip);
    }
    setExpandedHosts(newExpanded);
  };

  const formatLastSeen = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusIcon = (host: Host) => {
    if (host.state === 'up') {
      return <Wifi className="h-4 w-4 text-green-500" />;
    }
    return <WifiOff className="h-4 w-4 text-red-500" />;
  };

  const getStatusColor = (host: Host) => {
    if (host.state === 'up') {
      return 'text-green-500 bg-green-500/10';
    }
    return 'text-red-500 bg-red-500/10';
  };

  return (
    <div className="space-y-2">
      {hosts.length === 0 ? (
        <div className="text-center py-8 text-dark-400">
          <Server className="mx-auto h-12 w-12 mb-4" />
          <p>No hosts discovered</p>
        </div>
      ) : (
        hosts.map((host) => {
          const isExpanded = expandedHosts.has(host.ip);
          return (
            <div key={host.ip} className="bg-dark-700 rounded-lg border border-dark-600">
              <div 
                className="p-4 cursor-pointer hover:bg-dark-600 transition-colors"
                onClick={() => toggleExpanded(host.ip)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(host)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-dark-100">{host.ip}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(host)}`}>
                          {host.state.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-dark-400">{host.hostname}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-dark-400">Last seen</p>
                      <p className="text-sm text-dark-200">{formatLastSeen(host.lastSeen)}</p>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-dark-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-dark-400" />
                    )}
                  </div>
                </div>
              </div>
              
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-dark-600">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="text-sm font-medium text-dark-300 mb-2">Host Information</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-dark-400">MAC Address:</span>
                          <span className="text-dark-200 font-mono">{host.macAddress}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-dark-400">Hostname:</span>
                          <span className="text-dark-200">{host.hostname}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-dark-300 mb-2">Open Ports ({host.openPorts.length})</h4>
                      {host.openPorts.length > 0 ? (
                        <div className="space-y-1">
                          {host.openPorts.slice(0, 5).map((port, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Shield className="h-3 w-3 text-yellow-500" />
                              <span className="text-sm text-dark-200">
                                {port.port}/{port.protocol} ({port.service})
                              </span>
                            </div>
                          ))}
                          {host.openPorts.length > 5 && (
                            <p className="text-xs text-dark-400">
                              +{host.openPorts.length - 5} more ports
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-dark-400">No open ports detected</p>
                      )}
                    </div>
                  </div>
                  
                  {host.error && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-sm text-red-400">Error: {host.error}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default HostList;
