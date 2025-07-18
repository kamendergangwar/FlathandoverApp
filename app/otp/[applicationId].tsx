// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { useApp } from '@/contexts/AppContext';
// import { ArrowLeft, Shield, CircleCheck as CheckCircle, Smartphone } from 'lucide-react-native';

// export default function OTPScreen() {
//   const { applicationId } = useLocalSearchParams();
//   const router = useRouter();
//   const { currentFlat, completeHandover } = useApp();
//   const [otp, setOtp] = useState(['', '', '', '', '', '']);
//   const [timer, setTimer] = useState(300); // 5 minutes
//   const [isVerifying, setIsVerifying] = useState(false);

//   // Mock OTP for demo - in real app this would come from SMS/email
//   const correctOtp = '123456';

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTimer(prev => prev > 0 ? prev - 1 : 0);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   if (!currentFlat) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <Text>No flat selected</Text>
//       </SafeAreaView>
//     );
//   }

//   const handleOtpChange = (value: string, index: number) => {
//     if (value.length > 1) return;
    
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // Auto-focus next input
//     if (value && index < 5) {
//       const nextInput = `otp-${index + 1}`;
//       // In a real app, you'd focus the next input here
//     }
//   };

//   const handleVerify = async () => {
//     const enteredOtp = otp.join('');
    
//     if (enteredOtp.length !== 6) {
//       Alert.alert('Invalid OTP', 'Please enter the complete 6-digit OTP.');
//       return;
//     }

//     setIsVerifying(true);

//     // Simulate API call
//     setTimeout(() => {
//       if (enteredOtp === correctOtp) {
//         completeHandover();
//         Alert.alert(
//           'Handover Complete!',
//           'The flat handover has been successfully completed and recorded.',
//           [
//             {
//               text: 'OK',
//               onPress: () => router.replace('/(tabs)')
//             }
//           ]
//         );
//       } else {
//         Alert.alert('Invalid OTP', 'The OTP you entered is incorrect. Please try again.');
//       }
//       setIsVerifying(false);
//     }, 2000);
//   };

//   const handleResendOtp = () => {
//     setTimer(300);
//     setOtp(['', '', '', '', '', '']);
//     Alert.alert('OTP Sent', 'A new OTP has been sent to the registered mobile number.');
//   };

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <LinearGradient
//         colors={['#1e40af', '#2563eb']}
//         style={styles.header}
//       >
//         <TouchableOpacity 
//           style={styles.backButton}
//           onPress={() => router.back()}
//         >
//           <ArrowLeft size={24} color="#ffffff" />
//         </TouchableOpacity>
//         <View style={styles.headerContent}>
//           <Text style={styles.headerTitle}>OTP Verification</Text>
//           <Text style={styles.headerSubtitle}>{currentFlat.flatNo} - {currentFlat.applicantName}</Text>
//         </View>
//       </LinearGradient>

//       <View style={styles.content}>
//         <View style={styles.infoCard}>
//           <Shield size={32} color="#059669" />
//           <View style={styles.infoText}>
//             <Text style={styles.infoTitle}>Secure Verification</Text>
//             <Text style={styles.infoDescription}>
//               An OTP has been sent to the applicant's registered mobile number for final verification.
//             </Text>
//           </View>
//         </View>

//         <View style={styles.phoneSection}>
//           <Smartphone size={20} color="#6b7280" />
//           <Text style={styles.phoneText}>
//             OTP sent to +91 ****-***-210
//           </Text>
//         </View>

//         <View style={styles.otpSection}>
//           <Text style={styles.otpLabel}>Enter 6-digit OTP</Text>
          
//           <View style={styles.otpContainer}>
//             {otp.map((digit, index) => (
//               <TextInput
//                 key={index}
//                 style={styles.otpInput}
//                 value={digit}
//                 onChangeText={(value) => handleOtpChange(value, index)}
//                 keyboardType="numeric"
//                 maxLength={1}
//                 textAlign="center"
//               />
//             ))}
//           </View>

//           <View style={styles.timerContainer}>
//             <Text style={styles.timerText}>
//               Time remaining: {formatTime(timer)}
//             </Text>
//           </View>

