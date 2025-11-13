"use client";

import Link from "next/link";
import { useProStatus } from "@/hooks/useProStatus";

export default function Navbar() {
  const isPro = useProStatus();

  return (
    <nav
      className="
        w-full fixed top-0 left-0 z-50
        bg-white/10 backdrop-blur-xl
        border-b border-white/20
        flex items-center justify-between
        px-6 py-4
      "
    >
      {/* Text-only Logo (SVG removed) */}
      <Link href="/" className="flex items-center gap-2">
        <span className="text-white font-bold text-2xl tracking-wide drop-shadow">
          Vibeify
        </span>
      </Link>

      {/* Right button */}
      {!isPro ? (
        <button
          onClick={async () => {
            const res = await fetch("/api/stripe/checkout", { method: "POST" });
            const data = await res.json();
            if (data.url) window.location.href = data.url;
          }}
          className="
            bg-green-500 hover:bg-green-400
            text-white font-semibold
            px-5 py-2 rounded-xl
            shadow-[0_0_15px_rgba(34,197,94,0.6)]
            active:scale-95 transition-all
          "
        >
          Go Pro
        </button>
      ) : (
        <span className="text-green-300 font-semibold drop-shadow">
          ⭐ Pro Member
        </span>
      )}
    </nav>
  );
}
