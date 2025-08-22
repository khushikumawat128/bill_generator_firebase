"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "./ui/skeleton";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
       <div className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-4">
             <Skeleton className="h-64 w-full" />
             <Skeleton className="h-32 w-full" />
             <Skeleton className="h-48 w-full" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-[80vh] w-full" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
