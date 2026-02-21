# 🚀 Start Here

Welcome to your Realtime Chat App! Follow these simple steps:

## 1️⃣ Open Two Terminals

You need two terminals running simultaneously.

### Terminal 1: Convex
```bash
cd realtime-chat-app
npm run convex
```

### Terminal 2: Next.js
```bash
cd realtime-chat-app
npm run dev
```

## 2️⃣ Open Your Browser

Navigate to: **http://localhost:3000**

## 3️⃣ Create an Account

1. Click "Sign Up"
2. Enter your email and password
3. Complete the sign-up process

## 4️⃣ You're Done! 🎉

You should now see your dashboard with your profile information.

---

## What's Configured?

✅ Next.js 14 with TypeScript and App Router
✅ Tailwind CSS for styling
✅ shadcn/ui components
✅ Clerk authentication
✅ Convex real-time database
✅ User profile sync
✅ Protected routes
✅ Modern, responsive design

## Need Help?

- See `SETUP.md` for detailed setup instructions
- See `README.md` for project documentation
- Check the Convex dashboard: https://dashboard.convex.dev
- Check the Clerk dashboard: https://dashboard.clerk.com

## Project Structure

```
realtime-chat-app/
├── app/
│   ├── dashboard/      ← Your protected dashboard
│   ├── sign-in/        ← Clerk sign-in page
│   ├── sign-up/        ← Clerk sign-up page
│   └── page.tsx        ← Landing page
├── convex/
│   ├── schema.ts       ← Database schema
│   └── users.ts        ← User functions
└── components/ui/      ← UI components
```

Happy coding! 🚀
