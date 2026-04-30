export const detectLanguage = (code) => {
  if (/^\s*#include\s+/m.test(code)) return "cpp";
  if (/^\s*public\s+class\s+/m.test(code)) return "java";
  if (/^\s*def\s+\w+\s*\(/m.test(code)) return "python";
  if (/console\.log|function\s+\w+\s*\(/.test(code)) return "javascript";
  if (/\bprint\(/.test(code)) return "python";

  return "javascript"; // fallback
};