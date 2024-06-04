"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-off-white">
      <SignUp
        routing="path"
        path="/sign-up"
        appearance={{
          elements: {
            formButtonPrimary: "bg-peach text-green-text hover:bg-green-text hover:text-off-white text-sm normal-case",
            card: "bg-light-green",
            headerTitle: "text-green-text",
            headerSubtitle: "text-green-text",
            formFieldLabel: "text-green-text",
            footerActionText: "text-green-text",
            footerActionLink: "text-blue-400",
            socialButtonsBlockButton__google: "bg-slate-50 hover:bg-slate-200",
            dividerLine: "bg-green-text",
            dividerText: "text-green-text",
          },
        }}
      />
    </div>
  );
}