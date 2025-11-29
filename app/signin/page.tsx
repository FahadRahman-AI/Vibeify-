"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signin");
  const [loading, setLoading] = useState(false);

  async function handleAuth() {
    setLoading(true);

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert(error.message);
        else window.location.href = "/";
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) alert(error.message);
        else alert("Account created! You can now sign in.");
      }
    } catch (e: any) {
      alert(e.message);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-blue-600 text-white px-4">
      <div className="w-full max-w-md p-8 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 shadow-xl">

        <h1 className="text-3xl font-bold text-center mb-6">
          {mode === "signin" ? "Sign In" : "Create Account"}
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 mb-4 text-white placeholder-white/60"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 mb-6 text-white placeholder-white/60"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-700 to-purple-900 font-semibold shadow-lg hover:opacity-90 transition active:scale-95 cursor-pointer"
        >
          {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Sign Up"}
        </button>

        <p
          className="text-center mt-6 text-white/90 underline cursor-pointer"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin"
            ? "Don't have an account? Create one"
            : "Already have an account? Sign in"}
        </p>

      </div>
    </main>
  );
}
