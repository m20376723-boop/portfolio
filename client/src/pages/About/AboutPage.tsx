import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Mail, CheckCircle2, Award, Briefcase, Code, MapPin, Edit2, Upload } from 'lucide-react';
import { api } from '../../services/api';
import { IProfile } from '../../types';
import { SectionHeading } from '../../components/SectionHeading';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';
import { Toast, ToastType } from '../../components/Toast';
import { useLiveEdit } from '../../context/LiveEditContext';

export const AboutPage: React.FC = () => {
  const { isLiveEdit } = useLiveEdit();

  const [profile, setProfile] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<IProfile>>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const fetchProfile = async () => {
    try {
      const res = await api.profile.get();
      if (res.data) {
        setProfile(res.data);
        setFormData(res.data);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await api.upload.uploadFile(file);
      if (res.data?.url) {
        setFormData((prev) => ({ ...prev, profileImage: res.data.url }));
        setToast({ message: 'Profile photo uploaded successfully!', type: 'success' });
      }
    } catch (err: any) {
      setToast({ message: err.message || 'Image upload failed', type: 'error' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.profile.update(formData);
      setProfile(res.data);
      setIsModalOpen(false);
      setToast({ message: 'About details updated and saved to MongoDB!', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to update about details', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading biography..." />
      </div>
    );
  }

  const name = profile?.name || 'Alex Rivera';
  const title = profile?.title || 'Senior Full-Stack Engineer & Cloud Architect';
  const bio =
    profile?.bio ||
    'Passionate software craftsman with 7+ years of building resilient distributed systems, modern web apps, and high-impact digital experiences.';
  const avatar =
    profile?.profileImage ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
  const location = profile?.location || 'San Francisco, CA / Remote';

  const stats = [
    { label: 'Years Experience', value: '7+', icon: Briefcase },
    { label: 'Projects Delivered', value: '45+', icon: Code },
    { label: 'Cloud Certifications', value: '3', icon: Award },
    { label: 'Satisfied Stakeholders', value: '100%', icon: CheckCircle2 },
  ];

  const highlights = [
    'Architecting fault-tolerant microservices handling millions of API requests daily',
    'Leading engineering teams in migrating monolithic legacy applications to micro-frontends and serverless clouds',
    'Obsessed with sub-second page performance, SEO optimization, and accessible UI designs',
    'Strong advocate for test-driven development, automated CI/CD pipelines, and clean architecture',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <SectionHeading
        badge="About Me"
        title="Engineering Excellence & Craftsmanship"
        subtitle="Get to know the developer behind the code and distributed cloud systems."
      />

      {isLiveEdit && (
        <div className="flex justify-end">
          <button
            onClick={() => {
              setFormData(profile || {});
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl font-bold bg-primary-600 hover:bg-primary-700 text-white text-xs shadow-md flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Biography & Details (MongoDB)</span>
          </button>
        </div>
      )}

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Profile Card */}
        <div className="lg:col-span-5 flex flex-col items-center text-center p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xl relative">
          {isLiveEdit && (
            <button
              onClick={() => {
                setFormData(profile || {});
                setIsModalOpen(true);
              }}
              className="absolute top-4 right-4 p-2 rounded-xl bg-primary-600 text-white shadow-md hover:scale-105 transition"
              title="Edit Profile in DB"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-xl border-4 border-slate-100 dark:border-slate-800 mb-6">
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{name}</h2>
          <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mt-1">{title}</p>
          <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{location}</span>
          </p>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 w-full flex flex-col gap-3">
            <Link
              to="/resume"
              className="w-full py-3 px-4 rounded-xl font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-500/20 text-sm flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              <span>View Interactive Resume</span>
            </Link>
            <Link
              to="/contact"
              className="w-full py-3 px-4 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm flex items-center justify-center gap-2 transition"
            >
              <Mail className="w-4 h-4 text-primary-500" />
              <span>Send a Message</span>
            </Link>
          </div>
        </div>

        {/* Story & Philosophy */}
        <div className="lg:col-span-7 space-y-8">
          <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed text-base space-y-4">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              My Engineering Journey
            </h3>
            <p>
              {bio}
            </p>
            <p>
              I began coding over a decade ago, fascinated by the immediate feedback loop of bringing interactive web experiences to life. Over the years, I expanded my focus from client-side interfaces to distributed microservice backends, cloud orchestration on AWS, and event-driven data streaming.
            </p>
            <p>
              When I'm not in an IDE designing resilient APIs or polishing user interface animations, I enjoy mentoring up-and-coming developers, writing architectural articles, and exploring containerization innovations in Kubernetes.
            </p>
          </div>

          {/* Key Pillars */}
          <div className="space-y-3 pt-2">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Core Engineering Focus
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Counter Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Biography & Details (MongoDB)"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Job Title *</label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Biography *</label>
            <textarea
              rows={4}
              required
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Profile Photo</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Image URL..."
                value={formData.profileImage || ''}
                onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <label className="px-3 py-2 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 cursor-pointer flex items-center shrink-0">
                <Upload className="w-3.5 h-3.5 mr-1" />
                <span>{uploadingImage ? '...' : 'Upload'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Location</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
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
