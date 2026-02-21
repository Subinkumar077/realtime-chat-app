# Deployment Guide

## Pre-Deployment Checklist

Before deploying to production, ensure:

- ✅ All features tested locally
- ✅ No TypeScript errors
- ✅ Environment variables configured
- ✅ Convex deployment ready
- ✅ Clerk production keys obtained

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

#### Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   
   In Vercel dashboard, add these environment variables:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_production_clerk_key
   CLERK_SECRET_KEY=your_production_clerk_secret
   CONVEX_DEPLOYMENT=your_production_convex_url
   NEXT_PUBLIC_CONVEX_URL=your_production_convex_url
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your app
   - You'll get a production URL

5. **Update Clerk Settings**
   - Go to Clerk dashboard
   - Update allowed redirect URLs to include your Vercel domain
   - Add your production domain to allowed origins

### Option 2: Other Platforms

You can also deploy to:
- **Netlify**: Similar to Vercel
- **AWS Amplify**: For AWS infrastructure
- **Railway**: Simple deployment platform
- **DigitalOcean App Platform**: Managed hosting

## Convex Production Setup

1. **Create Production Deployment**
   ```bash
   npx convex deploy
   ```

2. **Get Production URL**
   - Convex will provide a production URL
   - Update your environment variables with this URL

3. **Configure Clerk Integration**
   - In Convex dashboard, go to Settings
   - Add Clerk integration
   - Configure JWT issuer URL from Clerk

## Environment Variables

### Development (.env.local)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CONVEX_DEPLOYMENT=https://your-dev-deployment.convex.cloud
NEXT_PUBLIC_CONVEX_URL=https://your-dev-deployment.convex.cloud
```

### Production (Vercel/Platform)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CONVEX_DEPLOYMENT=https://your-prod-deployment.convex.cloud
NEXT_PUBLIC_CONVEX_URL=https://your-prod-deployment.convex.cloud
```

## Post-Deployment

1. **Test Authentication**
   - Sign up with a new account
   - Verify user sync to Convex
   - Test sign out and sign in

2. **Monitor**
   - Check Vercel logs for errors
   - Monitor Convex dashboard for database activity
   - Check Clerk dashboard for authentication events

3. **Performance**
   - Run Lighthouse audit
   - Check Core Web Vitals
   - Optimize images if needed

## Troubleshooting

### Issue: Authentication not working in production

**Solution**: 
- Verify Clerk production keys are correct
- Check allowed redirect URLs in Clerk dashboard
- Ensure domain is added to allowed origins

### Issue: Convex connection fails

**Solution**:
- Verify CONVEX_DEPLOYMENT URL is correct
- Check Convex dashboard for deployment status
- Ensure Clerk integration is configured in Convex

### Issue: Build fails on Vercel

**Solution**:
- Check build logs for specific errors
- Ensure all dependencies are in package.json
- Verify TypeScript has no errors locally

## Security Checklist

- ✅ Use production Clerk keys (not test keys)
- ✅ Never commit .env.local to git
- ✅ Use environment variables for all secrets
- ✅ Enable HTTPS (automatic on Vercel)
- ✅ Configure CORS properly in Convex
- ✅ Set up proper authentication middleware

## Monitoring & Analytics

Consider adding:
- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking
- **PostHog**: Product analytics
- **LogRocket**: Session replay

## Scaling Considerations

As your app grows:
- Convex automatically scales
- Consider Vercel Pro for better performance
- Implement caching strategies
- Optimize database queries
- Add CDN for static assets

## Backup & Recovery

- Convex provides automatic backups
- Export data regularly from Convex dashboard
- Keep git history clean and organized
- Document any manual database changes

## Cost Estimates

### Free Tier (Development)
- Vercel: Free for personal projects
- Convex: Free tier available
- Clerk: Free up to 10,000 MAU

### Production (Estimated)
- Vercel Pro: $20/month
- Convex: Pay as you grow
- Clerk: Starts at $25/month

## Support Resources

- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Convex**: [docs.convex.dev](https://docs.convex.dev)
- **Clerk**: [clerk.com/docs](https://clerk.com/docs)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)

---

Ready to deploy? Start with Vercel for the easiest experience! 🚀
