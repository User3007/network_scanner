# Enhanced Network Scanner Dashboard

A comprehensive, responsive web application for monitoring detailed network properties and testing internet connection speed with advanced network diagnostics.

## 🚀 Features

### 🌐 Connection Details
- **Online Status**: Real-time online/offline status with visual indicators
- **Connection Type**: Current network connection type (WiFi, Cellular, etc.)
- **Effective Connection**: Network quality classification (2G, 3G, 4G, etc.)
- **Downlink Speed**: Browser-estimated downlink speed
- **RTT (Round Trip Time)**: Network latency measurement with multiple test endpoints

### 🔍 IP & Network Information
- **Public IP Address**: Your external IP address with ISP detection
- **Local IP Address**: Internal network IP using WebRTC
- **Hostname**: Current hostname or domain
- **ISP Provider**: Internet Service Provider information
- **IPv6 Support**: Tests and displays IPv6 connectivity status

### 📍 Location Information
- **Country**: Country name and code based on IP geolocation
- **Region**: State/province information
- **City**: Current city location
- **Timezone**: Local timezone information
- **Coordinates**: GPS coordinates (IP-based and precise geolocation if permitted)

### 💻 System Information
- **Browser**: Detected browser name and version
- **Platform**: Operating system platform
- **Language**: Browser language settings
- **Screen Resolution**: Display resolution
- **Color Depth**: Screen color depth information

### 🔒 Security Information
- **Connection Security**: HTTPS/HTTP status
- **DNS over HTTPS**: DoH availability testing
- **WebRTC Support**: WebRTC capability detection
- **Cookie Status**: Cookie support status

### 🚀 Advanced Speed Testing
- **Download Speed Test**: Comprehensive download speed measurement
- **Upload Speed Test**: Upload speed testing with multiple methods
- **Ping Test**: Multi-endpoint ping testing with jitter calculation
- **Visual Speed Gauge**: Real-time animated speed gauge
- **Progress Tracking**: Detailed progress indicators during testing

### 📊 Enhanced History & Analytics
- **Local Storage**: Automatic saving of test results
- **Detailed Results**: Complete test history with timestamps
- **Performance Tracking**: Track speed changes over time

## 🎯 How to Use

### Getting Started
1. **Open the Application**
   - Open `index.html` in any modern web browser
   - No server setup required - runs entirely client-side
   - Works offline for basic system information

2. **Network Properties Dashboard**
   - All network information loads automatically on page load
   - Properties are organized into logical sections:
     - Connection Details
     - IP & Network Info
     - Location Info
     - System Info
     - Security Info
   - Click "Refresh" to update all network properties
   - Auto-refresh occurs every 30 seconds

3. **Speed Testing**
   - Click "Start Speed Test" for comprehensive testing
   - Tests include ping, download speed, and upload speed
   - Visual feedback with animated gauge and progress bar
   - Results automatically saved to browser storage

4. **History Management**
   - View your last 10 speed test results
   - Each entry shows download/upload speeds, ping, and timestamp
   - Click "Clear" to remove all stored history

## 🔧 Technical Details

### Advanced Network Detection
- **Multi-source IP Detection**: Uses multiple APIs for reliable IP information
- **WebRTC Local IP**: Discovers local network IP addresses
- **Connection API**: Leverages Navigator Connection API when available
- **Geolocation Integration**: Optional precise location with user permission
- **IPv6 Testing**: Comprehensive IPv6 connectivity testing

### Security & Privacy Features
- **HTTPS Detection**: Identifies secure connections
- **DoH Testing**: Tests DNS over HTTPS availability
- **WebRTC Capabilities**: Detects real-time communication support
- **Privacy-First**: All data stored locally, minimal external requests

### Performance Optimization
- **Parallel Loading**: All network properties load simultaneously
- **Fallback Methods**: Multiple detection methods ensure reliability
- **Error Handling**: Graceful degradation when services are unavailable
- **Caching**: Intelligent caching to reduce redundant requests

### Browser Compatibility
- **Modern Browsers**: Full support for Chrome, Firefox, Safari, Edge
- **Progressive Enhancement**: Core features work on older browsers
- **Mobile Optimized**: Responsive design for all device sizes
- **API Fallbacks**: Alternative methods when modern APIs aren't available

## 📱 Responsive Design

### Desktop Features
- Multi-column layout for efficient space usage
- Hover effects and smooth animations
- Full feature set with detailed information

### Mobile Optimizations
- Single-column responsive layout
- Touch-friendly interface elements
- Optimized gauge size for smaller screens
- Simplified property display for better readability

