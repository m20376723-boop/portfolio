import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { HomePage } from '../pages/Home/HomePage';
import { AboutPage } from '../pages/About/AboutPage';
import { SkillsPage } from '../pages/Skills/SkillsPage';
import { ProjectsPage } from '../pages/Projects/ProjectsPage';
import { ExperiencePage } from '../pages/Experience/ExperiencePage';
import { EducationPage } from '../pages/Education/EducationPage';
import { ServicesPage } from '../pages/Services/ServicesPage';
import { ResumePage } from '../pages/Resume/ResumePage';
import { ContactPage } from '../pages/Contact/ContactPage';
import { BlogPage } from '../pages/Blog/BlogPage';
import { BlogPostPage } from '../pages/Blog/BlogPostPage';

// Admin Pages
import { AdminLoginPage } from '../pages/Admin/AdminLoginPage';
import { AdminDashboardPage } from '../pages/Admin/AdminDashboardPage';
import { ManageProfile } from '../pages/Admin/ManageProfile';
import { ManageSkills } from '../pages/Admin/ManageSkills';
import { ManageProjects } from '../pages/Admin/ManageProjects';
import { ManageExperience } from '../pages/Admin/ManageExperience';
import { ManageEducation } from '../pages/Admin/ManageEducation';
import { ManageServices } from '../pages/Admin/ManageServices';
import { ManageBlogs } from '../pages/Admin/ManageBlogs';
import { ManageMessages } from '../pages/Admin/ManageMessages';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Dashboard Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="profile" element={<ManageProfile />} />
        <Route path="skills" element={<ManageSkills />} />
        <Route path="projects" element={<ManageProjects />} />
        <Route path="experience" element={<ManageExperience />} />
        <Route path="education" element={<ManageEducation />} />
        <Route path="services" element={<ManageServices />} />
        <Route path="blogs" element={<ManageBlogs />} />
        <Route path="messages" element={<ManageMessages />} />
      </Route>

      {/* 404 Route */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#0a0f1d] text-center">
            <div className="max-w-md space-y-4">
              <h1 className="text-6xl font-black text-primary-500 font-mono">404</h1>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Page Not Found</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                The resource or portfolio route you were looking for doesn't exist or has moved.
              </p>
              <div className="pt-2">
                <Link
                  to="/"
                  className="px-5 py-2.5 rounded-xl font-bold bg-primary-600 text-white text-xs inline-flex items-center gap-1.5 shadow-md shadow-primary-500/20"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        }
      />
    </Routes>
  );
};
