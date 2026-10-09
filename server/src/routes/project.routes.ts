import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { validateRequiredFields } from '../middleware/validation.middleware';

const router = Router();

router.get('/', ProjectController.getAll);
router.get('/:id', ProjectController.getById);
router.post('/', authenticate, requireAdmin, validateRequiredFields(['title', 'description', 'technologies']), ProjectController.create);
router.put('/:id', authenticate, requireAdmin, ProjectController.update);
router.delete('/:id', authenticate, requireAdmin, ProjectController.delete);

export default router;
