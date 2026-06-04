import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
  const posts = (await getCollection("posts", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );

  // Astro `context.site` is the bare site (e.g. https://sofiayan.cc)
  // We need to combine it with `import.meta.env.BASE_URL` so the feed reflects
  // the actual deployed root (https://sofiayan.cc/).
  const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");
  const origin = (context.site?.toString() ?? "https://sofiayan.cc").replace(/\/$/, "");
  const siteRoot = `${origin}${base}`;

  return rss({
    title: "Sofia Yan | Tech & Travel",
    description:
      "探索 AI、區塊鏈與數位內容驗證的交會點。旅行手記、科技觀察，以及對生活的隨想。",
    site: siteRoot,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishedAt,
      description: post.data.excerpt ?? "",
      // Use full URL; rss helper normalises it correctly.
      link: `${siteRoot}blog/${post.id.replace(/\.mdx?$/, "")}/`,
      categories: [post.data.category, ...(post.data.tags ?? [])],
    })),
    customData: `<language>zh-tw</language>`,
  });
};
