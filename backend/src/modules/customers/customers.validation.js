import { z } from 'zod';

export const createCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Customer name is required'),
    contactPerson: z.string().optional(),
    email: z.string().email('Invalid email format').optional().or(z.literal('')),
    source: z.string().optional(),
    country: z.string().optional(),
    billingAddress: z.string().optional(),
    shippingAddress: z.string().optional(),
    creditLimit: z.number().nonnegative().optional(),
    paymentTerms: z.string().optional(),
    assignedTo: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID').optional(),
  }),
});

export const updateCustomerSchema = z.object({
  body: createCustomerSchema.shape.body.partial(),
});
