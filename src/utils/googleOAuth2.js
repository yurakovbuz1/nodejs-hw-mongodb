import { OAuth2Client } from 'google-auth-library';
import createHttpError from 'http-errors';
import fs from 'node:fs';
import path from 'node:path';

const config = JSON.parse(
  fs.readFileSync(path.resolve('src', 'google-OAuth-credentials.json'), {
    encoding: 'utf-8',
  }),
);

const googleOAuth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
  redirectUri: config['web']['redirect_uris'][0],
});

export function generateAuthUrl() {
  return googleOAuth2Client.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
}

export async function validateCode(code) {
  try {
    const response = await googleOAuth2Client.getToken(code);
    return googleOAuth2Client.verifyIdToken({
      idToken: response.tokens.id_token,
      audience: process.env.GOOGLE_AUTH_CLIENT_ID,
    });
  } catch (error) {
    if (
      error.response &&
      error.response.status >= 400 &&
      error.response.status <= 499
    ) {
      throw createHttpError(401, 'Unauthorized');
    } else {
      throw error;
    }
  }
}
