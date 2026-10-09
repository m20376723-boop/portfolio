import { Router } from 'express';
import { SkillController } from '../controllers/skill.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { validateRequiredFields } from '../middleware/validation.middleware';

const router = Router();

router.get('/', SkillController.getAll);
router.get('/:id', SkillController.getById);
router.post('/', authenticate, requireAdmin, validateRequiredFields(['name', 'category', 'proficiency']), SkillController.create);
router.put('/:id', authenticate, requireAdmin, SkillController.update);
router.delete('/:id', authenticate, requireAdmin, SkillController.delete);

export default router;
