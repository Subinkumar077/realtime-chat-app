"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/users");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || isSignedIn) {
    return null;
  }

  return (
    <div className="h-screen bg-[#FCF5EB] relative overflow-hidden font-sans flex items-center">
      {/* Background Decorative Circle (matching the image) */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] border-[40px] border-white/40 rounded-full -z-0" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-full">
          
          {/* Left Content Column */}
          <div className="flex-1 max-w-2xl text-left space-y-6">
            <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight text-[#1C3B33] leading-[1.1]">
              <span className="text-[#25D366]">Whisper:</span> Connect with the world securely and for free
            </h1>
            
            <p className="text-lg md:text-xl text-[#5E5E5E] leading-relaxed max-w-lg">
              Private messages, secure calls, and everything for free — wherever you are.
            </p>

            <div className="space-y-8 pt-2">
              {/* Primary Action Button (UNTOUCHED) */}
              <Link href="/sign-up" className="inline-block">
                <Button 
                  size="lg" 
                  className="bg-[#25D366] hover:bg-[#20bd5b] text-white px-10 py-7 rounded-full text-xl font-medium shadow-lg transition-all"
                >
                  Get started <span className="ml-2">↓</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Image/Graphic Column */}
          <div className="flex-1 relative w-full max-w-[500px] lg:max-w-none flex justify-center lg:justify-end">
            <div className="relative z-10">
              {/* Main Image Placeholder */}
              {/* UPDATED: Removed fixed heights, object-cover, shadow, and rounded corners. 
                  Added h-auto to maintain original aspect ratio without cropping. */}
              <img 
                src="/g.png" 
                alt="Happy user"
                className="w-full max-w-[550px] lg:max-w-[667px] h-auto"
              />
              
              {/* Floating Chat UI Elements */}
              <div className="absolute bottom-89 -left-40 bg-[#E1FDD4] py-2 px-4 rounded-xl shadow-md border border-white text-sm hidden md:block">
                I want another family trip soon! ✅
              </div>
                            
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}