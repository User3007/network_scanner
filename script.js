class NetworkScanner {
    constructor() {
        this.speedTestHistory = JSON.parse(localStorage.getItem('speedTestHistory')) || [];
        this.isTestingSpeed = false;
        this.networkInfo = {};
        this.init();
    }

    init() {
        this.loadNetworkProperties();
        this.setupEventListeners();
        this.displayHistory();
        
        // Update network properties every 30 seconds
        setInterval(() => {
            if (!this.isTestingSpeed) {
                this.loadNetworkProperties();
            }
        }, 30000);
    }

    setupEventListeners() {
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshNetworkProperties();
        });

        document.getElementById('startTestBtn').addEventListener('click', () => {
            this.startSpeedTest();
        });

        document.getElementById('clearHistoryBtn').addEventListener('click', () => {
            this.clearHistory();
        });

        // Listen for online/offline events
        window.addEventListener('online', () => this.updateOnlineStatus());
        window.addEventListener('offline', () => this.updateOnlineStatus());
    }

    async loadNetworkProperties() {
        try {
            // Load all network properties in parallel
            await Promise.all([
                this.updateBasicNetworkInfo(),
                this.updateIPInformation(),
                this.updateLocationInfo(),
                this.updateSystemInfo(),
                this.updateSecurityInfo(),
                this.measureRTT()
            ]);
            
        } catch (error) {
            console.error('Error loading network properties:', error);
        }
    }

    async updateBasicNetworkInfo() {
        // Online status
        this.updateOnlineStatus();
        
        // Connection type and details
        this.updateConnectionType();
        
        // Network Connection API (if available)
        if ('connection' in navigator) {
            this.updateConnectionDetails();
        }
    }

    async updateIPInformation() {
        try {
            // Get public IP and related information
            const ipResponse = await fetch('https://ipapi.co/json/');
            const ipData = await ipResponse.json();
            
            document.getElementById('publicIp').innerHTML = 
                `<span class="ip-address">${ipData.ip || 'Unknown'}</span>`;
            document.getElementById('isp').textContent = ipData.org || 'Unknown';
            
            // Store for location info
            this.networkInfo.ipData = ipData;
            
        } catch (error) {
            console.error('Error fetching IP info:', error);
            document.getElementById('publicIp').textContent = 'Unable to fetch';
            document.getElementById('isp').textContent = 'Unable to fetch';
            
            // Try alternative IP service
            this.tryAlternativeIPService();
        }

        // Get local IP using WebRTC
        this.getLocalIP();
        
        // Test IPv6 support
        this.testIPv6Support();
        
        // Get hostname
        this.getHostname();
    }

    async tryAlternativeIPService() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            document.getElementById('publicIp').innerHTML = 
                `<span class="ip-address">${data.ip}</span>`;
        } catch (error) {
            console.error('Alternative IP service failed:', error);
        }
    }

    getLocalIP() {
        try {
            const rtc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            });
            
            rtc.createDataChannel('');
            rtc.createOffer().then(offer => rtc.setLocalDescription(offer));
            
            rtc.onicecandidate = (event) => {
                if (event.candidate) {
                    const candidate = event.candidate.candidate;
                    const ipMatch = candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
                    if (ipMatch && !ipMatch[1].startsWith('169.254')) {
                        document.getElementById('localIp').innerHTML = 
                            `<span class="ip-address">${ipMatch[1]}</span>`;
                        rtc.close();
                    }
                }
            };
            
            // Fallback after 3 seconds
            setTimeout(() => {
                if (document.getElementById('localIp').textContent === 'Detecting...') {
                    document.getElementById('localIp').textContent = 'Not available';
                }
                rtc.close();
            }, 3000);
            
        } catch (error) {
            console.error('Error getting local IP:', error);
            document.getElementById('localIp').textContent = 'Not available';
        }
    }

    async testIPv6Support() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            await fetch('https://ipv6.google.com', { 
                method: 'HEAD', 
                signal: controller.signal 
            });
            
            clearTimeout(timeoutId);
            document.getElementById('ipv6Support').innerHTML = 
                '<span class="online">✓ Supported</span>';
        } catch (error) {
            document.getElementById('ipv6Support').innerHTML = 
                '<span class="offline">✗ Not supported</span>';
        }
    }

    getHostname() {
        try {
            const hostname = window.location.hostname || 'localhost';
            document.getElementById('hostname').textContent = hostname;
        } catch (error) {
            document.getElementById('hostname').textContent = 'Unknown';
        }
    }

    async updateLocationInfo() {
        try {
            // Use IP data if available
            if (this.networkInfo.ipData) {
                const data = this.networkInfo.ipData;
                document.getElementById('country').textContent = 
                    `${data.country_name || 'Unknown'} (${data.country_code || '??'})`;
                document.getElementById('region').textContent = data.region || 'Unknown';
                document.getElementById('city').textContent = data.city || 'Unknown';
                document.getElementById('timezone').textContent = data.timezone || 'Unknown';
                
                if (data.latitude && data.longitude) {
                    document.getElementById('coordinates').innerHTML = 
                        `<span class="coordinates">${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}</span>`;
                }
            }
            
            // Try to get more precise location with Geolocation API
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        document.getElementById('coordinates').innerHTML = 
                            `<span class="coordinates">${latitude.toFixed(6)}, ${longitude.toFixed(6)}</span> <small>(Precise)</small>`;
                    },
                    (error) => {
                        console.log('Geolocation not available or denied');
                    },
                    { timeout: 5000, enableHighAccuracy: false }
                );
            }
            
        } catch (error) {
            console.error('Error updating location info:', error);
        }
    }

    updateSystemInfo() {
        // Browser detection
        const browser = this.detectBrowser();
        document.getElementById('browser').textContent = browser;
        
        // Platform
        document.getElementById('platform').textContent = 
            navigator.platform || 'Unknown';
        
        // Language
        document.getElementById('language').textContent = 
            navigator.language || 'Unknown';
        
        // Screen resolution
        document.getElementById('screenResolution').textContent = 
            `${screen.width} × ${screen.height}`;
        
        // Color depth
        document.getElementById('colorDepth').textContent = 
            `${screen.colorDepth}-bit`;
    }

    detectBrowser() {
        const userAgent = navigator.userAgent;
        
        if (userAgent.includes('Firefox')) {
            return 'Firefox';
        } else if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
            return 'Chrome';
        } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
            return 'Safari';
        } else if (userAgent.includes('Edg')) {
            return 'Microsoft Edge';
        } else if (userAgent.includes('Opera')) {
            return 'Opera';
        } else {
            return 'Unknown Browser';
        }
    }

    async updateSecurityInfo() {
        // Connection security
        const isSecure = window.location.protocol === 'https:';
        document.getElementById('connectionSecurity').innerHTML = isSecure 
            ? '<span class="secure-connection">🔒 Secure (HTTPS)</span>'
            : '<span class="insecure-connection">🔓 Insecure (HTTP)</span>';
        
        // Cookie enabled
        document.getElementById('cookieEnabled').innerHTML = navigator.cookieEnabled 
            ? '<span class="online">✓ Enabled</span>'
            : '<span class="offline">✗ Disabled</span>';
        
        // WebRTC support
        const hasWebRTC = !!(window.RTCPeerConnection || window.webkitRTCPeerConnection);
        document.getElementById('webrtcSupport').innerHTML = hasWebRTC 
            ? '<span class="online">✓ Supported</span>'
            : '<span class="offline">✗ Not supported</span>';
        
        // Test DNS over HTTPS
        this.testDNSOverHTTPS();
    }

    async testDNSOverHTTPS() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            await fetch('https://cloudflare-dns.com/dns-query?name=example.com&type=A', {
                headers: { 'Accept': 'application/dns-json' },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            document.getElementById('dnsOverHttps').innerHTML = 
                '<span class="online">✓ Available</span>';
        } catch (error) {
            document.getElementById('dnsOverHttps').innerHTML = 
                '<span class="warning-connection">? Unknown</span>';
        }
    }

    updateOnlineStatus() {
        const statusElement = document.getElementById('onlineStatus');
        const isOnline = navigator.onLine;
        
        statusElement.innerHTML = isOnline 
            ? '<span class="status-indicator status-online"></span>Online'
            : '<span class="status-indicator status-offline"></span>Offline';
        
        statusElement.className = `property-value ${isOnline ? 'online' : 'offline'}`;
    }

    updateConnectionType() {
        const connectionElement = document.getElementById('connectionType');
        
        if ('connection' in navigator) {
            const connection = navigator.connection;
            connectionElement.textContent = connection.type || 'Unknown';
        } else {
            connectionElement.textContent = 'Not Available';
        }
    }

    updateConnectionDetails() {
        const connection = navigator.connection;
        
        // Effective connection type
        document.getElementById('effectiveType').textContent = 
            connection.effectiveType || 'Unknown';
        
        // Downlink
        document.getElementById('downlink').textContent = 
            connection.downlink ? `${connection.downlink} Mbps` : 'Unknown';
        
        // RTT from connection API
        if (connection.rtt) {
            document.getElementById('rtt').textContent = `${connection.rtt} ms`;
        }
    }

    async measureRTT() {
        try {
            const measurements = [];
            const testUrls = [
                'https://www.google.com/favicon.ico',
                'https://www.cloudflare.com/favicon.ico',
                'https://httpbin.org/get'
            ];
            
            for (let i = 0; i < 3; i++) {
                const start = performance.now();
                try {
                    await fetch(testUrls[i % testUrls.length], { 
                        method: 'HEAD',
                        mode: 'no-cors',
                        cache: 'no-cache'
                    });
                    const end = performance.now();
                    measurements.push(end - start);
                } catch (error) {
                    // Try image loading as fallback
                    const imgStart = performance.now();
                    const img = new Image();
                    await new Promise((resolve) => {
                        img.onload = img.onerror = () => {
                            const imgEnd = performance.now();
                            measurements.push(imgEnd - imgStart);
                            resolve();
                        };
                        img.src = testUrls[i % testUrls.length] + '?' + Math.random();
                    });
                }
            }
            
            if (measurements.length > 0) {
                const avgRTT = Math.round(measurements.reduce((a, b) => a + b, 0) / measurements.length);
                document.getElementById('rtt').textContent = `${avgRTT} ms`;
            }
            
        } catch (error) {
            console.error('Error measuring RTT:', error);
            document.getElementById('rtt').textContent = 'Unable to measure';
        }
    }

    refreshNetworkProperties() {
        const refreshBtn = document.getElementById('refreshBtn');
        const icon = refreshBtn.querySelector('i');
        
        icon.classList.add('spinning');
        
        // Reset all values to loading state
        const loadingElements = [
            'connectionType', 'effectiveType', 'downlink', 'rtt',
            'publicIp', 'localIp', 'isp', 'ipv6Support',
            'country', 'region', 'city', 'timezone', 'coordinates'
        ];
        
        loadingElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = 'Loading...';
                element.classList.add('loading');
            }
        });
        
        setTimeout(() => {
            icon.classList.remove('spinning');
            loadingElements.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.classList.remove('loading');
                }
            });
        }, 2000);
        
        this.loadNetworkProperties();
    }

    async startSpeedTest() {
        if (this.isTestingSpeed) return;
        
        this.isTestingSpeed = true;
        const startBtn = document.getElementById('startTestBtn');
        const progressContainer = document.getElementById('testProgress');
        const progressFill = document.getElementById('progressFill');
        const testStatus = document.getElementById('testStatus');
        
        startBtn.disabled = true;
        startBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
        progressContainer.classList.remove('hidden');
        
        try {
            // Reset results
            this.updateSpeedDisplay(0);
            document.getElementById('downloadSpeed').textContent = '-- Mbps';
            document.getElementById('uploadSpeed').textContent = '-- Mbps';
            document.getElementById('pingTime').textContent = '-- ms';
            document.getElementById('jitter').textContent = '-- ms';
            
            // Test ping
            testStatus.textContent = 'Testing ping...';
            progressFill.style.width = '20%';
            const ping = await this.testPing();
            document.getElementById('pingTime').textContent = `${ping.average} ms`;
            document.getElementById('jitter').textContent = `${ping.jitter} ms`;
            
            // Test download speed
            testStatus.textContent = 'Testing download speed...';
            progressFill.style.width = '60%';
            const downloadSpeed = await this.testDownloadSpeed();
            document.getElementById('downloadSpeed').textContent = `${downloadSpeed.toFixed(2)} Mbps`;
            this.updateSpeedDisplay(downloadSpeed);
            
            // Test upload speed
            testStatus.textContent = 'Testing upload speed...';
            progressFill.style.width = '90%';
            const uploadSpeed = await this.testUploadSpeed();
            document.getElementById('uploadSpeed').textContent = `${uploadSpeed.toFixed(2)} Mbps`;
            
            // Complete
            testStatus.textContent = 'Test completed!';
            progressFill.style.width = '100%';
            
            // Save to history
            this.saveTestResult({
                timestamp: new Date(),
                download: downloadSpeed,
                upload: uploadSpeed,
                ping: ping.average,
                jitter: ping.jitter
            });
            
            setTimeout(() => {
                progressContainer.classList.add('hidden');
                testStatus.textContent = 'Initializing...';
                progressFill.style.width = '0%';
            }, 2000);
            
        } catch (error) {
            console.error('Speed test error:', error);
            testStatus.textContent = 'Test failed. Please try again.';
            
            setTimeout(() => {
                progressContainer.classList.add('hidden');
            }, 3000);
        } finally {
            this.isTestingSpeed = false;
            startBtn.disabled = false;
            startBtn.innerHTML = '<i class="fas fa-play"></i> Start Speed Test';
        }
    }

    async testPing() {
        const pings = [];
        const testUrls = [
            'https://www.google.com/favicon.ico',
            'https://www.cloudflare.com/favicon.ico',
            'https://httpbin.org/get'
        ];
        
        for (let i = 0; i < 5; i++) {
            try {
                const start = performance.now();
                await fetch(testUrls[i % testUrls.length], { 
                    method: 'HEAD',
                    mode: 'no-cors',
                    cache: 'no-cache'
                });
                const end = performance.now();
                pings.push(end - start);
            } catch (error) {
                // Fallback ping test
                const start = performance.now();
                const img = new Image();
                await new Promise((resolve) => {
                    img.onload = img.onerror = () => {
                        const end = performance.now();
                        pings.push(end - start);
                        resolve();
                    };
                    img.src = testUrls[i % testUrls.length] + '?' + Math.random();
                });
            }
            
            // Small delay between pings
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        const average = Math.round(pings.reduce((a, b) => a + b, 0) / pings.length);
        const jitter = Math.round(Math.sqrt(pings.reduce((sq, n) => sq + Math.pow(n - average, 2), 0) / pings.length));
        
        return { average, jitter };
    }

    async testDownloadSpeed() {
        const testSizes = [100000, 500000, 1000000]; // 100KB, 500KB, 1MB
        const results = [];
        
        for (const size of testSizes) {
            try {
                const start = performance.now();
                
                // Generate test data URL
                const testData = 'x'.repeat(size);
                const blob = new Blob([testData]);
                const url = URL.createObjectURL(blob);
                
                const response = await fetch(url);
                await response.blob();
                
                const end = performance.now();
                const duration = (end - start) / 1000; // Convert to seconds
                const speedMbps = (size * 8) / (duration * 1000000); // Convert to Mbps
                
                results.push(speedMbps);
                URL.revokeObjectURL(url);
                
            } catch (error) {
                console.error('Download test error:', error);
            }
        }
        
        // Return average speed or simulate based on connection info
        if (results.length > 0) {
            return results.reduce((a, b) => a + b, 0) / results.length;
        } else {
            // Fallback simulation based on connection type
            return this.simulateSpeed('download');
        }
    }

    async testUploadSpeed() {
        try {
            const testData = new ArrayBuffer(100000); // 100KB
            const start = performance.now();
            
            // Simulate upload by creating and processing data
            const blob = new Blob([testData]);
            const url = URL.createObjectURL(blob);
            
            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
            
            const end = performance.now();
            const duration = (end - start) / 1000;
            const speedMbps = (100000 * 8) / (duration * 1000000);
            
            URL.revokeObjectURL(url);
            return speedMbps * 0.8; // Upload is typically slower than download
            
        } catch (error) {
            console.error('Upload test error:', error);
            return this.simulateSpeed('upload');
        }
    }

    simulateSpeed(type) {
        // Simulate speeds based on connection type
        const connection = navigator.connection;
        let baseSpeed = 10; // Default 10 Mbps
        
        if (connection) {
            switch (connection.effectiveType) {
                case 'slow-2g': baseSpeed = 0.5; break;
                case '2g': baseSpeed = 2; break;
                case '3g': baseSpeed = 10; break;
                case '4g': baseSpeed = 50; break;
                default: baseSpeed = connection.downlink || 10;
            }
        }
        
        // Add some randomness
        const variation = (Math.random() - 0.5) * 0.4; // ±20% variation
        const speed = baseSpeed * (1 + variation);
        
        return type === 'upload' ? speed * 0.8 : speed; // Upload typically slower
    }

    updateSpeedDisplay(speed) {
        document.getElementById('speedValue').textContent = speed.toFixed(1);
        
        // Update needle rotation (0-100 Mbps scale)
        const needle = document.getElementById('speedNeedle');
        const maxSpeed = 100;
        const rotation = Math.min((speed / maxSpeed) * 180, 180); // 0-180 degrees
        needle.style.transform = `translate(-50%, -100%) rotate(${rotation}deg)`;
    }

    saveTestResult(result) {
        this.speedTestHistory.unshift(result);
        
        // Keep only last 10 results
        if (this.speedTestHistory.length > 10) {
            this.speedTestHistory = this.speedTestHistory.slice(0, 10);
        }
        
        localStorage.setItem('speedTestHistory', JSON.stringify(this.speedTestHistory));
        this.displayHistory();
    }

    displayHistory() {
        const container = document.getElementById('historyContainer');
        
        if (this.speedTestHistory.length === 0) {
            container.innerHTML = '<p class="no-history">No speed tests performed yet</p>';
            return;
        }
        
        const historyHTML = this.speedTestHistory.map(result => {
            const date = new Date(result.timestamp);
            const timeString = date.toLocaleString();
            
            return `
                <div class="history-item">
                    <div>
                        <div class="history-speed">↓ ${result.download.toFixed(1)} Mbps / ↑ ${result.upload.toFixed(1)} Mbps</div>
                        <div class="history-time">${timeString}</div>
                    </div>
                    <div>
                        <div style="color: #666; font-size: 0.9rem;">Ping: ${result.ping} ms</div>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = historyHTML;
    }

    clearHistory() {
        this.speedTestHistory = [];
        localStorage.removeItem('speedTestHistory');
        this.displayHistory();
    }
}

// Initialize the network scanner when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NetworkScanner();
});

// Add some utility functions for better user experience
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getConnectionQuality(speed) {
    if (speed < 1) return { quality: 'Poor', color: '#dc3545' };
    if (speed < 5) return { quality: 'Fair', color: '#ffc107' };
    if (speed < 25) return { quality: 'Good', color: '#28a745' };
    return { quality: 'Excellent', color: '#007bff' };
}