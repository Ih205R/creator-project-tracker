'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { 
  LuPalette, 
  LuImage, 
  LuType, 
  LuSave, 
  LuUpload,
  LuCrown,
  LuCheck,
  LuCopy,
  LuRefreshCw,
  LuSparkles
} from 'react-icons/lu';

export default function BrandingPage() {
  const { isPro, user } = useAuth();
  const [brandSettings, setBrandSettings] = useState({
    logoUrl: '',
    primaryColor: '#6366f1',
    secondaryColor: '#ec4899',
    accentColor: '#10b981',
    fontFamily: 'Inter',
    brandName: '',
    tagline: '',
    website: ''
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const colorPresets = [
    { name: 'Vibrant', colors: ['#6366f1', '#ec4899', '#10b981'] },
    { name: 'Ocean', colors: ['#0ea5e9', '#06b6d4', '#14b8a6'] },
    { name: 'Sunset', colors: ['#f97316', '#ef4444', '#fbbf24'] },
    { name: 'Forest', colors: ['#10b981', '#059669', '#84cc16'] },
    { name: 'Royal', colors: ['#8b5cf6', '#a855f7', '#d946ef'] },
    { name: 'Monochrome', colors: ['#1f2937', '#6b7280', '#9ca3af'] }
  ];

  const fontOptions = [
    'Inter',
    'Roboto',
    'Poppins',
    'Montserrat',
    'Open Sans',
    'Lato',
    'Playfair Display',
    'Raleway'
  ];

  const templates = [
    {
      id: 1,
      name: 'Modern Minimalist',
      primary: '#000000',
      secondary: '#ffffff',
      accent: '#6366f1',
      font: 'Inter'
    },
    {
      id: 2,
      name: 'Bright & Bold',
      primary: '#ec4899',
      secondary: '#fbbf24',
      accent: '#8b5cf6',
      font: 'Poppins'
    },
    {
      id: 3,
      name: 'Professional',
      primary: '#1e40af',
      secondary: '#3b82f6',
      accent: '#60a5fa',
      font: 'Roboto'
    },
    {
      id: 4,
      name: 'Nature',
      primary: '#059669',
      secondary: '#10b981',
      accent: '#84cc16',
      font: 'Montserrat'
    }
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/branding`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brandSettings),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert('Failed to save branding settings');
      }
    } catch (error) {
      console.error('Failed to save branding:', error);
      alert('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrandSettings({ ...brandSettings, logoUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const applyTemplate = (template) => {
    setBrandSettings({
      ...brandSettings,
      primaryColor: template.primary,
      secondaryColor: template.secondary,
      accentColor: template.accent,
      fontFamily: template.font
    });
  };

  if (!isPro) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-12 max-w-2xl mx-auto border border-purple-200 dark:border-purple-900">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="text-7xl mb-6"
          >
            🎨
          </motion.div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Custom Branding - Pro Feature
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Upgrade to Pro to customize your brand colors, fonts, logo, and create a consistent brand identity!
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <LuPalette className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Brand Colors</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Customize your color palette
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <LuType className="w-12 h-12 text-pink-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Custom Fonts</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose your brand typography
              </p>
            </div>
          </div>
          <Link
            href="/upgrade"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Upgrade to Pro Now
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <LuPalette className="w-8 h-8 text-purple-600" />
            Brand Customization
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create a consistent brand identity across all your content
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saved ? (
            <>
              <LuCheck className="w-5 h-5" />
              Saved!
            </>
          ) : saving ? (
            <>
              <LuRefreshCw className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <LuSave className="w-5 h-5" />
              Save Changes
            </>
          )}
        </motion.button>
      </div>

      {/* Brand Templates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <LuSparkles className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Quick Templates
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Start with a pre-designed template and customize it to match your brand
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {templates.map((template) => (
            <motion.button
              key={template.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => applyTemplate(template)}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-left hover:shadow-lg transition-all"
            >
              <div className="flex gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: template.primary }}
                />
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: template.secondary }}
                />
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: template.accent }}
                />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {template.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {template.font}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Logo Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <LuImage className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Brand Logo
            </h2>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            {brandSettings.logoUrl ? (
              <div className="space-y-4">
                <img
                  src={brandSettings.logoUrl}
                  alt="Brand Logo"
                  className="max-h-32 mx-auto"
                />
                <button
                  onClick={() => setBrandSettings({ ...brandSettings, logoUrl: '' })}
                  className="text-red-600 hover:text-red-700 font-semibold"
                >
                  Remove Logo
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <LuUpload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-900 dark:text-white font-semibold mb-1">
                  Upload your logo
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  PNG, JPG, or SVG (max 2MB)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Brand Name
              </label>
              <input
                type="text"
                value={brandSettings.brandName}
                onChange={(e) => setBrandSettings({ ...brandSettings, brandName: e.target.value })}
                placeholder="Your Brand Name"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={brandSettings.tagline}
                onChange={(e) => setBrandSettings({ ...brandSettings, tagline: e.target.value })}
                placeholder="Your brand tagline"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website
              </label>
              <input
                type="url"
                value={brandSettings.website}
                onChange={(e) => setBrandSettings({ ...brandSettings, website: e.target.value })}
                placeholder="https://yourdomain.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </motion.div>

        {/* Color Palette */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <LuPalette className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Color Palette
            </h2>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Primary Color
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={brandSettings.primaryColor}
                  onChange={(e) => setBrandSettings({ ...brandSettings, primaryColor: e.target.value })}
                  className="w-20 h-10 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={brandSettings.primaryColor}
                  onChange={(e) => setBrandSettings({ ...brandSettings, primaryColor: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Secondary Color
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={brandSettings.secondaryColor}
                  onChange={(e) => setBrandSettings({ ...brandSettings, secondaryColor: e.target.value })}
                  className="w-20 h-10 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={brandSettings.secondaryColor}
                  onChange={(e) => setBrandSettings({ ...brandSettings, secondaryColor: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Accent Color
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={brandSettings.accentColor}
                  onChange={(e) => setBrandSettings({ ...brandSettings, accentColor: e.target.value })}
                  className="w-20 h-10 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={brandSettings.accentColor}
                  onChange={(e) => setBrandSettings({ ...brandSettings, accentColor: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setBrandSettings({
                      ...brandSettings,
                      primaryColor: preset.colors[0],
                      secondaryColor: preset.colors[1],
                      accentColor: preset.colors[2]
                    });
                  }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 hover:shadow-md transition-all"
                >
                  <div className="flex gap-1 mb-1">
                    {preset.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="flex-1 h-6 rounded"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {preset.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Font Selection */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <LuType className="w-5 h-5 text-pink-600" />
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Brand Font
              </label>
            </div>
            <select
              value={brandSettings.fontFamily}
              onChange={(e) => setBrandSettings({ ...brandSettings, fontFamily: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              {fontOptions.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>
        </motion.div>
      </div>

      {/* Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Brand Preview
        </h2>
        <div
          className="rounded-lg p-8 text-center"
          style={{
            background: `linear-gradient(135deg, ${brandSettings.primaryColor}, ${brandSettings.secondaryColor})`,
            fontFamily: brandSettings.fontFamily
          }}
        >
          {brandSettings.logoUrl && (
            <img
              src={brandSettings.logoUrl}
              alt="Logo"
              className="max-h-16 mx-auto mb-4"
            />
          )}
          <h1 className="text-4xl font-bold text-white mb-2">
            {brandSettings.brandName || 'Your Brand Name'}
          </h1>
          <p className="text-white/90 text-lg mb-6">
            {brandSettings.tagline || 'Your inspiring tagline goes here'}
          </p>
          <div className="flex justify-center gap-4">
            <button
              className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: brandSettings.accentColor }}
            >
              Call to Action
            </button>
            <button className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg font-semibold text-white transition-all hover:bg-white/30">
              Learn More
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
