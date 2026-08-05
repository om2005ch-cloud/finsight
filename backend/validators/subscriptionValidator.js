const { z } = require('zod');

const createSubscriptionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.number().positive('Amount must be positive'),
  billing_cycle: z.enum(['monthly', 'yearly']).optional().default('monthly'),
  category_id: z.number().int().nullable().optional(),
  next_billing_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').optional(),
  status: z.enum(['active', 'paused', 'cancelled']).optional().default('active'),
});

module.exports = { createSubscriptionSchema };
