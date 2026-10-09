import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Briefcase } from 'lucide-react';
import { api } from '../../services/api';
import { IExperience } from '../../types';
import { Modal } from '../../components/Modal';
import { Toast, ToastType } from '../../components/Toast';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const ManageExperience: React.FC = () => {
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<IExperience | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

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

  const fetchExperience = async () => {
    try {
      const res = await api.experience.getAll();
      if (res.data) setExperiences(res.data);
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to load experience', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const openCreateModal = () => {
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
    setIsModalOpen(true);
  };

  const openEditModal = (exp: IExperience) => {
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
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        setToast({ message: 'Experience record updated successfully', type: 'success' });
      } else {
        await api.experience.create(payload);
        setToast({ message: 'Experience record created successfully', type: 'success' });
      }
      setIsModalOpen(false);
      fetchExperience();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to save experience', type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this experience record?')) return;
    try {
      await api.experience.delete(id);
      setToast({ message: 'Experience deleted', type: 'success' });
      fetchExperience();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to delete record', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Career Experience</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your employment history, engineering roles, and achievements.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl font-bold bg-primary-600 hover:bg-primary-700 text-white text-xs shadow-md shadow-primary-500/20 transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Work Record</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" label="Loading career history..." />
      ) : (
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Role & Company</th>
                  <th className="py-3.5 px-4">Period</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {experiences.map((exp) => (
                  <tr key={exp._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">{exp.position}</p>
                      <p className="text-[11px] text-primary-600 dark:text-primary-400 font-semibold">{exp.company}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{exp.location}</td>
                    <td className="py-3 px-4 text-slate-500">{exp.order}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(exp)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(exp._id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExp ? 'Edit Experience Record' : 'Add Experience Record'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Position / Job Title *</label>
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
                placeholder="e.g. 2021"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">End Date</label>
              <input
                type="text"
                placeholder="Present or 2023"
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
              placeholder="San Francisco, CA (Remote)"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Role Description *</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Technologies (comma separated)
            </label>
            <input
              type="text"
              placeholder="TypeScript, AWS, Docker"
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
              {editingExp ? 'Save Changes' : 'Create Record'}
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
