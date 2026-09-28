import * as React from "react";
import Link from "next/link";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "404 — Page Not Found | WhatsApp CRM",
  description: "The requested CRM page could not be found.",
};

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background text-foreground text-center">
      {/* WhatsApp CRM Branding Icon */}
      <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 mb-6">
        <MessageCircle className="size-8 fill-slate-950 text-slate-950" />
      </div>

      {/* 404 Badge & Heading */}
      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3">
        404 Error
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground max-w-md">
        Page Not Found
      </h1>

      <p className="mt-3 text-sm text-muted-foreground max-w-sm leading-relaxed">
        The conversation, contact, or module you are looking for does not exist or has been
        relocated.
      </p>

      {/* CTA Button */}
      <div className="mt-8">
        <Button
          asChild
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 font-medium shadow-md shadow-emerald-600/20"
        >
          <Link href="/dashboard">
            <ArrowLeft className="size-4" />
            Go to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
