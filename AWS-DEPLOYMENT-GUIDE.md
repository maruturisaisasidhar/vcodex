# 🚀 AWS EC2 Deployment Guide for Lara AI Backend

## 📋 Overview

This guide will help you deploy your Lara AI chatbot backend to AWS EC2 and configure your frontend to use the AWS-hosted API instead of localhost.

## 🔧 **Step 1: Prepare Your Local Files**

### Files Modified:

✅ `src/routes/laraAI.js` - Updated to use environment variables  
✅ `src/components/panels/AiPanel.jsx` - Updated to use new API structure  
✅ `server-production.js` - Production-ready server code  
✅ `deploy-to-ec2.sh` - Automated deployment script  
✅ `.env.example` - Environment variables template

## 🖥️ **Step 2: Set Up AWS EC2 Instance**

### 2.1 Launch EC2 Instance

1. Go to AWS Console → EC2
2. Launch new instance:
   - **AMI**: Ubuntu Server 22.04 LTS (or Amazon Linux 2)
   - **Instance Type**: t2.micro (free tier) or t3.small
   - **Security Group**: Create new with these rules:

### 🔒 **Security Group Rules (IMPORTANT):**

**Inbound Rules:**
| Type | Protocol | Port Range | Source | Description |
|-------------|----------|------------|---------------|--------------------------|
| SSH | TCP | 22 | Your IP | SSH access |
| HTTP | TCP | 80 | 0.0.0.0/0 | HTTP traffic |
| HTTPS | TCP | 443 | 0.0.0.0/0 | HTTPS traffic |
| Custom TCP | TCP | 5000 | 0.0.0.0/0 | Lara AI Backend API |

**Outbound Rules:**
| Type | Protocol | Port Range | Destination | Description |
|-------------|----------|------------|---------------|--------------------------|
| All traffic | All | All | 0.0.0.0/0 | Allow all outbound |

**To add these in AWS Console:**

1. Go to EC2 → Security Groups
2. Select your security group or create new one
3. Click "Edit inbound rules"
4. Add each rule:

   - **SSH**: Type=SSH, Port=22, Source=Your IP (recommended) or 0.0.0.0/0
   - **HTTP**: Type=HTTP, Port=80, Source=0.0.0.0/0
   - **HTTPS**: Type=HTTPS, Port=443, Source=0.0.0.0/0
   - **Custom TCP**: Type=Custom TCP, Port=5000, Source=0.0.0.0/0

   - **Key Pair**: Create/select your key pair

### 2.2 Connect to EC2

```bash
# For Ubuntu
ssh -i "your-key.pem" ubuntu@YOUR-EC2-PUBLIC-IP

# For Amazon Linux
ssh -i "your-key.pem" ec2-user@YOUR-EC2-PUBLIC-IP
```

## 🚀 **Step 3: Deploy Backend to EC2**

### Option A: Automatic Deployment (Recommended)

1. Upload the deployment script to your EC2:

```bash
scp -i "your-key.pem" deploy-to-ec2.sh ec2-user@YOUR-EC2-PUBLIC-IP:~/
```

2. Run the deployment script:

```bash
ssh -i "your-key.pem" ec2-user@YOUR-EC2-PUBLIC-IP
chmod +x deploy-to-ec2.sh
./deploy-to-ec2.sh
```

### Option B: Manual Deployment

1. **Install Node.js**:

```bash
sudo yum update -y
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
sudo chown ec2-user:ec2-user /var/www/lara-ai
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
sudo yum install -y certbot
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

   - **Check EC2 Security Group** allows inbound port 5000 from 0.0.0.0/0
   - **Verify Security Group is attached** to your EC2 instance
   - Check Ubuntu firewall: `sudo ufw status`
   - Allow port if needed: `sudo ufw allow 5000/tcp`

2. **Cannot connect to server**:
   - Verify Security Group has port 5000 open
   - Check if server is running: `pm2 status`
   - Test locally first: `curl http://localhost:5000/health`
   - Get public IP: `curl -s http://checkip.amazonaws.com`

## 🎉 **Success!**

Your Lara AI backend is now running on AWS EC2!

**Your API endpoints:**

- Health Check: `http://YOUR-EC2-PUBLIC-IP:5000/health`
- AI Chat: `http://YOUR-EC2-PUBLIC-IP:5000/api/lara/ask`

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

---

**Need Help?** Check the troubleshooting section or PM2 logs for error details.

**Quick Security Group Setup Commands:**

```bash
# After creating your instance, get the security group ID
aws ec2 describe-instances --instance-ids YOUR-INSTANCE-ID

# Add port 5000 rule (replace sg-xxxxxxxxx with your security group ID)
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 5000 \
  --cidr 0.0.0.0/0
```
