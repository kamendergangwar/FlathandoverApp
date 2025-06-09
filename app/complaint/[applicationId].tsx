import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { ArrowLeft, TriangleAlert as AlertTriangle, Send, CircleCheck as CheckCircle, X } from 'lucide-react-native';

export default function ComplaintScreen() {
  const { applicationId } = useLocalSearchParams();
  const router = useRouter();
  const { currentFlat, checklist, submitComplaint } = useApp();
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentFlat) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No flat selected</Text>
      </SafeAreaView>
    );
  }

  const issueItems = checklist.filter(item => !item.checked);
  const priorities = [
    { value: 'low', label: 'Low', color: '#059669' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'high', label: 'High', color: '#dc2626' },
  ];

  const handleSubmit = async () => {
    if (description.trim().length < 10) {
      Alert.alert('Description Required', 'Please provide a detailed description of the issues (minimum 10 characters).');
      return;
    }

    setIsSubmitting(true);

    const complaint = {
      applicationNo: currentFlat.applicationNo,
      flatNo: currentFlat.flatNo,
      applicantName: currentFlat.applicantName,
      issues: issueItems.map(item => ({
        category: item.category,
        item: item.item,
        issue: item.issue || 'Not checked'
      })),
      description,
      priority,
      submittedAt: new Date().toISOString(),
    };

    try {
      const success = await submitComplaint(complaint);
      
      if (success) {
        Alert.alert(
          'Complaint Submitted',
          'The complaint has been submitted successfully. The handover is now on hold until issues are resolved.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)')
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to submit complaint. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while submitting the complaint.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#dc2626', '#ef4444']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Report Issues</Text>
          <Text style={styles.headerSubtitle}>{currentFlat.flatNo} - {currentFlat.applicantName}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.alertCard}>
          <AlertTriangle size={24} color="#dc2626" />
          <View style={styles.alertText}>
            <Text style={styles.alertTitle}>Handover On Hold</Text>
            <Text style={styles.alertDescription}>
              Issues found during inspection. Please document all problems below to proceed with complaint registration.
            </Text>
          </View>
        </View>

        <View style={styles.issuesSection}>
          <Text style={styles.sectionTitle}>Issues Found</Text>
          {issueItems.map((item) => (
            <View key={item.id} style={styles.issueItem}>
              <X size={20} color="#dc2626" />
              <View style={styles.issueDetails}>
                <Text style={styles.issueCategory}>{item.category}</Text>
                <Text style={styles.issueText}>{item.item}</Text>
                {item.issue && (
                  <Text style={styles.issueNote}>Note: {item.issue}</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.prioritySection}>
          <Text style={styles.sectionTitle}>Priority Level</Text>
          <View style={styles.priorityContainer}>
            {priorities.map((p) => (
              <TouchableOpacity
                key={p.value}
                style={[
                  styles.priorityButton,
                  priority === p.value && { backgroundColor: p.color },
                  priority === p.value && styles.priorityButtonActive
                ]}
                onPress={() => setPriority(p.value as any)}
              >
                <Text style={[
                  styles.priorityText,
                  priority === p.value && styles.priorityTextActive
                ]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Detailed Description</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Describe the issues in detail, including any safety concerns, damage observed, or items that need repair/replacement..."
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={6}
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>
            {description.length}/500 characters
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>What happens next?</Text>
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <CheckCircle size={16} color="#059669" />
              <Text style={styles.infoText}>Complaint will be registered in the system</Text>
            </View>
            <View style={styles.infoItem}>
              <CheckCircle size={16} color="#059669" />
              <Text style={styles.infoText}>Maintenance team will be notified</Text>
            </View>
            <View style={styles.infoItem}>
              <CheckCircle size={16} color="#059669" />
              <Text style={styles.infoText}>Handover will resume after issue resolution</Text>
            </View>
            <View style={styles.infoItem}>
              <CheckCircle size={16} color="#059669" />
              <Text style={styles.infoText}>Applicant will be kept informed of progress</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[
              styles.submitButton,
              (description.trim().length < 10 || isSubmitting) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={description.trim().length < 10 || isSubmitting}
          >
            {isSubmitting ? (
              <Text style={styles.submitButtonText}>Submitting...</Text>
            ) : (
              <>
                <Send size={20} color="#ffffff" />
                <Text style={styles.submitButtonText}>Submit Complaint</Text>
              </>
            )}
          </TouchableOpacity>
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
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  alertCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  alertText: {
    marginLeft: 12,
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#dc2626',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#b91c1c',
    lineHeight: 20,
  },
  issuesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  issueItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  issueDetails: {
    marginLeft: 12,
    flex: 1,
  },
  issueCategory: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  issueText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 4,
  },
  issueNote: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#dc2626',
    fontStyle: 'italic',
  },
  prioritySection: {
    marginBottom: 24,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  priorityButtonActive: {
    borderColor: 'transparent',
  },
  priorityText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
  },
  priorityTextActive: {
    color: '#ffffff',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  descriptionInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  characterCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 8,
  },
  infoSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  infoList: {
    marginLeft: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginLeft: 8,
    flex: 1,
  },
  actionContainer: {
    paddingBottom: 24,
  },
  submitButton: {
    backgroundColor: '#dc2626',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginLeft: 8,
  },
});