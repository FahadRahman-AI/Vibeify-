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

  async function handleRewrite() {
    if (!text.trim()) return alert("Enter some text first!");

    if (!isPro) {
      const used = Number(localStorage.getItem("free_rewrites") || 0);
      if (used >= 5) {
        alert("Daily limit reached — upgrade to Pro!");
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
      if (data.error) return alert(data.error);

      setResult(data.result);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }

    setLoading(false);
  }

  async function goPro() {
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data?.url) return (window.location.href = data.url);
      alert("Unable to start checkout.");
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-700 via-pink-500 to-indigo-500 flex items-center justify-center px-6 py-16">

      {/* Glass Card */}
      <div className="
        max-w-3xl w-full 
        bg-white/10 
        backdrop-blur-xl 
        rounded-3xl 
        border border-white/20 
        shadow-[0_0_50px_rgba(255,255,255,0.25)]
        p-10
      ">
        
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <img src="/logo.svg" className="w-16 drop-shadow-lg opacity-95" />
        </div>

        {/* Title */}
        <h1 className="text-center text-5xl font-extrabold tracking-tight mb-3 
          bg-gradient-to-r from-white to-purple-200 
          bg-clip-text text-transparent drop-shadow-lg">
          Vibeify AI
        </h1>

        <p className="text-center text-white/80 mb-8 text-lg drop-shadow">
          Instantly transform your writing with personality, emotion, and flow ✨
        </p>

        {/* Status */}
        {isPro ? (
          <p className="text-center text-green-300 font-semibold mb-6 text-lg">
            🔥 Pro Active — Unlimited Rewrites + Premium Tones
          </p>
        ) : (
          <p className="text-center text-yellow-200 font-medium mb-6">
            Free Plan — 5 rewrites/day. Unlock Pro for unlimited access.
          </p>
        )}

        {/* Input Box */}
        <textarea
          className="
            w-full bg-white/20 
            border border-white/30 
            rounded-2xl 
            p-4 text-white 
            placeholder-white/60 
            backdrop-blur-md 
            focus:ring-2 focus:ring-purple-300 
            transition shadow-inner
          "
          rows={4}
          placeholder="Write or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Tone Selector */}
        <label className="mt-5 mb-1 block text-white/90 font-semibold">
          Choose Tone:
        </label>

        <select
          value={tone}
          onChange={(e) => {
            const val = e.target.value;
            if (!isPro && premiumTones.includes(val)) {
              alert("This tone requires Pro.");
              return;
            }
            setTone(val);
          }}
          className="
            w-full bg-white/20 
            border border-white/30 
            rounded-2xl p-3 
            text-white 
            backdrop-blur-md
          "
        >
          <option value="Professional">Professional</option>
          <option value="Friendly">Friendly</option>

          <option disabled={!isPro} value="Savage">🔒 Savage (Pro)</option>
          <option disabled={!isPro} value="Romantic+">🔒 Romantic+ (Pro)</option>
          <option disabled={!isPro} value="Poetic+">🔒 Poetic+ (Pro)</option>
          <option disabled={!isPro} value="Ultra Professional">🔒 Ultra Professional (Pro)</option>
        </select>

        {/* Buttons */}
        <button
          onClick={handleRewrite}
          disabled={loading}
          className="
            w-full mt-6 py-3 rounded-xl 
            bg-purple-600 hover:bg-purple-500 
            active:scale-95 
            transition-all 
            text-white font-bold
            shadow-[0_0_15px_rgba(168,85,247,0.6)]
          "
        >
          {loading ? "Rewriting..." : "Rewrite Text"}
        </button>

        {!isPro && (
          <button
            onClick={goPro}
            className="
              w-full mt-4 py-3 rounded-xl 
              bg-green-600 hover:bg-green-500 
              active:scale-95 
              transition-all 
              text-white font-bold
              shadow-[0_0_15px_rgba(34,197,94,0.6)]
            "
          >
            Upgrade to Pro — $5/month
          </button>
        )}

        {/* Output */}
        {result && (
          <div className="
            mt-10 
            bg-white/20 
            border border-white/30 
            backdrop-blur-lg 
            rounded-2xl 
            p-5 text-white 
            whitespace-pre-wrap 
            shadow-inner
          ">
            <h2 className="text-xl font-semibold mb-2 text-purple-200">
              ✨ Rewritten Text
            </h2>
            {result}
          </div>
        )}

      </div>
    </main>
  );
}
