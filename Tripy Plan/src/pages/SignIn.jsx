import React from "react";
import { SignIn as ClerkSignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";

export default function SignIn() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 relative">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-[90vw] max-w-[420px] rounded-[32px] shadow-xl bg-white px-6 py-8 flex flex-col items-center"
      >
        <h1 className="text-2xl font-bold text-center mb-1 text-[#6941FF]">Sign in to Tripy Plan</h1>
        <p className="text-center text-gray-500 mb-6">Welcome back! Please sign in to continue</p>
        <ClerkSignIn
          appearance={{
            variables: { colorPrimary: "#6941FF" },
            elements: {
              logoBox: "hidden",
              card: "shadow-none bg-transparent p-0",
              formButtonPrimary:
                "bg-[#6941FF] hover:bg-[#7C3AED] text-white font-medium rounded-lg h-10 mt-2",
              dividerText: "text-gray-400",
              socialButtonsBlockButton:
                "border border-gray-200 rounded-lg h-10 font-medium text-gray-700",
              formFieldInput:
                "rounded-lg border-gray-200 focus:border-[#6941FF] focus:ring-[#6941FF]",
              footerAction: "mt-2 text-center",
              footerActionLink: "text-[#6941FF] hover:underline font-medium",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              formFieldLabel: "text-gray-700 font-medium",
              formFieldInputShowPasswordButton: "text-[#6941FF]",
              identityPreview: "text-gray-700",
              alternativeMethodsBlockButton:
                "text-[#6941FF] hover:underline font-medium",
              formResendCodeLink: "text-[#6941FF] hover:underline font-medium",
              formFieldAction: "text-[#6941FF] hover:underline font-medium",
            },
          }}
          path="/sign-in"
          routing="path"
          signInUrl="/sign-in"
          redirectUrl="/dashboard"
          strategies={["oauth_google", "email_link", "email_code", "phone_code"]}
        />
      </motion.div>
      <div className="fixed bottom-0 left-0 w-full bg-[#6941FF] text-white text-sm flex justify-center items-center h-10 z-50">
        Clerk is in development mode. Sign up or sign in to continue.
      </div>
    </div>
  );
} 