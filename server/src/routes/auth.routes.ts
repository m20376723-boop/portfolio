import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequiredFields, validateEmail } from '../middleware/validation.middleware';

const router = Router();

router.post(
  '/register',
  validateRequiredFields(['name', 'email', 'password']),
  validateEmail,
  AuthController.register
);

router.post(
  '/login',
  validateRequiredFields(['email', 'password']),
  validateEmail,
  AuthController.login
);

router.get('/me', authenticate, AuthController.getMe);

export default router;
