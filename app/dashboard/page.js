'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { projectsAPI, userAPI } from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage() {
  const { userProfile, isPro } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, projectsRes] = await Promise.all([
        userAPI.getStats(),
        projectsAPI.getAll()
      ]);

      setStats(statsRes.data.stats);
      setRecentProjects(projectsRes.data.projects.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const statCards = [
    {
      title: 'Total Projects',
      value: stats?.projects?.total || 0,
      icon: '📋',
      color: 'bg-blue-500',
    },
    {
      title: 'Brand Deals',
      value: stats?.brandDeals?.total || 0,
      icon: '💼',
      color: 'bg-green-500',
    },
    {
      title: 'Posted Content',
      value: stats?.projects?.byStatus?.find(s => s._id === 'Posted')?.count || 0,
      icon: '✅',
      color: 'bg-purple-500',
    },
    {
      title: 'In Progress',
      value: stats?.projects?.byStatus?.filter(s => ['Drafting', 'Editing'].includes(s._id))
        .reduce((sum, s) => sum + s.count, 0) || 0,
      icon: '⏳',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {userProfile?.displayName || 'Creator'}! 👋
        </h1>
        <p className="text-indigo-100">
          {isPro ? '⭐ Pro Member' : 'Free Plan'} • Track your content and grow your brand
        </p>
      </div>

      {/* Upgrade Banner for Free Users */}
      {!isPro && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                Unlock Pro Features
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300">
                Get unlimited projects, brand deals, and AI-powered tools
              </p>
            </div>
            <Link
              href="/dashboard/upgrade"
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold"
            >
              Upgrade Now
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
              {stat.title}
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/projects?action=new"
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="text-4xl mb-3">➕</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            New Project
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Create a new content project
          </p>
        </Link>

        <Link
          href="/dashboard/brand-deals?action=new"
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="text-4xl mb-3">🤝</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            New Brand Deal
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Track a new partnership
          </p>
        </Link>

        <Link
          href="/dashboard/ai-tools"
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow group relative"
        >
          <div className="text-4xl mb-3">🤖</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            AI Tools
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Generate captions & scripts
          </p>
          {!isPro && (
            <span className="absolute top-4 right-4 px-2 py-1 text-xs font-semibold text-white bg-indigo-600 rounded">
              PRO
            </span>
          )}
        </Link>
      </div>

      {/* Recent Projects */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Projects
          </h2>
          <Link
            href="/dashboard/projects"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 text-sm font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="p-6">
          {recentProjects.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No projects yet. Create your first project to get started!
            </p>
          ) : (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div
                  key={project._id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span>{project.platform}</span>
                      <span>•</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        project.status === 'Posted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        project.status === 'Scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                      }`}>
                        {project.status}
                      </span>
                      {project.priority === 'Urgent' && (
                        <span className="text-red-600 dark:text-red-400">🔥</span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/projects/${project._id}`}
                    className="px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
