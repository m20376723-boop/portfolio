import React, { useEffect, useState } from 'react';
import { Mail, Trash2, CheckCircle, Clock, Eye, Reply } from 'lucide-react';
import { api } from '../../services/api';
import { IContactMessage } from '../../types';
import { Modal } from '../../components/Modal';
import { Toast, ToastType } from '../../components/Toast';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const ManageMessages: React.FC = () => {
  const [messages, setMessages] = useState<IContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied' | 'archived'>('all');
  const [selectedMessage, setSelectedMessage] = useState<IContactMessage | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const fetchMessages = async () => {
    try {
      const res = await api.contact.getAll();
      if (res.data) setMessages(res.data);
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to load messages', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'unread' | 'read' | 'replied' | 'archived') => {
    try {
      await api.contact.updateStatus(id, status);
      setToast({ message: `Status updated to ${status}`, type: 'success' });
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
      fetchMessages();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to update status', type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      await api.contact.delete(id);
      setToast({ message: 'Message deleted', type: 'success' });
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(null);
      }
      fetchMessages();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to delete message', type: 'error' });
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Contact Inquiries Inbox</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Messages received through the portfolio contact form.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'unread', 'read', 'replied', 'archived'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                filter === st
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {st} {st !== 'all' && `(${messages.filter((m) => m.status === st).length})`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" label="Loading inbox..." />
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-500 dark:text-slate-400">
          <p className="text-sm font-semibold">No messages in this filter view</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredMessages.map((msg) => (
              <div
                key={msg._id}
                className="p-5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{msg.name}</span>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      {msg.email}
                    </a>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        msg.status === 'unread'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                          : msg.status === 'replied'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>

                  <p className="font-semibold text-xs text-slate-800 dark:text-slate-200">{msg.subject}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{msg.message}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <span className="text-[11px] text-slate-400 font-mono pr-2">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (msg.status === 'unread') {
                        handleUpdateStatus(msg._id, 'read');
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition"
                    title="View Message"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 transition"
                    title="Delete Message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Reader Modal */}
      {selectedMessage && (
        <Modal
          isOpen={!!selectedMessage}
          onClose={() => setSelectedMessage(null)}
          title={selectedMessage.subject}
          maxWidth="lg"
        >
          <div className="space-y-6 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{selectedMessage.name}</p>
                  <p className="text-primary-600 dark:text-primary-400 font-mono">{selectedMessage.email}</p>
                </div>
                <span className="text-[11px] text-slate-400">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2">Message Body</p>
              <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-sm leading-relaxed whitespace-pre-line text-slate-800 dark:text-slate-200">
                {selectedMessage.message}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-500">Status:</span>
                <select
                  value={selectedMessage.status}
                  onChange={(e) => handleUpdateStatus(selectedMessage._id, e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="px-4 py-2 rounded-xl bg-primary-600 text-white font-bold flex items-center gap-1.5"
                  onClick={() => handleUpdateStatus(selectedMessage._id, 'replied')}
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
};
