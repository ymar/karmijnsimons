import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Position in the work grid (lowest first). */
      order: z.number(),
      cover: image(),
      coverAlt: z.string().default(''),
    }),
});

export const collections = { work };
