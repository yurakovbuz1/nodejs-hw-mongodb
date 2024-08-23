import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';

export async function registerNewUser(user) {
  const result = await UsersCollection.findOne({ email: user.email });

  if (result !== null) {
    throw createHttpError(409, 'Email in use');
  }

  return UsersCollection.create(user);
}
