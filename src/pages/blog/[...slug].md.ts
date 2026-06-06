import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";

// Plain-text Markdown mirrors of every blog post, for AI agents / answer engines
// that prefer clean text over parsing HTML. Linked from /llms.txt.
// e.g. /blog/zero-to-ai-native/  ->  /blog/zero-to-ai-native.md

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id.replace(/\.mdx?$/, "") },
    props: { post },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const { post } = props as { post: Awaited<ReturnType<typeof getCollection>>[number] };
  const d = post.data;
  const slug = post.id.replace(/\.mdx?$/, "");
  const canonical = `https://sofiayan.cc/blog/${slug}/`;
  const published = d.publishedAt instanceof Date ? d.publishedAt.toISOString().slice(0, 10) : "";
  const tags = Array.isArray(d.tags) && d.tags.length ? d.tags.join(", ") : "";

  const meta = [
    `- Author: Sofia Yan (嚴世紀), Co-Founder & CGO, Numbers Protocol`,
    published ? `- Published: ${published}` : null,
    tags ? `- Tags: ${tags}` : null,
    `- Canonical: ${canonical}`,
    `- License: search=yes, ai-input=yes, ai-train=no (no AI training; cite with credit: "Sofia Yan, Co-Founder & CGO, Numbers Protocol")`,
  ]
    .filter(Boolean)
    .join("\n");

  const header = [
    `# ${d.title}`,
    d.excerpt ? `> ${d.excerpt}` : null,
    meta,
    "---",
  ]
    .filter(Boolean)
    .join("\n\n");

  // Strip MDX import/export statements and collapse excess blank lines so the
  // mirror reads as clean prose.
  const body = (post.body ?? "")
    .replace(/^\s*import\s.+$/gm, "")
    .replace(/^\s*export\s.+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return new Response(`${header}\n\n${body}\n`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
