# Setup Guide

## Quick Start

Follow these steps to get your real-time chat application running:

### Step 1: Start Convex Development Server

Open a terminal and run:
```bash
npm run convex
```

This will:
- Connect to your Convex deployment
- Generate TypeScript types in `convex/_generated/`
- Watch for changes in your Convex functions

**Important**: Keep this terminal running while developing.

### Step 2: Start Next.js Development Server

Open a **second terminal** and run:
```bash
npm run dev
```

This will start the Next.js development server at [http://localhost:3000](http://localhost:3000)

### Step 3: Test the Application

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. Click "Sign Up" to create a new account
3. Complete the Clerk sign-up flow
4. You'll be redirected to the dashboard
5. Your user profile will automatically sync to Convex

## Verification Checklist

✅ Both terminals are running (Convex and Next.js)
✅ No TypeScript errors in the dashboard page
✅ You can sign up and sign in successfully
✅ Dashboard shows your user information
✅ User data is synced to Convex (check Convex dashboard)

## Common Issues

### Issue: TypeScript errors about missing `api.users`

**Solution**: Make sure the Convex dev server is running (`npm run convex`). It generates the necessary types.

### Issue: Authentication not working

**Solution**: Verify that the environment variables in `.env.local` match your Clerk dashboard settings.

### Issue: "Module not found" errors

**Solution**: Run `npm install` to ensure all dependencies are installed.

## Environment Variables

Your `.env.local` file should contain:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex Database
CONVEX_DEPLOYMENT=https://unique-coyote-699.convex.cloud
NEXT_PUBLIC_CONVEX_URL=https://unique-coyote-699.convex.cloud
```

## Project Architecture

### Authentication Flow
1. User signs up/in via Clerk
2. Clerk redirects to `/dashboard`
3. Dashboard component syncs user to Convex
4. User data is stored in Convex `users` table

### Protected Routes
- `/dashboard` - Requires authentication (protected by middleware)
- `/` - Public landing page
- `/sign-in` - Clerk sign-in page
- `/sign-up` - Clerk sign-up page

### Data Flow
```
Clerk Auth → Next.js App → Convex Database
     ↓            ↓              ↓
  User Info → Dashboard → User Sync
```

## Development Workflow

1. Make changes to your code
2. Next.js will hot-reload automatically
3. Convex will regenerate types when schema/functions change
4. Test in browser at localhost:3000

## Next Steps

Now that your app is running, you can:
- Add chat rooms functionality
- Implement direct messaging
- Add message history
- Create user presence indicators
- Build typing indicators

Refer to the main README.md for more details on extending the application.
