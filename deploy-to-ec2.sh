#!/bin/bash

# Deploy Lara AI Backend to Ubuntu EC2
# Run this script on your Ubuntu EC2 instance

echo "🚀 Starting Lara AI Backend Deployment on Ubuntu..."

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install NVM (Node Version Manager) if not already installed
if [ ! -d "$HOME/.nvm" ]; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
fi

# Create a temporary script that sources NVM and runs Node.js commands
cat > /tmp/setup-node.sh << 'NODEEOF'
#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Install Node.js LTS
nvm install --lts
nvm use --lts

# Verify Node.js installation
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Install PM2 globally
npm install -g pm2

# Create symbolic links so commands work outside of NVM context
sudo ln -sf $(which node) /usr/local/bin/node
sudo ln -sf $(which npm) /usr/local/bin/npm
sudo ln -sf $(which pm2) /usr/local/bin/pm2

echo "✅ Node.js and PM2 installed successfully!"
NODEEOF

chmod +x /tmp/setup-node.sh
bash /tmp/setup-node.sh

# Create application directory
sudo mkdir -p /var/www/lara-ai
sudo chown ubuntu:ubuntu /var/www/lara-ai
cd /var/www/lara-ai

# Create server-production.js
cat > server-production.js << 'EOF'
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Lara AI endpoint using correct API format
app.post('/api/lara/ask', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    console.log(`[${new Date().toISOString()}] Processing request: ${prompt.substring(0, 50)}...`);

    // Use the correct working API endpoint and format
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    console.log(`[${new Date().toISOString()}] Request successful`);
    res.json({ response: text });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    if (error.message && error.message.includes('429')) {
      res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again in a few seconds.',
        details: 'Too many requests to the AI service'
      });
    } else if (error.message && error.message.includes('quota')) {
      res.status(429).json({ 
        error: 'API quota exceeded. Please try again later.',
        details: 'Daily/monthly quota limit reached'
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to process request',
        details: error.message
      });
    }
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Lara AI Backend server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API Key configured: ${process.env.GEMINI_API_KEY ? '✅' : '❌'}`);
});
EOF

# Create package.json (fixed - removed "type": "module")
cat > package.json << 'EOF'
{
  "name": "lara-ai-backend",
  "version": "1.0.0",
  "description": "Lara AI Chatbot Backend Server",
  "main": "server-production.js",
  "scripts": {
    "start": "node server-production.js",
    "dev": "nodemon server-production.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF

# Create PM2 ecosystem file with .cjs extension to ensure CommonJS
cat > ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [{
    name: 'lara-ai-backend',
    script: './server-production.js',
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
    max_memory_restart: '1G'
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Create .env file template
cat > .env << 'EOF'
GEMINI_API_KEY=YOUR_API_KEY_HERE
PORT=5000
NODE_ENV=production
CORS_ORIGIN=*
EOF

# Install dependencies
npm install

# Configure firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 5000/tcp
sudo ufw --force enable

echo "✅ Deployment script completed!"
echo ""
echo "🔐 IMPORTANT: Configure AWS Security Group"
echo "   1. Go to AWS Console → EC2 → Security Groups"
echo "   2. Edit inbound rules for your instance's security group"
echo "   3. Add rule: Custom TCP, Port 5000, Source 0.0.0.0/0"
echo "   4. Save rules"
echo ""
echo "📋 Next Steps:"
echo "1. Edit /var/www/lara-ai/.env and add your GEMINI_API_KEY"
echo "2. Start the server with: cd /var/www/lara-ai && pm2 start ecosystem.config.cjs"
echo "3. ⚠️  CRITICAL: Configure your EC2 Security Group to allow port 5000"
echo "4. Access your API at: http://YOUR-EC2-PUBLIC-IP:5000"
echo ""
echo "🧪 Verify Security Group is working:"
echo "   curl http://$(curl -s http://checkip.amazonaws.com):5000/health"
echo ""
echo "🔧 Frontend Configuration:"
echo "5. Create .env file in your frontend project root with:"
echo "   VITE_API_URL=http://$(curl -s http://checkip.amazonaws.com):5000"
echo ""
echo "📱 Your API endpoints:"
echo "   Health: http://$(curl -s http://checkip.amazonaws.com):5000/health"
echo "   AI Chat: http://$(curl -s http://checkip.amazonaws.com):5000/api/lara/ask"
echo ""
echo "🚨 If connection times out:"
echo "   - Check AWS Security Group allows port 5000"
echo "   - Verify PM2 is running: pm2 status"
echo "   - Check logs: pm2 logs lara-ai-backend"