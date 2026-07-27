import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Coulisses de l'artisanat, rencontres avec nos artisans partenaires et conseils pour entretenir vos pieces.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-border bg-secondary/30 px-6 py-16 text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
          <span className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
            Blog
          </span>
          <h1 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">
            Coulisses de l&apos;artisanat
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            Rencontres avec nos artisans partenaires, notre demarche, et des
            conseils pour prendre soin de vos pieces.
          </p>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-2 rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_6px_-2px_rgba(36,28,16,0.06),0_16px_28px_-12px_rgba(36,28,16,0.18)]"
            >
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-semibold tracking-wide text-accent uppercase">
                  {post.category}
                </span>
                <span>&middot;</span>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span>&middot;</span>
                <span>{post.readTime} de lecture</span>
              </div>
              <h2 className="text-xl font-medium tracking-tight group-hover:text-accent">
                {post.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
