import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerNewUserController,
  loginUserController,
  refreshUserSessionController,
  logoutUserController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';
import {
  loginSchema,
  registerSchema,
  resetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = express.Router();
const jsonParser = express.json();

router.post(
  '/register',
  jsonParser,
  validateBody(registerSchema),
  ctrlWrapper(registerNewUserController),
);

router.post(
  '/login',
  jsonParser,
  validateBody(loginSchema),
  ctrlWrapper(loginUserController),
);

router.post('/logout', ctrlWrapper(logoutUserController));

router.post('/refresh', ctrlWrapper(refreshUserSessionController));

router.post(
  '/send-reset-email',
  jsonParser,
  validateBody(resetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

router.post(
  '/reset-pwd',
  jsonParser,
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default router;
