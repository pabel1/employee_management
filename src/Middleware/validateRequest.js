const validateRequest = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = validateRequest;
