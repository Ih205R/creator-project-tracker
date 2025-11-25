import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashboardScreen({ navigation }) {
  const { user, userProfile, isPro } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const apiUrl = 'http://10.0.2.2:5000';
      
      const response = await fetch(`${apiUrl}/api/user/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const statCards = [
    { 
      label: 'Active Projects', 
      value: stats?.projects?.total || '0', 
      icon: 'clipboard-outline', 
      color: '#6366F1',
      bgColor: '#EEF2FF'
    },
    { 
      label: 'Upcoming Deadlines', 
      value: stats?.calendar?.upcoming || '0', 
      icon: 'time-outline', 
      color: '#F59E0B',
      bgColor: '#FEF3C7'
    },
    { 
      label: 'Brand Deals', 
      value: stats?.brandDeals?.total || '0', 
      icon: 'briefcase-outline', 
      color: '#10B981',
      bgColor: '#D1FAE5'
    },
    { 
      label: 'Notifications', 
      value: stats?.notifications?.unread || '0', 
      icon: 'notifications-outline', 
      color: '#8B5CF6',
      bgColor: '#F3E8FF'
    },
  ];

  const displayName = userProfile?.displayName || user?.displayName || 'Creator';

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6366F1']} />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Welcome back! 👋</Text>
            <Text style={styles.userName}>{displayName}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="notifications-outline" size={24} color="#1F2937" />
            {stats?.notifications?.unread > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{stats.notifications.unread}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        {isPro && (
          <View style={styles.proBadgeContainer}>
            <Icon name="star" size={16} color="#F59E0B" />
            <Text style={styles.proBadgeText}>Pro Member</Text>
          </View>
        )}
        
        {!isPro && (
          <TouchableOpacity style={styles.upgradeButton}>
            <Icon name="sparkles-outline" size={16} color="#6366F1" />
            <Text style={styles.upgradeText}>Upgrade to Pro</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.statsGrid}>
        {statCards.map((stat, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.statCard, { borderLeftColor: stat.color }]}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: stat.bgColor }]}>
              <Icon name={stat.icon} size={24} color={stat.color} />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.activityCard}>
          <Icon name="information-circle" size={48} color="#6B7280" />
          <Text style={styles.activityText}>Your recent activity will appear here</Text>
          <Text style={styles.activitySubtext}>Start by creating a project or scheduling an event</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIconContainer}>
              <Icon name="add-circle" size={24} color="#6366F1" />
            </View>
            <Text style={styles.actionText}>New Project</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIconContainer}>
              <Icon name="calendar-outline" size={24} color="#10B981" />
            </View>
            <Text style={styles.actionText}>Add Event</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIconContainer}>
              <Icon name="briefcase-outline" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.actionText}>Track Deal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIconContainer}>
              <Icon name="sparkles-outline" size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.actionText}>AI Tools</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomPadding} />
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
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  proBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  proBadgeText: {
    marginLeft: 6,
    color: '#92400E',
    fontWeight: '600',
    fontSize: 14,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  upgradeText: {
    marginLeft: 8,
    color: '#6366F1',
    fontWeight: '600',
    fontSize: 14,
  },
  statsGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activityText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  activitySubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    backgroundColor: '#F9FAFB',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 20,
  },
});
