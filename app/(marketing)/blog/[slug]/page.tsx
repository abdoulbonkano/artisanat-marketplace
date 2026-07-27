import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { blogPosts, getBlogPost } from "@/lib/blog";
import { articleComponents } from "@/components/blog/articles";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  const Content = articleComponents[slug];

  if (!post || !Content) {
    notFound();
  }

  return (
    <article className="mx-auto flex max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      <Link
        href="/blog"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Retour au blog
      </Link>

      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="font-semibold tracking-wide text-accent uppercase">
            {post.category}
          </span>
          <span>&middot;</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>&middot;</span>
          <span>{post.readTime} de lecture</span>
        </div>
        <h1 className="text-3xl font-medium tracking-tight text-balance sm:text-4xl">
          {post.title}
        </h1>
      </header>

      <div className="flex flex-col gap-8">
        <Content />
      </div>
    </article>
  );
}
