import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Sends from Resend's shared test domain until a verified custom domain is
// configured - works immediately, no DNS setup required.
const FROM_ADDRESS = "Marketplace Artisanat <onboarding@resend.dev>";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (!resend) {
    console.log(`[email] RESEND_API_KEY absent - email non envoye a ${to}: ${subject}`);
    return;
  }

  try {
    await resend.emails.send({ from: FROM_ADDRESS, to, subject, html });
  } catch (error) {
    // Email is never on the critical path (an order or message must still
    // succeed if the notification fails to send), so this is swallowed.
    console.error("[email] Echec d'envoi", error);
  }
}
