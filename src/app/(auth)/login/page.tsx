"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = React.useState("arjun@mindclub.com");
  const [password, setPassword] = React.useState("password123");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setUser({
        id: "agent_001",
        name: "Arjun Mehta",
        email: email || "arjun@mindclub.com",
        role: "admin",
      });
      setIsLoading(false);
      router.push("/dashboard");
    }, 400);
  };

  return (
    <Card className="border-border shadow-lg">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto flex size-14 items-center justify-center">
          <Image
            src="/logo.png"
            alt="WhatsApp CRM Logo"
            width={56}
            height={56}
            className="size-14 rounded-full object-cover shadow-md"
            priority
          />
        </div>
        <CardTitle className="text-xl font-bold tracking-tight text-foreground">
          WhatsApp CRM
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Enter your agent credentials or continue with the demo account
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@mindclub.com"
                className="pl-9 text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9 text-sm"
                required
              />
            </div>
          </div>

          <div className="rounded-md bg-muted/60 p-2.5 text-xs text-muted-foreground flex items-start gap-2">
            <ShieldCheck className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              Pre-filled with Admin agent credentials (<strong>Arjun Mehta</strong>).
            </span>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
          >
            {isLoading ? "Signing in..." : "Sign In to Workspace"}
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
