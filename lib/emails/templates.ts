import { SITE_NAME, SITE_URL } from "@/lib/site";

const COLOR_PRIMARY = "#1f3d2a";
const COLOR_BG = "#faf3ea";
const COLOR_TEXT = "#2b241b";
const COLOR_MUTED = "#6b5f4f";

function layout(preheader: string, bodyHtml: string): string {
  return `
<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:0;background-color:${COLOR_BG};font-family:Georgia,'Times New Roman',serif;color:${COLOR_TEXT};">
    <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</span>
    <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
      <div style="background-color:${COLOR_PRIMARY};border-radius:16px 16px 0 0;padding:24px 28px;">
        <span style="color:#ffffff;font-size:20px;font-weight:600;">${SITE_NAME}</span>
      </div>
      <div style="background-color:#fffdf9;border:1px solid #e8ddcc;border-top:none;border-radius:0 0 16px 16px;padding:28px;">
        ${bodyHtml}
      </div>
      <p style="margin-top:20px;text-align:center;font-size:12px;color:${COLOR_MUTED};">
        ${SITE_NAME} - <a href="${SITE_URL}" style="color:${COLOR_MUTED};">${SITE_URL.replace("https://", "")}</a>
      </p>
    </div>
  </body>
</html>`;
}

function button(label: string, url: string): string {
  return `<a href="${url}" style="display:inline-block;margin-top:16px;padding:12px 24px;background-color:${COLOR_PRIMARY};color:#ffffff;text-decoration:none;border-radius:999px;font-size:14px;font-weight:600;">${label}</a>`;
}

export function welcomeEmail({ name }: { name: string }) {
  return {
    subject: `Bienvenue sur ${SITE_NAME}`,
    html: layout(
      "Bienvenue sur la marketplace de l'artisanat fait main",
      `
        <h1 style="font-size:22px;margin:0 0 12px;">Bienvenue, ${name} !</h1>
        <p style="font-size:15px;line-height:1.6;color:${COLOR_TEXT};">
          Votre compte a bien ete cree. Vous pouvez des maintenant parcourir
          les creations de nos artisans partenaires, ou ouvrir votre propre
          boutique si vous etes vous-meme artisan.
        </p>
        ${button("Decouvrir les creations", `${SITE_URL}/produits`)}
      `,
    ),
  };
}

export function orderConfirmationEmail({
  orderId,
  items,
  totalCents,
}: {
  orderId: string;
  items: { titleSnapshot: string; quantity: number; priceCentsSnapshot: number }[];
  totalCents: number;
}) {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;font-size:14px;">${item.titleSnapshot} &times; ${item.quantity}</td>
          <td style="padding:8px 0;font-size:14px;text-align:right;">${((item.priceCentsSnapshot * item.quantity) / 100).toFixed(2)} EUR</td>
        </tr>`,
    )
    .join("");

  return {
    subject: "Confirmation de votre commande",
    html: layout(
      "Votre commande est confirmee",
      `
        <h1 style="font-size:22px;margin:0 0 12px;">Commande confirmee</h1>
        <p style="font-size:15px;line-height:1.6;">
          Merci pour votre commande. Voici le recapitulatif :
        </p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;border-top:1px solid #e8ddcc;">
          ${rows}
        </table>
        <p style="font-size:16px;font-weight:600;border-top:1px solid #e8ddcc;padding-top:12px;">
          Total : ${(totalCents / 100).toFixed(2)} EUR
        </p>
        ${button("Suivre ma commande", `${SITE_URL}/commandes/${orderId}`)}
      `,
    ),
  };
}

export function newSaleEmail({
  shopName,
  items,
  amountCents,
}: {
  shopName: string;
  items: { titleSnapshot: string; quantity: number }[];
  amountCents: number;
}) {
  const list = items
    .map((item) => `<li style="font-size:14px;">${item.titleSnapshot} &times; ${item.quantity}</li>`)
    .join("");

  return {
    subject: "Vous avez une nouvelle vente !",
    html: layout(
      "Nouvelle vente sur votre boutique",
      `
        <h1 style="font-size:22px;margin:0 0 12px;">Nouvelle vente, ${shopName} !</h1>
        <p style="font-size:15px;line-height:1.6;">Un acheteur vient de commander :</p>
        <ul style="padding-left:18px;">${list}</ul>
        <p style="font-size:16px;font-weight:600;">Montant : ${(amountCents / 100).toFixed(2)} EUR</p>
        ${button("Voir la commande", `${SITE_URL}/vendeur/commandes`)}
      `,
    ),
  };
}

export function newMessageEmail({
  recipientName,
  senderName,
  body,
  url,
}: {
  recipientName: string;
  senderName: string;
  body: string;
  url: string;
}) {
  return {
    subject: `Nouveau message de ${senderName}`,
    html: layout(
      "Vous avez recu un nouveau message",
      `
        <h1 style="font-size:22px;margin:0 0 12px;">Bonjour ${recipientName}</h1>
        <p style="font-size:15px;line-height:1.6;">
          <strong>${senderName}</strong> vous a envoye un message :
        </p>
        <p style="font-size:14px;line-height:1.6;background-color:${COLOR_BG};border-radius:8px;padding:12px 16px;color:${COLOR_TEXT};">
          ${body}
        </p>
        ${button("Repondre", url)}
      `,
    ),
  };
}

export function shopApprovedEmail({ shopName, shopUrl }: { shopName: string; shopUrl: string }) {
  return {
    subject: "Votre boutique est approuvee !",
    html: layout(
      "Votre boutique est maintenant en ligne",
      `
        <h1 style="font-size:22px;margin:0 0 12px;">Felicitations !</h1>
        <p style="font-size:15px;line-height:1.6;">
          Votre boutique <strong>${shopName}</strong> a ete approuvee et est
          maintenant visible publiquement sur ${SITE_NAME}.
        </p>
        ${button("Voir ma boutique", shopUrl)}
      `,
    ),
  };
}

export function shopRejectedEmail({ shopName }: { shopName: string }) {
  return {
    subject: "Votre demande de boutique",
    html: layout(
      "Mise a jour sur votre demande de boutique",
      `
        <h1 style="font-size:22px;margin:0 0 12px;">Votre demande n'a pas ete retenue</h1>
        <p style="font-size:15px;line-height:1.6;">
          Votre demande d'ouverture de boutique <strong>${shopName}</strong>
          n'a pas ete approuvee pour le moment. Ecrivez-nous si vous pensez
          qu'il s'agit d'une erreur ou pour en savoir plus.
        </p>
        ${button("Nous contacter", `${SITE_URL}/contact`)}
      `,
    ),
  };
}

export function contactNotificationEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return {
    subject: `Nouveau message de contact : ${subject}`,
    html: layout(
      "Nouveau message recu depuis le formulaire de contact",
      `
        <h1 style="font-size:22px;margin:0 0 12px;">Nouveau message de contact</h1>
        <p style="font-size:14px;line-height:1.6;">
          <strong>${name}</strong> (${email})
        </p>
        <p style="font-size:14px;line-height:1.6;background-color:${COLOR_BG};border-radius:8px;padding:12px 16px;">
          ${message}
        </p>
        ${button("Voir dans l'admin", `${SITE_URL}/admin/contact`)}
      `,
    ),
  };
}
