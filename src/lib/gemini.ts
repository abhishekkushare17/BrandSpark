import { GoogleGenerativeAI } from "@google/generative-ai";

export function getGeminiClient(customApiKey?: string): GoogleGenerativeAI | null {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenerativeAI(apiKey.trim());
}

export function hasActiveGeminiKey(customApiKey?: string): boolean {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  return Boolean(apiKey && apiKey.trim().length > 5);
}

export async function callGeminiGenerate(
  prompt: string,
  options?: {
    customApiKey?: string;
    temperature?: number;
    systemInstruction?: string;
    jsonMode?: boolean;
    model?: string;
  }
): Promise<string | null> {
  const client = getGeminiClient(options?.customApiKey);
  if (!client) return null;

  try {
    const modelName = options?.model || "gemini-1.5-flash";
    const model = client.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: options?.temperature ?? 0.8,
        responseMimeType: options?.jsonMode ? "application/json" : "text/plain",
      },
      systemInstruction: options?.systemInstruction,
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.warn("Gemini API call warning (will use BrandSpark algorithmic engine fallback):", error);
    return null;
  }
}
