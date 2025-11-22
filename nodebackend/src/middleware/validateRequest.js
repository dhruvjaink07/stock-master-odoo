export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.body)
      next()
    } catch (error) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      })
    }
  }
}
