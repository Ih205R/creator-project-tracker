'use client';

import { motion } from 'framer-motion';
import { 
  LuCalendar, 
  LuPencil, 
  LuTrash2,
  LuExternalLink,
  LuCheckCircle,
  LuClock,
  LuLoader,
  LuCircle
} from 'react-icons/lu';

const STATUS_CONFIG = {
  'not-started': {
    label: 'Not Started',
    icon: LuCircle,
    color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
  },
  'in-progress': {
    label: 'In Progress',
    icon: LuLoader,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  },
  'submitted': {
    label: 'Submitted',
    icon: LuClock,
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
  },
  'approved': {
    label: 'Approved',
    icon: LuCheckCircle,
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  }
};

const TYPE_LABELS = {
  'video': 'Video',
  'story': 'Story',
  'short': 'Short',
  'post': 'Post',
  'reel': 'Reel',
  'tweet': 'Tweet',
  'blog': 'Blog',
  'podcast': 'Podcast',
  'other': 'Other'
};

export default function DeliverableCard({ deliverable, onEdit, onDelete, onStatusChange }) {
  const status = STATUS_CONFIG[deliverable.status] || STATUS_CONFIG['not-started'];
  const StatusIcon = status.icon;

  const isOverdue = deliverable.deadline && 
    new Date(deliverable.deadline) < new Date() && 
    deliverable.status !== 'approved';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={`
        bg-white dark:bg-gray-800 rounded-xl border 
        ${isOverdue ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'}
        p-4 transition-all
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Type Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded uppercase">
              {TYPE_LABELS[deliverable.type] || deliverable.type}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded ${status.color}`}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </span>
          </div>

          {/* Description */}
          {deliverable.description && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              {deliverable.description}
            </p>
          )}

          {/* Deadline */}
          {deliverable.deadline && (
            <div className={`flex items-center gap-1 text-xs ${
              isOverdue 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              <LuCalendar className="w-3 h-3" />
              <span>
                Due: {new Date(deliverable.deadline).toLocaleDateString()}
                {isOverdue && ' (Overdue)'}
              </span>
            </div>
          )}

          {/* Submitted Link */}
          {deliverable.submittedLink && (
            <a
              href={deliverable.submittedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <LuExternalLink className="w-3 h-3" />
              View Submission
            </a>
          )}

          {/* Approval Notes */}
          {deliverable.approvalNotes && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
              Note: {deliverable.approvalNotes}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit?.(deliverable)}
            className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <LuPencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete?.(deliverable._id)}
            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <LuTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Status Change Buttons */}
      {deliverable.status !== 'approved' && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          {deliverable.status === 'not-started' && (
            <button
              onClick={() => onStatusChange?.(deliverable._id, 'in-progress')}
              className="flex-1 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              Start Work
            </button>
          )}
          {deliverable.status === 'in-progress' && (
            <button
              onClick={() => onStatusChange?.(deliverable._id, 'submitted')}
              className="flex-1 py-1.5 text-xs font-medium text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
            >
              Submit for Review
            </button>
          )}
          {deliverable.status === 'submitted' && (
            <button
              onClick={() => onStatusChange?.(deliverable._id, 'approved')}
              className="flex-1 py-1.5 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              Mark Approved
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
