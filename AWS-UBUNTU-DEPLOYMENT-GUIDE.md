# 🚀 AWS EC2 Ubuntu Deployment Guide for Lara AI Backend

## 📋 Overview

This guide will help you deploy your Lara AI chatbot backend to AWS EC2 Ubuntu and configure your frontend to use the AWS-hosted API instead of localhost.

## 🔧 **Step 1: Prepare Your Local Files**

### Files Modified:

✅ `src/routes/laraAI.js` - Updated to use environment variables  
✅ `src/components/panels/AiPanel.jsx` - Updated to use new API structure  
✅ `server-production.js` - Production-ready server code  
✅ `deploy-to-ec2.sh` - Automated Ubuntu deployment script  
✅ `.env.example` - Environment variables template

## 🖥️ **Step 2: Set Up AWS EC2 Ubuntu Instance**

### 2.1 Launch EC2 Instance

1. Go to AWS Console → EC2
2. Launch new instance:
   - **AMI**: Ubuntu Server 22.04 LTS (or 20.04 LTS)
   - **Instance Type**: t2.micro (free tier) or t3.small
   - **Security Group**: Create new with these rules:
     - SSH (22) from your IP
     - HTTP (80) from anywhere (0.0.0.0/0)
     - Custom TCP (5000) from anywhere (0.0.0.0/0)
   - **Key Pair**: Create/select your key pair

### 2.2 Connect to EC2

```bash
ssh -i "your-key.pem" ubuntu@YOUR-EC2-PUBLIC-IP
```

## 🚀 **Step 3: Deploy Backend to EC2**

### Option A: Automatic Deployment (Recommended)

1. Upload the deployment script to your EC2:

```bash
scp -i "your-key.pem" deploy-to-ec2.sh ubuntu@YOUR-EC2-PUBLIC-IP:~/
```

2. Run the deployment script:

```bash
ssh -i "your-key.pem" ubuntu@YOUR-EC2-PUBLIC-IP
chmod +x deploy-to-ec2.sh
./deploy-to-ec2.sh
```

### Option B: Manual Deployment

1. **Install Node.js**:

```bash
sudo apt update && sudo apt upgrade -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
```

2. **Install PM2**:

```bash
npm install -g pm2
```

3. **Create Application Directory**:

```bash
sudo mkdir -p /var/www/lara-ai
sudo chown ubuntu:ubuntu /var/www/lara-ai
cd /var/www/lara-ai
```

4. **Upload Your Files**:
   Copy the contents of `server-production.js` and `backend-package.json` to your EC2 instance.

5. **Install Dependencies**:

```bash
npm install
```

## 🔑 **Step 4: Configure Environment Variables**

1. **Edit the .env file**:

```bash
cd /var/www/lara-ai
nano .env
```

2. **Add your credentials**:

```env
GEMINI_API_KEY=AIzaSyDmcs2aOiu4DobBK-UQYBzPagr5EZvATY4
PORT=5000
NODE_ENV=production
CORS_ORIGIN=*
```

## 🏃 **Step 5: Start the Server**

### Start with PM2:

```bash
cd /var/www/lara-ai
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### Verify it's running:

```bash
pm2 status
curl http://localhost:5000/health
```

## 🌐 **Step 6: Configure Domain (Optional)**

### Option A: Use EC2 Public IP

- Your API will be available at: `http://YOUR-EC2-PUBLIC-IP:5000`

### Option B: Use Custom Domain

1. **Set up Elastic IP** (recommended for production)
2. **Configure Route 53** or your DNS provider
3. **Set up SSL with Let's Encrypt**:

```bash
sudo apt install -y certbot nginx
# Follow certbot instructions for your domain
```

## 🎯 **Step 7: Update Frontend Configuration**

### 7.1 Create Environment File

Create `.env` in your project root:

```env
VITE_API_URL=http://YOUR-EC2-PUBLIC-IP:5000
```

### 7.2 For Production Build:

```env
VITE_API_URL=https://your-domain.com
```

### 7.3 Build and Deploy Frontend:

```bash
npm run build
```

## 🔍 **Step 8: Testing**

### Test Backend Health:

```bash
curl http://YOUR-EC2-PUBLIC-IP:5000/health
```

### Test AI Endpoint:

```bash
curl -X POST http://YOUR-EC2-PUBLIC-IP:5000/api/lara/ask \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, how are you?"}'
```

## 📊 **Step 9: Monitoring & Maintenance**

### Useful PM2 Commands:

```bash
pm2 status          # Check server status
pm2 logs            # View server logs
pm2 restart all     # Restart server
pm2 stop all        # Stop server
pm2 delete all      # Delete all processes
```

### View Logs:

```bash
pm2 logs lara-ai-backend
```

### Monitor Resource Usage:

```bash
pm2 monit
```

## 🔧 **Troubleshooting**

### Common Issues:

1. **Port 5000 blocked**:

   - Check EC2 Security Group allows inbound port 5000
   - Check Ubuntu firewall: `sudo ufw status`
   - Allow port if needed: `sudo ufw allow 5000/tcp`

2. **API Key not working**:

   - Verify `.env` file has correct API key
   - Check PM2 logs: `pm2 logs`

3. **CORS errors**:

   - Update `CORS_ORIGIN` in `.env` to your frontend domain
   - Restart server: `pm2 restart all`

4. **Server not starting**:

   - Check Node.js version: `node --version`
   - Install dependencies: `npm install`
   - Check PM2 status: `pm2 status`
   - Check system logs: `sudo journalctl -u pm2-ubuntu`

5. **NVM not found after reboot**:

   ```bash
   source ~/.bashrc
   # or
   source ~/.profile
   ```

6. **Permission issues**:
   ```bash
   sudo chown -R ubuntu:ubuntu /var/www/lara-ai
   ```

## 🎉 **Success!**

Your Lara AI backend is now running on AWS EC2 Ubuntu!

**Your API endpoints:**

- Health Check: `http://YOUR-EC2-PUBLIC-IP:5000/health`
- AI Chat: `http://YOUR-EC2-PUBLIC-IP:5000/api/lara/ask`

## 📋 **Quick Start Commands:**

```bash
# 1. Upload and run deployment script
scp -i "your-key.pem" deploy-to-ec2.sh ubuntu@YOUR-EC2-IP:~/
ssh -i "your-key.pem" ubuntu@YOUR-EC2-IP
chmod +x deploy-to-ec2.sh && ./deploy-to-ec2.sh

# 2. Add your API key
nano /var/www/lara-ai/.env

# 3. Start the server
pm2 start ecosystem.config.js
```

## 📝 **Next Steps (Optional)**

1. **Set up SSL/TLS** for HTTPS
2. **Configure Load Balancer** for high availability
3. **Set up CloudWatch** for monitoring
4. **Create RDS database** if needed
5. **Set up CI/CD pipeline** for automatic deployments

## 💰 **Cost Considerations**

- **t2.micro**: Free tier eligible (first 12 months)
- **Elastic IP**: $0.005/hour when not attached
- **Data transfer**: First 1GB/month free

## 🐧 **Ubuntu-Specific Notes**

- Default user: `ubuntu` (not `ec2-user`)
- Package manager: `apt` (not `yum`)
- Firewall: `ufw` (not `firewalld`)
- Service management: `systemctl`

---

**Need Help?** Check the troubleshooting section or PM2 logs for error details.
