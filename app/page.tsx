"use client";

import { useState } from "react";
import { useProStatus } from "@/hooks/useProStatus";

export default function Home() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("Professional");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const isPro = useProStatus();

  const premiumTones = ["Poetic+", "Ultra Professional"];

  // ---------------------------
  // 🔥 Handle Rewrite
  // ---------------------------
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

  // ---------------------------
  // ⚡ Stripe Upgrade
  // ---------------------------
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

  // ---------------------------
  // ⭐ UI START
  // ---------------------------
  return (
    <main
      className="min-h-screen w-full flex justify-center px-6 py-16"
      style={{
        background:
          "linear-gradient(135deg, #ff4f9a 0%, #b44aff 40%, #7b3dff 70%, #4e39ff 100%)",
      }}
    >
      <div className="w-full max-w-4xl bg-white/10 border border-white/20 rounded-3xl p-10 shadow-[0_0_60px_rgba(255,255,255,0.15)] backdrop-blur-3xl">

        {/* Title */}
        <h1 className="text-center text-5xl font-extrabold text-white drop-shadow-md mb-2 tracking-wide">
          Vibeify AI
        </h1>

        <p className="text-center text-neutral-200 mb-3 text-lg">
          Instantly transform your writing with unique AI-powered tones.
        </p>

        <p className="text-center text-yellow-200 font-semibold mb-8">
          Free Plan — 5 rewrites/day. Unlock Pro for unlimited access.
        </p>

        {/* TEXTBOX */}
        <textarea
          className="
            w-full bg-white/10 border border-white/20 rounded-2xl p-4 
            text-white placeholder-neutral-300 
            focus:outline-none focus:ring-2 focus:ring-pink-300
            backdrop-blur-xl
          "
          rows={5}
          placeholder="Type something here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Tone Selector */}
        <label className="mt-6 mb-2 block text-neutral-200 font-semibold">
          Tone:
        </label>

        <select
          value={tone}
          onChange={(e) => {
            const selected = e.target.value;
            if (!isPro && premiumTones.includes(selected)) {
              alert("This tone requires Pro. Upgrade to unlock!");
              return;
            }
            setTone(selected);
          }}
          className="
            w-full rounded-xl p-3 text-white border border-white/20
            bg-white/10 backdrop-blur-xl appearance-none
            focus:outline-none
          "
          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
        >
          {/* FREE TONES */}
          <option className="bg-[#6a0ef5] text-white" value="Professional">Professional</option>
          <option className="bg-[#6a0ef5] text-white" value="Friendly">Friendly</option>
          <option className="bg-[#6a0ef5] text-white" value="Mysterious">Mysterious</option>

          {/* LOCKED TONES */}
          <option
            className="bg-[#6a0ef5] text-white"
            value="Poetic+"
            disabled={!isPro}
          >
            🔒 Poetic+ (Pro)
          </option>

          <option
            className="bg-[#6a0ef5] text-white"
            value="Ultra Professional"
            disabled={!isPro}
          >
            🔒 Ultra Professional (Pro)
          </option>
        </select>

        {/* Rewrite Button */}
        <button
          onClick={handleRewrite}
          disabled={loading}
          className="
            w-full mt-6 py-3 rounded-xl
            bg-pink-600 hover:bg-pink-500 active:scale-95 
            transition-all font-semibold shadow-lg
          "
        >
          {loading ? "Rewriting..." : "Rewrite Text"}
        </button>

        {/* UPGRADE BUTTON — GOLD SHINE HOVER */}
        {!isPro && (
          <button
            onClick={goPro}
            className="
              w-full mt-4 py-3 rounded-xl
              bg-purple-700 text-white font-semibold shadow-lg
              transition-all relative overflow-hidden
            "
          >
            {/* GOLD SHINE OVERLAY */}
            <span
              className="
                absolute inset-0 h-full w-full 
                bg-gradient-to-r from-transparent via-yellow-300 to-transparent
                opacity-0 hover:opacity-40
                transition-opacity duration-700
                animate-shine
              "
            ></span>

            Upgrade to Pro — $5/month
          </button>
        )}

        {/* Result */}
        {result && (
          <div className="mt-8 bg-white/10 border border-white/20 rounded-2xl p-5 text-white whitespace-pre-wrap shadow-inner backdrop-blur-xl">
            <h2 className="text-lg font-semibold mb-2 text-pink-200">
              ✨ Rewritten Text:
            </h2>
            {result}
          </div>
        )}

        {/* Suggestions */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {[
            "Hey, can we reschedule our meeting?",
            "Sorry I'm running late 😅",
            "Let's grab coffee sometime soon!",
            "I'm thrilled about the new project!",
          ].map((s, i) => (
            <button
              key={i}
              onClick={() => setText(s)}
              className="
                px-4 py-2 rounded-xl bg-white/10 text-white 
                border border-white/20 backdrop-blur-xl
                hover:bg-white/20 transition
              "
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
