import { SignIn } from "@clerk/nextjs";
 
export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen bg-green-200">
        <SignIn         
            appearance={{
                elements: {
                    formButtonPrimary:
                        "bg-yellow-500 hover:bg-yellow-400 text-sm normal-case",
                    card:
                        "bg-emerald-800",
                    headerTitle:
                        "text-amber-50",
                    headerSubtitle:
                        "text-amber-50",
                    formFieldLabel:
                        "text-amber-50",
                    footerActionText:
                        "text-amber-50",
                    footerActionLink:
                        "text-blue-400",
                    socialButtonsBlockButton__google:
                        "bg-slate-50 hover:bg-slate-200",
                    dividerLine:
                        "bg-amber-50",
                    dividerText:
                        "text-amber-50",

                },
            }} 
        />
    </div>
  );
}