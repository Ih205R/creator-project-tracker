'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LuUsers, LuPlus, LuMail, LuTrash2, LuCrown, LuShield, LuUserCheck } from 'react-icons/lu';
import axios from 'axios';

const ROLES = [
  { value: 'admin', label: 'Admin', description: 'Full access to all features' },
  { value: 'editor', label: 'Editor', description: 'Can edit projects and brand deals' },
  { value: 'viewer', label: 'Viewer', description: 'Can view but not edit' }
];

export default function TeamCollaborationPage() {
  const { userProfile, isPro } = useAuth();
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'editor',
    message: ''
  });

  useEffect(() => {
    // Check if user has Premium plan
    if (userProfile && userProfile.subscriptionPlan !== 'Premium') {
      router.push('/dashboard?upgrade=premium');
      return;
    }
    loadTeamMembers();
  }, [userProfile]);

  const loadTeamMembers = async () => {
    try {
      // Placeholder for actual API call
      // const response = await teamAPI.getMembers();
      // setTeamMembers(response.data);
      
      // Mock data for now - only add if userProfile exists
      if (userProfile?.email) {
        setTeamMembers([
          {
            id: '1',
            email: userProfile.email,
            role: 'owner',
            status: 'active',
            joinedAt: new Date(),
            isOwner: true
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to load team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      // Placeholder for actual API call
      // await teamAPI.invite(inviteData);
      
      alert('Invitation sent successfully!');
      setShowInviteModal(false);
      setInviteData({ email: '', role: 'editor', message: '' });
      loadTeamMembers();
    } catch (error) {
      console.error('Failed to send invitation:', error);
      alert('Failed to send invitation');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    try {
      // Placeholder for actual API call
      // await teamAPI.removeMember(memberId);
      
      setTeamMembers(teamMembers.filter(m => m.id !== memberId));
      alert('Team member removed successfully');
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner': return <LuCrown className="w-4 h-4 text-yellow-500" />;
      case 'admin': return <LuShield className="w-4 h-4 text-purple-500" />;
      default: return <LuUserCheck className="w-4 h-4 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const canInviteMore = teamMembers.length < 5;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <LuUsers className="text-indigo-600" />
              Team Collaboration
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Invite up to 5 team members to collaborate on your projects
            </p>
          </div>
          {canInviteMore && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <LuPlus className="w-5 h-5" />
              Invite Member
            </button>
          )}
        </div>

        {/* Premium Badge */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-6 mb-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <LuCrown className="w-6 h-6" />
            <h2 className="text-xl font-bold">Premium Feature</h2>
          </div>
          <p className="text-purple-100">
            Collaborate with your team in real-time. Members: {teamMembers.length}/5
          </p>
        </div>

        {/* Team Members List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Team Members ({teamMembers.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {teamMembers.map((member, index) => {
              // Safety check for member data
              if (!member || !member.email) return null;
              
              return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {member.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {member.email}
                        </h3>
                        {member.isOwner && (
                          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 text-xs font-medium rounded">
                            Owner
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {getRoleIcon(member.role)}
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {member.role}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Joined {new Date(member.joinedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!member.isOwner && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                    >
                      <LuTrash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <LuMail className="text-indigo-600" />
                Invite Team Member
              </h2>

              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteData.email}
                    onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="colleague@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role *
                  </label>
                  <select
                    required
                    value={inviteData.role}
                    onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    {ROLES.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label} - {role.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    value={inviteData.message}
                    onChange={(e) => setInviteData({ ...inviteData, message: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Join our team to collaborate on exciting projects!"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Send Invitation
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            How Team Collaboration Works
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
            <li>• Invite up to 5 team members to your workspace</li>
            <li>• Assign roles with different permission levels</li>
            <li>• Collaborate in real-time on projects and brand deals</li>
            <li>• Track team member activity and contributions</li>
            <li>• Manage access and permissions at any time</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
