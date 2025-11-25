'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LuWandSparkles, 
  LuMail,
  LuCopy,
  LuCheck,
  LuLoader,
  LuRefreshCw
} from 'react-icons/lu';

const EMAIL_TYPES = [
  { value: 'negotiation', label: 'Negotiation', description: 'Negotiate terms and pricing' },
  { value: 'follow-up', label: 'Follow-up', description: 'Check in on the deal status' },
  { value: 'payment-request', label: 'Payment Request', description: 'Request pending payment' },
  { value: 'deliverable-submission', label: 'Deliverable Submission', description: 'Submit completed work' }
];

export default function AIEmailGenerator({ deal, onEmailGenerated }) {
  const [selectedType, setSelectedType] = useState('follow-up');
  const [customNotes, setCustomNotes] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Using local template generation for immediate response.
      // The backend aiService.js provides full OpenAI integration for production use.
      const email = generateLocalEmail(selectedType, deal, customNotes);
      setGeneratedEmail(email);
      onEmailGenerated?.(email);
    } catch (err) {
      setError('Failed to generate email. Please try again.');
      console.error('Email generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateLocalEmail = (type, deal, notes) => {
    const brandName = deal?.brandName || 'Brand';
    const dealValue = deal?.amount || 0;
    const contactPerson = deal?.contactPerson || 'there';

    const templates = {
      'negotiation': {
        subject: `Partnership Proposal - ${brandName} Collaboration`,
        body: `Hi ${contactPerson},

Thank you for reaching out regarding a potential partnership with ${brandName}. I'm excited about the opportunity to collaborate!

Based on my audience demographics and engagement rates, I'd like to propose a partnership valued at $${dealValue.toLocaleString()}. This would include:

- High-quality content across agreed platforms
- Authentic integration with my content style
- Detailed performance analytics post-campaign

${notes ? `Additional notes: ${notes}\n\n` : ''}I'm open to discussing the terms and finding a structure that works for both of us.

Looking forward to your thoughts!

Best regards`
      },
      'follow-up': {
        subject: `Following Up - ${brandName} Partnership`,
        body: `Hi ${contactPerson},

I hope this email finds you well. I wanted to follow up on our previous conversation about the ${brandName} partnership.

I'm still very interested in moving forward and wanted to check if there were any updates on your end or if you needed any additional information from me.

${notes ? `${notes}\n\n` : ''}Please let me know the best next steps.

Best regards`
      },
      'payment-request': {
        subject: `Payment Request - ${brandName} Campaign`,
        body: `Hi ${contactPerson},

I hope you're doing well. I'm reaching out regarding the payment for our recent ${brandName} campaign.

The total amount of $${dealValue.toLocaleString()} is now due for payment. Please find the invoice attached or let me know if you need any additional documentation.

${notes ? `${notes}\n\n` : ''}Payment can be made via [your preferred method]. Please let me know once the payment has been processed.

Thank you for the great collaboration!

Best regards`
      },
      'deliverable-submission': {
        subject: `Deliverable Submission - ${brandName} Campaign`,
        body: `Hi ${contactPerson},

I'm excited to share the completed deliverables for our ${brandName} campaign!

You can find the content at the links below:
[Insert content links here]

Please review and let me know if any revisions are needed. I'm happy to make adjustments based on your feedback.

${notes ? `Additional notes: ${notes}\n\n` : ''}Looking forward to your approval!

Best regards`
      }
    };

    return templates[type] || templates['follow-up'];
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
          <LuWandSparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">AI Email Generator</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Generate professional emails</p>
        </div>
      </div>

      {/* Email Type Selection */}
      <div className="space-y-3 mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Email Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {EMAIL_TYPES.map(type => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`p-3 text-left rounded-xl border-2 transition-all ${
                selectedType === type.value
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className={`text-sm font-medium ${
                selectedType === type.value 
                  ? 'text-indigo-700 dark:text-indigo-400' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {type.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {type.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Notes */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
          Additional Context (optional)
        </label>
        <textarea
          value={customNotes}
          onChange={(e) => setCustomNotes(e.target.value)}
          rows="2"
          placeholder="Add any specific points you want to include..."
          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all resize-none"
        />
      </div>

      {/* Generate Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGenerate}
        disabled={loading}
        className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <LuLoader className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <LuWandSparkles className="w-5 h-5" />
            Generate Email
          </>
        )}
      </motion.button>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Generated Email */}
      <AnimatePresence>
        {generatedEmail && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <LuMail className="w-4 h-4" />
                Generated Email
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerate}
                  className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Regenerate"
                >
                  <LuRefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCopy(`Subject: ${generatedEmail.subject}\n\n${generatedEmail.body}`)}
                  className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <LuCheck className="w-4 h-4 text-green-500" /> : <LuCopy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Subject */}
            <div className="mb-3">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Subject
              </label>
              <div className="mt-1 p-2 bg-white dark:bg-gray-800 rounded-lg text-sm text-gray-900 dark:text-white">
                {generatedEmail.subject}
              </div>
            </div>

            {/* Body */}
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Body
              </label>
              <div className="mt-1 p-3 bg-white dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-64 overflow-y-auto">
                {generatedEmail.body}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
