import { useState } from "react";

export default function App() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      setResult(data.data);
    } catch (err) {
      setResult({ error: "Failed to connect to backend" });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col items-center">
      
      {/* Header */}
      <h1 className="text-3xl font-bold mb-2">
        AI Code Reviewer
      </h1>
      <p className="text-gray-400 mb-6">
        Paste your code and get instant AI feedback
      </p>

      {/* Input Card */}
      <div className="w-full max-w-3xl bg-gray-900 p-4 rounded-xl border border-gray-700">
        <textarea
          className="w-full h-52 bg-gray-800 p-3 rounded-lg outline-none"
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button
          onClick={reviewCode}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold"
        >
          {loading ? "Analyzing..." : "Review Code"}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="w-full max-w-3xl mt-6 bg-gray-900 p-4 rounded-xl border border-gray-700">
          
          {result.error ? (
            <p className="text-red-400">{result.error}</p>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-3">
                Score: <span className="text-green-400">{result.score}</span>
              </h2>

              <Section title="Bugs" items={result.bugs} color="red" />
              <Section title="Improvements" items={result.improvements} color="yellow" />
              <Section title="Best Practices" items={result.bestPractices} color="green" />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, items, color }) {
  return (
    <div className="mb-4">
      <h3 className={`text-${color}-400 font-semibold mb-2`}>
        {title}
      </h3>
      <ul className="list-disc ml-6 text-gray-300">
        {items?.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}