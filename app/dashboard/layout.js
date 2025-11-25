'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { 
  LuBell, 
  LuSun, 
  LuMoon, 
  LuLayoutDashboard,
  LuClipboardList,
  LuCalendar,
  LuBriefcase,
  LuSparkles,
  LuUser,
  LuSettings,
  LuChartBar,
  LuPalette,
  LuLink,
  LuUsers,
  LuStar
} from 'react-icons/lu';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { user, userProfile, loading, signOut, isPro } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Debug logging for userProfile and isPro
  useEffect(() => {
    if (userProfile) {
      console.log('🎨 Dashboard Layout - User Profile:', {
        email: userProfile.email,
        role: userProfile.role,
        subscriptionStatus: userProfile.subscriptionStatus,
        subscriptionPlan: userProfile.subscriptionPlan,
        subscriptionPeriodEnd: userProfile.subscriptionPeriodEnd,
        isPro: isPro,
        displayName: userProfile.displayName
      });
    } else {
      console.log('🎨 Dashboard Layout - No user profile yet');
    }
  }, [userProfile, isPro]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LuLayoutDashboard },
    { name: 'Projects', href: '/dashboard/projects', icon: LuClipboardList },
    { name: 'Brand Deals', href: '/brand-deals', icon: LuBriefcase },
    { name: 'Calendar', href: '/dashboard/calendar', icon: LuCalendar },
    { name: 'Team', href: '/team', icon: LuUsers, proBadge: true, premiumOnly: true },
    { name: 'Premium Features', href: '/premium', icon: LuStar, proBadge: true, premiumOnly: true },
    { name: 'AI Tools', href: '/dashboard/ai-tools', icon: LuSparkles, proBadge: true },
    { name: 'Analytics', href: '/dashboard/analytics', icon: LuChartBar, proBadge: true },
    { name: 'Branding', href: '/dashboard/branding', icon: LuPalette, proBadge: true },
    { name: 'Integrations', href: '/dashboard/integrations', icon: LuLink, proBadge: true },
    { name: 'Profile', href: '/dashboard/profile', icon: LuUser },
    { name: 'Settings', href: '/dashboard/settings', icon: LuSettings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Creator Tracker
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation
              .filter(item => !item.premiumOnly || isPro)
              .map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <div className="flex items-center">
                      <Icon className="mr-3 w-5 h-5 stroke-2" />
                      {item.name}
                    </div>
                    {item.proBadge && !isPro && (
                      <span className="px-2 py-1 text-xs font-semibold text-white bg-indigo-600 rounded">
                        PRO
                      </span>
                    )}
                    {item.proBadge && isPro && item.premiumOnly && (
                      <span className="px-2 py-1 text-xs font-semibold text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200 rounded">
                        ⭐
                      </span>
                    )}
                  </Link>
                );
              })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center flex-1">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {userProfile?.displayName?.[0] || user.email?.[0].toUpperCase()}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                    {userProfile?.displayName || 'User'}
                  </p>
                  {isPro && userProfile?.subscriptionPlan ? (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                        ⭐ {userProfile.subscriptionPlan}
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Free Plan
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {!isPro && (
              <Link
                href="/dashboard/upgrade"
                className="block w-full px-4 py-2 text-sm text-center text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 mb-2 transition-all"
              >
                ✨ Upgrade to Pro
              </Link>
            )}
            
            <button
              onClick={handleSignOut}
              className="block w-full px-4 py-2 text-sm text-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <LuSun className="w-6 h-6 stroke-2" />
              ) : (
                <LuMoon className="w-6 h-6 stroke-2" />
              )}
            </button>

            {/* Notifications */}
            <Link
              href="/dashboard/notifications"
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative transition-colors"
              aria-label="Notifications"
            >
              <LuBell className="w-6 h-6 stroke-2" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
