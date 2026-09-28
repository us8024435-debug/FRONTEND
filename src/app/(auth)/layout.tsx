import * as React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — WhatsApp CRM",
  description: "Secure login portal for WhatsApp CRM platform.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
