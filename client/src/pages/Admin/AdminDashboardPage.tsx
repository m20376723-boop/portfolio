import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Wrench,
  BookOpen,
  Mail,
  Briefcase,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { api } from '../../services/api';
import { IContactMessage } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const AdminDashboardPage: React.FC = () => {
  const [counts, setCounts] = useState({
    projects: 0,
    skills: 0,
    blogs: 0,
    messages: 0,
    experience: 0,
    services: 0,
  });
  const [recentMessages, setRecentMessages] = useState<IContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [p, s, b, m, exp, srv] = await Promise.all([
          api.projects.getAll().catch(() => ({ data: [] })),
          api.skills.getAll().catch(() => ({ data: [] })),
          api.blogs.getAll(true).catch(() => ({ data: [] })),
          api.contact.getAll().catch(() => ({ data: [] })),
          api.experience.getAll().catch(() => ({ data: [] })),
          api.services.getAll().catch(() => ({ data: [] })),
        ]);

        setCounts({
          projects: p.data?.length || 0,
          skills: s.data?.length || 0,
          blogs: b.data?.length || 0,
          messages: m.data?.length || 0,
          experience: exp.data?.length || 0,
          services: srv.data?.length || 0,
        });

        if (m.data) {
          setRecentMessages(m.data.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading dashboard metrics..." />
      </div>
    );
  }

  const statCards = [
    { label: 'Projects', count: counts.projects, path: '/admin/projects', icon: FolderGit2, color: 'text-sky-500' },
    { label: 'Skills', count: counts.skills, path: '/admin/skills', icon: Wrench, color: 'text-amber-500' },
    { label: 'Articles', count: counts.blogs, path: '/admin/blogs', icon: BookOpen, color: 'text-purple-500' },
    { label: 'Inbox Messages', count: counts.messages, path: '/admin/messages', icon: Mail, color: 'text-emerald-500' },
    { label: 'Career Records', count: counts.experience, path: '/admin/experience', icon: Briefcase, color: 'text-indigo-500' },
    { label: 'Services', count: counts.services, path: '/admin/services', icon: Sparkles, color: 'text-pink-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Authentication Active</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Portfolio Management Dashboard
          </h2>
          <p className="text-primary-100 text-xs sm:text-sm mt-1">
            Maintain your professional portfolio, update projects, manage skill proficiencies, and review inquiries.
          </p>
        </div>

        <Link
          to="/"
          target="_blank"
          className="px-4 py-2.5 rounded-xl font-semibold bg-white text-primary-700 hover:bg-primary-50 text-xs shadow-md transition shrink-0 flex items-center gap-1.5"
        >
          <span>Preview Live Site</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              to={stat.path}
              className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all hover:-translate-y-0.5 group"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-500 transition-colors" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{stat.count}</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent Contact Inquiries */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary-500" />
            <span>Recent Inquiries</span>
          </h3>
          <Link
            to="/admin/messages"
            className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
          >
            <span>View All ({counts.messages})</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
            No contact inquiries yet.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentMessages.map((msg) => (
              <div key={msg._id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{msg.name}</span>
                    <span className="text-[11px] text-slate-400">({msg.email})</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        msg.status === 'unread'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate mt-0.5">{msg.subject}</p>
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
