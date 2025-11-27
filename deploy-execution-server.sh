#!/bin/bash

# Deploy V-CodeX Execution Server to Ubuntu EC2
# Run this script on your Ubuntu EC2 instance

echo "🚀 Starting V-CodeX Execution Server Deployment on Ubuntu..."

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
echo "📦 Installing Docker..."
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu
newgrp docker

# Test Docker installation
docker --version

# Install NVM and Node.js (if not already installed)
if [ ! -d "$HOME/.nvm" ]; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install --lts
    nvm use --lts
fi

# Install PM2 globally
npm install -g pm2

# Create execution server directory
sudo mkdir -p /var/www/execution-server
sudo chown ubuntu:ubuntu /var/www/execution-server
cd /var/www/execution-server

# Create package.json for execution server
cat > package.json << 'EOF'
{
  "name": "v-codex-execution-server",
  "version": "1.0.0",
  "description": "V-CodeX Code Execution Server with Docker",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "ws": "^8.14.2",
    "cors": "^2.8.5",
    "firebase-admin": "^11.11.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF

# Create Docker images directory
mkdir -p docker-images

# Create C/C++ Docker image
cat > docker-images/Dockerfile.c << 'EOF'
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y gcc g++ && rm -rf /var/lib/apt/lists/*
WORKDIR /app
CMD ["/bin/bash"]
EOF

# Create Python Docker image
cat > docker-images/Dockerfile.python << 'EOF'
FROM python:3.11-slim
WORKDIR /app
ENTRYPOINT ["python", "-u"]
EOF

# Create Java Docker image
cat > docker-images/Dockerfile.java << 'EOF'
FROM openjdk:17-alpine
RUN apk add --no-cache bash
WORKDIR /app
CMD ["/bin/bash"]
EOF

# Create MERN environment Docker image
cat > docker-images/Dockerfile.mern << 'EOF'
FROM node:18-bullseye
RUN apt-get update && apt-get install -y \
    python3 python3-pip \
    default-jdk \
    gcc g++ \
    vim nano \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /workspace
CMD ["/bin/bash"]
EOF

# Build Docker images
echo "🐳 Building Docker images..."
docker build -f docker-images/Dockerfile.c -t c-compiler .
docker build -f docker-images/Dockerfile.c -t cpp-compiler .
docker build -f docker-images/Dockerfile.python -t python-runner .
docker build -f docker-images/Dockerfile.java -t java-compiler .
docker build -f docker-images/Dockerfile.mern -t mern-environment .

# Create PM2 ecosystem file
cat > ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [{
    name: 'execution-server',
    script: './server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    watch: false,
    max_memory_restart: '2G'
  }]
};
EOF

# Create logs directory and temp directory
mkdir -p logs temp

# Configure firewall for execution server
sudo ufw allow 5000/tcp
sudo ufw --force enable

echo "✅ V-CodeX Execution Server setup completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Upload your server.js file to /var/www/execution-server/"
echo "2. Upload your serviceAccountKey.json file to /var/www/execution-server/"
echo "3. Install dependencies: cd /var/www/execution-server && npm install"
echo "4. Start the server: pm2 start ecosystem.config.cjs"
echo "5. Configure AWS Security Group to allow port 5000"
echo ""
echo "🐳 Docker Images Built:"
echo "   - c-compiler (for C code execution)"
echo "   - cpp-compiler (for C++ code execution)"
echo "   - python-runner (for Python code execution)"
echo "   - java-compiler (for Java code execution)"
echo "   - mern-environment (for interactive shell)"
echo ""
echo "🔧 Useful Commands:"
echo "   pm2 status           - Check server status"
echo "   pm2 logs             - View server logs"
echo "   docker images        - List Docker images"
echo "   docker ps            - List running containers"
echo ""
echo "📱 WebSocket Endpoints:"
echo "   Code Runner: ws://YOUR-EC2-IP:5000/runner"
echo "   Interactive Shell: ws://YOUR-EC2-IP:5000/shell"
echo "   Exam Judge: ws://YOUR-EC2-IP:5000/judge"
