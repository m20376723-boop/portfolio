import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { validateRequiredFields } from '../middleware/validation.middleware';

const router = Router();

router.get('/', ProfileController.getProfile);
router.put('/', authenticate, requireAdmin, validateRequiredFields(['name', 'title', 'bio', 'email']), ProfileController.updateProfile);

export default router;
