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
    <div className="min-h-screen bg-[#FCF5EB] relative overflow-hidden">
      {/* Background Decorative Circle - responsive sizing */}
      <div className="absolute top-[-20%] right-[-20%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] border-[20px] md:border-[30px] lg:border-[40px] border-white/40 rounded-full -z-0" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-0 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 min-h-screen lg:min-h-0 lg:h-screen">
          
          {/* Left Content Column */}
          <div className="flex-1 w-full max-w-2xl text-center lg:text-left space-y-4 md:space-y-6 pt-8 lg:pt-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1C3B33] leading-tight">
              <span className="text-[#25D366]">Whisper:</span> Connect with the world securely and for free
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-[#5E5E5E] leading-relaxed max-w-lg mx-auto lg:mx-0">
              Private messages, secure calls, and everything for free — wherever you are.
            </p>

            <div className="pt-4 md:pt-6">
              <Link href="/sign-up" className="inline-block">
                <Button 
                  size="lg" 
                  className="bg-[#25D366] hover:bg-[#20bd5b] text-white px-8 sm:px-10 py-5 sm:py-7 rounded-full text-lg sm:text-xl font-medium shadow-lg transition-all"
                >
                  Get started <span className="ml-2">↓</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Image/Graphic Column */}
          <div className="flex-1 w-full max-w-[400px] sm:max-w-[500px] lg:max-w-none flex justify-center lg:justify-end">
            <div className="relative w-full">
              {/* Main Image */}
              <img 
                src="/g.png" 
                alt="Happy user"
                className="w-full h-auto max-w-[350px] sm:max-w-[450px] md:max-w-[550px] lg:max-w-[667px] mx-auto"
              />
              
              {/* Floating Chat UI Element - only show on larger screens */}
              <div className="absolute bottom-[10%] left-0 lg:-left-20 bg-[#E1FDD4] py-2 px-3 sm:px-4 rounded-xl shadow-md border border-white text-xs sm:text-sm hidden md:block max-w-[200px] lg:max-w-none">
                I want another family trip soon! ✅
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
