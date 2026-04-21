"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Profile() {
  const [profile, setProfile] = useState({
    styles: "",
    brands: "",
    references: "",
    lifestyle: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("tasteProfile");
    if (stored) setProfile(JSON.parse(stored));
  }, []);

  function save() {
    localStorage.setItem("tasteProfile", JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function clear() {
    const empty = { styles: "", brands: "", references: "", lifestyle: "" };
    setProfile(empty);
    localStorage.removeItem("tasteProfile");
  }

  const fields = [
    {
      key: "styles",
      emoji: "🎨",
      label: "Preferred styles",
      placeholder: "e.g. quiet luxury, Y2K, French girl aesthetic, streetwear...",
      gradient: "from-pink-400 to-rose-400",
      bg: "from-pink-50 to-rose-50",
      border: "border-pink-100",
    },
    {
      key: "brands",
      emoji: "🏷️",
      label: "Preferred brands",
      placeholder: "e.g. Chanel, Jacquemus, Toteme, Cos, Zara...",
      gradient: "from-violet-400 to-purple-400",
      bg: "from-violet-50 to-purple-50",
      border: "border-violet-100",
    },
    {
      key: "references",
      emoji: "✨",
      label: "Cultural references & icons",
      placeholder: "e.g. Jennie Kim, Hailey Bieber, Vogue Korea, Pinterest fashion...",
      gradient: "from-blue-400 to-indigo-400",
      bg: "from-blue-50 to-indigo-50",
      border: "border-blue-100",
    },
    {
      key: "lifestyle",
      emoji: "🌸",
      label: "Lifestyle & personal details",
      placeholder: "e.g. Yale grad student, loves traveling, warm skin tone, 5'4\" petite...",
      gradient: "from-emerald-400 to-teal-400",
      bg: "from-emerald-50 to-teal-50",
      border: "border-emerald-100",
    },
  ];

  return (
    <main className="min-h-screen" style={{ background: "linear-gradient(135deg, #fff0f6 0%, #f0f4ff 50%, #f5fff0 100%)" }}>
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-start mb-2">
            <Link href="/" className="text-sm px-4 py-1.5 rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 transition">
              ← Back
            </Link>
          </div>
          <div className="text-5xl mb-3">💫</div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">My Style Profile</h1>
          <p className="text-gray-400 text-sm mt-1">Tell us who you are — we'll find what's truly worth it for you ✦</p>
        </div>

        {/* Fields */}
        <div className="space-y-4 mb-6">
          {fields.map((f) => (
            <div key={f.key} className={`rounded-2xl border ${f.border} bg-gradient-to-br ${f.bg} p-4`}>
              <div className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${f.gradient} text-white text-xs font-semibold px-3 py-1 rounded-full mb-3`}>
                {f.emoji} {f.label}
              </div>
              <input
                className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                placeholder={f.placeholder}
                value={profile[f.key]}
                onChange={(e) => setProfile({ ...profile, [f.key]: e.target.value })}
              />
            </div>
          ))}
        </div>

        {/* Save Button */}
        <button
          onClick={save}
          className="w-full py-3.5 rounded-2xl font-medium text-sm text-white mb-3 transition"
          style={{ background: "linear-gradient(to right, #f472b6, #a78bfa)" }}
        >
          {saved ? "✦ You're Worth It ✦" : "💾 Save Profile"}
        </button>

        {saved && (
          <p className="text-center text-xs text-pink-400 mb-3 animate-pulse">
            Every recommendation is now made just for you ✨
          </p>
        )}

        {/* Start Shopping Button */}
        <Link
          href="/"
          className="w-full py-3.5 rounded-2xl font-medium text-sm text-center block mb-3 transition"
          style={{ background: "linear-gradient(to right, #f9a8d4, #c4b5fd, #86efac)" }}
        >
          <span className="text-white drop-shadow">✦ You're Worth It — Start Shopping</span>
        </Link>

        {/* Clear Button */}
        <button
          onClick={clear}
          className="w-full py-3 rounded-2xl font-medium text-sm text-gray-400 border border-gray-100 hover:bg-gray-50 transition"
        >
          Clear profile
        </button>

        <p className="text-center text-xs text-gray-300 mt-4">
          Your profile is stored locally on your device only
        </p>
      </div>
    </main>
  );
}