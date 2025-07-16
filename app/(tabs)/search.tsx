import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';
import { Search, Chrome as Home, MapPin, Calendar, User, ArrowRight, CircleAlert as AlertCircle, Phone, Hash, Globe, QrCode, X } from 'lucide-react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

export default function SearchScreen() {
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState<'application' | 'mobile' | 'barcode'>('application');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { searchFlat, setCurrentFlat, currentFlat, resetChecklist, language, setLanguage, t } = useApp();
  const router = useRouter();

  const handleSearch = async () => {
    const trimmedValue = searchValue.trim();
    
    if (!trimmedValue) {
      if (searchType === 'barcode') {
        setError(t('please_scan_barcode'));
      } else if (searchType === 'application') {
        setError(t('please_enter_application'));
      } else {
        setError(t('please_enter_mobile'));
      }
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // For barcode, treat the scanned data as application number
      const searchTypeForAPI = searchType === 'barcode' ? 'application' : searchType;
      const flat = await searchFlat(trimmedValue, searchTypeForAPI);
      
      if (flat) {
        setCurrentFlat(flat);
        resetChecklist();
        setError('');
      } else {
        const errorKey = (searchType === 'application' || searchType === 'barcode') ? 'no_flat_found_app' : 'no_flat_found_mobile';
        setError(t(errorKey));
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
    if (searchType === 'application') return t('enter_application_number');
    if (searchType === 'mobile') return t('enter_mobile_number');
    return t('scan_barcode_or_enter');
  };

  const getSearchIcon = () => {
    if (searchType === 'application') return Hash;
    if (searchType === 'mobile') return Phone;
    return QrCode;
  };

  const handleMobileInputChange = (text: string) => {
    if (searchType === 'mobile') {
      // Auto-add +91 if not present and user starts typing numbers
      if (text.length > 0 && !text.startsWith('+91') && /^\d/.test(text)) {
        setSearchValue('+91 ' + text);
      } else {
        setSearchValue(text);
      }
    } else {
      setSearchValue(text);
    }
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setSearchValue(data);
    setShowBarcodeScanner(false);
    setError(''); // Clear any existing errors
    // Auto-search after scanning
    setTimeout(() => {
      // Trigger search with the scanned data
      if (data && data.trim()) {
        handleSearchWithValue(data.trim());
      }
    }, 500);
  };

  const handleSearchWithValue = async (value: string) => {
    setIsLoading(true);
    setError('');

    try {
      const flat = await searchFlat(value, 'application'); // Barcode data treated as application number
      
      if (flat) {
        setCurrentFlat(flat);
        resetChecklist();
        setError('');
      } else {
        setError(t('no_flat_found_app'));
      }
    } catch (err) {
      setError('Failed to search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openBarcodeScanner = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        setError(t('camera_permission_required'));
        return;
      }
    }
    setShowBarcodeScanner(true);
  };

  const renderBarcodeScanner = () => {
    if (!showBarcodeScanner) return null;

    return (
      <Modal
        visible={showBarcodeScanner}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.scannerContainer}>
          <View style={styles.scannerHeader}>
            <TouchableOpacity
              style={styles.closeScannerButton}
              onPress={() => setShowBarcodeScanner(false)}
            >
              <X size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.scannerTitle}>{t('scan_barcode')}</Text>
            <View style={styles.scannerHeaderSpacer} />
          </View>

          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr', 'code128', 'code39', 'code93', 'codabar', 'ean13', 'ean8', 'upc_e', 'pdf417'],
            }}
          >
            <View style={styles.scannerOverlay}>
              <View style={styles.scannerFrame}>
                <View style={styles.scannerCorner} />
                <View style={[styles.scannerCorner, styles.scannerCornerTopRight]} />
                <View style={[styles.scannerCorner, styles.scannerCornerBottomLeft]} />
                <View style={[styles.scannerCorner, styles.scannerCornerBottomRight]} />
              </View>
              <Text style={styles.scannerInstructions}>
                {t('position_barcode_in_frame')}
              </Text>
            </View>
          </CameraView>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e40af', '#2563eb']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>{t('search_application')}</Text>
            <Text style={styles.headerSubtitle}>{t('search_subtitle')}</Text>
          </View>
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => setLanguage(language === 'en' ? 'mr' : 'en')}
          >
            <Globe size={20} color="#ffffff" />
            <Text style={styles.languageText}>{language === 'en' ? 'मर' : 'EN'}</Text>
          </TouchableOpacity>
        </View>
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
                {t('application_no')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.searchTypeButton,
                searchType === 'mobile' && styles.searchTypeButtonActive
              ]}
              onPress={() => {
                setSearchType('mobile');
                setSearchValue('+91 ');
                setError('');
              }}
            >
              <Phone size={16} color={searchType === 'mobile' ? '#ffffff' : '#6b7280'} />
              <Text style={[
                styles.searchTypeText,
                searchType === 'mobile' && styles.searchTypeTextActive
              ]}>
                {t('mobile_no')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.searchTypeButton,
                searchType === 'barcode' && styles.searchTypeButtonActive
              ]}
              onPress={() => {
                setSearchType('barcode');
                setSearchValue('');
                setError('');
              }}
            >
              <QrCode size={16} color={searchType === 'barcode' ? '#ffffff' : '#6b7280'} />
              <Text style={[
                styles.searchTypeText,
                searchType === 'barcode' && styles.searchTypeTextActive
              ]}>
                {t('barcode')}
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
              onChangeText={handleMobileInputChange}
              autoCapitalize={searchType === 'application' ? 'characters' : 'none'}
              keyboardType={searchType === 'mobile' ? 'phone-pad' : 'default'}
              editable={searchType !== 'barcode'}
            />
            {searchType === 'barcode' && (
              <TouchableOpacity
                style={styles.scanButton}
                onPress={openBarcodeScanner}
              >
                <QrCode size={20} color="#2563eb" />
                <Text style={styles.scanButtonText}>{t('scan')}</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.searchButton, isLoading && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.searchButtonText}>{t('search')}</Text>
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
            <Text style={styles.sectionTitle}>{t('flat_details')}</Text>
            <View style={styles.flatCard}>
              <View style={styles.flatHeader}>
                <View style={styles.flatNumberContainer}>
                  <Text style={styles.flatNumber}>{currentFlat.flatNo}</Text>
                  <Text style={styles.towerName}>{currentFlat.tower}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{t('ready_for_handover')}</Text>
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
                  <Text style={styles.detailLabel}>{t('configuration')}</Text>
                  <Text style={styles.detailValue}>{currentFlat.bhk} • {currentFlat.area}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <MapPin size={16} color="#6b7280" />
                  <Text style={styles.detailLabel}>{t('location')}</Text>
                  <Text style={styles.detailValue}>Floor {currentFlat.floor}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Calendar size={16} color="#6b7280" />
                  <Text style={styles.detailLabel}>{t('possession_date')}</Text>
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
                <Text style={styles.proceedButtonText}>{t('proceed_to_handover')}</Text>
                <ArrowRight size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>{t('search_options')}</Text>
          <Text style={styles.helpText}>
            {t('search_help_text_extended')}
          </Text>
          
          <View style={styles.exampleContainer}>
            <Text style={styles.exampleTitle}>{t('example_formats')}</Text>
            <Text style={styles.exampleText}>• Application: 240100145808, 240100145809, etc.</Text>
            <Text style={styles.exampleText}>• Mobile: +91 98765 43210, 9876543210</Text>
            <Text style={styles.exampleText}>• Barcode: {t('scan_application_barcode')}</Text>
          </View>
        </View>
      </ScrollView>

      {renderBarcodeScanner()}
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  languageText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginLeft: 6,
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
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  searchTypeButtonActive: {
    backgroundColor: '#2563eb',
  },
  searchTypeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
    marginLeft: 4,
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
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  scanButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563eb',
    marginLeft: 6,
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
  // Barcode Scanner Styles
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingTop: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  closeScannerButton: {
    padding: 8,
  },
  scannerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  scannerHeaderSpacer: {
    width: 40,
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    position: 'relative',
    marginBottom: 40,
  },
  scannerCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#ffffff',
    borderWidth: 3,
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  scannerCornerTopRight: {
    top: 0,
    right: 0,
    left: 'auto',
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 0,
  },
  scannerCornerBottomLeft: {
    bottom: 0,
    left: 0,
    top: 'auto',
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  scannerCornerBottomRight: {
    bottom: 0,
    right: 0,
    top: 'auto',
    left: 'auto',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  scannerInstructions: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});