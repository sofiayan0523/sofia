import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    category: z.enum(["travel", "ai-tools", "thoughts"]),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    readTime: z.string().default("5 min"),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
