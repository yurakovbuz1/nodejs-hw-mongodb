import { registerNewUser } from '../services/auth.js';

export async function registerNewUserController(req, res, next) {
  console.log('req :>>', req.body);
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
