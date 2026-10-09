import { Router } from 'express';
import { ContactController } from '../controllers/contact.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { validateRequiredFields, validateEmail } from '../middleware/validation.middleware';

const router = Router();

router.post(
  '/',
  validateRequiredFields(['name', 'email', 'subject', 'message']),
  validateEmail,
  ContactController.submitMessage
);

router.get('/', authenticate, requireAdmin, ContactController.getAll);
router.get('/:id', authenticate, requireAdmin, ContactController.getById);
router.put('/:id', authenticate, requireAdmin, validateRequiredFields(['status']), ContactController.updateStatus);
router.delete('/:id', authenticate, requireAdmin, ContactController.delete);

export default router;
