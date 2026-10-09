import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock } from 'lucide-react';
import { api } from '../../services/api';
import { SectionHeading } from '../../components/SectionHeading';
import { Toast, ToastType } from '../../components/Toast';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setToast({ message: 'Please fill out all required fields.', type: 'error' });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setToast({ message: 'Please enter a valid email address.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const res = await api.contact.submit(formData);
      setToast({
        message: res.message || 'Your message has been sent successfully! I will reply shortly.',
        type: 'success',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setToast({
        message: err.message || 'Failed to send message. Please try again or email directly.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const contactCards = [
    {
      title: 'Email Address',
      value: 'alex.rivera@example.com',
      desc: 'Typical response time within 24 hours',
      icon: Mail,
      href: 'mailto:alex.rivera@example.com',
    },
    {
      title: 'Phone / Signal',
      value: '+1 (555) 234-5678',
      desc: 'Mon - Fri, 9am - 6pm PST',
      icon: Phone,
      href: 'tel:+15552345678',
    },
    {
      title: 'Primary Location',
      value: 'San Francisco, CA',
      desc: 'Available worldwide remotely',
      icon: MapPin,
    },
    {
      title: 'Availability',
      value: 'Open for Q1 & Q2 Contracts',
      desc: 'Full-time roles & consulting',
      icon: Clock,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <SectionHeading
        badge="Get in Touch"
        title="Let's Start a Conversation"
        subtitle="Have an ambitious technical project, need architecture consulting, or exploring engineering leadership opportunities? Send a message."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Information & Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Direct Communication
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Whether you are an engineering executive looking for a staff engineer, a startup founder building an MVP, or an organization modernizing legacy infrastructure, feel free to reach out.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 pt-2">
            {contactCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</p>
                    {card.href ? (
                      <a
                        href={card.href}
                        className="text-sm font-bold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition truncate block"
                      >
                        {card.value}
                      </a>
                    ) : (
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{card.value}</p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xl">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-500" />
            <span>Send a Direct Message</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            All inquiries are directly forwarded and logged into the portfolio management dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider"
                >
                  Your Name *
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider"
                >
                  Email Address *
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  placeholder="e.g. jane@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-subject"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider"
              >
                Subject *
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                required
                placeholder="e.g. Consulting Project / Staff Full-Stack Opportunity"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider"
              >
                Message *
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                placeholder="Share project goals, timelines, or role details..."
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-primary-500 text-slate-900 dark:text-white resize-none"
              />
            </div>

            <button
              id="submit-contact-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-semibold bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white shadow-lg shadow-primary-500/25 transition flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <span>Sending message...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
