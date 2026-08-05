const { z } = require('zod');

const createGoalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  target_amount: z.number().positive('Target amount must be positive'),
  current_amount: z.number().nonnegative().optional().default(0),
  target_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Target date must be YYYY-MM-DD'),
  category_id: z.number().int().nullable().optional(),
});

const updateGoalSchema = z.object({
  title: z.string().min(1).optional(),
  target_amount: z.number().positive().optional(),
  current_amount: z.number().nonnegative().optional(),
  target_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  category_id: z.number().int().nullable().optional(),
});

module.exports = { createGoalSchema, updateGoalSchema };
