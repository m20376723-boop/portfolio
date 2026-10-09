import React from 'react';
import {
  Code,
  Server,
  Cloud,
  Database,
  Search,
  Layout,
  Terminal,
  Cpu,
  Layers,
  Edit2,
  Trash2,
} from 'lucide-react';
import { IService } from '../types';

interface ServiceCardProps {
  service: IService;
  onEdit?: (service: IService) => void;
  onDelete?: (id: string) => void;
  isLiveEdit?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onEdit,
  onDelete,
  isLiveEdit = false,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'code':
        return <Code className="w-6 h-6 text-primary-500" />;
      case 'server':
        return <Server className="w-6 h-6 text-indigo-500" />;
      case 'cloud':
        return <Cloud className="w-6 h-6 text-sky-500" />;
      case 'database':
        return <Database className="w-6 h-6 text-emerald-500" />;
      case 'search':
        return <Search className="w-6 h-6 text-purple-500" />;
      case 'layout':
        return <Layout className="w-6 h-6 text-pink-500" />;
      case 'cpu':
        return <Cpu className="w-6 h-6 text-amber-500" />;
      default:
        return <Layers className="w-6 h-6 text-primary-500" />;
    }
  };

  return (
    <div className="group relative p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all duration-300 flex flex-col justify-between">
      {/* Live edit controls */}
      {isLiveEdit && (onEdit || onDelete) && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
          {onEdit && (
            <button
              onClick={() => onEdit(service)}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary-600 hover:text-white text-slate-500 dark:text-slate-300 transition"
              title="Edit Service in DB"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(service._id)}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-500 dark:text-slate-300 transition"
              title="Delete Service from DB"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      <div>
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
          {getIcon(service.icon)}
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5">
          {service.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {service.description}
        </p>
      </div>
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center text-xs font-semibold text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform">
        <span>Learn more &rarr;</span>
      </div>
    </div>
  );
};
