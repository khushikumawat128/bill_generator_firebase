"use client";

import { useContext, createContext, useState, useEffect, ReactNode } from "react";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase";
import { useToast } from "./use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignInError = (error: any, providerName: string) => {
    console.error(`Error signing in with ${providerName}:`, error);
    let description = "An unexpected error occurred during sign-in. Please try again.";
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/account-exists-with-different-credential':
          description = `An account already exists with the same email address but different sign-in credentials. Try signing in with a different provider.`;
          break;
        case 'auth/popup-closed-by-user':
          description = 'The sign-in popup was closed before completing the sign-in. Please try again.';
          break;
        case 'auth/cancelled-popup-request':
            description = 'The sign-in popup was cancelled. Please try again.';
            break;
        case 'auth/operation-not-allowed':
           description = `Sign-in with ${providerName} is not enabled. Please enable it in the Firebase console.`;
           break;
        case 'auth/configuration-not-found':
          description = `Please go to the Firebase console and enable ${providerName} as a sign-in method for your project to continue.`;
          break;
        default:
          description = `An error occurred: ${error.message}`;
          break;
      }
    }
     toast({
        title: "Authentication Error",
        description: description,
        variant: "destructive",
      });
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      handleSignInError(error, "Google");
    }
  };

  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      handleSignInError(error, "GitHub");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
       toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithGithub,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
