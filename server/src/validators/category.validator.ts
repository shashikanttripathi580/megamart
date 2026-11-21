import { z } from 'zod';

export const listCategoriesQuerySchema = z.object({
  tree: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  parentOnly: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
});

export const categorySlugParamSchema = z.object({
  slug: z.string().min(1, 'Category slug is required').trim(),
});
