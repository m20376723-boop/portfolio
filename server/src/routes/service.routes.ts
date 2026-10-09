import { Router } from 'express';
import { ServiceController } from '../controllers/service.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { validateRequiredFields } from '../middleware/validation.middleware';

const router = Router();

router.get('/', ServiceController.getAll);
router.get('/:id', ServiceController.getById);
router.post('/', authenticate, requireAdmin, validateRequiredFields(['title', 'description']), ServiceController.create);
router.put('/:id', authenticate, requireAdmin, ServiceController.update);
router.delete('/:id', authenticate, requireAdmin, ServiceController.delete);

export default router;
