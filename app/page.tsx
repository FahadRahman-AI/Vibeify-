"use client";

import { useState, useEffect } from "react";
import { useProStatus } from "@/hooks/useProStatus";

// 🔥 Generate a unique and persistent device ID
function getDeviceId() {
  let id = localStorage.getItem("device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("device_id", id);
  }
  return id;
}

export default function Home() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("Professional");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const isPro = useProStatus();

  useEffect(() => {
    setDeviceId(getDeviceId());
  }, []);

  // Allowed tones logic
  const premiumTones = ["Poetic+", "Ultra Professional"];
  const allTones = [
    "Professional",
    "Friendly",
    "Mysterious",
    "Savage",
    "Romantic+",
    "Poetic+",
    "Ultra Professional",
  ];

  // Suggested example snippets
  const suggestions = [
    "Hey, can we reschedule our meeting?",
    "Sorry I'm running late 😅",
    "Let's grab coffee sometime soon!",
    "I'm thrilled about the new project!",
  ];

  async function handleRewrite() {
    if (!text.trim()) {
      alert("Please enter some text first.");
      return;
    }

    if (!isPro) {
      const count = Number(localStorage.getItem("free_rewrites") || "0");
      if (count >= 5) {
        alert("Your daily free limit has been reached. Upgrade to Pro for unlimited rewrites.");
        return;
      }
      localStorage.setItem("free_rewrites", String(count + 1));
    }

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        body: JSON.stringify({ text, tone }),
      });

      const data = await res.json();
      if (data.error) alert(data.error);
      else setResult(data.result);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }

    setLoading(false);
  }

  // Stripe checkout
  async function goPro() {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        body: JSON.stringify({ deviceId }),
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
      else alert("Unable to start checkout.");
    } catch (err) {
      alert("Checkout failed.");
      console.error(err);
    }
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center px-6 py-10"
      style={{
        background:
          "linear-gradient(135deg, #ff4f9a, #d345ff 30%, #7a5bff 60%, #4b3bff 90%)",
      }}
    >
      {/* Main container */}
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_0_40px_rgba(255,255,255,0.1)] p-10 mt-10">

        {/* Title */}
        <h1 className="text-center text-5xl font-extrabold text-white drop-shadow-md mb-4">
          Vibeify AI
        </h1>

        <p className="text-center text-white/90 mb-6">
          Instantly transform your writing with unique AI-powered tones.
        </p>

        {/* Plan status */}
        <p className="text-center text-white/70 mb-8">
          Free Plan — 5 rewrites/day. Unlock Pro for unlimited access.
        </p>

        {/* Textbox */}
        <textarea
          placeholder="Type something here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-40 bg-white/10 border border-white/30 rounded-xl p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        {/* Tone dropdown */}
        <label className="text-white/80 font-semibold mt-6 mb-2 block">
          Tone:
        </label>

        <select
          value={tone}
          onChange={(e) => {
            const t = e.target.value;
            if (!isPro && premiumTones.includes(t)) {
              alert("This tone requires Pro.");
              return;
            }
            setTone(t);
          }}
          className="w-full bg-white/10 border border-white/30 text-white rounded-xl p-3 focus:outline-none backdrop-blur-xl"
          style={{
            colorScheme: "dark",
          }}
        >
          {allTones.map((t) => (
            <option
              key={t}
              value={t}
              style={{ background: "#8a2be2", color: "white" }} // fixes white dropdown issue
              disabled={!isPro && premiumTones.includes(t)}
            >
              {premiumTones.includes(t) ? `🔒 ${t}` : t}
            </option>
          ))}
        </select>

        {/* Rewrite Button — with animation restored */}
        <button
          onClick={handleRewrite}
          disabled={loading}
          className="w-full mt-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-pink-600 to-red-600 hover:from-red-600 hover:to-pink-600 active:scale-95 transition-all shadow-lg hover:shadow-pink-500/40 animate-pulse"
        >
          {loading ? "Rewriting..." : "Rewrite Text"}
        </button>

        {/* Upgrade Button — gold shine on hover */}
        {!isPro && (
          <button
            onClick={goPro}
            className="w-full mt-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-violet-700 relative overflow-hidden group shadow-lg hover:shadow-yellow-400/40"
          >
            <span className="relative z-10">Upgrade to Pro — $5/month</span>

            {/* Gold Shine Effect */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-300/40 to-yellow-400/0 
              opacity-0 group-hover:opacity-100 transition-opacity duration-500 
              group-hover:animate-shine pointer-events-none"
            />
          </button>
        )}

        {/* Output */}
        {result && (
          <div className="mt-6 bg-white/10 p-4 rounded-xl text-white border border-white/20 whitespace-pre-wrap">
            <h2 className="font-semibold mb-2 text-pink-200">✨ Rewritten Text:</h2>
            {result}
          </div>
        )}

        {/* Suggestions */}
        <div className="flex gap-3 flex-wrap justify-center mt-8">
          {suggestions.map((s) => (
            <button
              key={s}
              className="px-4 py-2 bg-white/10 text-white rounded-full border border-white/20 hover:bg-white/20 transition"
              onClick={() => setText(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Shine animation keyframes */}
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(150%); }
        }
        .animate-shine {
          animation: shine 1.5s linear infinite;
        }
      `}</style>
    </main>
  );
}
