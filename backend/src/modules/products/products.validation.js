import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required'),
    sku: z.string().min(1, 'SKU is required'),
    category: z.string().optional(),
    grade: z.string().optional(),
    packagingTypes: z.array(z.string()).optional(),
    domesticPrice: z.number().nonnegative().optional(),
    exportPrices: z.array(
      z.object({
        currency: z.string(),
        price: z.number().nonnegative(),
      })
    ).optional(),
    unit: z.string().optional(),
  }),
});

export const updateProductSchema = z.object({
  body: createProductSchema.shape.body.partial(),
});
