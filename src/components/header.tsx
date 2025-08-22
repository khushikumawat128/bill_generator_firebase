"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FileText, LogOut, User, LayoutDashboard, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-bold">InvoicePilot</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center gap-2">
             <Link href="/dashboard">
                <Button variant="ghost"><LayoutDashboard className="mr-2 h-4 w-4"/>Dashboard</Button>
            </Link>
            <Link href="/dashboard/profile">
                <Button variant="ghost"><Settings className="mr-2 h-4 w-4"/>Profile</Button>
            </Link>
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.photoURL ?? "https://placehold.co/40x40.png"} alt={user?.displayName ?? "User"} data-ai-hint="user avatar" />
                  <AvatarFallback>{user?.displayName?.charAt(0) ?? "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.displayName ?? "Test User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email ?? "user@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile"><User className="mr-2 h-4 w-4" />Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
