export const reviewCode = async (code: string) => {
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
You are a senior software engineer.

Return ONLY valid JSON:
{
  "score": number,
  "bugs": string[],
  "improvements": string[],
  "bestPractices": string[]
}

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

  // Debug full response (VERY IMPORTANT)
  console.log("FULL GEMINI RESPONSE:", JSON.stringify(data, null, 2));

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

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
  } catch (err) {
    return {
      error: "Failed to parse JSON",
      raw: text,
    };
  }
};