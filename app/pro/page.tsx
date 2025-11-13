"use client";

import Link from "next/link";

export default function ProSuccess() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-700 via-pink-500 to-indigo-500 flex items-center justify-center px-6 py-20">
      
      <div className="
        max-w-2xl w-full
        bg-white/10 backdrop-blur-xl
        border border-white/20
        rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.25)]
        p-10 text-center
      ">

        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
          🎉 You're Now Pro!
        </h1>

        <p className="text-white/90 text-lg mb-1">
          Unlimited rewrites. Premium tones unlocked. No limits. 🔥
        </p>

        <p className="text-white/70 text-sm mb-10">
          Enjoy the full power of Vibeify AI — instantly.
        </p>

        <Link 
          href="/"
          className="
            inline-block mt-4 px-8 py-3
            bg-green-500 hover:bg-green-400 
            text-white font-semibold 
            rounded-xl transition-all active:scale-95
            shadow-[0_0_20px_rgba(34,197,94,0.6)]
          "
        >
          Back to Home
        </Link>

      </div>
    </main>
  );
}
