import React, { useState, useEffect } from 'react'; 
 
function App() { 
  const [networkData, setNetworkData] = useState(null); 
  const [systemData, setSystemData] = useState(null); 
 
  useEffect(() => { 
    fetch('/api/network-info') 
      .then(res => res.json()) 
      .then(data => setSystemData(data)); 
  }, []); 
 
  const handleScan = () => { 
    fetch('/api/scan-network', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ ipRange: '192.168.1.0/24', ports: '1-1000' }) 
    }) 
      .then(res => res.json()) 
      .then(data => setNetworkData(data)); 
  }; 
 
  return ( 
    <div style={{ padding: '20px', background: '#1a1a1a', color: 'white', minHeight: '100vh' }}> 
      <h1>?? Network Scanner Dashboard</h1> 
      <button onClick={handleScan} style={{ padding: '10px 20px', margin: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}> 
        Scan Network 
      </button> 
        <div> 
          <h2>Scan Results</h2> 
          <p>Total Hosts: {networkData.totalHosts}</p> 
          <p>Alive Hosts: {networkData.aliveHosts}</p> 
          {networkData.hosts.map((host, i) => ( 
            <div key={i} style={{ border: '1px solid #333', padding: '10px', margin: '5px', borderRadius: '5px' }}> 
              <p>IP: {host.ip}</p> 
              <p>Hostname: {host.hostname}</p> 
              <p>Status: {host.state}</p> 
            </div> 
          ))} 
        </div> 
      )} 
        <div> 
          <h2>System Info</h2> 
          <p>Hostname: {systemData.hostname}</p> 
          <p>Platform: {systemData.platform}</p> 
          <p>Uptime: {Math.floor(systemData.uptime / 60)} minutes</p> 
        </div> 
      )} 
    </div> 
  ); 
} 
 
export default App; 
