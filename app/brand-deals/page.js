'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { brandDealsAPI } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LuBriefcase, 
  LuPlus, 
  LuSearch,
  LuFilter,
  LuArrowLeft,
  LuSparkles,
  LuLayoutGrid,
  LuList,
  LuGripVertical,
  LuChevronDown
} from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import DealCard from '@/components/brandDeals/DealCard';
import DealModal from '@/components/brandDeals/DealModal';
import DashboardStats from '@/components/brandDeals/DashboardStats';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const STAGES = [
  { id: 'lead', label: 'Lead', color: 'from-gray-400 to-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-800/50' },
  { id: 'negotiation', label: 'Negotiation', color: 'from-yellow-400 to-orange-500', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { id: 'contract', label: 'Contract', color: 'from-blue-400 to-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 'active', label: 'Active', color: 'from-indigo-500 to-purple-600', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' },
  { id: 'completed', label: 'Completed', color: 'from-green-400 to-emerald-600', bgColor: 'bg-green-50 dark:bg-green-900/20' },
  { id: 'paid', label: 'Paid', color: 'from-emerald-500 to-green-600', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' }
];

export default function BrandDealsPage() {
  const router = useRouter();
  const { userProfile, isPro } = useAuth();
  const [deals, setDeals] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [viewMode, setViewMode] = useState('kanban');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadDeals();
    loadStats();
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

  const loadStats = async () => {
    try {
      const response = await brandDealsAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingDeal) {
        await brandDealsAPI.update(editingDeal._id, formData);
      } else {
        await brandDealsAPI.create(formData);
      }
      setShowModal(false);
      setEditingDeal(null);
      loadDeals();
      loadStats();
    } catch (error) {
      console.error('Failed to save brand deal:', error);
      throw error;
    }
  };

  const handleEdit = (deal) => {
    setEditingDeal(deal);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this brand deal?')) return;
    try {
      await brandDealsAPI.delete(id);
      loadDeals();
      loadStats();
    } catch (error) {
      console.error('Failed to delete brand deal:', error);
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const newStage = destination.droppableId;
    
    // Optimistically update the UI
    setDeals(prevDeals => 
      prevDeals.map(deal => 
        deal._id === draggableId 
          ? { ...deal, stage: newStage }
          : deal
      )
    );

    try {
      await brandDealsAPI.updateStage(draggableId, newStage);
      loadStats();
    } catch (error) {
      console.error('Failed to update deal stage:', error);
      loadDeals(); // Revert on error
    }
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = 
      deal.brandName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.dealName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = filterStage === 'all' || deal.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  const getDealsByStage = useCallback((stageId) => {
    return filteredDeals.filter(deal => deal.stage === stageId);
  }, [filteredDeals]);

  const getStageTotal = (stageId) => {
    return getDealsByStage(stageId).reduce((sum, deal) => sum + (deal.amount || 0), 0);
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
          <p className="text-gray-600 dark:text-gray-400">Loading deals...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/20">
      <div className="max-w-full mx-auto px-4 sm:px-6 py-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
        >
          <LuArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </motion.button>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
              <LuBriefcase className="text-indigo-600" />
              Brand Deals Pipeline
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your brand partnerships from lead to payment
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'kanban' 
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <LuLayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <LuList className="w-5 h-5" />
              </button>
            </div>

            {/* New Deal Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setEditingDeal(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              <LuPlus className="w-5 h-5" />
              New Deal
            </motion.button>
          </div>
        </motion.div>

        {/* AI Insights Banner */}
        {isPro && deals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-pink-500/20 rounded-2xl border border-indigo-200/50 dark:border-indigo-500/20"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                <LuSparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">AI Insights</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  {stats.pipelineForecast > 0 
                    ? `You have $${stats.pipelineForecast?.toLocaleString()} in your pipeline. ${stats.winRate}% of your deals convert successfully.`
                    : 'Start adding deals to get personalized insights and recommendations.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <DashboardStats stats={stats} />
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          {/* Search */}
          <div className="relative flex-1">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search deals by brand or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <LuFilter className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {filterStage === 'all' ? 'All Stages' : STAGES.find(s => s.id === filterStage)?.label}
              </span>
              <LuChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 overflow-hidden"
                >
                  <button
                    onClick={() => { setFilterStage('all'); setShowFilters(false); }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      filterStage === 'all' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    All Stages
                  </button>
                  {STAGES.map(stage => (
                    <button
                      key={stage.id}
                      onClick={() => { setFilterStage(stage.id); setShowFilters(false); }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        filterStage === stage.id ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {stage.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Kanban Board */}
        {viewMode === 'kanban' ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4 min-w-max">
                {STAGES.map((stage, stageIndex) => {
                  const stageDeals = getDealsByStage(stage.id);
                  const stageTotal = getStageTotal(stage.id);

                  return (
                    <motion.div
                      key={stage.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: stageIndex * 0.05 }}
                      className="flex-shrink-0 w-80"
                    >
                      {/* Stage Header */}
                      <div className={`rounded-t-xl p-4 ${stage.bgColor}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${stage.color}`}></div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {stage.label}
                            </h3>
                            <span className="px-2 py-0.5 text-xs font-medium bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 rounded-full">
                              {stageDeals.length}
                            </span>
                          </div>
                        </div>
                        {stageTotal > 0 && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ${stageTotal.toLocaleString()}
                          </p>
                        )}
                      </div>

                      {/* Droppable Area */}
                      <Droppable droppableId={stage.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`
                              min-h-[400px] p-3 rounded-b-xl border-2 border-t-0 transition-colors
                              ${snapshot.isDraggingOver 
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-500/50' 
                                : 'bg-gray-50/50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700'}
                            `}
                          >
                            <div className="space-y-3">
                              {stageDeals.map((deal, index) => (
                                <Draggable key={deal._id} draggableId={deal._id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <DealCard
                                        deal={deal}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        isDragging={snapshot.isDragging}
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>

                            {stageDeals.length === 0 && (
                              <div className="flex flex-col items-center justify-center h-32 text-gray-400 dark:text-gray-500">
                                <LuGripVertical className="w-8 h-8 mb-2 opacity-50" />
                                <p className="text-sm">Drop deals here</p>
                              </div>
                            )}
                          </div>
                        )}
                      </Droppable>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </DragDropContext>
        ) : (
          /* List View */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {filteredDeals.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                <LuBriefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No deals found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchQuery || filterStage !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Start by creating your first brand deal'}
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  Create Your First Deal
                </motion.button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredDeals.map((deal, index) => (
                  <motion.div
                    key={deal._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <DealCard
                      deal={deal}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Empty State for Kanban */}
        {viewMode === 'kanban' && deals.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center"
          >
            <LuBriefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Start Building Your Pipeline
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Track brand deals from initial contact through payment. Drag and drop to move deals through stages.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
            >
              Create Your First Deal
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Deal Modal */}
      <DealModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingDeal(null);
        }}
        onSubmit={handleSubmit}
        deal={editingDeal}
      />
    </div>
  );
}
