import { useState } from "react";

function App() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const reviewCode = async () => {
    setLoading(true);

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
      setResult({ error: "Request failed" });
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>AI Code Reviewer</h1>

      <textarea
        rows={10}
        cols={60}
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <br />

      <button onClick={reviewCode} disabled={loading}>
        {loading ? "Reviewing..." : "Review Code"}
      </button>

      <hr />

      {result && (
        <div>
          <h2>Result</h2>

          {result.error ? (
            <p>{result.error}</p>
          ) : (
            <>
              <p><b>Score:</b> {result.score}</p>

              <h3>Bugs</h3>
              <ul>
                {result.bugs?.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>

              <h3>Improvements</h3>
              <ul>
                {result.improvements?.map((i, idx) => (
                  <li key={idx}>{i}</li>
                ))}
              </ul>

              <h3>Best Practices</h3>
              <ul>
                {result.bestPractices?.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;