
# Deployment Guide - FriendlyMart System

## Deployment Options

### 1. Lovable (Recommended for beginners)
- Click the "Publish" button in Lovable interface
- Your app will be automatically deployed
- Custom domain can be connected (paid plan required)

### 2. Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

### 3. Netlify
```bash
# Build the project
npm run build

# Deploy dist folder to Netlify
# Or connect your GitHub repo to Netlify for automatic deployments
```

### 4. GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

## Environment Configuration

### Production Environment Variables
For production deployment, consider these configurations:

```env
# If using Supabase (recommended for production)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email service (if implementing real emails)
VITE_EMAIL_SERVICE_URL=your_email_service_url
VITE_EMAIL_API_KEY=your_email_api_key
```

## Pre-deployment Checklist

- [ ] Test all features in production build (`npm run build && npm run preview`)
- [ ] Verify all routes work correctly
- [ ] Check responsive design on different devices
- [ ] Test authentication flow
- [ ] Verify data persistence
- [ ] Check console for any errors
- [ ] Optimize images and assets
- [ ] Set up error monitoring (optional)

## Post-deployment Steps

1. **Test the deployed application**
2. **Set up monitoring** (Google Analytics, etc.)
3. **Configure custom domain** (if needed)
4. **Set up SSL certificate** (usually automatic)
5. **Create backup strategy** for localStorage data

## Performance Optimization

### Before Deployment
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist

# Check for unused dependencies
npx depcheck
```

### Production Optimizations
- Enable compression (gzip/brotli)
- Set up CDN for static assets
- Implement service worker for caching
- Optimize images and fonts

## Troubleshooting Deployment Issues

### Common Issues

**Build Failures**
- Check TypeScript errors: `npm run build`
- Verify all imports and dependencies
- Check environment variables

**Routing Issues**
- Configure your hosting for SPA routing
- Ensure all routes redirect to index.html

**Asset Loading Problems**
- Check base URL in vite.config.ts
- Verify asset paths are correct

### Platform-specific Solutions

**Vercel**: Add `vercel.json` for SPA routing:
```json
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/.*", "dest": "/index.html" }
  ]
}
```

**Netlify**: Add `_redirects` file in public folder:
```
/*    /index.html   200
```

## Security Considerations for Production

- Use HTTPS (usually automatic with modern hosts)
- Implement proper authentication backend
- Hash passwords properly
- Validate all user inputs
- Set up CORS properly
- Use environment variables for sensitive data

## Monitoring and Analytics

Consider implementing:
- Google Analytics for user behavior
- Error tracking (Sentry, LogRocket)
- Performance monitoring
- Uptime monitoring

---

Choose the deployment method that best fits your needs and technical expertise. Lovable and Vercel offer the easiest deployment experience for beginners.
