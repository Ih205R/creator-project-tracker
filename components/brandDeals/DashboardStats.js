'use client';

import { motion } from 'framer-motion';
import { 
  LuDollarSign, 
  LuBriefcase, 
  LuClock, 
  LuTrendingUp,
  LuCircleCheck,
  LuChartBar,
  LuTarget
} from 'react-icons/lu';

const StatCard = ({ title, value, subtitle, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
  >
    <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8">
      <div className={`w-full h-full rounded-full ${color} opacity-10`}></div>
    </div>
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </motion.div>
);

export default function DashboardStats({ stats }) {
  const {
    totalDeals = 0,
    totalValue = 0,
    activeDeals = 0,
    outstandingAmount = 0,
    paidAmount = 0,
    winRate = 0,
    averageDealSize = 0,
    pipelineForecast = 0,
    monthlyRevenue = 0
  } = stats || {};

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Deal Value"
        value={formatCurrency(totalValue)}
        subtitle={`${totalDeals} total deals`}
        icon={LuDollarSign}
        color="bg-gradient-to-br from-green-500 to-emerald-600"
        delay={0}
      />
      <StatCard
        title="Outstanding"
        value={formatCurrency(outstandingAmount)}
        subtitle="Awaiting payment"
        icon={LuClock}
        color="bg-gradient-to-br from-orange-500 to-amber-600"
        delay={0.1}
      />
      <StatCard
        title="Monthly Revenue"
        value={formatCurrency(monthlyRevenue)}
        subtitle="This month"
        icon={LuTrendingUp}
        color="bg-gradient-to-br from-indigo-500 to-purple-600"
        delay={0.2}
      />
      <StatCard
        title="Active Deals"
        value={activeDeals}
        subtitle="In progress"
        icon={LuBriefcase}
        color="bg-gradient-to-br from-blue-500 to-cyan-600"
        delay={0.3}
      />
      <StatCard
        title="Win Rate"
        value={`${winRate}%`}
        subtitle="Deals closed"
        icon={LuCircleCheck}
        color="bg-gradient-to-br from-green-500 to-teal-600"
        delay={0.4}
      />
      <StatCard
        title="Average Deal Size"
        value={formatCurrency(averageDealSize)}
        subtitle="Per deal"
        icon={LuChartBar}
        color="bg-gradient-to-br from-purple-500 to-pink-600"
        delay={0.5}
      />
      <StatCard
        title="Pipeline Forecast"
        value={formatCurrency(pipelineForecast)}
        subtitle="Potential revenue"
        icon={LuTarget}
        color="bg-gradient-to-br from-cyan-500 to-blue-600"
        delay={0.6}
      />
      <StatCard
        title="Total Paid"
        value={formatCurrency(paidAmount)}
        subtitle="Revenue collected"
        icon={LuDollarSign}
        color="bg-gradient-to-br from-emerald-500 to-green-600"
        delay={0.7}
      />
    </div>
  );
}
