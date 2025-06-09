import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, CircleCheck as CheckCircle, Circle as XCircle, Clock, Chrome as Home, User } from 'lucide-react-native';

const mockHistory = [
  {
    id: '1',
    applicationNo: 'APP001',
    applicantName: 'Rajesh Kumar',
    flatNo: 'A-101',
    tower: 'Tower A',
    status: 'completed',
    date: '2024-01-15',
    time: '10:30 AM'
  },
  {
    id: '2',
    applicationNo: 'APP003',
    applicantName: 'Anita Singh',
    flatNo: 'B-203',
    tower: 'Tower B',
    status: 'on_hold',
    date: '2024-01-14',
    time: '2:15 PM'
  },
  {
    id: '3',
    applicationNo: 'APP005',
    applicantName: 'Mohammad Ali',
    flatNo: 'C-305',
    tower: 'Tower C',
    status: 'completed',
    date: '2024-01-13',
    time: '11:45 AM'
  },
  {
    id: '4',
    applicationNo: 'APP007',
    applicantName: 'Priya Sharma',
    flatNo: 'A-205',
    tower: 'Tower A',
    status: 'completed',
    date: '2024-01-12',
    time: '9:20 AM'
  },
];

export default function HistoryScreen() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} color="#059669" />;
      case 'on_hold':
        return <XCircle size={20} color="#dc2626" />;
      default:
        return <Clock size={20} color="#f59e0b" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'on_hold': return 'On Hold';
      default: return 'Pending';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#059669';
      case 'on_hold': return '#dc2626';
      default: return '#f59e0b';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e40af', '#2563eb']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Handover History</Text>
        <Text style={styles.headerSubtitle}>View all your completed and pending handovers</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <CheckCircle size={24} color="#059669" />
            <Text style={[styles.statValue, { color: '#059669' }]}>15</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <XCircle size={24} color="#dc2626" />
            <Text style={[styles.statValue, { color: '#dc2626' }]}>3</Text>
            <Text style={styles.statLabel}>On Hold</Text>
          </View>
          <View style={styles.statCard}>
            <Clock size={24} color="#f59e0b" />
            <Text style={[styles.statValue, { color: '#f59e0b' }]}>5</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          {mockHistory.map((item) => (
            <TouchableOpacity key={item.id} style={styles.historyCard}>
              <View style={styles.cardHeader}>
                <View style={styles.flatInfo}>
                  <Text style={styles.flatNumber}>{item.flatNo}</Text>
                  <Text style={styles.towerName}>{item.tower}</Text>
                </View>
                <View style={styles.statusContainer}>
                  {getStatusIcon(item.status)}
                  <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {getStatusText(item.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.applicantRow}>
                <User size={16} color="#6b7280" />
                <Text style={styles.applicantName}>{item.applicantName}</Text>
              </View>

              <View style={styles.applicationRow}>
                <Home size={16} color="#6b7280" />
                <Text style={styles.applicationNo}>App No: {item.applicationNo}</Text>
              </View>

              <View style={styles.dateTimeContainer}>
                <Calendar size={16} color="#6b7280" />
                <Text style={styles.dateTime}>{item.date} at {item.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>This Month Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Handovers:</Text>
              <Text style={styles.summaryValue}>23</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Success Rate:</Text>
              <Text style={[styles.summaryValue, { color: '#059669' }]}>87%</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Average Time:</Text>
              <Text style={styles.summaryValue}>45 mins</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
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
  historySection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  flatInfo: {
    flex: 1,
  },
  flatNumber: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  towerName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
  },
  applicantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  applicantName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginLeft: 8,
  },
  applicationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  applicationNo: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginLeft: 8,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    marginLeft: 8,
  },
  summarySection: {
    marginBottom: 32,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
});