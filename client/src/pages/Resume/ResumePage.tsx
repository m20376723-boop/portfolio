import React, { useEffect, useState } from 'react';
import { Download, Printer, Mail, MapPin, Globe, ExternalLink, Briefcase, GraduationCap, Award } from 'lucide-react';
import { api } from '../../services/api';
import { IProfile, IExperience, IEducation, ISkill } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const ResumePage: React.FC = () => {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [educations, setEducations] = useState<IEducation[]>([]);
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, expRes, eduRes, skillsRes] = await Promise.all([
          api.profile.get().catch(() => ({ data: null })),
          api.experience.getAll().catch(() => ({ data: [] })),
          api.education.getAll().catch(() => ({ data: [] })),
          api.skills.getAll().catch(() => ({ data: [] })),
        ]);

        if (profileRes.data) setProfile(profileRes.data);
        if (expRes.data) setExperiences(expRes.data);
        if (eduRes.data) setEducations(eduRes.data);
        if (skillsRes.data) setSkills(skillsRes.data);
      } catch (err) {
        console.error('Failed to load resume details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Preparing resume..." />
      </div>
    );
  }

  const name = profile?.name || 'Alex Rivera';
  const title = profile?.title || 'Senior Full-Stack Engineer & Cloud Architect';
  const email = profile?.email || 'alex.rivera@example.com';
  const location = profile?.location || 'San Francisco, CA / Remote';
  const website = profile?.socialLinks?.website || 'https://alexrivera.dev';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm print:hidden">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Curriculum Vitae</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Standard printable & downloadable resume</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
          {profile?.resumeUrl ? (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-sm transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </a>
          ) : (
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-sm transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Printable Resume Sheet */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl space-y-8 text-slate-800 dark:text-slate-200 print:shadow-none print:border-none print:p-0 print:m-0">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {name}
          </h1>
          <p className="text-base sm:text-lg font-semibold text-primary-600 dark:text-primary-400 mt-1">
            {title}
          </p>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 dark:text-slate-400 mt-4">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-primary-500" />
              {email}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary-500" />
              {location}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-primary-500" />
              {website}
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 border-b border-slate-200 dark:border-slate-800 pb-1.5">
            Executive Summary
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {profile?.bio ||
              'High-performing Senior Full-Stack Engineer with a track record of designing scalable cloud microservices, zero-downtime databases, and intuitive modern web frontends using TypeScript, React, and Node.js.'}
          </p>
        </section>

        {/* Technical Core Competencies */}
        <section className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 border-b border-slate-200 dark:border-slate-800 pb-1.5">
            Technical Skills
          </h2>
          <div className="flex flex-wrap gap-2 pt-1">
            {skills.map((skill) => (
              <span
                key={skill._id}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80"
              >
                {skill.name} ({skill.proficiency}%)
              </span>
            ))}
          </div>
        </section>

        {/* Professional Experience */}
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 border-b border-slate-200 dark:border-slate-800 pb-1.5 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            <span>Professional Work Experience</span>
          </h2>
          <div className="space-y-6 pt-1">
            {experiences.map((exp) => (
              <div key={exp._id} className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {exp.position} <span className="text-primary-600 dark:text-primary-400 font-semibold">@ {exp.company}</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{exp.location}</p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line pt-1">
                  {exp.description}
                </p>
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.technologies.map((t) => (
                      <span key={t} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Education & Certifications */}
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 border-b border-slate-200 dark:border-slate-800 pb-1.5 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span>Education & Credentials</span>
          </h2>
          <div className="space-y-5 pt-1">
            {educations.map((edu) => (
              <div key={edu._id} className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {edu.degree} in {edu.field}
                  </h3>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ''}
                  </span>
                </div>
                <p className="text-xs font-semibold text-primary-600 dark:text-primary-400">{edu.institution}</p>
                {edu.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-0.5">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
