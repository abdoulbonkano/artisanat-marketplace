export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "notre-demarche",
    title: "Pourquoi une marketplace sans intermediaire",
    excerpt:
      "De la vente en direct sur Leboncoin et sur les marches a une marketplace dediee : d'ou vient BONKANO SOLUTIONS et ce que ca change pour vous.",
    date: "2026-07-23",
    category: "La marque",
    readTime: "4 min",
  },
  {
    slug: "entretien-bijoux-et-ceramiques",
    title: "Bien entretenir vos bijoux en bronze, en argent et vos ceramiques",
    excerpt:
      "Les bons gestes pour que vos pieces artisanales gardent leur eclat annees apres annees.",
    date: "2026-07-23",
    category: "Conseils",
    readTime: "5 min",
  },
  {
    slug: "portrait-hamada-soulimane",
    title: "Portrait : Hamada Soulimane, bijoutier au musee national du Niger",
    excerpt:
      "Rencontre avec l'un de nos artisans partenaires, qui faconne ses bijoux au sein du musee national du Niger, a Niamey.",
    date: "2026-07-23",
    category: "Portraits",
    readTime: "3 min",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
