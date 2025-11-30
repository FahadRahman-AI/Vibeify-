"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/useUser";
import { useProStatus } from "@/hooks/useProStatus";

export default function Home() {
  const user = useUser();
  const isPro = useProStatus(user?.id || null);

  const [text, setText] = useState("");
  const [tone, setTone] = useState("Professional");
  const [loading, setLoading] = useState(false);
  const [deviceId, setDeviceId] = useState("");

  // DAILY LIMIT
  const FREE_LIMIT = 5;
  const [freeCount, setFreeCount] = useState(0);

  // TONES
  const tones = [
    "Professional",
    "Friendly",
    "Confident",
    "Funny",
    "Mysterious",
    "Poetic (Pro)",
    "Ultra Professional (Pro)",
  ];

  // SUGGESTION BUTTONS
  const suggestions = [
    "Hey, can we reschedule our meeting? 😊",
    "Sorry I'm running late 😅",
    "Let's grab coffee sometime soon!",
    "I'm thrilled about the new project!",
  ];

  // On mount → generate device ID + load usage counter
  useEffect(() => {
    let id = localStorage.getItem("device_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("device_id", id);
    }
    setDeviceId(id);

    // DAILY FREE COUNTER
    const today = new Date().toISOString().slice(0, 10);
    const storedDate = localStorage.getItem("free_rewrites_date");
    const storedCount = localStorage.getItem("free_rewrites_count");

    if (storedDate === today) {
      setFreeCount(Number(storedCount || 0));
    } else {
      localStorage.setItem("free_rewrites_date", today);
      localStorage.setItem("free_rewrites_count", "0");
      setFreeCount(0);
    }
  }, []);

  // LINK ACCOUNT <-> DEVICE ID
  useEffect(() => {
    if (user?.id && deviceId) {
      fetch("/api/auth/link", {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          deviceId,
        }),
      });
    }
  }, [user?.id, deviceId]);

  // ---------- REWRITE ----------
  async function rewriteText() {
    if (!text.trim()) return;

    if (!isPro && freeCount >= FREE_LIMIT) {
      alert("You've used all 5 free rewrites today. Upgrade to Pro for unlimited access.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        body: JSON.stringify({ text, tone, deviceId }),
      });

      const data = await res.json();

      if (data.error) alert(data.error);

      if (data.output) {
        setText(data.output);

        if (!isPro) {
          const newCount = freeCount + 1;
          setFreeCount(newCount);

          const today = new Date().toISOString().slice(0, 10);
          localStorage.setItem("free_rewrites_date", today);
          localStorage.setItem("free_rewrites_count", String(newCount));
        }
      }
    } catch (e) {
      alert("Something went wrong.");
      console.error(e);
    }

    setLoading(false);
  }

  // ---------- CHECKOUT (FIXED) ----------
  async function startCheckout() {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        body: JSON.stringify({ deviceId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Unable to start checkout.");
      }
    } catch (e) {
      alert("Error starting checkout.");
    }
  }

  // ---------- LOGOUT ----------
  function logout() {
    supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-blue-600 text-white px-4 py-10">
      <div className="w-full max-w-2xl p-10 rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/10">

        {/* NAVBAR */}
        <div className="flex justify-end mb-4 gap-4 items-center">

          {!user && (
            <>
              <a href="/account" className="text-white/80 hover:text-white underline cursor-pointer">
                My Account
              </a>
              <a href="/signin" className="text-white/80 hover:text-white underline cursor-pointer">
                Sign In
              </a>
            </>
          )}

          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/90">{user.email}</span>

              {isPro ? (
                <span className="px-3 py-1 bg-yellow-400 text-black rounded-full text-xs font-bold">
                  PRO
                </span>
              ) : (
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold">
                  FREE
                </span>
              )}

              <button
                onClick={logout}
                className="text-white/70 underline hover:text-white cursor-pointer text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* TITLE */}
        <h1 className="text-5xl font-extrabold text-white flex items-center gap-3 justify-center mb-3">
          <span className="text-yellow-300 text-4xl">✨</span>
          Vibeify AI
        </h1>

        <p className="text-center text-lg text-white/80 mb-1">
          Instantly transform your writing with unique AI-powered tones.
        </p>

        {/* DAILY FREE COUNTER */}
        {!isPro ? (
          <p className="text-center text-sm text-white/80 mb-6">
            Today’s free rewrites:{" "}
            <span className="font-semibold">
              {freeCount} / {FREE_LIMIT}
            </span>
          </p>
        ) : (
          <p className="text-center text-sm text-green-200 mb-6">
            Pro Plan — Unlimited rewrites.
          </p>
        )}

        {/* TEXTAREA */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something here..."
          className="w-full h-40 p-4 rounded-xl bg-white/10 text-white border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        {/* TONE SELECT */}
        <div className="mt-6">
          <label className="text-white/80">Tone:</label>

          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="mt-2 w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-pink-300 cursor-pointer"
          >
            {tones.map((t) => (
              <option key={t} value={t} className="bg-purple-600 text-white">
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* REWRITE BUTTON */}
        <button
          onClick={rewriteText}
          disabled={loading}
          className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-semibold shadow-lg hover:opacity-90 transition active:scale-95 cursor-pointer"
        >
          {loading ? "Rewriting..." : "Rewrite Text"}
        </button>

        {/* UPGRADE TO PRO */}
        {!isPro && (
          <button
            onClick={startCheckout}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-purple-700 to-purple-900 text-white font-semibold shadow-xl relative overflow-hidden hover:text-yellow-200 transition cursor-pointer"
          >
            <span className="relative z-10">Upgrade to Pro — $5/month</span>
            <span className="absolute inset-0 pointer-events-none shine-effect"></span>
          </button>
        )}

        {/* SUGGESTIONS */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setText(s)}
              className="px-4 py-2 bg-white/10 text-white rounded-xl border border-white/20 hover:bg-white/20 transition"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* GOLD SHINE EFFECT */}
      <style jsx>{`
        @keyframes goldShine {
          0% {
            transform: translateX(-150%);
          }
          100% {
            transform: translateX(150%);
          }
        }
        .shine-effect {
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(255, 215, 0, 0.7) 50%,
            transparent 100%
          );
          transform: skewX(-20deg);
          animation: none;
        }
        button:hover .shine-effect {
          animation: goldShine 1s ease-in-out;
        }
      `}</style>
    </main>
  );
}
