"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GitPullRequest } from "lucide-react";

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
        <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center mx-auto">
          <GitPullRequest className="h-6 w-6 text-primary" />
        </div>
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