//           {timer === 0 && (
//             <TouchableOpacity 
//               style={styles.resendButton}
//               onPress={handleResendOtp}
//             >
//               <Text style={styles.resendButtonText}>Resend OTP</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         <View style={styles.demoSection}>
//           <View style={styles.demoCard}>
//             <Text style={styles.demoTitle}>Demo OTP</Text>
//             <Text style={styles.demoOtp}>123456</Text>
//             <Text style={styles.demoNote}>Use this OTP for testing</Text>
//           </View>
//         </View>

//         <View style={styles.actionContainer}>
//           <TouchableOpacity 
//             style={[
//               styles.verifyButton,
//               (otp.join('').length !== 6 || isVerifying) && styles.verifyButtonDisabled
//             ]}
//             onPress={handleVerify}
//             disabled={otp.join('').length !== 6 || isVerifying}
//           >
//             {isVerifying ? (
//               <Text style={styles.verifyButtonText}>Verifying...</Text>
//             ) : (
//               <>
//                 <CheckCircle size={20} color="#ffffff" />
//                 <Text style={styles.verifyButtonText}>Complete Handover</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         </View>

//         <View style={styles.securityNote}>
//           <Text style={styles.securityText}>
//             🔒 This verification ensures secure handover completion and creates an audit trail for the transaction.
//           </Text>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f9fafb',
//   },
//   header: {
//     paddingHorizontal: 24,
//     paddingVertical: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   backButton: {
//     marginRight: 16,
//   },
//   headerContent: {
//     flex: 1,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontFamily: 'Inter-Bold',
//     color: '#ffffff',
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: 'rgba(255, 255, 255, 0.8)',
//     marginTop: 2,
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 24,
//   },
//   infoCard: {
//     backgroundColor: '#ecfdf5',
//     borderRadius: 12,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginTop: 20,
//     marginBottom: 24,
//   },
//   infoText: {
//     marginLeft: 12,
//     flex: 1,
//   },
//   infoTitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#059669',
//     marginBottom: 4,
//   },
//   infoDescription: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: '#047857',
//     lineHeight: 20,
//   },
//   phoneSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 32,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   phoneText: {
//     fontSize: 14,
//     fontFamily: 'Inter-Medium',
//     color: '#6b7280',
//     marginLeft: 8,
//   },
//   otpSection: {
//     alignItems: 'center',
//     marginBottom: 32,
//   },
//   otpLabel: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#111827',
//     marginBottom: 20,
//   },
//   otpContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   otpInput: {
//     width: 48,
//     height: 56,
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#e5e7eb',
//     fontSize: 24,
//     fontFamily: 'Inter-Bold',
//     color: '#111827',
//     marginHorizontal: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   timerContainer: {
//     marginBottom: 16,
//   },
//   timerText: {
//     fontSize: 14,
//     fontFamily: 'Inter-Medium',
//     color: '#f59e0b',
//   },
//   resendButton: {
//     paddingVertical: 8,
//   },
//   resendButtonText: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#2563eb',
//   },
//   demoSection: {
//     marginBottom: 32,
//   },
//   demoCard: {
//     backgroundColor: '#fef3c7',
//     borderRadius: 12,
//     padding: 16,
//     alignItems: 'center',
//   },
//   demoTitle: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#d97706',
//     marginBottom: 8,
//   },
//   demoOtp: {
//     fontSize: 24,
//     fontFamily: 'Inter-Bold',
//     color: '#92400e',
//     letterSpacing: 4,
//     marginBottom: 4,
//   },
//   demoNote: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: '#a16207',
//   },
//   actionContainer: {
//     marginBottom: 24,
//   },
//   verifyButton: {
//     backgroundColor: '#059669',
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//   },
//   verifyButtonDisabled: {
//     backgroundColor: '#d1d5db',
//   },
//   verifyButtonText: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#ffffff',
//     marginLeft: 8,
//   },
//   securityNote: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     padding: 16,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   securityText: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: '#6b7280',
//     textAlign: 'center',
//     lineHeight: 16,
//   },
// });


import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { ArrowLeft, Shield, CircleCheck as CheckCircle, Smartphone } from 'lucide-react-native';

