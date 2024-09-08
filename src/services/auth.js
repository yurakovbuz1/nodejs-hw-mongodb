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
import jwt from 'jsonwebtoken';
import { validateCode } from '../utils/googleOAuth2.js';

export async function registerNewUser(user) {
  const result = await UsersCollection.findOne({ email: user.email });

  if (result !== null) {
    throw createHttpError(409, 'Email in use');
  }

  const plainPassword = user.password;
  user.password = await bcrypt.hash(plainPassword, 10);

  return UsersCollection.create(user);
}

export async function loginUser(user) {
  const maybeUser = await UsersCollection.findOne({ email: user.email });
  const correctPass = await bcrypt.compare(user.password, maybeUser.password);
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
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '5m',
    },
  );

  const mailSent = await sendMail({
    from: SMTP.FROM,
    to: email,
    subject: 'Reset your password',
    html: `<h1>Reset your password using the following <a href="${process.env.APP_DOMAIN}/reset-password?token=${resetToken}">link</a></h1>`,
  });

  if (mailSent.accepted.length < 1) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
}

export async function resetPassword(token, password) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UsersCollection.findOne({
      _id: decoded.sub,
      email: decoded.email,
    });

    if (user === null) {
      throw createHttpError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPassUser = await UsersCollection.findOneAndUpdate(
      { _id: user._id },
      { password: hashedPassword },
    );

    console.log(newPassUser);

    await SessionsCollection.deleteOne({ userId: user._id });
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }
    throw error;
  }
}

export async function loginOrRegisterWithGoogle(code) {
  const ticket = await validateCode(code);
  console.log('ticket :>> ', ticket);

  const payload = ticket.getPayload();
  if (typeof payload === 'undefined') {
    throw createHttpError(401, 'Unauthorized');
  }

  const user = await UsersCollection.findOne({ email: payload.email });

  const password = await bcrypt.hash(
    crypto.randomBytes(30).toString('base64'),
    10,
  );

  if (user === null) {
    const createdUser = await UsersCollection.create({
      email: payload.email,
      name: payload.name,
      password,
    });
    return await SessionsCollection.create({
      userId: createdUser._id,
      accessToken: crypto.randomBytes(30).toString('base64'),
      refreshToken: crypto.randomBytes(30).toString('base64'),
      accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
      refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });
  }
  await SessionsCollection.deleteOne({ userId: user._id });

  return SessionsCollection.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
}
