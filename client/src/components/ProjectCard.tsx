import React from 'react';
import { ExternalLink, Github, Star, Edit2, Trash2 } from 'lucide-react';
import { IProject } from '../types';

interface ProjectCardProps {
  project: IProject;
  onEdit?: (project: IProject) => void;
  onDelete?: (id: string) => void;
  isLiveEdit?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  isLiveEdit = false,
}) => {
  return (
    <div className="group relative flex flex-col rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl dark:shadow-none hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all duration-300 overflow-hidden">
      {/* Live edit badge & actions on top of card */}
      {isLiveEdit && (onEdit || onDelete) && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 backdrop-blur-md shadow-lg border border-white/20 animate-fade-in">
          {onEdit && (
            <button
              onClick={() => onEdit(project)}
              className="p-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white transition"
              title="Edit Project in Database"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(project._id)}
              className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition"
              title="Delete Project from Database"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Project image */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={project.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'}
          alt={project.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {project.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/90 text-white backdrop-blur-md shadow-md">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Featured</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {project.title}
        </h3>
        <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-400 line-clamp-3 flex-1 leading-relaxed">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
                aria-label={`View source code for ${project.title}`}
              >
                <Github className="w-4 h-4" />
                <span>Code</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition"
                aria-label={`View live demo for ${project.title}`}
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
              </a>
            )}
          </div>

          {isLiveEdit && onEdit && (
            <button
              onClick={() => onEdit(project)}
              className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
