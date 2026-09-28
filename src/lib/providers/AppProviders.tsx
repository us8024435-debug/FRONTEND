"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { QueryProvider } from "./QueryProvider";
import { AuthProvider } from "@/lib/auth/AuthContext";

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Root Application Providers Composition:
 * QueryProvider (Server Cache) -> ThemeProvider (Theme Tokens) -> AuthProvider (User Session) -> Children -> Toaster
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
