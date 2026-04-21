"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const SECTIONS = {
  VALUE: {
    label: "💰 Value for Money",
    gradient: "from-emerald-400 to-teal-400",
    bg: "from-emerald-50 to-teal-50",
    border: "border-emerald-100",
  },
  BEST_FOR: {
    label: "🎯 Best For",
    gradient: "from-blue-400 to-indigo-400",
    bg: "from-blue-50 to-indigo-50",
    border: "border-blue-100",
  },
  RED_FLAGS: {
    label: "⚠️ Red Flags",
    gradient: "from-rose-400 to-pink-400",
    bg: "from-rose-50 to-pink-50",
    border: "border-rose-100",
  },
  ALTERNATIVES: {
    label: "🔄 Alternatives",
    gradient: "from-violet-400 to-purple-400",
    bg: "from-violet-50 to-purple-50",
    border: "border-violet-100",
  },
  STYLE_FIT: {
    label: "✨ Style Fit & Outfit",
    gradient: "from-pink-400 to-rose-400",
    bg: "from-pink-50 to-rose-50",
    border: "border-pink-100",
  },
  VERDICT: {
    label: "🏆 Verdict",
    gradient: "from-amber-400 to-orange-400",
    bg: "from-amber-50 to-orange-50",
    border: "border-amber-100",
  },
  WHERE_TO_BUY: {
    label: "💸 Where to Buy & Save",
    gradient: "from-green-400 to-emerald-400",
    bg: "from-green-50 to-emerald-50",
    border: "border-green-100",
  },
  COMPARISON: {
    label: "⚖️ Side-by-Side",
    gradient: "from-cyan-400 to-blue-400",
    bg: "from-cyan-50 to-blue-50",
    border: "border-cyan-100",
  },
  WINNER: {
    label: "🏆 Winner",
    gradient: "from-amber-400 to-orange-400",
    bg: "from-amber-50 to-orange-50",
    border: "border-amber-100",
  },
};

function parseResult(text) {
  const sections = [];
  const regex = /\[([A-Z_]+)\]\n([\s\S]*?)(?=\n\[|$)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const key = match[1];
    const content = match[2].trim();
    if (SECTIONS[key]) {
      sections.push({ key, content });
    }
  }
  return sections;
}

