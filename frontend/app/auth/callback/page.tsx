"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SentinelLogo } from "@/components/sentinel-logo";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function CallbackHandler() {
  const params = useSearchParams();

  useEffect(() => {
    const code = params.get("code");
    const error = params.get("error");

    if (error) {
      window.location.href = "/?auth_error=" + error;
      return;
    }

    if (code) {
      // Forward the code to the FastAPI backend which handles the exchange
      window.location.href = `${API}/auth/callback?code=${code}`;
    }
  }, [params]);

  return null;
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <SentinelLogo size={48} showWordmark={false} className="justify-center mx-auto" />
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-sm">Connecting your GitHub account...</span>
        </div>
        <Suspense>
          <CallbackHandler />
        </Suspense>
      </div>
    </div>
  );
}
