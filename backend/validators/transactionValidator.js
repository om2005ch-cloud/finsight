const { z } = require('zod');

const createTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().max(255).optional(),
  category_id: z.number().int().optional(),
  transaction_date: z.string().optional(),
});

const updateTransactionSchema = createTransactionSchema.partial();
// .partial() makes every field optional — since updates don't require all fields

module.exports = { createTransactionSchema, updateTransactionSchema };