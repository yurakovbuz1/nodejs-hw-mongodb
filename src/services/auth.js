import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import crypto from 'node:crypto';
import {
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  SMTP,
} from '../constants/constants.js';
import bcrypt from 'bcrypt';
import { sendMail } from '../utils/sendMail.js';

export async function registerNewUser(user) {
  const result = await UsersCollection.findOne({ email: user.email });

  if (result !== null) {
    throw createHttpError(409, 'Email in use');
  }

  const plainPassword = user.password;
  user.password = await bcrypt.hash(plainPassword, 5); // 5?

  return UsersCollection.create(user);
}

export async function loginUser(user) {
  const maybeUser = await UsersCollection.findOne({ email: user.email });
  const correctPass = await bcrypt.compare(user.password, maybeUser.password); // output - ?
  if (correctPass === false) {
    throw createHttpError(401, 'Unauthorised');
  }
  await SessionsCollection.deleteOne({ userId: maybeUser._id });

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return await SessionsCollection.create({
    userId: maybeUser._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
}

export async function logoutUser(sessionId) {
  await SessionsCollection.deleteOne({ _id: sessionId });
}

export async function refreshUserSession(sessionId, refreshToken) {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (session === null) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    throw createHttpError(401, 'Session expired');
  }

  await SessionsCollection.deleteOne({ _id: session._id });

  const accessToken = crypto.randomBytes(30).toString('base64');
  const newRefreshToken = crypto.randomBytes(30).toString('base64');

  return await SessionsCollection.create({
    _id: session._id,
    userId: session.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
}

export async function requestResetEmail(email) {
  const user = await UsersCollection.findOne({ email });

  if (user === null) {
    throw createHttpError(404, 'Email not found');
  }

  await sendMail({
    from: SMTP.FROM,
    to: email,
    subject: 'Reset your password',
    html: '<h1>Reset your password</h1>',
  });
}
