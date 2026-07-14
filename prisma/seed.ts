import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@artisanat-marketplace.local";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "changeme123";

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Admin",
      role: "ADMIN",
      hashedPassword,
    },
  });

  console.log(`Compte admin pret : ${email} / ${password}`);

  const categories = [
    { slug: "bijoux", name: "Bijoux" },
    { slug: "ceramique", name: "Ceramique & poterie" },
    { slug: "textile", name: "Textile & couture" },
    { slug: "bois", name: "Bois & mobilier" },
    { slug: "papeterie", name: "Papeterie & illustration" },
    { slug: "cuir", name: "Maroquinerie & cuir" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log(`${categories.length} categories pretes.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
