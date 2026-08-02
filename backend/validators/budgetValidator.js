const { z } = require('zod');

const createBudgetSchema = z.object({
  category_id: z.number().int(),
  monthly_limit: z.number().positive(),
  month: z.string(), // format: "2026-08-01"
});

module.exports = { createBudgetSchema };