## 🛠️ API Integrations

### External Services Used
- **ipapi.co**: Primary IP geolocation service
- **ipify.org**: Fallback IP detection service
- **Google STUN**: WebRTC local IP discovery
- **Cloudflare DoH**: DNS over HTTPS testing
- **Multiple CDNs**: RTT and connectivity testing

### Data Privacy
- **Local Storage Only**: All test history stored in browser
- **Minimal Data Collection**: Only necessary network information
- **No Tracking**: No analytics or user tracking
- **Optional Geolocation**: Precise location only with user consent

## 🔍 Network Properties Explained

### Connection Details
- **Online Status**: Browser's network connectivity state
- **Connection Type**: Physical connection method (WiFi, cellular, ethernet)
- **Effective Type**: Network quality estimation (slow-2g, 2g, 3g, 4g)
- **Downlink**: Estimated download speed from browser
- **RTT**: Round-trip time to various test endpoints

### IP Information
- **Public IP**: Your internet-facing IP address
- **Local IP**: Internal network IP (192.168.x.x, 10.x.x.x, etc.)
- **ISP**: Internet Service Provider organization
- **IPv6**: Next-generation internet protocol support

### Location Data
- **Geolocation**: IP-based location (approximate)
- **Precise Location**: GPS-based coordinates (if permitted)
- **Timezone**: Local time zone information

### Security Indicators
- **HTTPS**: Encrypted connection status
- **DoH**: DNS over HTTPS capability
- **WebRTC**: Real-time communication support
- **Cookies**: Browser cookie functionality

## 🚀 Advanced Features

### Speed Test Algorithm
1. **Multi-endpoint Ping**: Tests latency to multiple servers
2. **Progressive Download**: Tests various data sizes for accuracy
3. **Simulated Upload**: Upload speed estimation with data processing
4. **Jitter Calculation**: Network stability measurement
5. **Fallback Methods**: Alternative testing when primary methods fail

### Error Handling
- **Service Fallbacks**: Multiple APIs for each feature
- **Timeout Management**: Prevents hanging requests
- **Graceful Degradation**: Core functionality maintained when services fail
- **User Feedback**: Clear status indicators for all operations

### Performance Features
- **Async Loading**: Non-blocking property detection
- **Caching Strategy**: Reduces redundant API calls
- **Progressive Enhancement**: Features activate as they become available
- **Memory Management**: Efficient resource usage

## 📋 Files Structure

```
enhanced-network-scanner/
├── index.html      # Enhanced HTML with all network property sections
├── styles.css      # Comprehensive responsive styling
├── script.js       # Advanced network detection and testing
└── README.md       # Complete documentation
```

## 🔧 Customization Options

### Modifying Test Parameters
- Adjust speed test data sizes in `testDownloadSpeed()`
- Change ping test frequency in `testPing()`
- Modify auto-refresh interval (default: 30 seconds)
- Customize timeout values for various tests

### Adding New Properties
- Extend `updateSystemInfo()` for additional browser properties
- Add new test endpoints in RTT measurement
- Integrate additional geolocation services
- Expand security testing capabilities

## 🐛 Troubleshooting

### Common Issues
- **IP Detection Fails**: Some networks block external IP services
- **Local IP Not Found**: WebRTC may be disabled in some browsers
- **Location Unavailable**: Geolocation services may be blocked
- **Speed Test Errors**: Network restrictions may prevent testing

### Solutions
- **Multiple Fallbacks**: App uses several methods for each feature
- **Manual Refresh**: Use refresh button if auto-detection fails
- **Browser Permissions**: Check location and network permissions
- **Network Policies**: Some corporate networks restrict certain features

## 🔮 Future Enhancements

### Planned Features
- **Network Scanning**: Local network device discovery (requires permissions)
- **Port Scanning**: Basic port availability testing
- **DNS Testing**: Comprehensive DNS server testing
- **VPN Detection**: VPN/proxy usage identification
- **Network Monitoring**: Continuous connection quality monitoring

### Advanced Analytics
- **Speed Trends**: Historical speed analysis with charts
- **Network Quality Score**: Comprehensive network rating
- **Comparison Tools**: Compare with average speeds in your area
- **Export Options**: CSV/JSON export of test results

---

## 📄 License & Usage

This is a client-side web application that provides comprehensive network information using standard web APIs and external services. Some features require internet connectivity and may be limited by browser security policies or network configurations.

**Note**: This enhanced version provides extensive network diagnostics while maintaining privacy and security. All sensitive data remains local to your browser."# decentralized-app" 
