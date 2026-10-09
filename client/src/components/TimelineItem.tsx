import React from 'react';
import { Calendar, MapPin, Briefcase, GraduationCap, Edit2, Trash2 } from 'lucide-react';

interface TimelineItemProps {
  title: string;
  subtitle: string;
  period: string;
  location?: string;
  description: string;
  technologies?: string[];
  type?: 'work' | 'education';
  isLast?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  isLiveEdit?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  title,
  subtitle,
  period,
  location,
  description,
  technologies,
  type = 'work',
  isLast = false,
  onEdit,
  onDelete,
  isLiveEdit = false,
}) => {
  return (
    <div className="relative pl-8 sm:pl-10 group">
      {/* Vertical line */}
      {!isLast && (
        <div className="absolute left-[15px] sm:left-[19px] top-8 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 group-hover:bg-primary-500/50 transition-colors" />
      )}

      {/* Dot / Icon badge */}
      <div className="absolute left-0 top-1.5 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-slate-900 border-2 border-primary-500 flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-sm group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all">
        {type === 'work' ? (
          <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </div>

      {/* Content box */}
      <div className="relative p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm group-hover:border-primary-500/40 transition-all duration-200 mb-8">
        {/* Live edit buttons */}
        {isLiveEdit && (onEdit || onDelete) && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary-600 hover:text-white text-slate-500 dark:text-slate-300 transition"
                title="Edit Entry in DB"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-500 dark:text-slate-300 transition"
                title="Delete Entry from DB"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2 pr-12">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 w-fit">
            <Calendar className="w-3.5 h-3.5 text-primary-500" />
            <span>{period}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-primary-600 dark:text-primary-400 mb-3">
          <span>{subtitle}</span>
          {location && (
            <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5" />
              {location}
            </span>
          )}
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {description}
        </p>

        {technologies && technologies.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1.5">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
