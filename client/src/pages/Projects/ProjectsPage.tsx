import React, { useEffect, useState } from 'react';
import { Search, Plus, Upload } from 'lucide-react';
import { api } from '../../services/api';
import { IProject } from '../../types';
import { SectionHeading } from '../../components/SectionHeading';
import { ProjectCard } from '../../components/ProjectCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';
import { Toast, ToastType } from '../../components/Toast';
import { useLiveEdit } from '../../context/LiveEditContext';

export const ProjectsPage: React.FC = () => {
  const { isLiveEdit } = useLiveEdit();

  const [projects, setProjects] = useState<IProject[]>([]);
  const [filterFeatured, setFilterFeatured] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<IProject | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    featured: false,
    order: 0,
  });

  const fetchProjects = async () => {
    try {
      const res = await api.projects.getAll();
      if (res.data) setProjects(res.data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenModal = (project?: IProject) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        image: project.image,
        technologies: project.technologies.join(', '),
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        featured: project.featured,
        order: project.order,
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        image: '',
        technologies: '',
        githubUrl: '',
        liveUrl: '',
        featured: false,
        order: projects.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await api.upload.uploadFile(file);
      if (res.data?.url) {
        setFormData((prev) => ({ ...prev, image: res.data.url }));
        setToast({ message: 'Project image uploaded successfully!', type: 'success' });
      }
    } catch (err: any) {
      setToast({ message: err.message || 'Image upload failed', type: 'error' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      technologies: formData.technologies
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
        setToast({ message: 'Project created and saved to MongoDB!', type: 'success' });
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to save project', type: 'error' });
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Delete this project from MongoDB?')) return;
    try {
      await api.projects.delete(id);
      setToast({ message: 'Project removed from database', type: 'success' });
      fetchProjects();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to delete project', type: 'error' });
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesFeatured =
      filterFeatured === null || project.featured === filterFeatured;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.technologies.some((t) => t.toLowerCase().includes(query));
    return matchesFeatured && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SectionHeading
        badge="Portfolio Showcase"
        title="Featured Projects & Systems"
        subtitle="Explore production applications, distributed microservices, and developer tools built with cutting-edge engineering standards."
      />

      {/* Filter, Search, and Live Add Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterFeatured(null)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              filterFeatured === null
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Projects ({projects.length})
          </button>
          <button
            onClick={() => setFilterFeatured(true)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              filterFeatured === true
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Featured Only
          </button>
        </div>

        {/* Search & Add Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, tech or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white"
            />
          </div>

          {isLiveEdit && (
            <button
              onClick={() => handleOpenModal()}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-md flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" label="Loading portfolio projects..." />
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20 text-slate-500 dark:text-slate-400">
          <p className="text-base font-semibold">No projects found</p>
          <p className="text-sm mt-1">Try refining your search terms or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              isLiveEdit={isLiveEdit}
              onEdit={handleOpenModal}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}

      {/* Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project (Saves to MongoDB)' : 'Add New Project to Database'}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Project Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description *</label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Project Screenshot</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Image URL..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <label className="px-3 py-2 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 cursor-pointer flex items-center shrink-0">
                <Upload className="w-3.5 h-3.5 mr-1" />
                <span>{uploadingImage ? '...' : 'Upload'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            {formData.image && (
              <img src={formData.image} alt="Preview" className="mt-2 h-16 rounded-lg object-cover border" />
            )}
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Technologies (comma separated) *
            </label>
            <input
              type="text"
              required
              placeholder="React, TypeScript, Node.js"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">GitHub Repo URL</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Live Demo URL</label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="featured-proj"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="rounded accent-primary-600"
            />
            <label htmlFor="featured-proj" className="font-bold cursor-pointer">
              Mark as Featured Project
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
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
