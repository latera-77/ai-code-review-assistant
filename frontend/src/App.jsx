import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function App() {
  const [code, setCode] = useState("// write your code here");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const reviewCode = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      setResult(data.data);
    } catch (err) {
      setResult({ error: "Backend not reachable" });
    }

    setLoading(false);
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6 flex flex-col items-center">

    {/* Header */}
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold tracking-tight">
        AI Code Reviewer
      </h1>
      <p className="text-gray-400 mt-2">
        Paste code → Get instant AI feedback
      </p>
    </div>

    {/* Editor Card */}
    <div className="w-full max-w-6xl bg-gray-900/60 backdrop-blur border border-gray-800 rounded-2xl p-4 shadow-xl">

      <Editor
        height="420px"
        defaultLanguage="javascript"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || "")}
      />

      <button
        onClick={reviewCode}
        disabled={loading}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition py-3 rounded-xl font-semibold"
      >
        {loading ? "Analyzing code..." : "Review Code"}
      </button>
    </div>

    {/* Result Section */}
    {result && (
      <div className="w-full max-w-6xl mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Score Card */}
        {!result.error && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-green-400">
              Score
            </h2>
            <p className="text-4xl font-bold mt-2">
              {result.score}
            </p>
          </div>
        )}

        {/* Bugs */}
        <Card title="Bugs" color="red" items={result.bugs} />

        {/* Improvements */}
        <Card title="Improvements" color="yellow" items={result.improvements} />

        {/* Best Practices */}
        <Card title="Best Practices" color="green" items={result.bestPractices} />

      </div>
    )}

  </div>
);
}

function Card({ title, items, color }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <h3 className={`text-${color}-400 font-semibold mb-3`}>
        {title}
      </h3>

      {items?.length ? (
        <ul className="space-y-2 text-sm text-gray-300">
          {items.map((item, i) => (
            <li key={i} className="bg-gray-800 p-2 rounded-lg">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No data</p>
      )}
    </div>
  );
}