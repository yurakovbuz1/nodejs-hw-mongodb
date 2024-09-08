import createHttpError from 'http-errors';
import fs from 'node:fs';
import path from 'node:path';
import swaggerUI from 'swagger-ui-express';

export function swaggerDocs() {
  try {
    const doc = JSON.parse(
      fs.readFileSync(path.resolve('docs', 'swagger.json'), {
        encoding: 'utf-8',
      }),
    );
    return [...swaggerUI.serve, swaggerUI.setup(doc)];
  } catch (error) {
    return (req, res, next) => {
      next(createHttpError(500, 'Cannot load swaggerDocs'));
    };
  }
}
