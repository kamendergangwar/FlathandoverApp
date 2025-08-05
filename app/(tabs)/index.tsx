

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';
import { Calendar, MapPin, Chrome as Home, CircleCheck as CheckCircle, Clock, TriangleAlert as AlertTriangle, ArrowRight, Search, FileText, Globe } from 'lucide-react-native';
import LoginIcon from '../components/LoginIcon';

export default function Dashboard() {
  const { user } = useAuth();
  const { currentFlat, language, setLanguage, t } = useApp();
  const router = useRouter();

  const stats = [
    { label: t('pending_handovers'), value: '5', color: '#f59e0b', icon: Clock },
    { label: t('completed_today'), value: '3', color: '#059669', icon: CheckCircle },
    { label: t('on_hold'), value: '2', color: '#dc2626', icon: AlertTriangle },
  ];

  const handleProceedToChecklist = () => {
    if (currentFlat) {
      router.push(`/checklist/${currentFlat.applicationNo}`);
    }
  };

  return (
  
 <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar backgroundColor="#1e40af" barStyle="light-content" />
      <LinearGradient
        colors={['#1e40af', '#2563eb']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <LoginIcon width={100} height={50} fill="#ffffff" />
            {user?.name && (
              <View style={styles.userInfo}>
                <Text style={styles.agentName}>{user.name}</Text>
                <View style={[styles.statusIndicator, { backgroundColor: user.isActive ? '#059669' : '#dc2626' }]}>
                  <Text style={styles.statusIndicatorText}>{user.isActive ? 'Active' : 'Inactive'}</Text>
                </View>
              </View>
            )}
            {/* Uncomment if you want to include greeting */}
            {/* <Text style={styles.greeting}>{t('welcome_back')}</Text> */}
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => setLanguage(language === 'en' ? 'mr' : 'en')}
            >
              <Globe size={16} color="#ffffff" />
              <Text style={styles.languageText}>{language === 'en' ? 'मर' : 'EN'}</Text>
            </TouchableOpacity>
            {user?.agentId && (
              <View style={styles.agentBadge}>
                <Text style={styles.agentId}>{user.agentId}</Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <View key={index} style={styles.statCard}>
                <IconComponent size={24} color={stat.color} />
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        {currentFlat ? (
          <View style={styles.currentFlatSection}>
            <Text style={styles.sectionTitle}>{t('current_assignment')}</Text>
            <View style={styles.flatCard}>
              <View style={styles.flatHeader}>
                <View style={styles.flatInfo}>
                  <Text style={styles.flatTitle}>{currentFlat.flatNo}</Text>
                  <Text style={styles.applicantName}>{currentFlat.applicantName}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentFlat.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(currentFlat.status)}</Text>
                </View>
              </View>
              
              <View style={styles.flatDetails}>
                <View style={styles.detailRow}>
                  <Home size={16} color="#6b7280" />
                  <Text style={styles.detailText}>{currentFlat.bhk} • {currentFlat.area}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MapPin size={16} color="#6b7280" />
                  <Text style={styles.detailText}>{currentFlat.tower}, Floor {currentFlat.floor}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Calendar size={16} color="#6b7280" />
                  <Text style={styles.detailText}>{t('possession_date')} {currentFlat.possession_date}</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.proceedButton}
                onPress={handleProceedToChecklist}
              >
                <Text style={styles.proceedButtonText}>{t('proceed_to_handover')}</Text>
                <ArrowRight size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.noFlatSection}>
            <View style={styles.noFlatCard}>
              <Search size={48} color="#9ca3af" />
              <Text style={styles.noFlatTitle}>{t('no_active_assignment')}</Text>
              <Text style={styles.noFlatText}>{t('search_applications')}</Text>
              <TouchableOpacity 
                style={styles.searchButton}
                onPress={() => router.push('/(tabs)/search')}
              >
                <Text style={styles.searchButtonText}>{t('search_applications')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>{t('quick_actions')}</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/search')}
            >
              <Search size={24} color="#2563eb" />
              <Text style={styles.actionText}>{t('search_flat')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/history')}
            >
              <FileText size={24} color="#059669" />
              <Text style={styles.actionText}>{t('view_history')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed': return '#059669';
    case 'in_progress': return '#f59e0b';
    case 'on_hold': return '#dc2626';
    default: return '#6b7280';
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'completed': return 'Completed';
    case 'in_progress': return 'In Progress';
    case 'on_hold': return 'On Hold';
    default: return 'Pending';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: StatusBar.currentHeight || 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  agentName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  headerRight: {
    //marginTop:50,
    flexDirection: 'row',
    //alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'column',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  statusIndicatorText: {
    fontSize: 8,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  languageText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginLeft: 4,
  },
  agentBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  agentId: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  currentFlatSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  flatCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  flatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  flatInfo: {
    flex: 1,
  },
  flatTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  applicantName: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  flatDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginLeft: 8,
  },
  proceedButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  proceedButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginRight: 8,
  },
  noFlatSection: {
    marginBottom: 32,
  },
  noFlatCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  noFlatTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  noFlatText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  searchButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  searchButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  quickActions: {
    marginBottom: 32,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginTop: 8,
  },
});