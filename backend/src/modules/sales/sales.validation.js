import { z } from 'zod';

export const createSalesOrderSchema = z.object({
  body: z.object({
    orderNo: z.string().min(1, 'Order number is required'),
    customer: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid customer ID'),
    items: z.array(
      z.object({
        product: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
        quantity: z.number().positive(),
        rate: z.number().positive(),
        amount: z.number().nonnegative(),
      })
    ).min(1, 'At least one item is required'),
    gstAmount: z.number().nonnegative().optional(),
    discount: z.number().nonnegative().optional(),
    status: z.enum(['Quotation', 'Approved', 'Processing', 'Delivered', 'Cancelled']).optional(),
    paymentStatus: z.enum(['Pending', 'Partial', 'Paid']).optional(),
  }),
});

export const updateSalesOrderSchema = z.object({
  body: createSalesOrderSchema.shape.body.partial().extend({
    // any status changes or other specifics
  }),
});
