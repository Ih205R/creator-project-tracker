import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SettingsScreen({ navigation }) {
  const { user, userProfile, isPro, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const settingsOptions = [
    { 
      title: 'Account Settings', 
      icon: 'person-outline', 
      subtitle: user?.email || 'Not logged in',
      color: '#6366F1'
    },
    { 
      title: 'Notifications', 
      icon: 'notifications-outline', 
      subtitle: 'Manage your notifications',
      color: '#10B981'
    },
    { 
      title: 'Subscription', 
      icon: 'star-outline', 
      subtitle: isPro ? '⭐ Pro Plan' : 'Free Plan',
      color: '#F59E0B',
      badge: isPro ? null : 'Upgrade'
    },
    { 
      title: 'Privacy & Security', 
      icon: 'lock-closed-outline', 
      subtitle: 'Manage your privacy settings',
      color: '#8B5CF6'
    },
    { 
      title: 'Help & Support', 
      icon: 'help-circle-outline', 
      subtitle: 'Get help with the app',
      color: '#06B6D4'
    },
    { 
      title: 'About', 
      icon: 'information-circle-outline', 
      subtitle: 'Version 1.0.0',
      color: '#6B7280'
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.avatar, isPro && styles.avatarPro]}>
          <Text style={styles.avatarText}>
            {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 
             user?.displayName ? user.displayName.charAt(0).toUpperCase() : '?'}
          </Text>
          {isPro && (
            <View style={styles.proStarContainer}>
              <Icon name="star" size={16} color="#F59E0B" />
            </View>
          )}
        </View>
        <Text style={styles.userName}>
          {userProfile?.displayName || user?.displayName || 'User'}
        </Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>
        
        {isPro && (
          <View style={styles.proBadgeContainer}>
            <Icon name="star" size={14} color="#F59E0B" />
            <Text style={styles.proBadgeText}>Pro Member</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            activeOpacity={0.7}
            onPress={() => {}}
          >
            <View style={[styles.optionIconContainer, { backgroundColor: option.color + '20' }]}>
              <Icon name={option.icon} size={24} color={option.color} />
            </View>
            <View style={styles.optionContent}>
              <View style={styles.optionTitleRow}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                {option.badge && (
                  <View style={styles.optionBadge}>
                    <Text style={styles.optionBadgeText}>{option.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>

      {!isPro && (
        <TouchableOpacity style={styles.upgradeButton}>
          <Icon name="sparkles" size={20} color="#FFFFFF" />
          <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out-outline" size={20} color="#EF4444" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Creator Project Tracker</Text>
        <Text style={styles.footerSubtext}>© 2024 All rights reserved</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  avatarPro: {
    borderWidth: 3,
    borderColor: '#F59E0B',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  proStarContainer: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  proBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  proBadgeText: {
    marginLeft: 6,
    color: '#92400E',
    fontWeight: '700',
    fontSize: 14,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },
  optionBadge: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  optionBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    padding: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
