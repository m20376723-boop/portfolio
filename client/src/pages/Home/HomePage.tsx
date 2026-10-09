import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Upload,
} from 'lucide-react';
import { api } from '../../services/api';
import { IProfile, IProject, ISkill, IService, IBlog } from '../../types';
import { ProjectCard } from '../../components/ProjectCard';
import { SkillBadge } from '../../components/SkillBadge';
import { ServiceCard } from '../../components/ServiceCard';
import { BlogCard } from '../../components/BlogCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';
import { Toast, ToastType } from '../../components/Toast';
import { useLiveEdit } from '../../context/LiveEditContext';

export const HomePage: React.FC = () => {
  const { isLiveEdit } = useLiveEdit();

  const [profile, setProfile] = useState<IProfile | null>(null);
  const [featuredProjects, setFeaturedProjects] = useState<IProject[]>([]);
  const [topSkills, setTopSkills] = useState<ISkill[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Modals state for Live Editing
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState<Partial<IProfile>>({});
  const [uploadingImage, setUploadingImage] = useState(false);

  // Project Modal
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<IProject | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    image: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    featured: true,
  });

  // Skill Modal
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<ISkill | null>(null);
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'Frontend' as ISkill['category'],
    proficiency: 90,
  });

  const fetchData = async () => {
    try {
      const [profileRes, projectsRes, skillsRes, servicesRes, blogsRes] =
        await Promise.all([
          api.profile.get().catch(() => ({ data: null })),
          api.projects.getAll(true).catch(() => ({ data: [] })),
          api.skills.getAll().catch(() => ({ data: [] })),
          api.services.getAll().catch(() => ({ data: [] })),
          api.blogs.getAll().catch(() => ({ data: [] })),
        ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
        setProfileForm(profileRes.data);
      }
      if (projectsRes.data) setFeaturedProjects(projectsRes.data.slice(0, 3));
      if (skillsRes.data) setTopSkills(skillsRes.data.slice(0, 8));
      if (servicesRes.data) setServices(servicesRes.data.slice(0, 3));
      if (blogsRes.data) setRecentBlogs(blogsRes.data.slice(0, 3));
    } catch (err) {
      console.error('Failed to load homepage data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.profile.update(profileForm);
      setProfile(res.data);
      setIsProfileModalOpen(false);
      setToast({ message: 'Profile updated and saved to MongoDB!', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to update profile', type: 'error' });
    }
  };

  // Profile Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await api.upload.uploadFile(file);
      if (res.data?.url) {
        setProfileForm((prev) => ({ ...prev, profileImage: res.data.url }));
        setToast({ message: 'Image uploaded successfully!', type: 'success' });
      }
    } catch (err: any) {
      setToast({ message: err.message || 'Upload failed', type: 'error' });
    } finally {
      setUploadingImage(false);
    }
  };

  // Project Live Edit & Create
  const handleOpenProjectModal = (proj?: IProject) => {
    if (proj) {
      setEditingProject(proj);
      setProjectForm({
        title: proj.title,
        description: proj.description,
        image: proj.image,
        technologies: proj.technologies.join(', '),
        githubUrl: proj.githubUrl || '',
        liveUrl: proj.liveUrl || '',
        featured: proj.featured,
      });
    } else {
      setEditingProject(null);
      setProjectForm({
        title: '',
        description: '',
        image: '',
        technologies: '',
        githubUrl: '',
        liveUrl: '',
        featured: true,
      });
    }
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...projectForm,
      technologies: projectForm.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };
    try {
      if (editingProject) {
        await api.projects.update(editingProject._id, payload);
        setToast({ message: 'Project updated and saved to MongoDB!', type: 'success' });
      } else {
        await api.projects.create(payload);
        setToast({ message: 'New project created in MongoDB!', type: 'success' });
      }
      setIsProjectModalOpen(false);
      fetchData();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to save project', type: 'error' });
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Delete this project from MongoDB?')) return;
    try {
      await api.projects.delete(id);
      setToast({ message: 'Project removed from database', type: 'success' });
      fetchData();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to delete project', type: 'error' });
    }
  };

  // Skill Live Edit & Create
  const handleOpenSkillModal = (sk?: ISkill) => {
    if (sk) {
      setEditingSkill(sk);
      setSkillForm({
        name: sk.name,
        category: sk.category,
        proficiency: sk.proficiency,
      });
    } else {
      setEditingSkill(null);
      setSkillForm({
        name: '',
        category: 'Frontend',
        proficiency: 90,
      });
    }
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await api.skills.update(editingSkill._id, skillForm);
        setToast({ message: 'Skill updated in MongoDB!', type: 'success' });
      } else {
        await api.skills.create(skillForm);
        setToast({ message: 'New skill created in MongoDB!', type: 'success' });
      }
      setIsSkillModalOpen(false);
      fetchData();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to save skill', type: 'error' });
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!window.confirm('Delete this skill from MongoDB?')) return;
    try {
      await api.skills.delete(id);
      setToast({ message: 'Skill deleted from database', type: 'success' });
      fetchData();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to delete skill', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading portfolio..." />
      </div>
    );
  }

  const name = profile?.name || 'Alex Rivera';
  const title = profile?.title || 'Senior Full-Stack Engineer & Cloud Architect';
  const bio =
    profile?.bio ||
    'Building high-performance distributed web applications, enterprise cloud solutions, and developer tooling with modern TypeScript and React.';
  const avatar =
    profile?.profileImage ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 overflow-hidden">
        {/* Live edit quick trigger */}
        {isLiveEdit && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Edit Mode Active: Any change will immediately save into your MongoDB database.
              </span>
              <button
                onClick={() => {
                  setProfileForm(profile || {});
                  setIsProfileModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl font-bold bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Hero & Profile</span>
              </button>
            </div>
          </div>
        )}

        {/* Ambient Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500/10 dark:bg-primary-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-accent-500/10 dark:bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left text column */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Available for New Opportunities & Consulting
              </div>

              <div className="relative group/name">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Hi, I'm <span className="text-gradient">{name}</span>
                </h1>
                {isLiveEdit && (
                  <button
                    onClick={() => {
                      setProfileForm(profile || {});
                      setIsProfileModalOpen(true);
                    }}
                    className="absolute -top-3 -right-6 p-1.5 rounded-lg bg-primary-600 text-white shadow-md hover:scale-110 transition"
                    title="Change name in DB"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <p className="text-xl sm:text-2xl font-semibold text-slate-700 dark:text-slate-200">
                {title}
              </p>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {bio}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/projects"
                  className="px-6 py-3.5 rounded-xl font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm"
                >
                  <span>Explore Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/contact"
                  className="px-6 py-3.5 rounded-xl font-semibold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80 transition-all text-sm flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-primary-500" />
                  <span>Get in Touch</span>
                </Link>

                <Link
                  to="/resume"
                  className="px-5 py-3.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-all text-sm flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Resume</span>
                </Link>
              </div>

              {/* Social Links */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-slate-500 dark:text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Connect:</span>
                <a
                  href={profile?.socialLinks?.github || 'https://github.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href={profile?.socialLinks?.linkedin || 'https://linkedin.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href={profile?.socialLinks?.twitter || 'https://twitter.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Right Image / Avatar column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-primary-500 to-accent-500 opacity-40 blur-xl group-hover:opacity-75 transition duration-500" />
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-2xl bg-slate-900">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {isLiveEdit && (
                    <button
                      onClick={() => {
                        setProfileForm(profile || {});
                        setIsProfileModalOpen(true);
                      }}
                      className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-900/90 text-white border border-white/20 shadow-lg hover:bg-primary-600 transition"
                      title="Update avatar in DB"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider uppercase rounded-full bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
              Featured Work
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Selected Projects
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {isLiveEdit && (
              <button
                onClick={() => handleOpenProjectModal()}
                className="px-3.5 py-1.5 rounded-xl font-bold bg-primary-600 hover:bg-primary-700 text-white text-xs shadow-md transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project to DB</span>
              </button>
            )}
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:gap-2.5 transition-all"
            >
              <span>View All Projects</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              isLiveEdit={isLiveEdit}
              onEdit={handleOpenProjectModal}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      </section>

      {/* Skills Overview Section */}
      <section className="bg-slate-100/60 dark:bg-[#0d1322] py-20 border-y border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between max-w-2xl mx-auto text-center mb-12 gap-4">
            <div className="w-full">
              <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider uppercase rounded-full bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                Core Competencies
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Technical Expertise
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                Deep expertise in modern frontend engineering, distributed backend systems, and containerized cloud setups.
              </p>
            </div>
          </div>

          {isLiveEdit && (
            <div className="text-center mb-6">
              <button
                onClick={() => handleOpenSkillModal()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-primary-600 text-white shadow-md hover:bg-primary-700 transition inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill to Database</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topSkills.map((skill) => (
              <SkillBadge
                key={skill._id}
                skill={skill}
                isLiveEdit={isLiveEdit}
                onEdit={handleOpenSkillModal}
                onDelete={handleDeleteSkill}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/skills"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 hover:border-primary-500 transition shadow-sm"
            >
              <span>Explore Full Technical Stack</span>
              <ArrowRight className="w-4 h-4 text-primary-500" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      {services.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider uppercase rounded-full bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
              Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              What I Can Do For You
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              From architecting minimum viable products to scaling high-throughput distributed systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} isLiveEdit={isLiveEdit} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Blog Articles */}
      {recentBlogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider uppercase rounded-full bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                Articles & Thinking
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Latest Publications
              </h2>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:gap-2.5 transition-all"
            >
              <span>Browse All Articles</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} isLiveEdit={isLiveEdit} />
            ))}
          </div>
        </section>
      )}

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 p-8 sm:p-12 text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Have a project in mind or want to collaborate?
            </h2>
            <p className="text-primary-100 text-base sm:text-lg">
              Let's build something exceptional together. I'm currently open for full-time engineering roles, technical advisory, and consulting contracts.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-xl font-semibold bg-white text-primary-700 hover:bg-primary-50 shadow-lg transition text-sm flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Start a Conversation</span>
              </Link>
              <Link
                to="/resume"
                className="px-6 py-3.5 rounded-xl font-semibold bg-primary-700/60 hover:bg-primary-700 border border-white/20 text-white transition text-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Edit Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Live Edit Profile (Saves to MongoDB)"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={profileForm.name || ''}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Job Title *</label>
            <input
              type="text"
              required
              value={profileForm.title || ''}
              onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Biography *</label>
            <textarea
              rows={3}
              required
              value={profileForm.bio || ''}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Profile Avatar</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Image URL..."
                value={profileForm.profileImage || ''}
                onChange={(e) => setProfileForm({ ...profileForm, profileImage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <label className="px-3 py-2 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 cursor-pointer flex items-center shrink-0">
                <Upload className="w-3.5 h-3.5 mr-1" />
                <span>{uploadingImage ? '...' : 'Upload'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-primary-600 text-white font-bold"
            >
              Save to Database
            </button>
          </div>
        </form>
      </Modal>

      {/* Project Edit Modal */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title={editingProject ? 'Edit Project (Saves to MongoDB)' : 'Add New Project to Database'}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Project Title *</label>
            <input
              type="text"
              required
              value={projectForm.title}
              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description *</label>
            <textarea
              rows={3}
              required
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
            <input
              type="text"
              value={projectForm.image}
              onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Technologies (comma separated) *</label>
            <input
              type="text"
              required
              value={projectForm.technologies}
              onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">GitHub URL</label>
              <input
                type="url"
                value={projectForm.githubUrl}
                onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Live Demo URL</label>
              <input
                type="url"
                value={projectForm.liveUrl}
                onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsProjectModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-primary-600 text-white font-bold"
            >
              {editingProject ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Skill Edit Modal */}
      <Modal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        title={editingSkill ? 'Edit Skill (Saves to MongoDB)' : 'Add Skill to Database'}
        maxWidth="sm"
      >
        <form onSubmit={handleSaveSkill} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Skill Name *</label>
            <input
              type="text"
              required
              value={skillForm.name}
              onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category *</label>
            <select
              value={skillForm.category}
              onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="DevOps & Cloud">DevOps & Cloud</option>
              <option value="Mobile & Other">Mobile & Other</option>
              <option value="Tools">Tools</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Proficiency: {skillForm.proficiency}%
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={skillForm.proficiency}
              onChange={(e) => setSkillForm({ ...skillForm, proficiency: Number(e.target.value) })}
              className="w-full accent-primary-600"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsSkillModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-primary-600 text-white font-bold"
            >
              Save to Database
            </button>
          </div>
        </form>
      </Modal>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
};
