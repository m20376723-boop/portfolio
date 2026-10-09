import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MessageSquare } from 'lucide-react';
import { api } from '../../services/api';
import { IService } from '../../types';
import { SectionHeading } from '../../components/SectionHeading';
import { ServiceCard } from '../../components/ServiceCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';
import { Toast, ToastType } from '../../components/Toast';
import { useLiveEdit } from '../../context/LiveEditContext';

export const ServicesPage: React.FC = () => {
  const { isLiveEdit } = useLiveEdit();

  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<IService | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'code',
  });
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const fetchServices = async () => {
    try {
      const res = await api.services.getAll();
      if (res.data) setServices(res.data);
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenModal = (service?: IService) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description,
        icon: service.icon || 'code',
      });
    } else {
      setEditingService(null);
      setFormData({
        title: '',
        description: '',
        icon: 'code',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await api.services.update(editingService._id, formData);
        setToast({ message: 'Service updated in MongoDB!', type: 'success' });
      } else {
        await api.services.create(formData);
        setToast({ message: 'New service created and saved in MongoDB!', type: 'success' });
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to save service', type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this service from MongoDB?')) return;
    try {
      await api.services.delete(id);
      setToast({ message: 'Service deleted from database', type: 'success' });
      fetchServices();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to delete service', type: 'error' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <SectionHeading
        badge="Specialized Offerings"
        title="Engineering Services & Solutions"
        subtitle="End-to-end software consulting, modern web development, and cloud architecture tailored for ambitious enterprises."
      />

      {isLiveEdit && (
        <div className="flex justify-end">
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service to MongoDB</span>
          </button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner size="lg" label="Loading services..." />
      ) : services.length === 0 ? (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400">
          <p>No services currently listed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              isLiveEdit={isLiveEdit}
              onEdit={() => handleOpenModal(service)}
              onDelete={() => handleDelete(service._id)}
            />
          ))}
        </div>
      )}

      {/* Engagement Process */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">How We Collaborate</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            A battle-tested workflow ensuring transparent communication, rapid iteration, and reliable production delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Discovery & Scope', desc: 'Understanding your product requirements, architectural trade-offs, and project milestones.' },
            { step: '02', title: 'System Architecture', desc: 'Drafting data models, API schemas, interface wireframes, and deployment topology.' },
            { step: '03', title: 'Iterative Sprints', desc: 'Clean, type-safe implementation with regular demo previews and automated CI/CD builds.' },
            { step: '04', title: 'Launch & Tuning', desc: 'Performance profiling, monitoring instrumentation, documentation handoff, and rollout.' },
          ].map((item) => (
            <div key={item.step} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
              <span className="text-2xl font-black text-primary-500 font-mono">{item.step}</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-500/20 transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Discuss Your Project Scope</span>
          </Link>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Edit Service (Saves to MongoDB)' : 'Add Service to MongoDB'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Service Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Icon Style</label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              <option value="code">Code (Full-Stack / Frontend)</option>
              <option value="server">Server (APIs / Microservices)</option>
              <option value="cloud">Cloud (DevOps / Infrastructure)</option>
              <option value="database">Database (Storage / Optimization)</option>
              <option value="search">Search (Audits / Code Reviews)</option>
              <option value="layout">Layout (UI / UX Architecture)</option>
            </select>
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
