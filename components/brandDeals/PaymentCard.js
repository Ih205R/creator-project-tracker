'use client';

import { motion } from 'framer-motion';
import { 
  LuDollarSign, 
  LuCalendar, 
  LuCheckCircle,
  LuClock,
  LuCreditCard,
  LuReceipt,
  LuExternalLink
} from 'react-icons/lu';

const STATUS_CONFIG = {
  'pending': {
    label: 'Pending',
    icon: LuClock,
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
  },
  'paid': {
    label: 'Paid',
    icon: LuCheckCircle,
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  }
};

const METHOD_LABELS = {
  'stripe': 'Stripe',
  'paypal': 'PayPal',
  'bank_transfer': 'Bank Transfer',
  'invoice': 'Invoice',
  'other': 'Other'
};

export default function PaymentCard({ payment, currency = 'USD', onMarkPaid }) {
  const status = STATUS_CONFIG[payment.status] || STATUS_CONFIG['pending'];
  const StatusIcon = status.icon;

  const isOverdue = payment.dueDate && 
    new Date(payment.dueDate) < new Date() && 
    payment.status !== 'paid';

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
        <div className="flex-1">
          {/* Amount & Status */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1 text-xl font-bold text-gray-900 dark:text-white">
              <LuDollarSign className="w-5 h-5 text-green-600" />
              {payment.amount?.toLocaleString()}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                {currency}
              </span>
            </div>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded ${status.color}`}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </span>
          </div>

          {/* Payment Method */}
          {payment.method && (
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <LuCreditCard className="w-4 h-4" />
              <span>{METHOD_LABELS[payment.method] || payment.method}</span>
            </div>
          )}

          {/* Dates */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
            {payment.dueDate && (
              <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 dark:text-red-400' : ''}`}>
                <LuCalendar className="w-3 h-3" />
                <span>
                  Due: {new Date(payment.dueDate).toLocaleDateString()}
                  {isOverdue && ' (Overdue)'}
                </span>
              </div>
            )}
            {payment.paidAt && (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <LuCheckCircle className="w-3 h-3" />
                <span>Paid: {new Date(payment.paidAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Receipt Link */}
          {payment.receiptUrl && (
            <a
              href={payment.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <LuReceipt className="w-3 h-3" />
              View Receipt
              <LuExternalLink className="w-3 h-3" />
            </a>
          )}

          {/* Notes */}
          {payment.notes && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
              {payment.notes}
            </p>
          )}
        </div>
      </div>

      {/* Mark as Paid Button */}
      {payment.status === 'pending' && onMarkPaid && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onMarkPaid(payment._id)}
          className="w-full mt-3 py-2 text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
        >
          <span className="flex items-center justify-center gap-2">
            <LuCheckCircle className="w-4 h-4" />
            Mark as Paid
          </span>
        </motion.button>
      )}
    </motion.div>
  );
}
