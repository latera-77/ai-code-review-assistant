export const reviewCode = async (code: string, language: string) => {
  const apiKey = process.env.GEMINI_API_KEY;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
You are a strict senior software engineer reviewing ${language} code.

IMPORTANT:
- Return ONLY valid JSON
- No explanation, no markdown
- Be STRICT in identifying bugs

Schema:
{
  "score": number,
  "bugs": [
    {
      "line": number,
      "message": string,
      "severity": "low" | "medium" | "high"
    }
  ],
  "improvements": string[],
  "bestPractices": string[]
}

Rules:
- Treat unsafe operations as bugs
- Division by zero MUST be a bug
- Logical risks MUST be bugs
- Missing validation MUST be bugs
- Always include realistic bugs if present
- Each bug MUST include correct line number

Code:
${code}

                `,
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  console.log("FULL RESPONSE:", JSON.stringify(data, null, 2));

  if (!response.ok) {
    return {
      error: data?.error?.message || "Gemini API error",
      fullResponse: data,
    };
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  console.log("RAW TEXT:", text);

  if (!text) {
    return {
      error: "Empty response from Gemini",
      fullResponse: data,
    };
  }

  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      error: "Failed to parse JSON",
      raw: text,
    };
  }
};