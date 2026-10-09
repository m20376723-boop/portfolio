import { Router } from 'express';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import skillRoutes from './skill.routes';
import projectRoutes from './project.routes';
import experienceRoutes from './experience.routes';
import educationRoutes from './education.routes';
import serviceRoutes from './service.routes';
import blogRoutes from './blog.routes';
import contactRoutes from './contact.routes';
import uploadRoutes from './upload.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/skills', skillRoutes);
router.use('/projects', projectRoutes);
router.use('/experience', experienceRoutes);
router.use('/education', educationRoutes);
router.use('/services', serviceRoutes);
router.use('/blogs', blogRoutes);
router.use('/contact', contactRoutes);
router.use('/upload', uploadRoutes);

export default router;
