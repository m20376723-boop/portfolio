import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Tag, Edit2, Trash2 } from 'lucide-react';
import { IBlog } from '../types';

interface BlogCardProps {
  blog: IBlog;
  onEdit?: (blog: IBlog) => void;
  onDelete?: (id: string) => void;
  isLiveEdit?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  onEdit,
  onDelete,
  isLiveEdit = false,
}) => {
  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="group relative flex flex-col rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl dark:shadow-none hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all duration-300 overflow-hidden">
      {/* Live edit controls */}
      {isLiveEdit && (onEdit || onDelete) && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 backdrop-blur-md shadow-lg border border-white/20">
          {onEdit && (
            <button
              onClick={() => onEdit(blog)}
              className="p-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white transition"
              title="Edit Article in DB"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(blog._id)}
              className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition"
              title="Delete Article from DB"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Blog Image */}
      {blog.image && (
        <Link to={`/blog/${blog.slug}`} className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800 block">
          <img
            src={blog.image}
            alt={blog.title}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>
      )}

      <div className="flex flex-col flex-1 p-6">
        {/* Date and tags */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <time dateTime={blog.createdAt}>{formattedDate}</time>
          </div>
          {blog.tags.length > 0 && (
            <div className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium">
              <Tag className="w-3 h-3" />
              <span>{blog.tags[0]}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <Link to={`/blog/${blog.slug}`}>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            {blog.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed flex-1">
          {blog.excerpt}
        </p>

        {/* Read More Link */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Link
            to={`/blog/${blog.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:gap-2.5 transition-all"
          >
            <span>Read Article</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {isLiveEdit && onEdit && (
            <button
              onClick={() => onEdit(blog)}
              className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit Article</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
