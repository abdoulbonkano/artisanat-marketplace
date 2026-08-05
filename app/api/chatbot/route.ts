import { CHATBOT_SYSTEM_PROMPT } from "@/lib/chatbot";
import { CHATBOT_MODEL, gemini, useGemini } from "@/lib/gemini";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { chatbotRequestSchema } from "@/lib/validations/chatbot";

export async function POST(request: Request) {
  if (!useGemini) {
    return Response.json(
      { error: "L'assistant n'est pas disponible pour le moment." },
      { status: 503 },
    );
  }

  const ip = await getClientIp();
  const { allowed } = await checkRateLimit(`chatbot:${ip}`, {
    limit: 20,
    windowMs: 60 * 60 * 1000,
  });
  if (!allowed) {
    return Response.json(
      { error: "Trop de messages envoyes. Reessayez plus tard." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = chatbotRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Requete invalide." }, { status: 400 });
  }

  const contents = parsed.data.messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  let geminiStream: AsyncGenerator<{ text?: string }>;
  try {
    geminiStream = await gemini.models.generateContentStream({
      model: CHATBOT_MODEL,
      contents,
      config: { systemInstruction: CHATBOT_SYSTEM_PROMPT },
    });
  } catch (error) {
    console.error("[chatbot] Failed to start Gemini stream:", error);
    return Response.json({ error: "L'assistant est indisponible." }, { status: 500 });
  }

  const textStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of geminiStream) {
          if (chunk.text) controller.enqueue(encoder.encode(chunk.text));
        }
        controller.close();
      } catch (error) {
        console.error("[chatbot] Gemini stream error:", error);
        controller.error(error);
      }
    },
  });

  return new Response(textStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
