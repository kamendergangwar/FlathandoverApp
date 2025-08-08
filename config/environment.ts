import Constants from 'expo-constants';

interface EnvironmentConfig {
  apiBaseUrl: string;
  apiTimeout: number;
  environment: string;
}

// Fallback configuration for when environment variables are not available
const fallbackConfig: EnvironmentConfig = {
  apiBaseUrl: 'http://restlotterydev.cidcohomes.com/rest-api/applicationservice',
  apiTimeout: 12000,
  environment: 'development',
};

// Get environment configuration
function getEnvironmentConfig(): EnvironmentConfig {
  // Try to get from process.env first (works in Expo Go and some builds)
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
      apiTimeout: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '12000'),
      environment: process.env.EXPO_PUBLIC_ENV || 'development',
    };
  }

  // Try to get from Constants.expoConfig.extra (works in builds)
  if (Constants.expoConfig?.extra?.apiBaseUrl) {
    return {
      apiBaseUrl: Constants.expoConfig.extra.apiBaseUrl,
      apiTimeout: Constants.expoConfig.extra.apiTimeout || 12000,
      environment: Constants.expoConfig.extra.environment || 'development',
    };
  }

  // Try to get from Constants.manifest2 (newer Expo versions)
  if (Constants.manifest2?.extra?.expoClient?.extra?.apiBaseUrl) {
    const extra = Constants.manifest2.extra.expoClient.extra;
    return {
      apiBaseUrl: extra.apiBaseUrl,
      apiTimeout: extra.apiTimeout || 12000,
      environment: extra.environment || 'development',
    };
  }

  // Use fallback configuration
  console.warn('Environment variables not found, using fallback configuration');
  return fallbackConfig;
}

export const environmentConfig = getEnvironmentConfig();

// Log the configuration for debugging
console.log('Environment Configuration:', {
  ...environmentConfig,
  timestamp: new Date().toISOString(),
  source: process.env.EXPO_PUBLIC_API_BASE_URL ? 'process.env' : 
          Constants.expoConfig?.extra?.apiBaseUrl ? 'Constants.expoConfig.extra' :
          Constants.manifest2?.extra?.expoClient?.extra?.apiBaseUrl ? 'Constants.manifest2' : 'fallback'
});