"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ProSuccess() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const sid = params.get("session_id");
    if (sid) {
      (async () => {
        try {
          await fetch(`/api/stripe/activate?session_id=${sid}`, { cache: "no-store" });
          router.replace("/?upgraded=1");
        } catch {
          router.replace("/?activate=error");
        }
      })();
    } else {
      router.replace("/?missing_session=1");
    }
  }, [params, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-600 via-indigo-500 to-sky-400 text-white">
      <h1 className="text-3xl font-bold mb-3 animate-pulse">Activating Pro…</h1>
      <p className="text-white/80">Please wait a moment.</p>
    </main>
  );
}
