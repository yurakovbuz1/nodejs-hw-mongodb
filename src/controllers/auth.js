import {
  registerNewUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  requestResetEmail,
  resetPassword,
  loginOrRegisterWithGoogle,
} from '../services/auth.js';
import '../utils/googleOAuth2.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';

export async function registerNewUserController(req, res, next) {
  // console.log('req :>>', req.body);
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const userCreated = await registerNewUser(user);

  res.send({
    status: 201,
    message: 'Successfully registered a user!',
    data: userCreated,
  });
}

export async function loginUserController(req, res, next) {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const session = await loginUser(user);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function logoutUserController(req, res, next) {
  const { sessionId } = req.cookies;
  console.log('sessionId :>> ', sessionId);
  if (typeof sessionId === 'string') {
    await logoutUser(sessionId);
    res.clearCookie('userId');
    res.clearCookie('refreshToken');
    res.status(204).end();
  }
}

export async function refreshUserSessionController(req, res, next) {
  console.log(req.cookies);
  const { sessionId, refreshToken } = req.cookies;

  const refreshedSession = await refreshUserSession(sessionId, refreshToken);

  res.cookie('refreshToken', refreshedSession.refreshToken, {
    httpOnly: true,
    expires: refreshedSession.refreshTokenValidUntil,
  });

  res.cookie('sessionId', refreshedSession._id, {
    httpOnly: true,
    expires: refreshedSession.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: refreshedSession.accessToken,
    },
  });
}

export async function requestResetEmailController(req, res, next) {
  const { email } = req.body;

  await requestResetEmail(email);

  res.send({
    status: 200,
    message: 'Reset email has been successfully sent.',
    data: {},
  });
}

export async function resetPasswordController(req, res, next) {
  const { token, password } = req.body;

  await resetPassword(token, password);

  res.send({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
}

export async function getOauthUrlController(req, res, next) {
  const url = generateAuthUrl();

  res.send({
    status: 200,
    message: 'Successfully retrieved Google OAuth Url',
    data: { url },
  });
}

export async function confirmOAuthController(req, res, next) {
  const { code } = req.body;
  const session = await loginOrRegisterWithGoogle(code);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Login with Google completed',
    data: {
      accessToken: session.accessToken,
    },
  });
}
