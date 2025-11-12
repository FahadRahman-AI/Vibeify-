"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ProContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
      <h1 className="text-3xl font-bold text-green-600 mb-4">✅ You’re now Pro!</h1>
      {sessionId && (
        <p className="text-gray-700 mb-2">Session ID: {sessionId}</p>
      )}
      <p className="text-gray-600">
        Enjoy unlimited AI text styling and rewriting. ✨
      </p>
      <a
        href="/"
        className="mt-6 text-blue-500 hover:underline"
      >
        Back to Home
      </a>
    </div>
  );
}

export default function ProPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <ProContent />
    </Suspense>
  );
}

