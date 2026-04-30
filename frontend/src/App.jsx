import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import { detectLanguage } from "./utils/detectLanguage";

export default function App() {
  const [code, setCode] = useState("// write your code here");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [detectedLanguage, setDetectedLanguage] = useState("javascript");
  
  // ✅ Detect language automatically
 useEffect(() => {
  const detected = detectLanguage(code);
  setDetectedLanguage(detected);
}, [code]);
  // ✅ Monaco error markers
  useEffect(() => {
    if (!result?.bugs || !window.editor || !window.monaco) return;

    const markers = (result.bugs || []).map((bug) => ({
      startLineNumber: bug.line || 1,
      endLineNumber: bug.line || 1,
      startColumn: 1,
      endColumn: 100,
      message: bug.message || "Issue detected",
      severity:
        bug.severity === "high"
          ? window.monaco.MarkerSeverity.Error
          : bug.severity === "medium"
          ? window.monaco.MarkerSeverity.Warning
          : window.monaco.MarkerSeverity.Info,
    }));

    window.monaco.editor.setModelMarkers(
      window.editor.getModel(),
      "ai-review",
      markers
    );
  }, [result]);

  // ✅ API call
  const reviewCode = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language }),
      });

      const data = await res.json();
      setResult(data?.data || { error: "Invalid response" });
    } catch (err) {
      setResult({ error: "Backend not reachable" });
    }

    setLoading(false);
  };

  // ✅ Safe Tailwind colors
  const colors = {
    red: "text-red-400",
    yellow: "text-yellow-400",
    green: "text-green-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 text-gray-900 flex flex-col items-center px-6 py-8"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold">AI Code Reviewer</h1>
        <p className="text-gray-400 mt-2">
          Paste code → Get instant AI feedback
        </p>

  {/* ✅ Language selector */}
  <select
    value={language}
    onChange={(e) => setLanguage(e.target.value)}
    className="mt-3 bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg"
  >
    <option value="javascript">JavaScript</option>
    <option value="python">Python</option>
    <option value="java">Java</option>
    <option value="cpp">C++</option>
    <option value="c">C</option>
  </select>
  <p className="text-sm text-gray-400 mt-2">
  Detected:{" "}
  <span className="text-green-400 font-semibold">
    {detectedLanguage}
  </span>
  {" "}✓
</p>
</div>

      {/* Editor */}
      <div className="w-full max-w-6xl bg-white border border-gray-300 rounded-2xl p-4 shadow-lg">
        <Editor
          height="420px"
          language={language}
          theme="vs-light"
          value={code}
          onChange={(value) => setCode(value || "")}
          onMount={(editor, monaco) => {
            window.editor = editor;
            window.monaco = monaco;
          }}
        />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={reviewCode}
          disabled={loading}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-3 rounded-xl font-semibold transition"
        >
          {loading ? "Analyzing code..." : "Review Code"}
        </motion.button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="w-full max-w-6xl mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {result.error ? (
              <div className="col-span-3 bg-red-900/30 border border-red-700 p-4 rounded-xl">
                <p className="text-red-400">{result.error}</p>
              </div>
            ) : (
              <>
                {/* Score */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <h2 className="text-green-400 font-semibold">Score</h2>
                  <p className="text-4xl font-bold mt-2">
                    {result.score}
                  </p>
                </div>

                <AnimatedCard
                  title="Bugs"
                  color="red"
                  items={result.bugs}
                  colors={colors}
                />

                <AnimatedCard
                  title="Improvements"
                  color="yellow"
                  items={result.improvements}
                  colors={colors}
                />

                <AnimatedCard
                  title="Best Practices"
                  color="green"
                  items={result.bestPractices}
                  colors={colors}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------- Card ---------- */

function AnimatedCard({ title, items, color, colors }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <h3 className={`${colors[color]} font-semibold mb-3`}>
        {title}
      </h3>

      {Array.isArray(items) && items.length > 0 ? (
        <ul className="space-y-2 text-sm text-gray-300">
          {items.map((item, i) => (
            <li key={i} className="bg-gray-800 p-2 rounded-lg">
              {item.message || item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No data</p>
      )}
    </div>
  );
}