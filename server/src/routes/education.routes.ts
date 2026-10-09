import { Router } from 'express';
import { EducationController } from '../controllers/education.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { validateRequiredFields } from '../middleware/validation.middleware';

const router = Router();

router.get('/', EducationController.getAll);
router.get('/:id', EducationController.getById);
router.post('/', authenticate, requireAdmin, validateRequiredFields(['institution', 'degree', 'field', 'startDate']), EducationController.create);
router.put('/:id', authenticate, requireAdmin, EducationController.update);
router.delete('/:id', authenticate, requireAdmin, EducationController.delete);

export default router;
