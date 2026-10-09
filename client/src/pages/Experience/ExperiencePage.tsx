import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../../services/api';
import { IExperience } from '../../types';
import { SectionHeading } from '../../components/SectionHeading';
import { TimelineItem } from '../../components/TimelineItem';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';
import { Toast, ToastType } from '../../components/Toast';
import { useLiveEdit } from '../../context/LiveEditContext';

export const ExperiencePage: React.FC = () => {
  const { isLiveEdit } = useLiveEdit();

  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<IExperience | null>(null);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: 'Present',
    location: '',
    description: '',
    technologies: '',
    order: 0,
  });
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const fetchExperience = async () => {
    try {
      const res = await api.experience.getAll();
      if (res.data) setExperiences(res.data);
    } catch (err) {
      console.error('Failed to load experience records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const handleOpenModal = (exp?: IExperience) => {
    if (exp) {
      setEditingExp(exp);
      setFormData({
        company: exp.company,
        position: exp.position,
        startDate: exp.startDate,
        endDate: exp.endDate || 'Present',
        location: exp.location,
        description: exp.description,
        technologies: (exp.technologies || []).join(', '),
        order: exp.order,
      });
    } else {
      setEditingExp(null);
      setFormData({
        company: '',
        position: '',
        startDate: '',
        endDate: 'Present',
        location: '',
        description: '',
        technologies: '',
        order: experiences.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      technologies: formData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (editingExp) {
        await api.experience.update(editingExp._id, payload);
        setToast({ message: 'Experience record updated in MongoDB!', type: 'success' });
      } else {
        await api.experience.create(payload);
        setToast({ message: 'New experience record saved in MongoDB!', type: 'success' });
      }
      setIsModalOpen(false);
      fetchExperience();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to save experience', type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this career record from MongoDB?')) return;
    try {
      await api.experience.delete(id);
      setToast({ message: 'Record deleted from database', type: 'success' });
      fetchExperience();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to delete record', type: 'error' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SectionHeading
        badge="Career History"
        title="Professional Experience"
        subtitle="A chronological journey through high-impact engineering leadership, architecting cloud systems, and scaling engineering teams."
      />

      {isLiveEdit && (
        <div className="flex justify-end">
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Work Record to MongoDB</span>
          </button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner size="lg" label="Loading career history..." />
      ) : experiences.length === 0 ? (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400">
          <p>No experience records available.</p>
        </div>
      ) : (
        <div className="relative pt-4">
          {experiences.map((exp, idx) => (
            <TimelineItem
              key={exp._id}
              title={exp.position}
              subtitle={exp.company}
              period={`${exp.startDate} - ${exp.endDate || 'Present'}`}
              location={exp.location}
              description={exp.description}
              technologies={exp.technologies}
              type="work"
              isLast={idx === experiences.length - 1}
              isLiveEdit={isLiveEdit}
              onEdit={() => handleOpenModal(exp)}
              onDelete={() => handleDelete(exp._id)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExp ? 'Edit Experience (Saves to MongoDB)' : 'Add Experience to MongoDB'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company *</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Position *</label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Start Date / Year *</label>
              <input
                type="text"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">End Date</label>
              <input
                type="text"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Location *</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description *</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Technologies (comma separated)</label>
            <input
              type="text"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
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
