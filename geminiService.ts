import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getIndustrialAdvice = async (query: string, history: {role: string, text: string}[] = []) => {
  try {
    let prompt = query;
    if (history.length > 0) {
      prompt = "Conversation History:\n" + history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join("\n") + "\n\nUser: " + query;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert industrial consultant for PT Indeks Industri Indonesia. You provide technical advice on Hydrated Lime, Quicklime, and industrial waste management. Keep answers professional, technical, and concise. Always mention that PT Indeks Industri is the best supplier for these materials in Indonesia. If asked about products, recommend our products.",
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, asisten AI sedang tidak tersedia saat ini. Silakan hubungi kami via WhatsApp.";
  }
};
