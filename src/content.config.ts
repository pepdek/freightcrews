import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

const folder = (name: string) => glob({ pattern: "*.md", base: `./src/content/${name}` });

const agents = defineCollection({
  loader: folder("agents"),
  schema: z.object({
    order: z.number(),
    name: z.string(), // short label from the mega menu
    title: z.string(),
    h1: z.string(),
    h1_italic: z.string(),
    meta: z.string().max(154),
    oneliner: z.string(),
    replaces: z.string(),
    job: z.array(z.string()).min(1),
    input: z.string(),
    output: z.string(),
    approval: z.string(),
    access: z.array(z.string()).min(1),
    time_value: z.string(),
    time_unit: z.string(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).length(3),
    demo: z.string().url().optional(),
  }),
});

const niches = defineCollection({
  loader: folder("niches"),
  schema: z.object({
    order: z.number(),
    name: z.string(),
    noun: z.string(), // "a {noun} desk"
    title: z.string(),
    meta: z.string().max(154),
    lead: z.string(),
    groups: z.array(
      z.object({
        role: z.string(),
        jobs: z.array(z.union([z.string(), z.object({ text: z.string(), agent: reference("agents") })])).min(1),
      }),
    ),
    stays: z.string(),
  }),
});

const proof = defineCollection({
  loader: folder("proof"),
  schema: z.object({
    draft: z.boolean().default(true),
    metrics: z.array(z.object({ value: z.string(), caption: z.string() })).max(3).default([]),
    short_version: z.string().optional(),
    situation: z.string().optional(),
    built: z.string().optional(),
    tested: z.string().optional(),
    limits: z.string().optional(),
  }),
});

export const collections = { agents, niches, proof };
