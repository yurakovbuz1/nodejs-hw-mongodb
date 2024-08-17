import createHttpError from 'http-errors';

export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.validate(req.body, { abortEarly: false });

    if (typeof result.error !== 'undefined') {
      next(
        createHttpError(
          404,
          result.error.details.map((error) => error.message).join(', '),
        ),
      );
    }
    next();
  };
}
