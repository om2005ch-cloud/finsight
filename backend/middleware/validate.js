function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.issues.map(i => ({ field: i.path[0], message: i.message })),
      });
    }
    req.body = result.data; // cleaned, type-coerced data
    next();
  };
}

module.exports = validate;