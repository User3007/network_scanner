import React, { useState } from 'react';
import { Connection } from '../types';
import { ChevronDown, ChevronRight, Globe, Server, Shield } from 'lucide-react';

interface ActiveConnectionsProps {
  connections: Connection[];
}

const ActiveConnections: React.FC<ActiveConnectionsProps> = ({ connections }) => {
  const [expandedConnections, setExpandedConnections] = useState<Set<number>>(new Set());

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedConnections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedConnections(newExpanded);
  };

  const getProtocolIcon = (protocol: string) => {
    switch (protocol.toLowerCase()) {
      case 'tcp':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'udp':
        return <Globe className="h-4 w-4 text-green-500" />;
      default:
        return <Server className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStateColor = (state: string) => {
    switch (state.toLowerCase()) {
      case 'established':
        return 'text-green-500 bg-green-500/10';
      case 'listening':
        return 'text-blue-500 bg-blue-500/10';
      case 'time_wait':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'close_wait':
        return 'text-orange-500 bg-orange-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const parseAddress = (address: string) => {
    const [ip, port] = address.split(':');
    return { ip, port: port || 'N/A' };
  };

  if (connections.length === 0) {
    return (
      <div className="text-center py-8">
        <Server className="mx-auto h-12 w-12 text-dark-400 mb-4" />
        <p className="text-dark-400">No active connections found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {connections.map((connection, index) => {
        const isExpanded = expandedConnections.has(index);
        const localAddr = parseAddress(connection.localAddress);
        const foreignAddr = parseAddress(connection.foreignAddress);

        return (
          <div key={index} className="bg-dark-700 rounded-lg border border-dark-600">
            <div 
              className="p-4 cursor-pointer hover:bg-dark-600 transition-colors"
              onClick={() => toggleExpanded(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getProtocolIcon(connection.protocol)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-dark-100">
                        {connection.protocol.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStateColor(connection.state)}`}>
                        {connection.state.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-dark-400">
                      {localAddr.ip}:{localAddr.port} → {foreignAddr.ip}:{foreignAddr.port}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-dark-400">Last seen</p>
                    <p className="text-sm text-dark-200">{formatTimestamp(connection.timestamp)}</p>
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
                    <h4 className="text-sm font-medium text-dark-300 mb-2">Local Address</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-dark-400">IP:</span>
                        <span className="text-dark-200 font-mono">{localAddr.ip}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-dark-400">Port:</span>
                        <span className="text-dark-200 font-mono">{localAddr.port}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-dark-300 mb-2">Foreign Address</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-dark-400">IP:</span>
                        <span className="text-dark-200 font-mono">{foreignAddr.ip}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-dark-400">Port:</span>
                        <span className="text-dark-200 font-mono">{foreignAddr.port}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-dark-600">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-dark-400">Protocol:</span>
                      <span className="ml-2 text-dark-200 font-mono">{connection.protocol}</span>
                    </div>
                    <div>
                      <span className="text-dark-400">State:</span>
                      <span className="ml-2 text-dark-200">{connection.state}</span>
                    </div>
                    <div>
                      <span className="text-dark-400">Timestamp:</span>
                      <span className="ml-2 text-dark-200">{formatTimestamp(connection.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ActiveConnections;
