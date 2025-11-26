'use client';

import { motion } from 'framer-motion';
import { 
  LuMail, 
  LuMessageSquare,
  LuStickyNote,
  LuCalendar,
  LuPaperclip,
  LuUser
} from 'react-icons/lu';

const TYPE_CONFIG = {
  'email': {
    icon: LuMail,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    label: 'Email'
  },
  'message': {
    icon: LuMessageSquare,
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    label: 'Message'
  },
  'note': {
    icon: LuStickyNote,
    color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    label: 'Note'
  }
};

function CommunicationItem({ communication, index }) {
  const config = TYPE_CONFIG[communication.type] || TYPE_CONFIG['note'];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative pl-8 pb-6"
    >
      {/* Timeline Line */}
      <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
      
      {/* Timeline Dot */}
      <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ${config.color}`}>
        <Icon className="w-3 h-3" />
      </div>

      {/* Content Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            {communication.subject && (
              <h4 className="font-medium text-gray-900 dark:text-white">
                {communication.subject}
              </h4>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${config.color}`}>
                {config.label}
              </span>
              {communication.from && (
                <span className="flex items-center gap-1">
                  <LuUser className="w-3 h-3" />
                  {communication.from}
                </span>
              )}
              {communication.to && (
                <span>→ {communication.to}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <LuCalendar className="w-3 h-3" />
            {communication.date 
              ? new Date(communication.date).toLocaleDateString() 
              : 'No date'}
          </div>
        </div>

        {/* Content */}
        <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {communication.content}
        </div>

        {/* Attachments */}
        {communication.attachments && communication.attachments.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <LuPaperclip className="w-3 h-3" />
              Attachments
            </div>
            <div className="flex flex-wrap gap-2">
              {communication.attachments.map((attachment, i) => (
                <a
                  key={i}
                  href={attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Attachment {i + 1}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function CommunicationThread({ communications = [] }) {
  if (!communications || communications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <LuMessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No communications yet</p>
        <p className="text-sm">Add notes or track emails for this deal</p>
      </div>
    );
  }

  // Sort by date, newest first
  const sortedCommunications = [...communications].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="space-y-0">
      {sortedCommunications.map((communication, index) => (
        <CommunicationItem
          key={communication._id || index}
          communication={communication}
          index={index}
        />
      ))}
    </div>
  );
}
