'use client';

import { motion } from 'framer-motion';
import { 
  LuDollarSign, 
  LuCalendar, 
  LuEye,
  LuMoreVertical,
  LuPencil,
  LuTrash2,
  LuArrowRight
} from 'react-icons/lu';
import Link from 'next/link';

const PLATFORM_COLORS = {
  youtube: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  instagram: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  tiktok: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  twitter: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  facebook: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  linkedin: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  blog: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  podcast: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
};

const PAYMENT_TERMS_LABELS = {
  'upfront': 'Upfront',
  'net-15': 'Net 15',
  'net-30': 'Net 30',
  'net-60': 'Net 60',
  'milestone': 'Milestone',
  'upon-completion': 'On Completion',
  'other': 'Custom'
};

export default function DealCard({ deal, onEdit, onDelete, isDragging }) {
  const deliverablesCount = deal.deliverables?.length || 0;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isDragging ? 1.02 : 1,
        boxShadow: isDragging 
          ? '0 20px 40px rgba(0,0,0,0.2)' 
          : '0 1px 3px rgba(0,0,0,0.1)'
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={`
        bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
        p-4 cursor-grab active:cursor-grabbing transition-colors
        ${isDragging ? 'ring-2 ring-indigo-500 ring-opacity-50' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {deal.dealName || deal.brandName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {deal.brandName}
          </p>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <Link
            href={`/brand-deals/${deal._id}`}
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <LuEye className="w-4 h-4" />
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(deal);
            }}
            className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <LuPencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(deal._id);
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <LuTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Deal Value */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
          <LuDollarSign className="w-4 h-4" />
          <span>{(deal.amount || 0).toLocaleString()}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
            {deal.currency || 'USD'}
          </span>
        </div>
        {deal.paymentTerms && (
          <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
            {PAYMENT_TERMS_LABELS[deal.paymentTerms] || deal.paymentTerms}
          </span>
        )}
      </div>

      {/* Platforms */}
      {deal.platforms && deal.platforms.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {deal.platforms.slice(0, 3).map((platform) => (
            <span
              key={platform}
              className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${
                PLATFORM_COLORS[platform] || PLATFORM_COLORS.other
              }`}
            >
              {platform}
            </span>
          ))}
          {deal.platforms.length > 3 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
              +{deal.platforms.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        {deliverablesCount > 0 && (
          <span>{deliverablesCount} deliverable{deliverablesCount !== 1 ? 's' : ''}</span>
        )}
        {deal.paymentDueDate && (
          <div className="flex items-center gap-1">
            <LuCalendar className="w-3 h-3" />
            <span>{new Date(deal.paymentDueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Quick View Link */}
      <Link
        href={`/brand-deals/${deal._id}`}
        onClick={(e) => e.stopPropagation()}
        className="mt-3 flex items-center justify-center gap-1 w-full py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
      >
        View Details
        <LuArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}
