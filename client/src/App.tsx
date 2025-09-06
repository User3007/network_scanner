import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import Dashboard from './components/Dashboard';
import NetworkScanner from './components/NetworkScanner';
import SystemInfo from './components/SystemInfo';
import Header from './components/Header';
import { NetworkData, SystemData } from './types';

const App: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [systemData, setSystemData] = useState<SystemData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scanner' | 'system'>('dashboard');

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    newSocket.on('network-update', (data: SystemData) => {
      setSystemData(data);
    });

    newSocket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });

    // Start monitoring when connected
    newSocket.on('connect', () => {
      newSocket.emit('start-monitoring');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleScanComplete = (data: NetworkData) => {
    setNetworkData(data);
  };

  return (
    <div className="min-h-screen bg-dark-900 text-dark-100">
      <Header 
        isConnected={isConnected} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard 
            networkData={networkData} 
            systemData={systemData} 
          />
        )}
        
        {activeTab === 'scanner' && (
          <NetworkScanner 
            onScanComplete={handleScanComplete}
            socket={socket}
          />
        )}
        
        {activeTab === 'system' && (
          <SystemInfo systemData={systemData} />
        )}
      </main>
    </div>
  );
};

export default App;


