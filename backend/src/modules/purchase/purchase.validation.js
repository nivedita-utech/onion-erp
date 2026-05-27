import { z } from 'zod';

export const createPurchaseOrderSchema = z.object({
  body: z.object({
    poNumber: z.string().min(1, 'PO number is required'),
    supplier: z.string().min(1, 'Supplier name is required'),
    items: z.array(
      z.object({
        product: z.string().min(1, 'Product name is required'),
        quantity: z.number().positive('Quantity must be greater than zero'),
        rate: z.number().positive('Rate must be greater than zero'),
        amount: z.number().nonnegative(),
      })
    ).min(1, 'At least one item is required'),
    status: z.enum(['Pending', 'Approved', 'Received', 'Cancelled']).optional(),
    paymentStatus: z.enum(['Pending', 'Partial', 'Paid']).optional(),
  }),
});

export const updatePurchaseOrderSchema = z.object({
  body: createPurchaseOrderSchema.shape.body.partial(),
});

export const createSupplierSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Supplier name is required'),
    contact: z.string().optional(),
    gst: z.string().optional(),
    products: z.array(z.string()).optional(),
    paymentTerms: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
  }),
});

export const updateSupplierSchema = z.object({
  body: createSupplierSchema.shape.body.partial(),
});
