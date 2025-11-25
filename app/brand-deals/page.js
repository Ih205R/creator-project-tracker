'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { brandDealsAPI } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { LuBriefcase, LuPlus, LuPencil, LuTrash2, LuDollarSign, LuCalendar, LuCircleCheck, LuClock, LuCircleX, LuArrowLeft } from 'react-icons/lu';
import { useRouter } from 'next/navigation';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', icon: LuClock, color: 'yellow' },
  { value: 'active', label: 'Active', icon: LuCircleCheck, color: 'blue' },
  { value: 'completed', label: 'Completed', icon: LuCircleCheck, color: 'green' },
  { value: 'cancelled', label: 'Cancelled', icon: LuCircleX, color: 'red' }
];

export default function BrandDealsPage() {
  const router = useRouter();
  const { userProfile, isPro } = useAuth();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [formData, setFormData] = useState({
    brandName: '',
    description: '',
    amount: '',
    status: 'pending',
    startDate: '',
    endDate: '',
    deliverables: '',
    contactEmail: '',
    notes: ''
  });

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const response = await brandDealsAPI.getAll();
      setDeals(response.data.brandDeals || []);
    } catch (error) {
      console.error('Failed to load brand deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDeal) {
        await brandDealsAPI.update(editingDeal._id, formData);
      } else {
        await brandDealsAPI.create(formData);
      }
      setShowModal(false);
      setEditingDeal(null);
      resetForm();
      loadDeals();
    } catch (error) {
      console.error('Failed to save brand deal:', error);
      alert(error.response?.data?.error || 'Failed to save brand deal');
    }
  };

  const handleEdit = (deal) => {
    setEditingDeal(deal);
    setFormData({
      brandName: deal.brandName,
      description: deal.description || '',
      amount: deal.amount || '',
      status: deal.status,
      startDate: deal.startDate ? new Date(deal.startDate).toISOString().split('T')[0] : '',
      endDate: deal.endDate ? new Date(deal.endDate).toISOString().split('T')[0] : '',
      deliverables: deal.deliverables || '',
      contactEmail: deal.contactEmail || '',
      notes: deal.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this brand deal?')) return;
    try {
      await brandDealsAPI.delete(id);
      loadDeals();
    } catch (error) {
      console.error('Failed to delete brand deal:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      brandName: '',
      description: '',
      amount: '',
      status: 'pending',
      startDate: '',
      endDate: '',
      deliverables: '',
      contactEmail: '',
      notes: ''
    });
  };

  const getStatusConfig = (status) => {
    return STATUS_OPTIONS.find(opt => opt.value === status) || STATUS_OPTIONS[0];
  };

  const totalRevenue = deals.reduce((sum, deal) => sum + (deal.amount || 0), 0);
  const activeDeals = deals.filter(d => d.status === 'active').length;
  const completedDeals = deals.filter(d => d.status === 'completed').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back to Dashboard Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
        >
          <LuArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Go back to the dashboard</span>
        </motion.button>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <LuBriefcase className="text-indigo-600" />
              Brand Deals
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your brand partnerships and collaborations
            </p>
          </div>
          <button
            onClick={() => {
              setEditingDeal(null);
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <LuPlus className="w-5 h-5" />
            New Deal
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <LuDollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Deals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{activeDeals}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <LuBriefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{completedDeals}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <LuCircleCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Deals List */}
        {deals.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <LuBriefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No brand deals yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start tracking your brand partnerships and collaborations
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Your First Deal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {deals.map((deal, index) => {
                const statusConfig = getStatusConfig(deal.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <motion.div
                    key={deal._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {deal.brandName}
                        </h3>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-${statusConfig.color}-100 text-${statusConfig.color}-800 dark:bg-${statusConfig.color}-900/20 dark:text-${statusConfig.color}-400`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(deal)}
                          className="p-2 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                        >
                          <LuPencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(deal._id)}
                          className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        >
                          <LuTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {deal.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {deal.description}
                      </p>
                    )}

                    <div className="space-y-2 text-sm">
                      {deal.amount && (
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <LuDollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-semibold">${deal.amount.toLocaleString()}</span>
                        </div>
                      )}
                      {deal.startDate && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <LuCalendar className="w-4 h-4" />
                          <span>
                            {new Date(deal.startDate).toLocaleDateString()}
                            {deal.endDate && ` - ${new Date(deal.endDate).toLocaleDateString()}`}
                          </span>
                        </div>
                      )}
                      {deal.deliverables && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Deliverables:
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {deal.deliverables}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              >
                {/* Gradient Header */}
                <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {editingDeal ? 'Edit Brand Deal' : 'Create New Deal'}
                      </h2>
                      <p className="text-indigo-100 text-sm">
                        {editingDeal ? 'Update your partnership details' : 'Track your brand partnership'}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowModal(false)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                    >
                      <LuCircleX className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Brand Name */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Brand Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.brandName}
                        onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                        placeholder="e.g., Nike, Apple, Tesla..."
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all placeholder:text-gray-400"
                      />
                    </motion.div>

                    {/* Description */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows="3"
                        placeholder="Brief description of the partnership..."
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all placeholder:text-gray-400 resize-none"
                      />
                    </motion.div>

                    {/* Amount & Status */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <LuDollarSign className="w-4 h-4 inline mr-1" />
                          Amount
                        </label>
                        <input
                          type="number"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          placeholder="5000"
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all placeholder:text-gray-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Status <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all cursor-pointer"
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </motion.div>

                    {/* Dates */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <LuCalendar className="w-4 h-4 inline mr-1" />
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <LuCalendar className="w-4 h-4 inline mr-1" />
                          End Date
                        </label>
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
                        />
                      </div>
                    </motion.div>

                    {/* Contact Email */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        placeholder="brand@company.com"
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all placeholder:text-gray-400"
                      />
                    </motion.div>

                    {/* Deliverables */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Deliverables
                      </label>
                      <textarea
                        value={formData.deliverables}
                        onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                        rows="2"
                        placeholder="e.g., 3 Instagram posts, 1 YouTube video, 5 TikTok videos..."
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all placeholder:text-gray-400 resize-none"
                      />
                    </motion.div>

                    {/* Notes */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Notes
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows="2"
                        placeholder="Additional notes or special requirements..."
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all placeholder:text-gray-400 resize-none"
                      />
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                      className="flex gap-3 pt-4"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                      >
                        {editingDeal ? '✓ Update Deal' : '+ Create Deal'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                      >
                        Cancel
                      </motion.button>
                    </motion.div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
