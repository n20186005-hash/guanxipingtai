import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const guides = defineCollection({
  loader: glob({ base: './src/content/guides', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string(),
    description: z.string(),
    category: z.string(),
    updatedAt: z.coerce.date(),
    reviewStatus: z.enum(['reviewed', 'draft']),
    showMapActions: z.boolean().default(true),
    volatileInformation: z.boolean().default(false),
    related: z.array(z.string()).default([]),
    intro: z.string(),
    eyebrow: z.string(),
    accent: z.enum(['sunset', 'sea', 'dusk', 'sand']).default('sea'),
    placeMapUrl: z.string().url().optional(),
    placeAddress: z.string().optional(),
    placeImage: z.string().optional(),
    placeImageAlt: z.string().optional(),
    placeImageSource: z.string().url().optional(),
    placeHours: z.string().optional(),
    placeAdmission: z.string().optional(),
    placeDuration: z.string().optional()
  })
});

export const collections = { guides };
