"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("Professional");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);


  async function goPro() {
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // redirect to Stripe Checkout page
      } else {
        alert("Unable to start checkout.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  }

  const handleRewrite = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setOutput("");

    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone }),
      });
      const data = await res.json();
      setOutput(data.result);
    } catch (err) {
      console.error(err);
      setOutput("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const presetExamples = [
    "Hey, can we reschedule our meeting?",
    "Sorry I’m running late 😅",
    "Let’s grab coffee sometime soon!",
    "I’m thrilled about the new project!",
  ];

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-violet-600 via-indigo-500 to-sky-400 flex flex-col items-center justify-center p-6 text-gray-900">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-6xl font-extrabold text-white drop-shadow-lg mb-2 tracking-tight">
          Vibeify ✨
        </h1>
        <p className="text-indigo-100 text-lg max-w-xl mx-auto">
          Instantly transform your words into any <span className="font-semibold text-white">vibe</span> —
          professional, flirty, poetic, savage, and more.
        </p>
      </div>

      {/* CARD */}
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 w-full max-w-2xl text-white">
        <label className="block text-lg mb-2 font-semibold">Your Text</label>
        <textarea
          className="w-full p-4 rounded-xl bg-white/20 border border-white/30 focus:outline-none focus:ring-4 focus:ring-sky-300 placeholder-white/70 text-white resize-none"
          rows={4}
          placeholder="Type or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
          <select
            className="p-3 rounded-lg bg-white/30 border border-white/40 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-sky-300"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            {[
              "Professional",
              "Flirty",
              "Funny",
              "Empathetic",
              "Poetic",
              "Savage",
              "Motivational",
              "Mysterious",
            ].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <button
            onClick={handleRewrite}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-500 hover:to-violet-600 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-60 shadow-lg"
          >
            {loading ? "Vibing..." : "✨ Rewrite"}
          </button>

          <button
  onClick={goPro}
  className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-500 hover:to-violet-600 text-white font-semibold transition-all"
>
  Upgrade to Pro — $5/month
</button>

        </div>

        {/* OUTPUT */}
        {output && (
          <div className="mt-6 bg-white/20 border border-white/30 rounded-xl p-5">
            <p className="text-sm text-indigo-200 mb-2 font-semibold">
              Your Rewritten Text:
            </p>
            <p className="text-white whitespace-pre-line leading-relaxed">{output}</p>
            <button
              className="mt-3 text-sm text-sky-200 underline hover:text-sky-100"
              onClick={() => navigator.clipboard.writeText(output)}
            >
              Copy to clipboard
            </button>
          </div>
        )}
      </div>

      {/* EXAMPLES */}
      <div className="mt-10 max-w-3xl text-center">
        <p className="text-white/80 font-medium mb-3">Try an example:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {presetExamples.map((ex) => (
            <button
              key={ex}
              onClick={() => setText(ex)}
              className="px-4 py-2 bg-white/20 border border-white/30 rounded-full text-white text-sm hover:bg-white/30 transition-all"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-14 text-white/60 text-sm text-center">
        <p>
          Made with 💜 by <span className="font-semibold text-white">Vibeify</span> — where
          every message gets the perfect tone.
        </p>
      </footer>
    </main>
  );
}
