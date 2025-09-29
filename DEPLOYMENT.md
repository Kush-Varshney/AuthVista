# Deployment Guide

This guide covers deploying the Full-Stack Notes Application to various platforms.

## 🚀 Quick Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)
- **Frontend**: Deploy to Vercel (recommended for React apps)
- **Backend**: Deploy to Railway (great for Node.js APIs)
- **Database**: MongoDB Atlas (cloud database)

### Option 2: Netlify (Frontend) + Heroku (Backend)
- **Frontend**: Deploy to Netlify
- **Backend**: Deploy to Heroku
- **Database**: MongoDB Atlas

### Option 3: Full Stack on Railway
- Deploy both frontend and backend to Railway
- Use MongoDB Atlas for database

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Environment variables documented
- [ ] Production build tested locally
- [ ] API endpoints tested with production database
- [ ] CORS configured for production domains
- [ ] Security headers configured
- [ ] Rate limiting configured appropriately

## 🗄️ Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account and cluster

2. **Configure Database Access**
   - Create a database user
   - Add your deployment platform's IP addresses to whitelist
   - For development: Add `0.0.0.0/0` (not recommended for production)

3. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## 🖥️ Backend Deployment

### Railway Deployment

1. **Prepare for Deployment**
   \`\`\`bash
   cd server
   # Ensure package.json has correct start script
   npm run build  # if you have a build step
   \`\`\`

2. **Deploy to Railway**
   - Install Railway CLI: `npm install -g @railway/cli`
   - Login: `railway login`
   - Initialize: `railway init`
   - Deploy: `railway up`

3. **Set Environment Variables**
   \`\`\`bash
   railway variables set NODE_ENV=production
   railway variables set MONGODB_URI="your-mongodb-atlas-connection-string"
   railway variables set JWT_SECRET="your-super-secret-jwt-key"
   railway variables set CLIENT_URL="https://your-frontend-domain.com"
   \`\`\`

### Heroku Deployment

1. **Prepare for Deployment**
   \`\`\`bash
   cd server
   # Create Procfile
   echo "web: node server.js" > Procfile
   \`\`\`

2. **Deploy to Heroku**
   \`\`\`bash
   # Install Heroku CLI and login
   heroku create your-app-name
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   \`\`\`

3. **Set Environment Variables**
   \`\`\`bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI="your-mongodb-atlas-connection-string"
   heroku config:set JWT_SECRET="your-super-secret-jwt-key"
   heroku config:set CLIENT_URL="https://your-frontend-domain.com"
   \`\`\`

## 🌐 Frontend Deployment

### Vercel Deployment

1. **Prepare for Deployment**
   \`\`\`bash
   cd client
   # Create production build
   npm run build
   \`\`\`

2. **Deploy to Vercel**
   - Install Vercel CLI: `npm install -g vercel`
   - Login: `vercel login`
   - Deploy: `vercel --prod`

3. **Set Environment Variables**
   - Go to Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-domain.com/api`

### Netlify Deployment

1. **Build and Deploy**
   \`\`\`bash
   cd client
   npm run build
   # Upload build folder to Netlify or use Git integration
   \`\`\`

2. **Configure Environment Variables**
   - Go to Netlify dashboard
   - Site settings > Environment variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-domain.com/api`

3. **Configure Redirects**
   Create `client/public/_redirects`:
   \`\`\`
   /*    /index.html   200
   \`\`\`

## 🔧 Production Configuration

### Backend Production Settings

\`\`\`javascript
// server/server.js - Production optimizations
if (process.env.NODE_ENV === 'production') {
  // Trust proxy for Railway/Heroku
  app.set('trust proxy', 1);
  
  // Stricter CORS in production
  app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }));
  
  // Enhanced security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));
}
\`\`\`

### Frontend Production Settings

\`\`\`javascript
// client/src/utils/api.js - Production API configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
\`\`\`

## 🔒 Security Considerations

### Environment Variables
Never commit sensitive environment variables to version control:

\`\`\`bash
# Backend .env (never commit)
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/AuthVista
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRE=30d
CLIENT_URL=https://your-frontend-domain.com

# Frontend .env (never commit)
REACT_APP_API_URL=https://your-backend-domain.com/api
\`\`\`

### Security Headers
Ensure these are configured in production:
- HTTPS only
- CORS properly configured
- Rate limiting enabled
- Input validation on all endpoints
- JWT tokens with reasonable expiration

## 📊 Monitoring and Logging

### Backend Monitoring
\`\`\`javascript
// Add to server.js
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Error logging
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});
\`\`\`

### Performance Monitoring
Consider adding:
- Application performance monitoring (APM)
- Error tracking (Sentry)
- Uptime monitoring
- Database performance monitoring

## 🔄 CI/CD Pipeline

### GitHub Actions Example
\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway login --token ${{ secrets.RAILWAY_TOKEN }}
          railway up

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --token ${{ secrets.VERCEL_TOKEN }} --prod
\`\`\`

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure CLIENT_URL is set correctly
   - Check that frontend URL matches CORS configuration

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist settings
   - Ensure database user has correct permissions

3. **Environment Variables Not Loading**
   - Verify variables are set in deployment platform
   - Check variable names match exactly
   - Restart application after setting variables

4. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Verify build scripts are correct

### Debugging Commands

\`\`\`bash
# Check Railway logs
railway logs

# Check Heroku logs
heroku logs --tail

# Test API endpoints
curl https://your-backend-domain.com/api/health

# Test database connection
mongosh "your-mongodb-connection-string"
\`\`\`

## 📈 Scaling Considerations

### Database Scaling
- Use MongoDB Atlas auto-scaling
- Implement database indexing for better performance
- Consider read replicas for high-traffic applications

### Application Scaling
- Use horizontal scaling on Railway/Heroku
- Implement caching strategies (Redis)
- Use CDN for static assets
- Consider microservices architecture for large applications

### Monitoring Scaling
- Set up alerts for high CPU/memory usage
- Monitor response times
- Track error rates
- Monitor database performance

This deployment guide should help you successfully deploy your Notes Application to production. Remember to test thoroughly in a staging environment before deploying to production.
