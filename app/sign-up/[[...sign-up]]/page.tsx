import { SignUp } from "@clerk/nextjs";
import { MessageCircle } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10" />
      
      <div className="w-full max-w-md relative">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/20">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
          <p className="text-slate-600">Sign up to get started with Realtime Chat</p>
        </div>

        {/* Clerk Sign Up Component */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/50 p-1">
          <SignUp 
            forceRedirectUrl="/dashboard"
            signInUrl="/sign-in"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0 bg-transparent",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border-slate-200 hover:bg-slate-50",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
                footerActionLink: "text-blue-600 hover:text-blue-700",
              }
            }}
          />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Secure authentication powered by Clerk
        </p>
      </div>
    </div>
  );
}
