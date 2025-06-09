import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { ArrowLeft, RotateCcw, ArrowRight, PenTool } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

export default function SignatureScreen() {
  const { applicationId } = useLocalSearchParams();
  const router = useRouter();
  const { currentFlat } = useApp();
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const pathRef = useRef('');

  if (!currentFlat) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No flat selected</Text>
      </SafeAreaView>
    );
  }

  const onTouchStart = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    if (typeof locationX === 'number' && typeof locationY === 'number') {
      const newPath = `M${locationX.toFixed(2)},${locationY.toFixed(2)}`;
      pathRef.current = newPath;
      setCurrentPath(newPath);
    }
  };

  const onTouchMove = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    if (typeof locationX === 'number' && typeof locationY === 'number') {
      const newPath = `${pathRef.current} L${locationX.toFixed(2)},${locationY.toFixed(2)}`;
      pathRef.current = newPath;
      setCurrentPath(newPath);
    }
  };

  const onTouchEnd = () => {
    setPaths(prev => [...prev, currentPath]);
    setCurrentPath('');
  };

  const clearSignature = () => {
    setPaths([]);
    setCurrentPath('');
    pathRef.current = '';
  };

  const handleProceed = () => {
    if (paths.length === 0) {
      Alert.alert('Signature Required', 'Please provide a signature before proceeding.');
      return;
    }
    router.push(`/otp/${applicationId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e40af', '#2563eb']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Digital Signature</Text>
          <Text style={styles.headerSubtitle}>{currentFlat.flatNo} - {currentFlat.applicantName}</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <PenTool size={24} color="#2563eb" />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Signature Required</Text>
            <Text style={styles.infoDescription}>
              Please ask the applicant to sign below to confirm receipt of the flat keys and completion of the handover process.
            </Text>
          </View>
        </View>

        <View style={styles.signatureSection}>
          <Text style={styles.signatureLabel}>Applicant Signature</Text>
          
          <View style={styles.signatureContainer}>
            <View
              style={styles.signatureCanvas}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <Svg style={styles.svg}>
                {paths.map((path, index) => (
                  <Path
                    key={index}
                    d={path}
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                ))}
                {currentPath && (
                  <Path
                    d={currentPath}
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                )}
              </Svg>
              
              {paths.length === 0 && currentPath === '' && (
                <View style={styles.signaturePlaceholder}>
                  <PenTool size={32} color="#d1d5db" />
                  <Text style={styles.placeholderText}>Sign here</Text>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearSignature}
          >
            <RotateCcw size={16} color="#6b7280" />
            <Text style={styles.clearButtonText}>Clear Signature</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.agreementSection}>
          <Text style={styles.agreementTitle}>Agreement</Text>
          <Text style={styles.agreementText}>
            By signing above, I acknowledge that I have received the flat keys and that all items mentioned in the handover checklist have been verified. I confirm that the flat is in acceptable condition for possession.
          </Text>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[
              styles.proceedButton,
              paths.length === 0 && styles.proceedButtonDisabled
            ]}
            onPress={handleProceed}
            disabled={paths.length === 0}
          >
            <Text style={styles.proceedButtonText}>Proceed to Verification</Text>
            <ArrowRight size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
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
  infoCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 24,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1d4ed8',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1e40af',
    lineHeight: 20,
  },
  signatureSection: {
    marginBottom: 24,
  },
  signatureLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  signatureContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  signatureCanvas: {
    height: 200,
    margin: 1,
  },
  svg: {
    flex: 1,
  },
  signaturePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#d1d5db',
    marginTop: 8,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 12,
  },
  clearButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginLeft: 8,
  },
  agreementSection: {
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
  agreementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  agreementText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    lineHeight: 20,
  },
  actionContainer: {
    paddingBottom: 24,
  },
  proceedButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  proceedButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  proceedButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginRight: 8,
  },
});