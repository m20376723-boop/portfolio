import { Router } from 'express';
import { ExperienceController } from '../controllers/experience.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { validateRequiredFields } from '../middleware/validation.middleware';

const router = Router();

router.get('/', ExperienceController.getAll);
router.get('/:id', ExperienceController.getById);
router.post('/', authenticate, requireAdmin, validateRequiredFields(['company', 'position', 'description', 'startDate', 'location']), ExperienceController.create);
router.put('/:id', authenticate, requireAdmin, ExperienceController.update);
router.delete('/:id', authenticate, requireAdmin, ExperienceController.delete);

export default router;
