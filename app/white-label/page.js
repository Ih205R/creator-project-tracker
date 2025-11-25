'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  LuPalette, LuImage, LuType, LuGlobe, LuSave, 
  LuArrowLeft, LuCrown, LuCheck, LuUpload, LuRefreshCw
} from 'react-icons/lu';

export default function WhiteLabelPage() {
  const { userProfile, user } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [branding, setBranding] = useState({
    companyName: '',
    logo: '',
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    accentColor: '#ec4899',
    customDomain: '',
    favicon: '',
    reportHeader: '',
    reportFooter: ''
  });

  const isPremium = userProfile?.subscriptionPlan === 'Premium';

  useEffect(() => {
    if (isPremium && userProfile?.branding) {
      setBranding({
        companyName: userProfile.branding.companyName || '',
        logo: userProfile.branding.logo || '',
        primaryColor: userProfile.branding.primaryColor || '#6366f1',
        secondaryColor: userProfile.branding.secondaryColor || '#8b5cf6',
        accentColor: userProfile.branding.accentColor || '#ec4899',
        customDomain: userProfile.branding.customDomain || '',
        favicon: userProfile.branding.favicon || '',
        reportHeader: userProfile.branding.reportHeader || '',
        reportFooter: userProfile.branding.reportFooter || ''
      });
    }
  }, [isPremium, userProfile]);

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <LuPalette className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            White-Label Options
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Upgrade to Premium to customize the platform with your own branding.
          </p>
          <Link
            href="/dashboard?upgrade=premium"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all"
          >
            <LuCrown className="w-5 h-5" />
            Upgrade to Premium
          </Link>
        </motion.div>
      </div>
    );
  }

  const saveBranding = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/branding`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ branding })
      });

      if (!response.ok) throw new Error('Failed to save branding');
      
      setMessage({ type: 'success', text: 'Branding settings saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save branding settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBranding({...branding, logo: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBranding({...branding, favicon: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/premium" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 mb-4">
            <LuArrowLeft className="w-4 h-4" />
            Back to Premium Features
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
              <LuPalette className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                White-Label Branding
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Customize the platform with your own brand identity
              </p>
            </div>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              message.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}
          >
            <LuCheck className="w-5 h-5" />
            {message.text}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings Form */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <LuType className="w-5 h-5 text-indigo-600" />
                Company Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={branding.companyName}
                    onChange={(e) => setBranding({...branding, companyName: e.target.value})}
                    placeholder="Your Company Name"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Custom Domain
                  </label>
                  <input
                    type="text"
                    value={branding.customDomain}
                    onChange={(e) => setBranding({...branding, customDomain: e.target.value})}
                    placeholder="app.yourcompany.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Contact support to configure your custom domain
                  </p>
                </div>
              </div>
            </div>

            {/* Logo & Favicon */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <LuImage className="w-5 h-5 text-indigo-600" />
                Logo & Favicon
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company Logo
                  </label>
                  <div className="flex items-center gap-4">
                    {branding.logo && (
                      <img src={branding.logo} alt="Logo" className="w-16 h-16 object-contain rounded-lg border-2 border-gray-200 dark:border-gray-600" />
                    )}
                    <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors">
                      <LuUpload className="w-4 h-4" />
                      Upload Logo
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Recommended: PNG or SVG, max 2MB
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Favicon
                  </label>
                  <div className="flex items-center gap-4">
                    {branding.favicon && (
                      <img src={branding.favicon} alt="Favicon" className="w-8 h-8 object-contain rounded border-2 border-gray-200 dark:border-gray-600" />
                    )}
                    <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors">
                      <LuUpload className="w-4 h-4" />
                      Upload Favicon
                      <input type="file" accept="image/*" onChange={handleFaviconUpload} className="hidden" />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Recommended: 32x32 PNG or ICO
                  </p>
                </div>
              </div>
            </div>

            {/* Color Scheme */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <LuPalette className="w-5 h-5 text-indigo-600" />
                Color Scheme
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={branding.primaryColor}
                      onChange={(e) => setBranding({...branding, primaryColor: e.target.value})}
                      className="w-16 h-10 rounded border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.primaryColor}
                      onChange={(e) => setBranding({...branding, primaryColor: e.target.value})}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={branding.secondaryColor}
                      onChange={(e) => setBranding({...branding, secondaryColor: e.target.value})}
                      className="w-16 h-10 rounded border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.secondaryColor}
                      onChange={(e) => setBranding({...branding, secondaryColor: e.target.value})}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={branding.accentColor}
                      onChange={(e) => setBranding({...branding, accentColor: e.target.value})}
                      className="w-16 h-10 rounded border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.accentColor}
                      onChange={(e) => setBranding({...branding, accentColor: e.target.value})}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Report Customization */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <LuGlobe className="w-5 h-5 text-indigo-600" />
                Report Customization
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Report Header Text
                  </label>
                  <input
                    type="text"
                    value={branding.reportHeader}
                    onChange={(e) => setBranding({...branding, reportHeader: e.target.value})}
                    placeholder="Powered by Your Company"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Report Footer Text
                  </label>
                  <input
                    type="text"
                    value={branding.reportFooter}
                    onChange={(e) => setBranding({...branding, reportFooter: e.target.value})}
                    placeholder="© 2024 Your Company. All rights reserved."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={saveBranding}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <LuRefreshCw className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <LuSave className="w-5 h-5" />
                  Save Branding Settings
                </>
              )}
            </button>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Preview
              </h2>
              <div className="space-y-4">
                {/* Logo Preview */}
                <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                  {branding.logo ? (
                    <img src={branding.logo} alt="Logo Preview" className="h-16 mx-auto object-contain" />
                  ) : (
                    <div className="h-16 flex items-center justify-center text-gray-400">
                      Logo Preview
                    </div>
                  )}
                  {branding.companyName && (
                    <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                      {branding.companyName}
                    </p>
                  )}
                </div>

                {/* Color Scheme Preview */}
                <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Color Palette
                  </p>
                  <div className="flex gap-2">
                    <div 
                      className="flex-1 h-16 rounded-lg shadow-inner"
                      style={{ backgroundColor: branding.primaryColor }}
                      title="Primary"
                    />
                    <div 
                      className="flex-1 h-16 rounded-lg shadow-inner"
                      style={{ backgroundColor: branding.secondaryColor }}
                      title="Secondary"
                    />
                    <div 
                      className="flex-1 h-16 rounded-lg shadow-inner"
                      style={{ backgroundColor: branding.accentColor }}
                      title="Accent"
                    />
                  </div>
                </div>

                {/* Button Preview */}
                <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Button Style
                  </p>
                  <button
                    className="w-full px-6 py-3 text-white rounded-lg font-medium shadow-lg transition-all"
                    style={{
                      background: `linear-gradient(to right, ${branding.primaryColor}, ${branding.secondaryColor})`
                    }}
                  >
                    Sample Button
                  </button>
                </div>

                {/* Domain Preview */}
                {branding.customDomain && (
                  <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Custom Domain
                    </p>
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                      <LuGlobe className="w-4 h-4" />
                      <span className="font-mono text-sm">{branding.customDomain}</span>
                    </div>
                  </div>
                )}

                {/* Report Preview */}
                <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Report Layout
                  </p>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center space-y-2 border-2 border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {branding.reportHeader || 'Report Header'}
                    </p>
                    <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400">
                      Report Content
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {branding.reportFooter || 'Report Footer'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
