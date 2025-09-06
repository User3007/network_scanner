import React from 'react';
import { NetworkData, SystemData } from '../types';
import NetworkOverview from './NetworkOverview';
import HostList from './HostList';
import NetworkCharts from './NetworkCharts';
import SystemStats from './SystemStats';

interface DashboardProps {
  networkData: NetworkData | null;
  systemData: SystemData | null;
}

const Dashboard: React.FC<DashboardProps> = ({ networkData, systemData }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Overview */}
        <div className="lg:col-span-2">
          <NetworkOverview networkData={networkData} />
        </div>
        
        {/* System Stats */}
        <div>
          <SystemStats systemData={systemData} />
        </div>
      </div>

      {/* Network Charts */}
      {systemData && (
        <div className="bg-dark-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-dark-100">Network Statistics</h2>
          <NetworkCharts systemData={systemData} />
        </div>
      )}

      {/* Host List */}
      {networkData && (
        <div className="bg-dark-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-dark-100">Discovered Hosts</h2>
          <HostList hosts={networkData.hosts} />
        </div>
      )}

      {/* Empty State */}
      {!networkData && !systemData && (
        <div className="text-center py-12">
          <div className="text-dark-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-dark-200 mb-2">No Data Available</h3>
          <p className="text-dark-400">Start a network scan to see results here.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
