import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

// Test-only fixture data for the local e2e Postgres (docker-compose db-test).
// Never run against a real database.
async function main() {
  const hashedPassword = await bcrypt.hash("changeme123", 10);

  await prisma.user.upsert({
    where: { email: "admin@artisanat-marketplace.local" },
    update: {},
    create: {
      email: "admin@artisanat-marketplace.local",
      name: "Admin",
      role: "ADMIN",
      hashedPassword,
    },
  });

  const categories = [
    { slug: "bijoux", name: "Bijoux" },
    { slug: "ceramique", name: "Ceramique & poterie" },
  ];
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  const seller = await prisma.user.upsert({
    where: { email: "seller-e2e@artisanat-marketplace.local" },
    // Reset 2FA state on every reseed so local re-runs of the 2FA e2e test
    // (which enables it on this account) stay deterministic.
    update: { twoFactorEnabled: false, twoFactorSecret: null },
    create: {
      email: "seller-e2e@artisanat-marketplace.local",
      name: "Artisan Test",
      role: "SELLER",
      hashedPassword,
      emailVerified: new Date(),
    },
  });
  await prisma.twoFactorRecoveryCode.deleteMany({ where: { userId: seller.id } });

  const shop = await prisma.shop.upsert({
    where: { ownerId: seller.id },
    update: { status: "ACTIVE" },
    create: {
      slug: "boutique-e2e",
      name: "Boutique E2E",
      description: "Boutique de test pour les scenarios end-to-end.",
      status: "ACTIVE",
      ownerId: seller.id,
    },
  });

  const bijoux = await prisma.category.findUniqueOrThrow({ where: { slug: "bijoux" } });

  await prisma.product.upsert({
    where: { slug: "bague-e2e-test" },
    update: { status: "PUBLISHED", stock: 10 },
    create: {
      slug: "bague-e2e-test",
      title: "Bague E2E Test",
      description: "Produit de test cree pour les scenarios end-to-end automatises.",
      priceCents: 4500,
      stock: 10,
      status: "PUBLISHED",
      shopId: shop.id,
      categoryId: bijoux.id,
    },
  });

  console.log("Fixtures e2e pretes : admin, vendeur, boutique, produit publie.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
