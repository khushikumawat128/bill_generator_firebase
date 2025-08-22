"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";


const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-4.3 1.4 -4.3-2.5 -6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6.2 0-1.4-.5-2.5-1.3-3.4.1-.3.5-1.6 0-3.2C17.2 4.2 16.2 4 15 4.5c-1-.3-2.1-.4-3.2-.4s-2.2.1-3.2.4c-1.2-.5-2.2-.2-2.7.2c-.5 1.6-.1 2.9 0 3.2C5 8.5 4.5 9.6 4.5 11c0 4.8 2.7 5.9 5.5 6.2c-.6.5-.5 1.2-.5 2V21"/>
  </svg>
)

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.35 11.1H12.18V13.83H18.1C17.7 15.65 16.33 16.94 14.49 16.94C12.37 16.94 10.61 15.18 10.61 13C10.61 10.82 12.37 9.06 14.49 9.06C15.51 9.06 16.42 9.42 17.15 10.1L19.23 8.02C17.76 6.72 16.23 6 14.49 6C10.94 6 8 8.94 8 12.5C8 16.06 10.94 19 14.49 19C17.9 19 20.47 16.52 20.47 13.22C20.47 12.51 20.41 11.79 20.35 11.1Z"/>
  </svg>
)

export default function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithGithub } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (loading) {
     return (
       <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl rounded-xl">
            <CardHeader className="text-center space-y-4">
              <Skeleton className="mx-auto h-16 w-16 rounded-full" />
              <Skeleton className="h-8 w-40 mx-auto" />
              <Skeleton className="h-4 w-60 mx-auto" />
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl rounded-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <FileText className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">InvoicePilot</h1>
            <CardDescription className="text-muted-foreground">
              Your AI-powered copilot for seamless invoicing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <Button variant="outline" className="w-full" onClick={signInWithGoogle}>
              <GoogleIcon className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>
            <Button variant="outline" className="w-full" onClick={signInWithGithub}>
              <GitHubIcon className="mr-2 h-5 w-5" />
              Sign in with GitHub
            </Button>
            <p className="px-8 text-center text-xs text-muted-foreground">
              By signing in, you agree to our Terms of Service.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
