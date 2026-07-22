import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}

// A minimal DB-backed sliding-window limiter - no external service needed.
// Fine at this scale; would move to Redis/Upstash if traffic grew significantly.
export async function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): Promise<{ allowed: boolean }> {
  const windowStart = new Date(Date.now() - windowMs);

  await prisma.rateLimitHit.deleteMany({
    where: { key, createdAt: { lt: windowStart } },
  });

  const count = await prisma.rateLimitHit.count({
    where: { key, createdAt: { gte: windowStart } },
  });

  if (count >= limit) {
    return { allowed: false };
  }

  await prisma.rateLimitHit.create({ data: { key } });
  return { allowed: true };
}
