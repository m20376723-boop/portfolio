import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit3, CheckCircle, ShieldCheck, Lock, X, ArrowRight, ExternalLink } from 'lucide-react';
import { useLiveEdit } from '../context/LiveEditContext';
import { useAuth } from '../hooks/useAuth';
import { Modal } from './Modal';
import { Toast, ToastType } from './Toast';

export const LiveEditToolbar: React.FC = () => {
  const { isLiveEdit, toggleLiveEdit, enableLiveEdit, isAuthModalOpen, closeAuthModal } = useLiveEdit();
  const { isAuthenticated, login } = useAuth();

  const [authEmail, setAuthEmail] = useState('admin@portfolio.dev');
  const [authPassword, setAuthPassword] = useState('AdminPass123!');
  const [authLoading, setAuthLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const handleQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      await login({ email: authEmail, password: authPassword });
      closeAuthModal();
      enableLiveEdit();
      setToast({
        message: 'Live Editing Unlocked! You can now edit any section directly on this page.',
        type: 'success',
      });
    } catch (err: any) {
      setToast({
        message: err.message || 'Authentication failed. Please verify credentials.',
        type: 'error',
      });
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toolbar */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2">
        <button
          id="toggle-live-edit-btn"
          onClick={toggleLiveEdit}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl transition-all duration-300 border ${
            isLiveEdit
              ? 'bg-emerald-600 text-white border-emerald-400 ring-4 ring-emerald-500/20 hover:bg-emerald-700 animate-pulse-subtle'
              : 'bg-white/95 dark:bg-[#111827]/95 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-primary-500 hover:text-primary-600'
          }`}
          title="Toggle In-Page Live Editing"
        >
          {isLiveEdit ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-200" />
              <span>Live Edit Mode: ON</span>
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4 text-primary-500" />
              <span>Enable In-Page Editing</span>
            </>
          )}
        </button>

        {isLiveEdit && (
          <Link
            to="/admin/dashboard"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold bg-white/90 dark:bg-[#111827]/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <span>Admin Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        )}
      </div>

      {/* Quick Unlock Authentication Modal */}
      <Modal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        title="Unlock In-Page Live Editing"
        maxWidth="md"
      >
        <div className="space-y-5 text-xs">
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            To change text, projects, skills, and images directly on the website and save them into the MongoDB database, please verify your administrator credentials.
          </p>

          <div className="p-3.5 rounded-xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800/80 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-primary-800 dark:text-primary-300">
              <ShieldCheck className="w-4 h-4 text-primary-500" />
              <span>Default Administrator Account:</span>
            </div>
            <p className="font-mono text-[11px] text-slate-700 dark:text-slate-300">admin@portfolio.dev</p>
            <p className="font-mono text-[11px] text-slate-700 dark:text-slate-300">AdminPass123!</p>
          </div>

          <form onSubmit={handleQuickLogin} className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={closeAuthModal}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={authLoading}
                className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{authLoading ? 'Verifying...' : 'Unlock & Enable Editing'}</span>
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  );
};
