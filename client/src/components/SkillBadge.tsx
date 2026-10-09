import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { ISkill } from '../types';

interface SkillBadgeProps {
  skill: ISkill;
  onEdit?: (skill: ISkill) => void;
  onDelete?: (id: string) => void;
  isLiveEdit?: boolean;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  skill,
  onEdit,
  onDelete,
  isLiveEdit = false,
}) => {
  return (
    <div className="relative p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary-400 dark:hover:border-primary-500/50 transition duration-200 group">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-slate-900 dark:text-white text-sm">
          {skill.name}
        </span>
        <div className="flex items-center gap-2">
          {isLiveEdit && (onEdit || onDelete) && (
            <div className="flex items-center gap-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(skill)}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-500 transition"
                  title="Edit skill in DB"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(skill._id)}
                  className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-500 transition"
                  title="Delete skill from DB"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
          <span className="text-xs font-mono font-semibold text-primary-600 dark:text-primary-400">
            {skill.proficiency}%
          </span>
        </div>
      </div>
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-primary-500 to-indigo-500 h-2 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${skill.proficiency}%` }}
        />
      </div>
    </div>
  );
};
