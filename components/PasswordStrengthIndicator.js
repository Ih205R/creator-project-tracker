'use client';

import { useMemo } from 'react';

export default function PasswordStrengthIndicator({ password }) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-gray-300' };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    // Calculate score
    if (checks.length) score += 20;
    if (checks.uppercase) score += 20;
    if (checks.lowercase) score += 20;
    if (checks.number) score += 20;
    if (checks.special) score += 20;

    // Determine strength level
    let label = '';
    let color = '';
    if (score < 40) {
      label = 'Weak';
      color = 'bg-red-500';
    } else if (score < 80) {
      label = 'Medium';
      color = 'bg-yellow-500';
    } else {
      label = 'Strong';
      color = 'bg-green-500';
    }

    return { score, label, color, checks };
  }, [password]);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${strength.score}%` }}
        />
      </div>

      {/* Strength label */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Password strength: <span className={`${
            strength.score < 40 ? 'text-red-500' :
            strength.score < 80 ? 'text-yellow-500' :
            'text-green-500'
          }`}>{strength.label}</span>
        </span>
      </div>

      {/* Requirements checklist */}
      <div className="text-xs space-y-1">
        <div className={`flex items-center gap-1 ${strength.checks.length ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
          <span>{strength.checks.length ? '✓' : '○'}</span>
          <span>At least 8 characters</span>
        </div>
        <div className={`flex items-center gap-1 ${strength.checks.uppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
          <span>{strength.checks.uppercase ? '✓' : '○'}</span>
          <span>One uppercase letter (A-Z)</span>
        </div>
        <div className={`flex items-center gap-1 ${strength.checks.number ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
          <span>{strength.checks.number ? '✓' : '○'}</span>
          <span>One number (0-9)</span>
        </div>
        <div className={`flex items-center gap-1 ${strength.checks.special ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
          <span>{strength.checks.special ? '✓' : '○'}</span>
          <span>One special character (!@#$%^&*...)</span>
        </div>
      </div>
    </div>
  );
}
