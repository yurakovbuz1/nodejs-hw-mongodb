import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerNewUserController } from '../controllers/auth.js';
import { userSchema } from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = express.Router();
const jsonParser = express.json();

router.post(
  '/register',
  jsonParser,
  validateBody(userSchema),
  ctrlWrapper(registerNewUserController),
);

export default router;
