// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useRouter } from 'expo-router';
// import { useAuth } from '@/contexts/AuthContext';
// import { LogIn, User, Lock } from 'lucide-react-native';
// import LoginIcon from './components/LoginIcon'

// export default function LoginScreen() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const { login, isLoading, user } = useAuth();
//   const router = useRouter();

//   // If user is already authenticated, redirect to tabs
//   React.useEffect(() => {
//     if (user) {
//       router.replace('/(tabs)');
//     }
//   }, [user, router]);

//   const handleLogin = async () => {
//     if (!email || !password) {
//       setError('Please enter both email and password');
//       return;
//     }

//     setError('');
//     const success = await login(email, password);
    
//     if (success) {
//       router.replace('/(tabs)');
//     } else {
//       setError('Invalid email or password');
//     }
//   };

//   return (
//     <LinearGradient
//       colors={['#1e40af', '#2563eb', '#3b82f6']}
//       style={styles.container}
//     >
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.content}>
//           <View style={styles.header}>
//             <View style={styles.logoContainer}>
//               <LoginIcon width={200} height={100} fill="#ffffff" />
//               {/* <LogIn size={48} color="#ffffff" /> */}
//             </View>
//             <Text style={styles.title}>Flat Handover</Text>
//             {/* <Text style={styles.subtitle}>Agent Portal</Text> */}
//           </View>

//           <View style={styles.form}>
//             <View style={styles.inputContainer}>
//               <User size={20} color="#6b7280" style={styles.inputIcon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Email Address"
//                 placeholderTextColor="#9ca3af"
//                 value={email}
//                 onChangeText={setEmail}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//               />
//             </View>

//             <View style={styles.inputContainer}>
//               <Lock size={20} color="#6b7280" style={styles.inputIcon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Password"
//                 placeholderTextColor="#9ca3af"
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry
//               />
//             </View>

//             {error ? <Text style={styles.errorText}>{error}</Text> : null}

//             <TouchableOpacity 
//               style={styles.loginButton} 
//               onPress={handleLogin}
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <ActivityIndicator color="#ffffff" />
//               ) : (
//                 <Text style={styles.loginButtonText}>Sign In</Text>
//               )}
//             </TouchableOpacity>

//             {/* <View style={styles.demoInfo}>
//               <Text style={styles.demoText}>Demo Credentials:</Text>
//               <Text style={styles.demoText}>Email: agent@helios.com</Text>
//               <Text style={styles.demoText}>Password: password123</Text>
//             </View> */}
//           </View>
//         </View>
//       </SafeAreaView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   safeArea: {
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 24,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 48,
//   },
//   logoContainer: {
//     width: 250,
//     height: 100,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
  
//     borderRadius: 95,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 10,
//   },
//   title: {
//     marginLeft:15,
//     fontSize: 32,
//     fontFamily: 'Inter-Bold',
//     color: '#ffffff',
//     marginBottom: 8,
//   },
//   subtitle: {
//      marginLeft:15,
//     fontSize: 18,
//     fontFamily: 'Inter-Medium',
//     color: 'rgba(255, 255, 255, 0.8)',
//   },
//   form: {
//     backgroundColor: 'rgba(255, 255, 255, 0.95)',
//     borderRadius: 16,
//     padding: 24,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f9fafb',
//     borderRadius: 12,
//     marginBottom: 16,
//     paddingHorizontal: 16,
//     height: 52,
//   },
//   inputIcon: {
//     marginRight: 12,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     fontFamily: 'Inter-Regular',
//     color: '#111827',
//   },
//   errorText: {
//     color: '#ef4444',
//     fontSize: 14,
//     fontFamily: 'Inter-Medium',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   loginButton: {
//     backgroundColor: '#1d4ed8',
//     borderRadius: 12,
//     height: 52,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 24,
//   },
//   loginButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//   },
//   demoInfo: {
//     backgroundColor: '#f3f4f6',
//     borderRadius: 8,
//     padding: 12,
//     alignItems: 'center',
//   },
//   demoText: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: '#6b7280',
//     marginBottom: 2,
//   },
// });

import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, Smartphone, Lock, Eye, EyeOff, CircleAlert as AlertCircle } from 'lucide-react-native';
import LoginIcon from './components/LoginIcon'
import { apiConfig, debugInfo } from '@/config/api-config';
import { logout } from '@/store/slices/authSlice';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, user, error, clearError } = useAuth();
  const router = useRouter();

  // If user is already authenticated, redirect to tabs
  useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user, router]);

  const handleLogin = async () => {
    if (!mobile || !password) {
      Alert.alert('Missing Information', 'Please enter both mobile number and password');
      return;
    }

    // Clear any previous errors
    clearError();
    
    const success = await login(mobile, password);
    
    if (success) {
      // Check if user is active before proceeding
      if (user && !user.isActive) {
        Alert.alert('Account Inactive', 'Your account is inactive. Please contact administrator.');
        logout();
        return;
      }
      router.replace('/(tabs)');
    }
  };

  const handleMobileChange = (text: string) => {
    // Remove any non-numeric characters
    const numericText = text.replace(/[^0-9]/g, '');
    setMobile(numericText);
  };
  return (
  
    <LinearGradient
     colors={['#1e40af', '#2563eb', '#3b82f6']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoBackground}>
                <LoginIcon width={180} height={90} fill="#ffffff" />
              </View>
            </View>
            <Text style={styles.title}>Flat Snagging </Text>
            <Text style={styles.subtitle}>Sign in to continue to your dashboard</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.formTitle}>Agent Login</Text>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Smartphone size={20} color="#6b7280" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Mobile Number"
                placeholderTextColor="#9ca3af"
                value={mobile}
                onChangeText={handleMobileChange}
                keyboardType="phone-pad"
                autoCapitalize="none"
                maxLength={10}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Lock size={20} color="#6b7280" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
              </TouchableOpacity>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <AlertCircle size={16} color="#dc2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <LogIn size={20} color="#ffffff" />
                  <Text style={styles.loginButtonText}>Sign In</Text>
                </>
              )}
            </TouchableOpacity>

           
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Powered by CIDCO Homes</Text>
            <Text style={styles.debugText}>
              ENV: {debugInfo.currentEnvironment} | DEV: {debugInfo.isDev ? 'Yes' : 'No'}
            </Text>
            <Text style={styles.debugText}>
              API: {apiConfig.baseURL}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 6,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    padding: 28,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  formTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    marginBottom: 18,
    height: 56,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputIconContainer: {
    paddingLeft: 16,
    paddingRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    paddingVertical: 0,
  },
  passwordToggle: {
    paddingRight: 16,
    paddingLeft: 12,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    marginBottom: 18,
    textAlign: 'center',
    backgroundColor: '#fef2f2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  loginButton: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  demoInfo: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  demoText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
    marginBottom: 8,
  },
  demoCredentials: {
    alignItems: 'center',
  },
  demoCredential: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#475569',
    marginBottom: 4,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  debugText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 4,
    textAlign: 'center',
  },
});