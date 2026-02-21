# Realtime Chat App

A modern real-time chat application built with Next.js 14, Convex, and Clerk.

## Features

- 🔐 Secure authentication with Clerk
- ⚡ Real-time messaging with Convex
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- 📱 Responsive design
- 🔄 Automatic user sync between Clerk and Convex

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: Clerk
- **Database & Real-time**: Convex
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm package manager

### Installation

1. Clone the repository and navigate to the project:
```bash
cd realtime-chat-app
```

2. Install dependencies:
```bash
npm install
```

3. Environment variables are already configured in `.env.local`

4. Start the Convex development server (in a separate terminal):
```bash
npx convex dev
```

5. Start the Next.js development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
realtime-chat-app/
├── app/
│   ├── dashboard/          # Protected dashboard page
│   ├── sign-in/           # Clerk sign-in page
│   ├── sign-up/           # Clerk sign-up page
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Landing page
│   └── providers.tsx      # Clerk + Convex providers
├── components/
│   └── ui/                # shadcn/ui components
├── convex/
│   ├── schema.ts          # Database schema
│   ├── users.ts           # User functions
│   └── _generated/        # Auto-generated Convex types
├── lib/
│   └── utils.ts           # Utility functions
└── middleware.ts          # Clerk middleware for route protection
```

## Key Features Implemented

### Authentication
- Landing page with sign-in/sign-up buttons
- Protected dashboard route
- Automatic user profile sync to Convex database

### Database Schema
- Users table with fields:
  - clerkId (indexed)
  - name
  - email
  - imageUrl
  - isOnline
  - lastSeen

### Convex Functions
- `syncUser`: Creates or updates user in database
- `getUserByClerkId`: Fetches user by Clerk ID
- `getAllUsers`: Retrieves all users
- `updateUserStatus`: Updates user online status

## Design System

The app uses a consistent design system:
- **Primary Color**: Blue (600-700 range)
- **Neutral Colors**: Slate (50-900 range)
- **Typography**: Geist Sans font family
- **Spacing**: Consistent padding and margins
- **Components**: shadcn/ui for buttons, avatars, dropdowns

## Next Steps

To extend this application, consider adding:
- Chat rooms/channels
- Direct messaging
- Message history
- File uploads
- User presence indicators
- Typing indicators
- Read receipts

## Environment Variables

The following environment variables are configured in `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CONVEX_DEPLOYMENT=your_convex_deployment_url
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

## Troubleshooting

### Convex Types Not Generated

If you see TypeScript errors about missing Convex types, run:
```bash
npx convex dev
```

This will generate the necessary type definitions in `convex/_generated/`.

### Authentication Issues

Make sure your Clerk environment variables are correctly set in `.env.local` and match your Clerk dashboard settings.

## License

MIT
