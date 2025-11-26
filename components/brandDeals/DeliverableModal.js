'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuX, LuCalendar, LuLink } from 'react-icons/lu';

const DELIVERABLE_TYPES = [
  { value: 'video', label: 'Video' },
  { value: 'story', label: 'Story' },
  { value: 'short', label: 'Short' },
  { value: 'post', label: 'Post' },
  { value: 'reel', label: 'Reel' },
  { value: 'tweet', label: 'Tweet' },
  { value: 'blog', label: 'Blog Post' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'other', label: 'Other' }
];

const STATUS_OPTIONS = [
  { value: 'not-started', label: 'Not Started' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'approved', label: 'Approved' }
];

export default function DeliverableModal({ isOpen, onClose, onSubmit, deliverable = null }) {
  const [formData, setFormData] = useState({
    type: 'video',
    description: '',
    deadline: '',
    status: 'not-started',
    submittedLink: '',
    approvalNotes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (deliverable) {
      setFormData({
        type: deliverable.type || 'video',
        description: deliverable.description || '',
        deadline: deliverable.deadline ? new Date(deliverable.deadline).toISOString().split('T')[0] : '',
        status: deliverable.status || 'not-started',
        submittedLink: deliverable.submittedLink || '',
        approvalNotes: deliverable.approvalNotes || ''
      });
    } else {
      setFormData({
        type: 'video',
        description: '',
        deadline: '',
        status: 'not-started',
        submittedLink: '',
        approvalNotes: ''
      });
    }
  }, [deliverable, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save deliverable:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-5">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {deliverable ? 'Edit Deliverable' : 'Add Deliverable'}
                </h2>
                <p className="text-indigo-100 text-sm mt-0.5">
                  {deliverable ? 'Update deliverable details' : 'Track a new content piece'}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <LuX className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-5 max-h-[calc(90vh-100px)] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  Content Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {DELIVERABLE_TYPES.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value })}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                        formData.type === type.value
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  placeholder="Describe what needs to be created..."
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all resize-none"
                />
              </div>

              {/* Deadline & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <LuCalendar className="w-4 h-4" />
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submitted Link */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <LuLink className="w-4 h-4" />
                  Submission Link
                </label>
                <input
                  type="url"
                  value={formData.submittedLink}
                  onChange={(e) => setFormData({ ...formData, submittedLink: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
                />
              </div>

              {/* Approval Notes */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  Approval Notes
                </label>
                <textarea
                  value={formData.approvalNotes}
                  onChange={(e) => setFormData({ ...formData, approvalNotes: e.target.value })}
                  rows="2"
                  placeholder="Notes from brand or approval comments..."
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (deliverable ? '✓ Update' : '+ Add Deliverable')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
