import { GoogleGenAI } from "@google/genai";

export const useGemini = Boolean(process.env.GEMINI_API_KEY);

// Falls back to a placeholder so the client can be constructed at build/module
// load time even without a real key configured; callers must check
// useGemini before making a request.
export const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "placeholder",
});

// Alias maintenu par Google plutot qu'un nom de version fige - evite de se
// retrouver bloque quand un modele est retire pour les nouveaux comptes.
export const CHATBOT_MODEL = "gemini-flash-latest";
