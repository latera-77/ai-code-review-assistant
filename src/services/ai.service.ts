import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const reviewCode = async (code: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are a senior software engineer.
Review code and give:
1. Bugs
2. Improvements
3. Best practices
Keep it short and structured.
        `,
      },
      {
        role: "user",
        content: code,
      },
    ],
  });

  return response.choices[0].message.content;
};