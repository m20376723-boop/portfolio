import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../../services/api';
import { IEducation } from '../../types';
import { SectionHeading } from '../../components/SectionHeading';
import { TimelineItem } from '../../components/TimelineItem';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';
import { Toast, ToastType } from '../../components/Toast';
import { useLiveEdit } from '../../context/LiveEditContext';

export const EducationPage: React.FC = () => {
  const { isLiveEdit } = useLiveEdit();

  const [educations, setEducations] = useState<IEducation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<IEducation | null>(null);
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    description: '',
  });
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const fetchEducation = async () => {
    try {
      const res = await api.education.getAll();
      if (res.data) setEducations(res.data);
    } catch (err) {
      console.error('Failed to load education records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const handleOpenModal = (edu?: IEducation) => {
    if (edu) {
      setEditingEdu(edu);
      setFormData({
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        startDate: edu.startDate,
        endDate: edu.endDate || '',
        description: edu.description || '',
      });
    } else {
      setEditingEdu(null);
      setFormData({
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEdu) {
        await api.education.update(editingEdu._id, formData);
        setToast({ message: 'Education record updated in MongoDB!', type: 'success' });
      } else {
        await api.education.create(formData);
        setToast({ message: 'New credential created and saved in MongoDB!', type: 'success' });
      }
      setIsModalOpen(false);
      fetchEducation();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to save education', type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this education record from MongoDB?')) return;
    try {
      await api.education.delete(id);
      setToast({ message: 'Record deleted from database', type: 'success' });
      fetchEducation();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to delete record', type: 'error' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SectionHeading
        badge="Credentials & Degrees"
        title="Education & Certifications"
        subtitle="Formal academic foundations in computer science alongside professional industry certifications."
      />

      {isLiveEdit && (
        <div className="flex justify-end">
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Credential to MongoDB</span>
          </button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner size="lg" label="Loading credentials..." />
      ) : educations.length === 0 ? (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400">
          <p>No education records available.</p>
        </div>
      ) : (
        <div className="relative pt-4">
          {educations.map((edu, idx) => (
            <TimelineItem
              key={edu._id}
              title={`${edu.degree} in ${edu.field}`}
              subtitle={edu.institution}
              period={`${edu.startDate} ${edu.endDate ? `- ${edu.endDate}` : ''}`}
              description={edu.description || ''}
              type="education"
              isLast={idx === educations.length - 1}
              isLiveEdit={isLiveEdit}
              onEdit={() => handleOpenModal(edu)}
              onDelete={() => handleDelete(edu._id)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEdu ? 'Edit Credential (Saves to MongoDB)' : 'Add Credential to MongoDB'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Institution *</label>
            <input
              type="text"
              required
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Degree *</label>
              <input
                type="text"
                required
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Field *</label>
              <input
                type="text"
                required
                value={formData.field}
                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
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
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description / Honors</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-none"
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
