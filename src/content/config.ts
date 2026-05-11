import { defineCollection, z } from 'astro:content';

const doctrine = defineCollection({
  type: 'content',
  schema: z.object({
    chapter: z.number(),
    title: z.string(),
    date: z.coerce.date(),
    word_count: z.number().optional(),
    rail_market: z.enum(['AU', 'JP', 'NZ', 'SG']).optional(),
  }),
});

const research = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    version: z.string().default('v1.0'),
    pdf_url: z.string().optional(),
    markets: z.array(z.string()).optional(),
    sectors: z.array(z.string()).optional(),
    pages: z.number().optional(),
    headline_metrics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
    source_dataset: z.string().optional(),
  }),
});

export const collections = { doctrine, research };