function SectionCard({ sectionKey, content }) {
  const s = SECTIONS[sectionKey];
  const lines = content.split("\n").filter((l) => l.trim());
  return (
    <div className={`rounded-2xl border ${s.border} bg-gradient-to-br ${s.bg} p-4 mb-3`}>
      <div className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${s.gradient} text-white text-xs font-semibold px-3 py-1 rounded-full mb-3`}>
        {s.label}
      </div>
      <div className="text-sm text-gray-700 leading-relaxed">
        {sectionKey === "COMPARISON" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              {lines.map((line, i) => {
                const cells = line.split("|").filter((c) => c.trim() && !c.match(/^-+$/));
                if (cells.length < 2) return null;
                return (
                  <tr key={i} className={i === 0 ? "font-semibold border-b border-gray-200" : "border-b border-gray-100"}>
                    {cells.map((cell, j) => (
                      <td key={j} className="py-1.5 pr-3">{cell.trim()}</td>
                    ))}
                  </tr>
                );
              })}
            </table>
          </div>
        ) : (
          lines.map((line, i) =>
            line.startsWith("- ") ? (
              <div key={i} className="flex gap-2 mb-1">
                <span className="text-gray-400 mt-0.5">•</span>
                <span>{line.slice(2)}</span>
              </div>
            ) : (
              <p key={i} className="mb-1">{line}</p>
            )
          )
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState("single");
  const [product, setProduct] = useState("");
  const [products, setProducts] = useState(["", "", ""]);
  const [occasion, setOccasion] = useState("");
  const [weather, setWeather] = useState("");
  const [colorPref, setColorPref] = useState("");
  const [makeup, setMakeup] = useState("");
  const [alreadyOwn, setAlreadyOwn] = useState("");
  const [vibe, setVibe] = useState(50);
  const [result, setResult] = useState("");
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("tasteProfile");
    if (stored) setProfile(JSON.parse(stored));
    const hist = localStorage.getItem("worthitHistory");
    if (hist) setHistory(JSON.parse(hist));
  }, []);

  function saveToHistory(productName, resultText) {
    const entry = {
      id: Date.now(),
      product: productName,
      mode: mode,
      products: mode === "compare" ? products.filter((p) => p.trim()) : [],
      result: resultText,
      date: new Date().toLocaleDateString(),
      occasion,
      weather,
      colorPref,
      makeup,
      alreadyOwn,
      vibe,
    };
    const updated = [entry, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem("worthitHistory", JSON.stringify(updated));
  }

  function loadFromHistory(entry) {
    const entryMode = entry.mode || "single";
    setMode(entryMode);

    if (entryMode === "compare" && entry.products?.length) {
      const padded = [...entry.products, "", ""].slice(0, 3);
      setProducts(padded);
      setProduct("");
    } else {
      setProduct(entry.product);
      setProducts(["", "", ""]);
    }

    setResult(entry.result);
    setSections(parseResult(entry.result));
    setOccasion(entry.occasion || "");
    setWeather(entry.weather || "");
    setColorPref(entry.colorPref || "");
    setMakeup(entry.makeup || "");
    setAlreadyOwn(entry.alreadyOwn || "");
    setVibe(entry.vibe ?? 50);
    setShowHistory(false);
  }

  function deleteHistory(id) {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem("worthitHistory", JSON.stringify(updated));
  }

  async function copyResult() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function analyze() {
    setLoading(true);
    setResult("");
    setSections([]);
    const extraContext = [
      occasion && `Occasion: ${occasion}`,
      weather && `Weather: ${weather}`,
      colorPref && `Color preference: ${colorPref}`,
      makeup && `Makeup & hair: ${makeup}`,
      alreadyOwn && `Already owns: ${alreadyOwn}`,
      `Style vibe: ${vibe < 30 ? "cool and minimal" : vibe > 70 ? "cute and playful" : "balanced"}`,
    ].filter(Boolean).join(", ");

    const body =
      mode === "compare"
        ? { mode: "compare", products: products.filter((p) => p.trim()), context: extraContext, profile }
        : { product, context: extraContext, profile };

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setResult(data.result);
    setSections(parseResult(data.result));
    saveToHistory(
      mode === "compare" ? products.filter((p) => p.trim()).join(" vs ") : product,
      data.result
    );
    setLoading(false);
  }

  const canAnalyze =
    mode === "single"
      ? product.trim()
      : products.filter((p) => p.trim()).length >= 2;

  return (
    <main className="min-h-screen" style={{ background: "linear-gradient(135deg, #fff0f6 0%, #f0f4ff 50%, #f5fff0 100%)" }}>
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-between mb-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm px-4 py-1.5 rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 transition"
            >
              🕐 History {history.length > 0 && `(${history.length})`}
            </button>
            <Link href="/profile" className="text-sm px-4 py-1.5 rounded-full border border-pink-200 text-pink-500 hover:bg-pink-50 transition">
              {profile ? "✦ My Style Profile" : "✨ Set up profile"}
            </Link>
          </div>

          {/* History Panel */}
          {showHistory && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 text-left">
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Recent analyses</div>
              {history.length === 0 ? (
                <p className="text-sm text-gray-400">No history yet — analyze something first!</p>
              ) : (
                history.map((h) => (
                  <div key={h.id} className="py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <button
                        onClick={() => loadFromHistory(h)}
                        className="text-sm text-gray-700 hover:text-pink-500 transition text-left flex-1 truncate font-medium"
                      >
                        🛍️ {h.product}
                      </button>
                      <button
                        onClick={() => deleteHistory(h.id)}
                        className="text-gray-300 hover:text-red-400 ml-2 text-xs transition"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 flex flex-wrap gap-2">
                      {h.occasion && <span>🎯 {h.occasion}</span>}
                      {h.weather && <span>🌤 {h.weather}</span>}
                      {h.makeup && <span>💄 {h.makeup}</span>}
                      {h.mode === "compare" && <span>⚖️ Compare</span>}
                      <span className="text-gray-300">{h.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="text-5xl mb-3">🛍️</div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">Worthit ✦</h1>
          <p className="text-gray-400 text-sm mt-1">Your honest, personalized shopping advisor</p>
          {profile && (
            <div className="mt-3 inline-flex items-center gap-2 bg-white text-pink-600 text-xs px-4 py-1.5 rounded-full shadow-sm border border-pink-100">
              ✓ Personalized for: <span className="font-medium">{profile.styles || profile.lifestyle || "your taste"}</span>
            </div>
          )}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => { setMode("single"); setResult(""); setSections([]); }}
              className={`flex-1 py-2.5 rounded-2xl text-sm font-medium transition ${
                mode === "single"
                  ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              🔍 Single Product
            </button>
            <button
              onClick={() => { setMode("compare"); setResult(""); setSections([]); }}
              className={`flex-1 py-2.5 rounded-2xl text-sm font-medium transition ${
                mode === "compare"
                  ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              ⚖️ Compare Products
            </button>
          </div>

          {mode === "single" ? (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Product</label>
              <textarea
                className="w-full border border-gray-100 bg-gray-50 rounded-2xl p-3.5 h-24 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 resize-none"
                placeholder="e.g. Loewe Puzzle Bag mini, $2,150 ..."
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              />
            </div>
          ) : (
            <div className="mb-4 space-y-2.5">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Products to compare (2–3)</label>
              {products.map((p, i) => (
                <input
                  key={i}
                  className="w-full border border-gray-100 bg-gray-50 rounded-2xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                  placeholder={`Product ${i + 1}${i === 2 ? " (optional)" : ""}`}
                  value={p}
                  onChange={(e) => {
                    const updated = [...products];
                    updated[i] = e.target.value;
                    setProducts(updated);
                  }}
                />
              ))}
            </div>
          )}

          <div className="mb-5 space-y-2.5">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Tell us more — makes results way better ✨
            </label>
            <input
              className="w-full border border-gray-100 bg-gray-50 rounded-2xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
              placeholder="🎯 Occasion — e.g. first date, job interview, park picnic..."
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
            />
            <input
              className="w-full border border-gray-100 bg-gray-50 rounded-2xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
              placeholder="🌤 Weather — e.g. 15°C sunny, humid summer..."
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
            />
            <input
              className="w-full border border-gray-100 bg-gray-50 rounded-2xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
              placeholder="🎨 Color preference — e.g. earthy tones, all black, pastels..."
              value={colorPref}
              onChange={(e) => setColorPref(e.target.value)}
            />
            <input
              className="w-full border border-gray-100 bg-gray-50 rounded-2xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
              placeholder="💄 Makeup & hair — e.g. no-makeup look, glam, dark hair..."
              value={makeup}
              onChange={(e) => setMakeup(e.target.value)}
            />
            <input
              className="w-full border border-gray-100 bg-gray-50 rounded-2xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
              placeholder="👗 Already own — e.g. white sneakers, gold jewelry, beige coat..."
              value={alreadyOwn}
              onChange={(e) => setAlreadyOwn(e.target.value)}
            />
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>🧊 Cool & minimal</span>
                <span className="font-medium text-pink-400">Style vibe</span>
                <span>🌸 Cute & playful</span>
              </div>
              <input
                type="range" min="0" max="100" value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                className="w-full accent-pink-400"
              />
            </div>
          </div>

          <button
            onClick={analyze}
            disabled={loading || !canAnalyze}
            className="w-full py-3.5 rounded-2xl font-medium text-sm text-white transition disabled:opacity-40"
            style={{ background: loading || !canAnalyze ? "#ccc" : "linear-gradient(to right, #f472b6, #a78bfa)" }}
          >
            {loading ? "✨ Thinking..." : mode === "compare" ? "⚖️ Compare now!" : "🔍 Is this worth it?"}
          </button>
          <button
            onClick={() => {
              setProduct("");
              setProducts(["", "", ""]);
              setOccasion("");
              setWeather("");
              setColorPref("");
              setMakeup("");
              setAlreadyOwn("");
              setVibe(50);
              setResult("");
              setSections([]);
            }}
            className="w-full py-2.5 rounded-2xl font-medium text-sm text-gray-400 border border-gray-100 hover:bg-gray-50 transition mt-2"
          >
            🗑 Clear all
          </button>
        </div>

        {/* Result */}
        {sections.length > 0 && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="text-xs font-medium text-pink-400 uppercase tracking-wide">✦ Analysis Result</div>
              <button
                onClick={copyResult}
                className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 transition"
              >
                {copied ? "✓ Copied!" : "📋 Copy result"}
              </button>
            </div>
            {sections.map((s) => (
              <SectionCard key={s.key} sectionKey={s.key} content={s.content} />
            ))}
          </div>
        )}
        {result && sections.length === 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mt-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {result}
          </div>
        )}
      </div>
    </main>
  );
}