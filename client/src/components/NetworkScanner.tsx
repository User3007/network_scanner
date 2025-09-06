import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import { NetworkData, ScanOptions } from '../types';
import { Play, Square, Settings, Wifi, Search } from 'lucide-react';

interface NetworkScannerProps {
  onScanComplete: (data: NetworkData) => void;
  socket: Socket | null;
}

const NetworkScanner: React.FC<NetworkScannerProps> = ({ onScanComplete, socket }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanOptions, setScanOptions] = useState<ScanOptions>({
    ipRange: '192.168.1.0/24',
    ports: '1-1000'
  });
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLog, setScanLog] = useState<string[]>([]);

  const addLogMessage = (message: string) => {
    setScanLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const startScan = async () => {
    if (isScanning) return;

    setIsScanning(true);
    setScanProgress(0);
    setScanLog([]);
    addLogMessage('Starting network scan...');

    try {
      const response = await fetch('/api/scan-network', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scanOptions),
      });

      if (!response.ok) {
        throw new Error('Scan failed');
      }

      const data = await response.json();
      addLogMessage(`Scan completed. Found ${data.aliveHosts} alive hosts out of ${data.totalHosts} total.`);
      onScanComplete(data);
    } catch (error) {
      addLogMessage(`Scan failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsScanning(false);
      setScanProgress(100);
    }
  };

  const stopScan = () => {
    setIsScanning(false);
    addLogMessage('Scan stopped by user');
  };

  const quickScan = async () => {
    setScanOptions(prev => ({ ...prev, ipRange: '192.168.1.0/24', ports: '1-1000' }));
    await startScan();
  };

  const deepScan = async () => {
    setScanOptions(prev => ({ ...prev, ipRange: '192.168.1.0/24', ports: '1-65535' }));
    await startScan();
  };

  return (
    <div className="space-y-6">
      {/* Scan Controls */}
      <div className="bg-dark-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-dark-100">Network Scanner</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-sm text-dark-400">
              {isScanning ? 'Scanning...' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={quickScan}
            disabled={isScanning}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Search className="h-4 w-4" />
            <span>Quick Scan</span>
          </button>
          
          <button
            onClick={deepScan}
            disabled={isScanning}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Wifi className="h-4 w-4" />
            <span>Deep Scan</span>
          </button>
          
          <button
            onClick={isScanning ? stopScan : startScan}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
              isScanning
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isScanning ? (
              <>
                <Square className="h-4 w-4" />
                <span>Stop Scan</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Start Scan</span>
              </>
            )}
          </button>
        </div>

        {/* Scan Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              IP Range
            </label>
            <input
              type="text"
              value={scanOptions.ipRange}
              onChange={(e) => setScanOptions(prev => ({ ...prev, ipRange: e.target.value }))}
              placeholder="192.168.1.0/24"
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isScanning}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Port Range
            </label>
            <input
              type="text"
              value={scanOptions.ports}
              onChange={(e) => setScanOptions(prev => ({ ...prev, ports: e.target.value }))}
              placeholder="1-1000"
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isScanning}
            />
          </div>
        </div>

        {/* Progress Bar */}
        {isScanning && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-dark-400">Scan Progress</span>
              <span className="text-sm text-dark-200">{scanProgress}%</span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Scan Log */}
      <div className="bg-dark-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dark-100">Scan Log</h3>
          <button
            onClick={() => setScanLog([])}
            className="text-sm text-dark-400 hover:text-dark-200 transition-colors"
          >
            Clear Log
          </button>
        </div>
        
        <div className="bg-dark-900 rounded-lg p-4 h-64 overflow-y-auto">
          {scanLog.length === 0 ? (
            <p className="text-dark-400 text-center py-8">No scan activity yet</p>
          ) : (
            <div className="space-y-1">
              {scanLog.map((log, index) => (
                <div key={index} className="text-sm font-mono text-dark-300">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preset Configurations */}
      <div className="bg-dark-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-dark-100 mb-4">Preset Configurations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Local Network', ipRange: '192.168.1.0/24', ports: '1-1000' },
            { name: 'Common Ports', ipRange: '192.168.1.0/24', ports: '22,23,25,53,80,110,143,443,993,995' },
            { name: 'Web Services', ipRange: '192.168.1.0/24', ports: '80,443,8080,8443' },
            { name: 'SSH Only', ipRange: '192.168.1.0/24', ports: '22' },
            { name: 'Database Ports', ipRange: '192.168.1.0/24', ports: '1433,3306,5432,6379,27017' },
            { name: 'Full Scan', ipRange: '192.168.1.0/24', ports: '1-65535' }
          ].map((preset, index) => (
            <button
              key={index}
              onClick={() => setScanOptions({ ipRange: preset.ipRange, ports: preset.ports })}
              disabled={isScanning}
              className="p-3 text-left bg-dark-700 hover:bg-dark-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <div className="font-medium text-dark-100">{preset.name}</div>
              <div className="text-sm text-dark-400 mt-1">
                {preset.ipRange} - {preset.ports}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NetworkScanner;
