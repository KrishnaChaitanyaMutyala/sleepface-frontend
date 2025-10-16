# Railway Deployment Guide 🚂

## Quick Start

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Login to Railway
```bash
railway login
```

### 3. Initialize Railway Project
```bash
railway init
```

### 4. Deploy to Railway
```bash
railway up
```

## Manual Deployment via Railway Dashboard

### 1. Go to [Railway.app](https://railway.app)
### 2. Sign up/Login with GitHub
### 3. Click "New Project" → "Deploy from GitHub repo"
### 4. Select your repository
### 5. Railway will automatically detect the Dockerfile and deploy

## Environment Variables

Set these in Railway dashboard:

```bash
# Database (if using PostgreSQL addon)
DATABASE_URL=postgresql://user:pass@host:port/dbname

# Redis (if using Redis addon)
REDIS_URL=redis://user:pass@host:port

# Optional: API Keys
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

## Addons

### PostgreSQL Database
1. Go to your project dashboard
2. Click "Add Service" → "Database" → "PostgreSQL"
3. Railway will automatically set `DATABASE_URL`

### Redis Cache
1. Go to your project dashboard  
2. Click "Add Service" → "Database" → "Redis"
3. Railway will automatically set `REDIS_URL`

## Monitoring

- **Logs**: View real-time logs in Railway dashboard
- **Metrics**: CPU, Memory, Network usage
- **Health Checks**: Automatic health monitoring at `/health`

## Scaling

- **Auto-scaling**: Railway automatically scales based on traffic
- **Manual scaling**: Adjust resources in dashboard
- **Custom domains**: Add custom domain in settings

## Cost Estimation

- **Starter**: $5/month (512MB RAM, 1 vCPU)
- **Pro**: $20/month (2GB RAM, 2 vCPU) 
- **Team**: $99/month (8GB RAM, 4 vCPU)

## Troubleshooting

### Common Issues:

1. **Build fails**: Check Dockerfile and requirements.txt
2. **Memory issues**: Upgrade to higher tier
3. **Slow startup**: Add health check timeout
4. **Dependencies**: Ensure all system deps are in Dockerfile

### Debug Commands:
```bash
# View logs
railway logs

# Connect to service
railway connect

# Check status
railway status
```

## Production Checklist

- [ ] Set up PostgreSQL database
- [ ] Configure Redis for caching
- [ ] Set up custom domain
- [ ] Configure environment variables
- [ ] Set up monitoring alerts
- [ ] Test health endpoints
- [ ] Configure backup strategy


