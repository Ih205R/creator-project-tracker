'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { brandDealsAPI } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LuArrowLeft,
  LuBuilding,
  LuUser,
  LuMail,
  LuTarget,
  LuDollarSign,
  LuCalendar,
  LuPackage,
  LuFileText,
  LuCreditCard,
  LuMessageSquare,
  LuSparkles,
  LuPlus,
  LuPencil,
  LuExternalLink,
  LuCircleCheck,
  LuClock,
  LuCircleAlert
} from 'react-icons/lu';
import DeliverableCard from '@/components/brandDeals/DeliverableCard';
import DeliverableModal from '@/components/brandDeals/DeliverableModal';
import PaymentCard from '@/components/brandDeals/PaymentCard';
import CommunicationThread from '@/components/brandDeals/CommunicationThread';
import AIEmailGenerator from '@/components/brandDeals/AIEmailGenerator';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LuBuilding },
  { id: 'deliverables', label: 'Deliverables', icon: LuPackage },
  { id: 'documents', label: 'Documents', icon: LuFileText },
  { id: 'payments', label: 'Payments', icon: LuCreditCard },
  { id: 'communications', label: 'Communications', icon: LuMessageSquare }
];

const STAGE_CONFIG = {
  'lead': { label: 'Lead', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
  'negotiation': { label: 'Negotiation', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  'contract': { label: 'Contract', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  'active': { label: 'Active', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
  'completed': { label: 'Completed', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  'paid': { label: 'Paid', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' }
};

const PAYMENT_TERMS_LABELS = {
  'upfront': 'Upfront Payment',
  'net-15': 'Net 15 Days',
  'net-30': 'Net 30 Days',
  'net-60': 'Net 60 Days',
  'milestone': 'Milestone Based',
  'upon-completion': 'Upon Completion',
  'other': 'Custom Terms'
};

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isPro } = useAuth();
  
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeliverableModal, setShowDeliverableModal] = useState(false);
  const [editingDeliverable, setEditingDeliverable] = useState(null);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    if (params.id) {
      loadDeal();
    }
  }, [params.id]);

  const loadDeal = async () => {
    try {
      const response = await brandDealsAPI.getOne(params.id);
      setDeal(response.data.brandDeal);
    } catch (error) {
      console.error('Failed to load deal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeliverable = async (data) => {
    try {
      if (editingDeliverable) {
        await brandDealsAPI.updateDeliverable(params.id, editingDeliverable._id, data);
      } else {
        await brandDealsAPI.addDeliverable(params.id, data);
      }
      setShowDeliverableModal(false);
      setEditingDeliverable(null);
      loadDeal();
    } catch (error) {
      console.error('Failed to save deliverable:', error);
      throw error;
    }
  };

  const handleDeleteDeliverable = async (deliverableId) => {
    if (!confirm('Are you sure you want to delete this deliverable?')) return;
    try {
      await brandDealsAPI.deleteDeliverable(params.id, deliverableId);
      loadDeal();
    } catch (error) {
      console.error('Failed to delete deliverable:', error);
    }
  };

  const handleDeliverableStatusChange = async (deliverableId, newStatus) => {
    try {
      await brandDealsAPI.updateDeliverable(params.id, deliverableId, { status: newStatus });
      loadDeal();
    } catch (error) {
      console.error('Failed to update deliverable status:', error);
    }
  };

  const handleMarkPaymentPaid = async (paymentId) => {
    try {
      await brandDealsAPI.updatePayment(params.id, paymentId, { 
        status: 'paid',
        paidAt: new Date().toISOString()
      });
      loadDeal();
    } catch (error) {
      console.error('Failed to update payment:', error);
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;
    try {
      await brandDealsAPI.addCommunication(params.id, {
        type: 'note',
        content: noteContent,
        from: 'Me'
      });
      setNoteContent('');
      setShowAddNoteModal(false);
      loadDeal();
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading deal...</p>
        </motion.div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <LuCircleAlert className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Deal not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The deal you're looking for doesn't exist or was deleted.
          </p>
          <button
            onClick={() => router.push('/brand-deals')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Brand Deals
          </button>
        </div>
      </div>
    );
  }

  const stageConfig = STAGE_CONFIG[deal.stage] || STAGE_CONFIG.lead;
  const deliverablesCount = deal.deliverables?.length || 0;
  const approvedDeliverables = deal.deliverables?.filter(d => d.status === 'approved').length || 0;
  const totalPaid = deal.payments?.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0) || 0;
  const outstandingAmount = (deal.amount || 0) - totalPaid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => router.push('/brand-deals')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
        >
          <LuArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Pipeline</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {deal.dealName || deal.brandName}
                </h1>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${stageConfig.color}`}>
                  {stageConfig.label}
                </span>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <LuBuilding className="w-5 h-5" />
                {deal.brandName}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 min-w-[120px]">
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Deal Value</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  ${(deal.amount || 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 min-w-[120px]">
                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Deliverables</p>
                <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                  {approvedDeliverables}/{deliverablesCount}
                </p>
              </div>
              {deal.paymentDueDate && (
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 min-w-[120px]">
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Payment Due</p>
                  <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
                    {new Date(deal.paymentDueDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex overflow-x-auto gap-2 pb-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic Info Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Deal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <LuUser className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Contact Person</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {deal.contactPerson || 'Not specified'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <LuMail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Contact Email</p>
                          {deal.contactEmail ? (
                            <a 
                              href={`mailto:${deal.contactEmail}`} 
                              className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                              {deal.contactEmail}
                            </a>
                          ) : (
                            <p className="font-medium text-gray-900 dark:text-white">Not specified</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <LuCreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Payment Terms</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {PAYMENT_TERMS_LABELS[deal.paymentTerms] || deal.paymentTerms || 'Not specified'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <LuCalendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Campaign Dates</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {deal.startDate 
                              ? `${new Date(deal.startDate).toLocaleDateString()}${deal.endDate ? ` - ${new Date(deal.endDate).toLocaleDateString()}` : ''}`
                              : 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Campaign Goal */}
                    {deal.campaignGoal && (
                      <div className="mt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <LuTarget className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Campaign Goal</p>
                        </div>
                        <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                          {deal.campaignGoal}
                        </p>
                      </div>
                    )}

                    {/* Platforms */}
                    {deal.platforms && deal.platforms.length > 0 && (
                      <div className="mt-6">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Platforms</p>
                        <div className="flex flex-wrap gap-2">
                          {deal.platforms.map((platform) => (
                            <span
                              key={platform}
                              className="px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full capitalize"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {deal.notes && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Notes</h3>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{deal.notes}</p>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Commission Breakdown */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Payment Breakdown
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Deal Value</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ${(deal.amount || 0).toLocaleString()}
                        </span>
                      </div>
                      {deal.commission > 0 && (
                        <>
                          <div className="flex justify-between text-red-600 dark:text-red-400">
                            <span>Platform Fee ({deal.commission}%)</span>
                            <span>-${((deal.amount * deal.commission) / 100).toLocaleString()}</span>
                          </div>
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                            <span className="font-medium text-gray-900 dark:text-white">Net Payment</span>
                            <span className="font-bold text-green-600 dark:text-green-400">
                              ${((deal.amount * (100 - deal.commission)) / 100).toLocaleString()}
                            </span>
                          </div>
                        </>
                      )}
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Paid</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          ${totalPaid.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Outstanding</span>
                        <span className={`font-semibold ${outstandingAmount > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600'}`}>
                          ${outstandingAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Insights */}
                  {isPro && deal.aiInsights && deal.aiInsights.length > 0 && (
                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-2xl border border-indigo-200/50 dark:border-indigo-500/20 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <LuSparkles className="w-5 h-5 text-indigo-600" />
                        AI Insights
                      </h3>
                      <div className="space-y-3">
                        {deal.aiInsights.slice(0, 3).map((insight, index) => (
                          <div 
                            key={index}
                            className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg"
                          >
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {insight.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Deliverables Tab */}
            {activeTab === 'deliverables' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Deliverables</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {approvedDeliverables} of {deliverablesCount} completed
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setEditingDeliverable(null);
                      setShowDeliverableModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                  >
                    <LuPlus className="w-5 h-5" />
                    Add Deliverable
                  </motion.button>
                </div>

                {/* Progress Bar */}
                {deliverablesCount > 0 && (
                  <div className="mb-6">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                        style={{ width: `${(approvedDeliverables / deliverablesCount) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {deal.deliverables && deal.deliverables.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {deal.deliverables.map((deliverable, index) => (
                      <DeliverableCard
                        key={deliverable._id || index}
                        deliverable={deliverable}
                        onEdit={(d) => {
                          setEditingDeliverable(d);
                          setShowDeliverableModal(true);
                        }}
                        onDelete={handleDeleteDeliverable}
                        onStatusChange={handleDeliverableStatusChange}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <LuPackage className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">No deliverables yet</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Add deliverables to track your content creation
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Documents</h3>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                  >
                    <LuPlus className="w-5 h-5" />
                    Upload Document
                  </motion.button>
                </div>

                {deal.documents && deal.documents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {deal.documents.map((doc, index) => (
                      <div
                        key={doc._id || index}
                        className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            <LuFileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {doc.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {doc.type}
                            </p>
                          </div>
                          {doc.url && (
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                              <LuExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        {doc.aiSummary && (
                          <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {doc.aiSummary}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <LuFileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">No documents yet</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Upload contracts, briefs, and assets
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment History</h3>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                      >
                        <LuPlus className="w-5 h-5" />
                        Add Payment
                      </motion.button>
                    </div>

                    {deal.payments && deal.payments.length > 0 ? (
                      <div className="space-y-4">
                        {deal.payments.map((payment, index) => (
                          <PaymentCard
                            key={payment._id || index}
                            payment={payment}
                            currency={deal.currency}
                            onMarkPaid={handleMarkPaymentPaid}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <LuCreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 dark:text-gray-400">No payments recorded</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          Add payments to track income from this deal
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Summary Sidebar */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 h-fit">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Total Deal Value</span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        ${(deal.amount || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                        <span className="flex items-center gap-2">
                          <LuCircleCheck className="w-4 h-4" />
                          Paid
                        </span>
                        <span className="font-semibold">${totalPaid.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-orange-600 dark:text-orange-400">
                      <span className="flex items-center gap-2">
                        <LuClock className="w-4 h-4" />
                        Pending
                      </span>
                      <span className="font-semibold">${outstandingAmount.toLocaleString()}</span>
                    </div>
                    {outstandingAmount > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all"
                      >
                        Request Payment
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Communications Tab */}
            {activeTab === 'communications' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Communications</h3>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowAddNoteModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                      >
                        <LuPlus className="w-5 h-5" />
                        Add Note
                      </motion.button>
                    </div>
                    <CommunicationThread communications={deal.communications} />
                  </div>
                </div>

                {/* AI Email Generator */}
                <div>
                  <AIEmailGenerator deal={deal} />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Deliverable Modal */}
      <DeliverableModal
        isOpen={showDeliverableModal}
        onClose={() => {
          setShowDeliverableModal(false);
          setEditingDeliverable(null);
        }}
        onSubmit={handleAddDeliverable}
        deliverable={editingDeliverable}
      />

      {/* Add Note Modal */}
      <AnimatePresence>
        {showAddNoteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddNoteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add Note</h3>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows="4"
                placeholder="Write your note..."
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all resize-none mb-4"
              />
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddNote}
                  disabled={!noteContent.trim()}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                  Save Note
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddNoteModal(false)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
