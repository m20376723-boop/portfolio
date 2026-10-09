import React, { useEffect, useState } from 'react';
import { Save, Upload, Link as LinkIcon, User, Globe, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { api } from '../../services/api';
import { IProfile } from '../../types';
import { Toast, ToastType } from '../../components/Toast';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const ManageProfile: React.FC = () => {
  const [profile, setProfile] = useState<IProfile>({
    name: '',
    title: '',
    bio: '',
    profileImage: '',
    resumeUrl: '',
    location: '',
    email: '',
    phone: '',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      website: '',
      instagram: '',
      youtube: '',
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.profile.get();
        if (res.data) setProfile(res.data);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const socialKey = name.split('.')[1];
      setProfile((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value,
        },
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await api.upload.uploadFile(file);
      if (res.data?.url) {
        setProfile((prev) => ({ ...prev, profileImage: res.data.url }));
        setToast({ message: 'Profile image uploaded successfully', type: 'success' });
      }
    } catch (err: any) {
      setToast({ message: err.message || 'Image upload failed', type: 'error' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.profile.update(profile);
      setToast({ message: 'Profile details saved successfully!', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to save profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading profile configuration..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Profile Configuration</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Update the identity, bio, contact details, and social media links displayed across the portfolio.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Identity */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-primary-500" />
            <span>General Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={profile.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={profile.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
              Biography / Professional Introduction *
            </label>
            <textarea
              name="bio"
              rows={4}
              required
              value={profile.bio}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={profile.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Media & Resume URLs */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-primary-500" />
            <span>Profile Avatar & Resume Document</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                Profile Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="profileImage"
                  placeholder="https://... or upload local file"
                  value={profile.profileImage}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white"
                />
                <label className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 cursor-pointer flex items-center justify-center shrink-0">
                  <Upload className="w-4 h-4 mr-1" />
                  <span>{uploadingImage ? '...' : 'Upload'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {profile.profileImage && (
                <div className="mt-3 w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img src={profile.profileImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                Resume URL / PDF File
              </label>
              <input
                type="text"
                name="resumeUrl"
                placeholder="https://.../resume.pdf"
                value={profile.resumeUrl}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary-500" />
            <span>Social Links & Profiles</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                GitHub URL
              </label>
              <input
                type="url"
                name="social.github"
                value={profile.socialLinks?.github || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                LinkedIn URL
              </label>
              <input
                type="url"
                name="social.linkedin"
                value={profile.socialLinks?.linkedin || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                Twitter / X URL
              </label>
              <input
                type="url"
                name="social.twitter"
                value={profile.socialLinks?.twitter || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                Personal Website
              </label>
              <input
                type="url"
                name="social.website"
                value={profile.socialLinks?.website || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl font-bold bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white shadow-lg shadow-primary-500/25 transition flex items-center gap-2 text-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Profile Details'}</span>
          </button>
        </div>
      </form>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
};
