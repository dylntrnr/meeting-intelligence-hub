"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      setError("Invalid token. Try again.");
      return;
    }

    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meeting Hub</h1>
          <p className="text-sm text-textSecondary">
            Enter your dashboard token to continue.
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="DASHBOARD_TOKEN"
            value={token}
            onChange={(event) => setToken(event.target.value)}
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" variant="primary" className="w-full">
            Unlock
          </Button>
        </form>
      </Card>
    </div>
  );
}
