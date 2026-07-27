import { describe, expect, it } from "vitest";
import { blogPosts, getBlogPost } from "@/lib/blog";

describe("getBlogPost", () => {
  it("finds a post by its slug", () => {
    const post = getBlogPost("notre-demarche");
    expect(post?.title).toBe("Pourquoi une marketplace sans intermediaire");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getBlogPost("ne-existe-pas")).toBeUndefined();
  });
});

describe("blogPosts", () => {
  it("has no duplicate slugs", () => {
    const slugs = blogPosts.map((post) => post.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("gives every post a non-empty title and excerpt", () => {
    for (const post of blogPosts) {
      expect(post.title.length).toBeGreaterThan(0);
      expect(post.excerpt.length).toBeGreaterThan(0);
    }
  });
});
