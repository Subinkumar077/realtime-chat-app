# Realtime Chat Application

A modern real-time chat application with instant messaging, reactions, typing indicators, and online status tracking.

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Convex (serverless)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Deployment**: Vercel

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CONVEX_DEPLOYMENT=your_convex_deployment_url
NEXT_PUBLIC_CONVEX_URL=your_convex_url
