"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Zap, Shield, Users } from "lucide-react";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-slate-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          {/* Hero Section */}
          <div className="space-y-6 max-w-3xl mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-4 shadow-xl shadow-blue-600/20">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl font-bold tracking-tight text-slate-900">
              Realtime Chat App
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Connect with friends and colleagues in real-time. Experience seamless
              communication with our modern, fast, and secure chat platform.
            </p>
            <div className="flex gap-4 justify-center pt-8">
              <Link href="/sign-in">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 shadow-lg shadow-blue-600/20">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="lg" variant="outline" className="border-slate-300 hover:bg-white px-8">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Lightning Fast</h3>
              <p className="text-slate-600">Real-time messaging with instant delivery and updates</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Secure</h3>
              <p className="text-slate-600">Enterprise-grade security with end-to-end encryption</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Collaborative</h3>
              <p className="text-slate-600">Connect with teams and communities effortlessly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
