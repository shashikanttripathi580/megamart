import { z } from 'zod';

export const listProductsQuerySchema = z
  .object({
    page: z
      .string()
      .optional()
      .default('1')
      .transform((val) => Math.max(1, parseInt(val, 10) || 1)),
    limit: z
      .string()
      .optional()
      .default('20')
      .transform((val) => Math.min(100, Math.max(1, parseInt(val, 10) || 20))),
    category: z.string().optional(),
    subcategory: z.string().optional(),
    brand: z.string().optional(),
    search: z.string().optional(),
    minPrice: z
      .string()
      .optional()
      .refine(
        (val) => val === undefined || (val.trim() !== '' && !isNaN(Number(val)) && Number(val) >= 0),
        { message: 'minPrice must be a valid non-negative number' }
      )
      .transform((val) => (val !== undefined && val.trim() !== '' ? Number(val) : undefined)),
    maxPrice: z
      .string()
      .optional()
      .refine(
        (val) => val === undefined || (val.trim() !== '' && !isNaN(Number(val)) && Number(val) >= 0),
        { message: 'maxPrice must be a valid non-negative number' }
      )
      .transform((val) => (val !== undefined && val.trim() !== '' ? Number(val) : undefined)),
    isFeatured: z
      .string()
      .optional()
      .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined)),
    sortBy: z.enum(['createdAt', 'sellingPrice', 'name', 'discountPercentage']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  })
  .refine(
    (data) => {
      if (data.minPrice !== undefined && data.maxPrice !== undefined) {
        return data.minPrice <= data.maxPrice;
      }
      return true;
    },
    {
      message: 'minPrice cannot be greater than maxPrice',
      path: ['minPrice'],
    }
  );

export const productIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID format. Must be a 24-character hexadecimal ObjectId'),
});

export const productSlugParamSchema = z.object({
  slug: z.string().min(1, 'Product slug is required').trim(),
});
