"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import { MessageCircle, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const syncUser = useMutation(api.users.syncUser);

  useEffect(() => {
    if (isLoaded && user) {
      syncUser({
        clerkId: user.id,
        name: user.fullName || user.firstName || "User",
        email: user.primaryEmailAddress?.emailAddress || "",
        imageUrl: user.imageUrl,
      });
    }
  }, [isLoaded, user, syncUser]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Realtime Chat</h1>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9">
                <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {user?.firstName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-slate-900">
                  {user?.fullName || user?.firstName}
                </p>
              </div>
              <SignOutButton>
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                  Sign Out
                </Button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome, {user?.firstName}! 👋
            </h2>
            <p className="text-slate-600">
              Your account is synced and ready. Start connecting with others now.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Link href="/users">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Start Chatting</h3>
                <p className="text-blue-100 text-sm">
                  Browse users and start conversations
                </p>
              </div>
            </Link>

            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-slate-600" />
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  Coming Soon
                </span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Group Chats</h3>
              <p className="text-slate-600 text-sm">
                Create and join group conversations
              </p>
            </div>
          </div>

          {/* Features Info */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              What's Available
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900">User Discovery</p>
                  <p className="text-sm text-slate-600">Search and find other users in real-time</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Online Status</p>
                  <p className="text-sm text-slate-600">See who's currently online and available</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Real-time Messaging</p>
                  <p className="text-sm text-slate-600">Coming soon - instant message delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
