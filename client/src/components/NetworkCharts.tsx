import React from 'react';
import { SystemData } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface NetworkChartsProps {
  systemData: SystemData;
}

const NetworkCharts: React.FC<NetworkChartsProps> = ({ systemData }) => {
  const { networkStats, networkInterfaces } = systemData;

  // Mock data for demonstration - in a real app, you'd collect this over time
  const networkTrafficData = [
    { time: '00:00', bytesIn: 1200, bytesOut: 800 },
    { time: '04:00', bytesIn: 1500, bytesOut: 1200 },
    { time: '08:00', bytesIn: 3000, bytesOut: 2500 },
    { time: '12:00', bytesIn: 4500, bytesOut: 3800 },
    { time: '16:00', bytesIn: 5200, bytesOut: 4200 },
    { time: '20:00', bytesIn: 3800, bytesOut: 3200 },
  ];

  const interfaceData = networkInterfaces.map(iface => ({
    name: iface.name,
    address: iface.address,
    cidr: iface.cidr,
    internal: iface.internal ? 'Internal' : 'External'
  }));

  const memoryData = [
    { name: 'Used', value: systemData.totalMemory - systemData.freeMemory, color: '#ef4444' },
    { name: 'Free', value: systemData.freeMemory, color: '#10b981' }
  ];

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Network Traffic Chart */}
      <div className="bg-dark-700 rounded-lg p-4">
        <h3 className="text-lg font-medium text-dark-100 mb-4">Network Traffic</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={networkTrafficData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#f3f4f6'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="bytesIn" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Bytes In"
            />
            <Line 
              type="monotone" 
              dataKey="bytesOut" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Bytes Out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Memory Usage Chart */}
      <div className="bg-dark-700 rounded-lg p-4">
        <h3 className="text-lg font-medium text-dark-100 mb-4">Memory Usage</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={memoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {memoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => formatBytes(value)}
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#f3f4f6'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center">
          <p className="text-sm text-dark-400">
            Total: {formatBytes(systemData.totalMemory)}
          </p>
        </div>
      </div>

      {/* Network Interfaces */}
      <div className="bg-dark-700 rounded-lg p-4">
        <h3 className="text-lg font-medium text-dark-100 mb-4">Network Interfaces</h3>
        <div className="space-y-3">
          {interfaceData.map((iface, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-dark-600 rounded-lg">
              <div>
                <p className="font-medium text-dark-100">{iface.name}</p>
                <p className="text-sm text-dark-400">{iface.address} ({iface.cidr})</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                iface.internal === 'Internal' 
                  ? 'bg-yellow-500/20 text-yellow-400' 
                  : 'bg-green-500/20 text-green-400'
              }`}>
                {iface.internal}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Network Stats */}
      <div className="bg-dark-700 rounded-lg p-4">
        <h3 className="text-lg font-medium text-dark-100 mb-4">Network Statistics</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-dark-400">Bytes Received:</span>
            <span className="text-dark-100 font-mono">{formatBytes(networkStats.bytesReceived)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-dark-400">Bytes Sent:</span>
            <span className="text-dark-100 font-mono">{formatBytes(networkStats.bytesSent)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-dark-400">Packets Received:</span>
            <span className="text-dark-100 font-mono">{networkStats.packetsReceived.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-dark-400">Packets Sent:</span>
            <span className="text-dark-100 font-mono">{networkStats.packetsSent.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-dark-400">Errors:</span>
            <span className="text-red-400 font-mono">{networkStats.errors}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkCharts;
