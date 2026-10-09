import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, User, Share2 } from 'lucide-react';
import { api } from '../../services/api';
import { IBlog } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<IBlog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;
      try {
        const res = await api.blogs.getBySlug(slug);
        if (res.data) {
          setBlog(res.data);
        } else {
          setError('Article not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading article..." />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Article Not Found</h2>
        <p className="text-slate-600 dark:text-slate-400">The article you requested could not be located.</p>
        <button
          onClick={() => navigate('/blog')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </button>
      </div>
    );
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all articles</span>
        </Link>
      </div>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary-500" />
            <time dateTime={blog.createdAt}>{formattedDate}</time>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-primary-500" />
            <span>Alex Rivera</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {blog.title}
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-4 border-primary-500 pl-4 py-1">
          {blog.excerpt}
        </p>

        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Featured Image */}
      {blog.image && (
        <div className="rounded-3xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-800">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content body */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm text-slate-800 dark:text-slate-200 leading-relaxed text-base sm:text-lg space-y-6 whitespace-pre-line font-sans">
        {blog.content}
      </div>

      {/* Author footer banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
            alt="Alex Rivera"
            className="w-14 h-14 rounded-2xl object-cover border-2 border-primary-500"
          />
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Written by Alex Rivera</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Senior Full-Stack Engineer & Distributed Systems Architect</p>
          </div>
        </div>

        <Link
          to="/contact"
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-sm transition"
        >
          Have questions? Reach out
        </Link>
      </div>
    </article>
  );
};
