import { Router } from 'express';
import { BlogController } from '../controllers/blog.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { validateRequiredFields } from '../middleware/validation.middleware';

const router = Router();

router.get('/', BlogController.getAll);
router.get('/id/:id', BlogController.getById);
router.get('/:slug', BlogController.getBySlug);
router.post('/', authenticate, requireAdmin, validateRequiredFields(['title', 'content', 'excerpt']), BlogController.create);
router.put('/:id', authenticate, requireAdmin, BlogController.update);
router.delete('/:id', authenticate, requireAdmin, BlogController.delete);

export default router;
