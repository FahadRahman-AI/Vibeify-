"use client";

import { useState } from "react";
import { useProStatus } from "@/hooks/useProStatus";

export default function Home() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("Professional");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const isPro = useProStatus();

  const premiumTones = [
    "Savage",
    "Romantic+",
    "Poetic+",
    "Ultra Professional",
  ];

  //////////////////////////////////////////
  // 🔥 Handle Rewrite (with Pro gating)
  //////////////////////////////////////////
  const handleRewrite = async () => {
    if (!text.trim()) {
      alert("Please enter some text first.");
      return;
    }

    if (!isPro) {
      const used = Number(localStorage.getItem("free_rewrites") || 0);
      if (used >= 5) {
        alert("You've reached your free daily limit! Upgrade to Pro for unlimited rewrites.");
        return;
      }
      localStorage.setItem("free_rewrites", String(used + 1));
    }

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        body: JSON.stringify({ text, tone }),
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      setResult(data.result);
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    }

    setLoading(false);
  };

  //////////////////////////////////////////
  // ⚡ Stripe Upgrade Function
  //////////////////////////////////////////
  async function goPro() {
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      alert("Unable to start checkout.");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-3xl w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_0_40px_rgba(255,255,255,0.1)] p-10">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/logo.svg" className="w-14 opacity-90" />
        </div>

        {/* Title */}
        <h1 className="text-center text-4xl font-bold mb-2 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
          Vibeify AI
        </h1>

        <p className="text-center text-neutral-300 mb-6">
          Transform your writing instantly with AI-powered tone styling.
        </p>

        {/* PRO / FREE STATUS */}
        {isPro ? (
          <p className="text-center text-green-400 font-semibold mb-6">
            🔥 Pro Activated — Unlimited Rewrites + Premium Tones
          </p>
        ) : (
          <p className="text-center text-yellow-300 mb-6">
            Free Plan — 5 rewrites per day. Unlock Pro for unlimited access.
          </p>
        )}

        {/* Input Box */}
        <textarea
          className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          rows={4}
          placeholder="Write or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Tone Selector */}
        <label className="mt-5 mb-1 block text-neutral-200 font-semibold">
          Tone:
        </label>

        <select
          value={tone}
          onChange={(e) => {
            const val = e.target.value;
            if (!isPro && premiumTones.includes(val)) {
              alert("This tone requires Pro. Upgrade to unlock!");
              return;
            }
            setTone(val);
          }}
          className="w-full bg-white/10 border border-white/20 rounded-2xl p-3 text-white"
        >
          <option value="Professional">Professional</option>
          <option value="Friendly">Friendly</option>

          {/* Premium (locked for free users) */}
          <option disabled={!isPro} value="Savage">🔒 Savage (Pro)</option>
          <option disabled={!isPro} value="Romantic+">🔒 Romantic+ (Pro)</option>
          <option disabled={!isPro} value="Poetic+">🔒 Poetic+ (Pro)</option>
          <option disabled={!isPro} value="Ultra Professional">🔒 Ultra Professional (Pro)</option>
        </select>

        {/* Buttons */}
        <button
          onClick={handleRewrite}
          disabled={loading}
          className="w-full mt-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 transition-all font-semibold shadow-lg hover:shadow-purple-500/40"
        >
          {loading ? "Rewriting..." : "Rewrite Text"}
        </button>

        {!isPro && (
          <button
            onClick={goPro}
            className="w-full mt-3 py-3 rounded-xl bg-green-600 hover:bg-green-500 active:scale-95 transition-all font-semibold shadow-lg hover:shadow-green-500/40"
          >
            Upgrade to Pro — $5/month
          </button>
        )}

        {/* Output Box */}
        {result && (
          <div className="mt-8 bg-white/10 border border-white/20 rounded-2xl p-5 text-white whitespace-pre-wrap shadow-inner">
            <h2 className="text-lg font-semibold mb-2 text-purple-300">
              ✨ Rewritten Text:
            </h2>
            {result}
          </div>
        )}
      </div>
    </main>
  );
}
