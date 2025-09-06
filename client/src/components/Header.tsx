import React from 'react';
import { Wifi, Search, Monitor, Activity } from 'lucide-react';

interface HeaderProps {
  isConnected: boolean;
  activeTab: 'dashboard' | 'scanner' | 'system';
  onTabChange: (tab: 'dashboard' | 'scanner' | 'system') => void;
}

const Header: React.FC<HeaderProps> = ({ isConnected, activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Monitor },
    { id: 'scanner', label: 'Network Scanner', icon: Search },
    { id: 'system', label: 'System Info', icon: Activity },
  ] as const;

  return (
    <header className="bg-dark-800 border-b border-dark-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Wifi className="h-8 w-8 text-primary-500" />
              <h1 className="text-xl font-bold text-dark-100">Network Scanner</h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-dark-300">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          
          <nav className="flex space-x-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === id
                    ? 'bg-primary-600 text-white'
                    : 'text-dark-300 hover:text-dark-100 hover:bg-dark-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
