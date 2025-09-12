#!/bin/bash

echo "Network Scanner Web Application Setup"
echo "====================================="
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js from https://nodejs.org/"
    echo "On macOS: brew install node"
    echo "On Ubuntu/Debian: sudo apt-get install nodejs npm"
    echo "On CentOS/RHEL: sudo yum install nodejs npm"
    exit 1
fi

echo "Node.js is installed: $(node --version)"
echo

# Install backend dependencies
echo "Installing backend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install backend dependencies."
    exit 1
fi

echo "Backend dependencies installed successfully."
echo

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install frontend dependencies."
    exit 1
fi

cd ..
echo "Frontend dependencies installed successfully."
echo

# Check if Nmap is installed
if ! command -v nmap &> /dev/null; then
    echo "Warning: Nmap is not installed. Network scanning functionality will not work."
    echo "Install Nmap:"
    echo "  macOS: brew install nmap"
    echo "  Ubuntu/Debian: sudo apt-get install nmap"
    echo "  CentOS/RHEL: sudo yum install nmap"
    echo
fi

echo "Setup completed successfully!"
echo
echo "To start the application:"
echo "1. Run: npm run dev"
echo "2. Open http://localhost:3000 in your browser"
echo
