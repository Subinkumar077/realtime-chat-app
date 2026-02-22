import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#FCF5EB] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Circle (Subtle tie-in to landing page) */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] border-[40px] border-white/40 rounded-full -z-0 opacity-50" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1C3B33] mb-2">Welcome Back</h1>
          <p className="text-[#5E5E5E]">Sign in to continue to Whisper</p>
        </div>

        {/* Clerk Sign In Component */}
        <div className="">
          <SignIn 
            forceRedirectUrl="/users"
            signUpUrl="/sign-up"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0 bg-transparent",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border-slate-200 hover:bg-slate-50",
                // Updated to match your landing page green
                formButtonPrimary: "bg-[#25D366] hover:bg-[#20bd5b] text-white",
                footerActionLink: "text-[#25D366] hover:text-[#1C3B33]",
                formFieldInput: "focus:border-[#25D366] focus:ring-[#25D366]/20",
              }
            }}
          />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-[#5E5E5E] mt-8">
          Secure authentication powered by Clerk
        </p>
      </div>
    </div>
  );
}