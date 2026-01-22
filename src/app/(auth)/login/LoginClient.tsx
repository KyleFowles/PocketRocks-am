/* ============================================================
   FILE: src/app/(auth)/login/LoginClient.tsx
   PURPOSE: Client-side login logic using useSearchParams
   ============================================================ */

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginClient() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Example: you can safely read search params here
    // console.log("Redirect after login:", redirectTo);
  }, [redirectTo]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Login</h1>

      <button
        disabled={loading}
        onClick={() => {
          setLoading(true);
          // your existing login logic here
        }}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </div>
  );
}
