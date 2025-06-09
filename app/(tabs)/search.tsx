import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';
import { Search, Chrome as Home, MapPin, Calendar, User, ArrowRight, CircleAlert as AlertCircle, Phone, Hash } from 'lucide-react-native';

export default function SearchScreen() {
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState<'application' | 'mobile'>('application');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { searchFlat, setCurrentFlat, currentFlat, resetChecklist } = useApp();
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setError(`Please enter ${searchType === 'application' ? 'an application number' : 'a mobile number'}`);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const flat = await searchFlat(searchValue.trim(), searchType);
      if (flat) {
        setCurrentFlat(flat);
        resetChecklist();
        setError('');
      } else {
        setError(`No flat found with this ${searchType === 'application' ? 'application number' : 'mobile number'}`);
      }
    } catch (err) {
      setError('Failed to search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToHandover = () => {
    if (currentFlat) {
      router.push(`/checklist/${currentFlat.applicationNo}`);
    }
  };

  const getPlaceholder = () => {
    return searchType === 'application' 
      ? 'Enter Application Number (e.g., APP001)'
      : 'Enter Mobile Number (e.g., +91 98765 43210)';
  };

  const getSearchIcon = () => {
    return searchType === 'application' ? Hash : Phone;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e40af', '#2563eb']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Search Application</Text>
        <Text style={styles.headerSubtitle}>Find flat details by application number or mobile number</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchSection}>
          <View style={styles.searchTypeContainer}>
            <TouchableOpacity
              style={[
                styles.searchTypeButton,
                searchType === 'application' && styles.searchTypeButtonActive
              ]}
              onPress={() => {
                setSearchType('application');
                setSearchValue('');
                setError('');
              }}
            >
              <Hash size={16} color={searchType === 'application' ? '#ffffff' : '#6b7280'} />
              <Text style={[
                styles.searchTypeText,
                searchType === 'application' && styles.searchTypeTextActive
              ]}>
                Application No.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.searchTypeButton,
                searchType === 'mobile' && styles.searchTypeButtonActive
              ]}
              onPress={() => {
                setSearchType('mobile');
                setSearchValue('');
                setError('');
              }}
            >
              <Phone size={16} color={searchType === 'mobile' ? '#ffffff' : '#6b7280'} />
              <Text style={[
                styles.searchTypeText,
                searchType === 'mobile' && styles.searchTypeTextActive
              ]}>
                Mobile No.
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            {React.createElement(getSearchIcon(), { 
              size: 20, 
              color: '#6b7280', 
              style: styles.searchIcon 
            })}
            <TextInput
              style={styles.searchInput}
              placeholder={getPlaceholder()}
              placeholderTextColor="#9ca3af"
              value={searchValue}
              onChangeText={setSearchValue}
              autoCapitalize={searchType === 'application' ? 'characters' : 'none'}
              keyboardType={searchType === 'mobile' ? 'phone-pad' : 'default'}
            />
          </View>

          <TouchableOpacity 
            style={[styles.searchButton, isLoading && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.searchButtonText}>Search</Text>
            )}
          </TouchableOpacity>

          {error ? (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color="#dc2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </View>

        {currentFlat && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Flat Details</Text>
            <View style={styles.flatCard}>
              <View style={styles.flatHeader}>
                <View style={styles.flatNumberContainer}>
                  <Text style={styles.flatNumber}>{currentFlat.flatNo}</Text>
                  <Text style={styles.towerName}>{currentFlat.tower}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Ready for Handover</Text>
                </View>
              </View>

              <View style={styles.applicantInfo}>
                <User size={20} color="#2563eb" />
                <View style={styles.applicantDetails}>
                  <Text style={styles.applicantName}>{currentFlat.applicantName}</Text>
                  <Text style={styles.applicationNumber}>App No: {currentFlat.applicationNo}</Text>
                </View>
              </View>

              <View style={styles.contactInfo}>
                <Phone size={16} color="#6b7280" />
                <Text style={styles.contactText}>Mobile: {currentFlat.mobileNumber}</Text>
              </View>

              <View style={styles.flatDetails}>
                <View style={styles.detailRow}>
                  <Home size={16} color="#6b7280" />
                  <Text style={styles.detailLabel}>Configuration:</Text>
                  <Text style={styles.detailValue}>{currentFlat.bhk} • {currentFlat.area}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <MapPin size={16} color="#6b7280" />
                  <Text style={styles.detailLabel}>Location:</Text>
                  <Text style={styles.detailValue}>Floor {currentFlat.floor}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Calendar size={16} color="#6b7280" />
                  <Text style={styles.detailLabel}>Possession Date:</Text>
                  <Text style={styles.detailValue}>{currentFlat.possession_date}</Text>
                </View>
              </View>

              <View style={styles.projectInfo}>
                <Text style={styles.projectName}>{currentFlat.project}</Text>
              </View>

              <TouchableOpacity 
                style={styles.proceedButton}
                onPress={handleProceedToHandover}
              >
                <Text style={styles.proceedButtonText}>Proceed to Handover</Text>
                <ArrowRight size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Search Options</Text>
          <Text style={styles.helpText}>
            You can search for flats using either the application number or the registered mobile number.
          </Text>
          
          <View style={styles.exampleContainer}>
            <Text style={styles.exampleTitle}>Example formats:</Text>
            <Text style={styles.exampleText}>• Application: APP001, APP002, etc.</Text>
            <Text style={styles.exampleText}>• Mobile: +91 98765 43210, 9876543210</Text>
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
  searchSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  searchTypeContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  searchTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  searchTypeButtonActive: {
    backgroundColor: '#2563eb',
  },
  searchTypeText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
    marginLeft: 6,
  },
  searchTypeTextActive: {
    color: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  searchButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  resultSection: {
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
    marginBottom: 20,
  },
  flatNumberContainer: {
    flex: 1,
  },
  flatNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  towerName: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  applicantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  applicantDetails: {
    marginLeft: 12,
    flex: 1,
  },
  applicantName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  applicationNumber: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 2,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginLeft: 8,
  },
  flatDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginLeft: 8,
    marginRight: 8,
    minWidth: 100,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
  },
  projectInfo: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  projectName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2563eb',
  },
  proceedButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  proceedButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginRight: 8,
  },
  helpSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  helpTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  exampleContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
  },
  exampleTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 2,
  },
});