export default function OTPScreen() {
  const { applicationId } = useLocalSearchParams();
  const router = useRouter();
  const { currentFlat, completeHandover } = useApp();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300); // 5 minutes
  const [isVerifying, setIsVerifying] = useState(false);

  // Create refs for each OTP input
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Mock OTP for demo - in real app this would come from SMS/email
  const correctOtp = '123456';

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!currentFlat) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No flat selected</Text>
      </SafeAreaView>
    );
  }

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    // Move to previous input on backspace
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    
    if (enteredOtp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the complete 6-digit OTP.');
      return;
    }

    setIsVerifying(true);

    // Simulate API call
    setTimeout(() => {
      if (enteredOtp === correctOtp) {
        completeHandover();
        Alert.alert(
          'Handover Complete!',
          'The flat handover has been successfully completed and recorded.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)')
            }
          ]
        );
      } else {
        Alert.alert('Invalid OTP', 'The OTP you entered is incorrect. Please try again.');
      }
      setIsVerifying(false);
    }, 2000);
  };

  const handleResendOtp = () => {
    setTimer(300);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus(); // Focus first input on resend
    Alert.alert('OTP Sent', 'A new OTP has been sent to the registered mobile number.');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          <Text style={styles.headerTitle}>OTP Verification</Text>
          <Text style={styles.headerSubtitle}>{currentFlat.flatNo} - {currentFlat.applicantName}</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Shield size={32} color="#059669" />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Secure Verification</Text>
            <Text style={styles.infoDescription}>
              An OTP has been sent to the applicant's registered mobile number for final verification.
            </Text>
          </View>
        </View>

        <View style={styles.phoneSection}>
          <Smartphone size={20} color="#6b7280" />
          <Text style={styles.phoneText}>
            OTP sent to +91 ****-***-210
          </Text>
        </View>

        <View style={styles.otpSection}>
          <Text style={styles.otpLabel}>Enter 6-digit OTP</Text>
          
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                returnKeyType={index < 5 ? 'next' : 'done'}
                blurOnSubmit={false}
              />
            ))}
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              Time remaining: {formatTime(timer)}
            </Text>
          </View>

          {timer === 0 && (
            <TouchableOpacity 
              style={styles.resendButton}
              onPress={handleResendOtp}
            >
              <Text style={styles.resendButtonText}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>
{/* 
        <View style={styles.demoSection}>
          <View style={styles.demoCard}>
            <Text style={styles.demoTitle}>Demo OTP</Text>
            <Text style={styles.demoOtp}>123456</Text>
            <Text style={styles.demoNote}>Use this OTP for testing</Text>
          </View>
        </View> */}

        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[
              styles.verifyButton,
              (otp.join('').length !== 6 || isVerifying) && styles.verifyButtonDisabled
            ]}
            onPress={handleVerify}
            disabled={otp.join('').length !== 6 || isVerifying}
          >
            {isVerifying ? (
              <Text style={styles.verifyButtonText}>Verifying...</Text>
            ) : (
              <>
                <CheckCircle size={20} color="#ffffff" />
                <Text style={styles.verifyButtonText}>Complete Handover</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.securityNote}>
          <Text style={styles.securityText}>
            🔒 This verification ensures secure handover completion and creates an audit trail for the transaction.
          </Text>
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
    backgroundColor: '#ecfdf5',
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
    color: '#059669',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#047857',
    lineHeight: 20,
  },
  phoneSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  phoneText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginLeft: 8,
  },
  otpSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  otpLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  otpInput: {
    width: 48,
    height: 56,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  timerContainer: {
    marginBottom: 16,
  },
  timerText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#f59e0b',
  },
  resendButton: {
    paddingVertical: 8,
  },
  resendButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563eb',
  },
  demoSection: {
    marginBottom: 32,
  },
  demoCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#d97706',
    marginBottom: 8,
  },
  demoOtp: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#92400e',
    letterSpacing: 4,
    marginBottom: 4,
  },
  demoNote: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a16207',
  },
  actionContainer: {
    marginBottom: 24,
  },
  verifyButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  verifyButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  verifyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginLeft: 8,
  },
  securityNote: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  securityText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
});