# PersonaLens Deployment Guide

Complete guide for deploying PersonaLens to production environments.

---

## 📋 Table of Contents

1. [Quick Deploy (Docker Compose)](#quick-deploy-docker-compose)
2. [Production Deployment Checklist](#production-deployment-checklist)
3. [Cloud Platform Deployments](#cloud-platform-deployments)
4. [Environment Configuration](#environment-configuration)
5. [Security Hardening](#security-hardening)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Deploy (Docker Compose)

### Local/VPS Deployment (Recommended for Getting Started)

**Prerequisites:**
- Docker and Docker Compose installed
- Domain name (optional, but recommended for production)
- MongoDB Atlas account OR local MongoDB

**Steps:**

1. **Clone the repository**
   ```bash
   git clone https://github.com/sadumina/PersonaLens.git
   cd PersonaLens
   ```

2. **Configure environment variables**
   ```bash
   # Backend environment
   cp personalens-backend/.env.example personalens-backend/.env
   
   # Edit the .env file
   nano personalens-backend/.env
   ```

   **Critical variables to set:**
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/database
   DATABASE_NAME=personalens
   JWT_SECRET=your-super-secret-key-min-32-characters
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   CORS_ORIGINS=["http://your-domain.com", "https://your-domain.com"]
   ENVIRONMENT=production
   ```

3. **Update docker-compose.yml for production**
   
   If using MongoDB Atlas (recommended):
   ```yaml
   # Remove mongodb service, update backend environment:
   backend:
     environment:
       - MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
   ```

4. **Build and start services**
   ```bash
   docker-compose up --build -d
   ```

5. **Verify deployment**
   ```bash
   # Check container status
   docker-compose ps
   
   # Check logs
   docker-compose logs -f
   
   # Test API
   curl http://localhost:8000/health
   
   # Access frontend
   # Open browser to http://localhost
   ```

6. **Stop services**
   ```bash
   docker-compose down
   
   # To also remove volumes
   docker-compose down -v
   ```

---

## ✅ Production Deployment Checklist

### Before Deployment

- [ ] **MongoDB Setup**
  - [ ] MongoDB Atlas cluster created
  - [ ] IP whitelist configured (or 0.0.0.0/0 for any IP)
  - [ ] Database user created with proper permissions
  - [ ] Connection string tested

- [ ] **Environment Variables**
  - [ ] All `.env` files created from `.env.example`
  - [ ] JWT_SECRET changed (min 32 characters)
  - [ ] MONGODB_URI configured
  - [ ] CORS_ORIGINS set to your domain(s)
  - [ ] ENVIRONMENT set to "production"

- [ ] **Domain & SSL**
  - [ ] Domain name registered
  - [ ] DNS records pointed to server
  - [ ] SSL certificate obtained (Let's Encrypt recommended)

- [ ] **Server**
  - [ ] Server provisioned (2GB RAM minimum)
  - [ ] Docker and Docker Compose installed
  - [ ] Firewall configured (ports 80, 443, 22)
  - [ ] SSH access configured

### Security

- [ ] **Secrets Management**
  - [ ] JWT_SECRET is random and secure (32+ chars)
  - [ ] MongoDB password is strong
  - [ ] No secrets in source control
  - [ ] Environment files have proper permissions (600)

- [ ] **Network Security**
  - [ ] Firewall enabled (ufw or cloud firewall)
  - [ ] Only necessary ports open (80, 443, 22)
  - [ ] SSH key-based authentication enabled
  - [ ] Fail2ban or similar installed

- [ ] **Application Security**
  - [ ] HTTPS enabled (redirect HTTP to HTTPS)
  - [ ] CORS properly configured
  - [ ] Rate limiting enabled
  - [ ] Input validation active

### Post-Deployment

- [ ] **Testing**
  - [ ] Health check endpoint responding
  - [ ] User registration working
  - [ ] User login working
  - [ ] CV upload working
  - [ ] Analysis working
  - [ ] History page accessible

- [ ] **Monitoring**
  - [ ] Logs being collected
  - [ ] Monitoring tool configured
  - [ ] Alerts set up for errors
  - [ ] Backup schedule created

---

## ☁️ Cloud Platform Deployments

### Option 1: DigitalOcean Droplet (Recommended for Beginners)

**Cost:** ~$6-12/month

**Steps:**

1. **Create Droplet**
   - Size: Basic, 2GB RAM ($12/month)
   - OS: Ubuntu 22.04 LTS
   - Enable monitoring

2. **Initial Server Setup**
   ```bash
   # SSH into droplet
   ssh root@your-droplet-ip
   
   # Update system
   apt update && apt upgrade -y
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   apt install docker-compose -y
   
   # Create non-root user
   adduser personalens
   usermod -aG sudo personalens
   usermod -aG docker personalens
   su - personalens
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/sadumina/PersonaLens.git
   cd PersonaLens
   
   # Configure environment
   cp personalens-backend/.env.example personalens-backend/.env
   nano personalens-backend/.env
   
   # Deploy
   docker-compose up --build -d
   ```

4. **Setup Domain and SSL**
   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx -y
   
   # Get SSL certificate
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

5. **Configure Nginx (if needed)**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl;
       server_name yourdomain.com;

       ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

       location / {
           proxy_pass http://localhost:80;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       location /api {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

---

### Option 2: AWS EC2

**Cost:** ~$10-50/month

**Steps:**

1. **Launch EC2 Instance**
   - AMI: Ubuntu Server 22.04 LTS
   - Instance Type: t3.small or t3.medium
   - Security Group: Allow ports 22, 80, 443
   - Key pair for SSH access

2. **Connect and Setup**
   ```bash
   # SSH into instance
   ssh -i your-key.pem ubuntu@your-ec2-public-ip
   
   # Follow same setup as DigitalOcean above
   ```

3. **Optional: Use Elastic IP**
   - Allocate an Elastic IP
   - Associate with your EC2 instance
   - Point your domain to the Elastic IP

---

### Option 3: Google Cloud Platform (GCP)

**Using Cloud Run (Serverless):**

1. **Prepare for Cloud Run**
   ```bash
   # Backend
   cd personalens-backend
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/personalens-backend
   
   # Frontend
   cd personalens-frontend
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/personalens-frontend
   ```

2. **Deploy Services**
   ```bash
   # Backend
   gcloud run deploy personalens-backend \
     --image gcr.io/YOUR_PROJECT_ID/personalens-backend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars MONGODB_URI=your-uri,JWT_SECRET=your-secret
   
   # Frontend
   gcloud run deploy personalens-frontend \
     --image gcr.io/YOUR_PROJECT_ID/personalens-frontend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

---

### Option 4: Azure

**Using Azure Container Instances:**

1. **Create Resource Group**
   ```bash
   az group create --name PersonaLensRG --location eastus
   ```

2. **Create Container Registry**
   ```bash
   az acr create --resource-group PersonaLensRG \
     --name personalensregistry --sku Basic
   ```

3. **Build and Push Images**
   ```bash
   # Login to registry
   az acr login --name personalensregistry
   
   # Build and push
   docker-compose build
   docker tag personalens_backend personalensregistry.azurecr.io/backend:latest
   docker tag personalens_frontend personalensregistry.azurecr.io/frontend:latest
   docker push personalensregistry.azurecr.io/backend:latest
   docker push personalensregistry.azurecr.io/frontend:latest
   ```

4. **Deploy Container Instances**
   ```bash
   az container create \
     --resource-group PersonaLensRG \
     --name personalens \
     --image personalensregistry.azurecr.io/backend:latest \
     --dns-name-label personalens-api \
     --ports 8000
   ```

---

### Option 5: Heroku

**Using Container Registry:**

1. **Install Heroku CLI and Login**
   ```bash
   heroku login
   heroku container:login
   ```

2. **Create Apps**
   ```bash
   heroku create personalens-backend
   heroku create personalens-frontend
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set -a personalens-backend \
     MONGODB_URI=your-uri \
     JWT_SECRET=your-secret \
     DATABASE_NAME=personalens
   ```

4. **Deploy**
   ```bash
   # Backend
   cd personalens-backend
   heroku container:push web -a personalens-backend
   heroku container:release web -a personalens-backend
   
   # Frontend
   cd personalens-frontend
   heroku container:push web -a personalens-frontend
   heroku container:release web -a personalens-frontend
   ```

---

## 🔐 Environment Configuration

### Backend (.env)

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
DATABASE_NAME=personalens

# JWT Settings
JWT_SECRET=your-super-secret-key-minimum-32-characters-long
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# CORS
CORS_ORIGINS=["https://yourdomain.com", "https://www.yourdomain.com"]

# Environment
ENVIRONMENT=production

# Optional: Logging
LOG_LEVEL=INFO
```

### Frontend (.env)

```env
VITE_API_URL=https://api.yourdomain.com
```

### Docker Compose (Production)

For production with MongoDB Atlas:

```yaml
version: '3.8'

services:
  backend:
    build: ./personalens-backend
    restart: always
    ports:
      - "8000:8000"
    env_file:
      - ./personalens-backend/.env
    networks:
      - personalens-network

  frontend:
    build: ./personalens-frontend
    restart: always
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=https://api.yourdomain.com
    depends_on:
      - backend
    networks:
      - personalens-network

networks:
  personalens-network:
    driver: bridge
```

---

## 🔒 Security Hardening

### 1. Generate Secure JWT Secret

```bash
# Generate a strong random secret
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
# OR
openssl rand -base64 32
```

### 2. Configure Firewall

```bash
# Ubuntu/Debian (ufw)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Check status
sudo ufw status
```

### 3. Enable HTTPS

**Using Let's Encrypt (Recommended):**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal is configured automatically
# Test renewal
sudo certbot renew --dry-run
```

### 4. Secure MongoDB Atlas

- Enable IP Whitelist (specific IPs or 0.0.0.0/0 for any)
- Use strong passwords
- Enable authentication
- Use connection string with SSL/TLS

### 5. Environment File Permissions

```bash
# Restrict access to .env files
chmod 600 personalens-backend/.env
chmod 600 personalens-frontend/.env
```

### 6. Update Docker Compose for Production

```yaml
# Add security options
services:
  backend:
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
```

---

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Backend health
curl https://api.yourdomain.com/health

# Expected response:
# {"status": "ok", "database": {"status": "connected"}}
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Update Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose up --build -d

# Remove old images
docker image prune -f
```

### Backup Strategy

**MongoDB Atlas:**
- Automatic backups enabled by default
- Point-in-time recovery available
- Download backups for extra safety

**Database Backup (if self-hosted):**
```bash
# Backup
docker exec mongodb mongodump --out /tmp/backup

# Restore
docker exec mongodb mongorestore /tmp/backup
```

### Performance Monitoring

**Install monitoring tools:**

```bash
# Install Netdata (real-time monitoring)
bash <(curl -Ss https://my-netdata.io/kickstart.sh)

# Access at http://your-server-ip:19999
```

---

## 🔧 Troubleshooting

### Issue: Backend won't start

**Check logs:**
```bash
docker-compose logs backend
```

**Common causes:**
- MongoDB connection failed → Check MONGODB_URI
- Port already in use → Change port or stop conflicting service
- Environment variables missing → Check .env file

### Issue: Frontend shows blank page

**Check:**
1. Backend is running: `curl http://localhost:8000/health`
2. Frontend build successful: `docker-compose logs frontend`
3. API URL correct in frontend .env
4. Browser console for errors (F12)

### Issue: CORS errors

**Fix:**
1. Add your domain to CORS_ORIGINS in backend .env
2. Rebuild: `docker-compose up --build -d backend`
3. Clear browser cache

### Issue: SSL certificate renewal fails

```bash
# Check Certbot logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# Manual renewal
sudo certbot renew --force-renewal

# Restart nginx
sudo systemctl restart nginx
```

### Issue: High memory usage

```bash
# Check resource usage
docker stats

# Restart services
docker-compose restart

# Or increase server resources
```

### Issue: Database connection timeout

**Solutions:**
1. Check MongoDB Atlas IP whitelist
2. Verify network connectivity: `ping cluster.mongodb.net`
3. Check connection string format
4. Ensure database cluster is not paused

---

## 📱 Quick Commands Reference

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose up --build -d

# Check status
docker-compose ps

# Update application
git pull && docker-compose up --build -d

# Backup database (if self-hosted)
docker exec mongodb mongodump --out /backup

# Clean up
docker system prune -a
```

---

## 🆘 Getting Help

If you encounter issues:

1. Check logs: `docker-compose logs -f`
2. Review documentation:
   - [QUICKSTART.md](QUICKSTART.md)
   - [MONGODB_CONNECTION_FIX.md](MONGODB_CONNECTION_FIX.md)
   - [REGISTRATION_TROUBLESHOOTING.md](REGISTRATION_TROUBLESHOOTING.md)
3. Check health endpoint: `curl http://localhost:8000/health`
4. Review [GitHub Issues](https://github.com/sadumina/PersonaLens/issues)

---

## 🎉 Success!

Your PersonaLens application should now be deployed and accessible!

- Frontend: https://yourdomain.com
- Backend API: https://api.yourdomain.com
- API Docs: https://api.yourdomain.com/docs

**Next steps:**
1. Test all functionality (register, login, upload, analyze)
2. Set up monitoring and alerts
3. Configure automatic backups
4. Document your specific deployment for your team

Happy analyzing! 🚀
