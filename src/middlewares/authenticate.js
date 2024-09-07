import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';

export async function authenticate(req, res, next) {
  const { authorization } = req.headers;
  if (typeof authorization !== 'string') {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  const [bearer, accessToken] = authorization.split(' ', 2);
  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    return next(createHttpError(401, 'Auth header has to be of type Bearer'));
  }

  const session = await SessionsCollection.findOne({ accessToken });

  //   console.log('session:>>>>> ', session);
  if (session === null) {
    return next(createHttpError(401, 'Session not found'));
  }

  if (new Date() > new Date(session.accessTokenValidUntil)) {
    return next(createHttpError(401, 'Access token has expired'));
  }
  next();
}
