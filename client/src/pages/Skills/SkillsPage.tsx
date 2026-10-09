import React, { useEffect, useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { api } from '../../services/api';
import { ISkill } from '../../types';
import { SectionHeading } from '../../components/SectionHeading';
import { SkillBadge } from '../../components/SkillBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';
import { Toast, ToastType } from '../../components/Toast';
import { useLiveEdit } from '../../context/LiveEditContext';

export const SkillsPage: React.FC = () => {
  const { isLiveEdit } = useLiveEdit();

  const [skills, setSkills] = useState<ISkill[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<ISkill | null>(null);
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'Frontend' as ISkill['category'],
    proficiency: 85,
    order: 0,
  });
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const fetchSkills = async () => {
    try {
      const res = await api.skills.getAll();
      if (res.data) setSkills(res.data);
    } catch (err) {
      console.error('Failed to load skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleOpenModal = (skill?: ISkill) => {
    if (skill) {
      setEditingSkill(skill);
      setSkillForm({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        order: skill.order,
      });
    } else {
      setEditingSkill(null);
      setSkillForm({
        name: '',
        category: 'Frontend',
        proficiency: 85,
        order: skills.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await api.skills.update(editingSkill._id, skillForm);
        setToast({ message: 'Skill updated in MongoDB!', type: 'success' });
      } else {
        await api.skills.create(skillForm);
        setToast({ message: 'Skill created and saved in MongoDB!', type: 'success' });
      }
      setIsModalOpen(false);
      fetchSkills();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to save skill', type: 'error' });
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!window.confirm('Delete this skill from MongoDB?')) return;
    try {
      await api.skills.delete(id);
      setToast({ message: 'Skill removed from database', type: 'success' });
      fetchSkills();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to delete skill', type: 'error' });
    }
  };

  const categories = [
    'All',
    'Frontend',
    'Backend',
    'Database',
    'DevOps & Cloud',
    'Mobile & Other',
    'Tools',
  ];

  const filteredSkills = skills.filter((skill) => {
    const matchesCategory =
      selectedCategory === 'All' || skill.category === selectedCategory;
    const matchesSearch = skill.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SectionHeading
        badge="Skills & Technologies"
        title="Technical Arsenal"
        subtitle="A comprehensive overview of programming languages, libraries, databases, and DevOps tools in my daily workflow."
      />

      {/* Filter, Search, and Live Add Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Add Button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skill (e.g., React)..."
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
              <span>Add Skill</span>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" label="Loading skills matrix..." />
      ) : filteredSkills.length === 0 ? (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400">
          <p>No skills found matching your filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => (
            <SkillBadge
              key={skill._id}
              skill={skill}
              isLiveEdit={isLiveEdit}
              onEdit={handleOpenModal}
              onDelete={handleDeleteSkill}
            />
          ))}
        </div>
      )}

      {/* Live Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill ? 'Edit Skill (Saves to MongoDB)' : 'Add Skill to MongoDB'}
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
