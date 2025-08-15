import Constants from 'expo-constants';

interface EnvironmentConfig {
  apiBaseUrl: string;
  apiTimeout: number;
  environment: string;
}

// Hardcoded configurations for each environment
const configurations = {
  development: {
    apiBaseUrl: 'http://restlotterydev.cidcohomes.com/rest-api/applicationservice',
    apiTimeout: 12000,
    environment: 'development',
  },
  staging: {
    apiBaseUrl: 'http://restlotterydev.cidcohomes.com/rest-api/applicationservice',
    apiTimeout: 12000,
    environment: 'staging',
  },
  preview: {
    apiBaseUrl: 'http://restlotterydev.cidcohomes.com/rest-api/applicationservice',
    apiTimeout: 12000,
    environment: 'preview',
  },
  production: {
    apiBaseUrl: 'https://your-production-domain.com/rest-api/applicationservice',
    apiTimeout: 15000,
    environment: 'production',
  },
};

// Determine environment from multiple sources
function getEnvironment(): keyof typeof configurations {
  console.log('=== Environment Detection Debug ===');
  
  // Check process.env first
  if (process.env.EXPO_PUBLIC_ENV) {
    console.log('Environment from process.env.EXPO_PUBLIC_ENV:', process.env.EXPO_PUBLIC_ENV);
    return process.env.EXPO_PUBLIC_ENV as keyof typeof configurations;
  }

  // Check Constants.expoConfig.extra
  if (Constants.expoConfig?.extra?.environment) {
    console.log('Environment from Constants.expoConfig.extra.environment:', Constants.expoConfig.extra.environment);
    return Constants.expoConfig.extra.environment as keyof typeof configurations;
  }

  // Check Constants.manifest2
  if (Constants.manifest2?.extra?.expoClient?.extra?.environment) {
    console.log('Environment from Constants.manifest2:', Constants.manifest2.extra.expoClient.extra.environment);
    return Constants.manifest2.extra.expoClient.extra.environment as keyof typeof configurations;
  }

  // Check if we're in Expo Go (development)
  if (Constants.appOwnership === 'expo') {
    console.log('Running in Expo Go - using development config');
    return 'development';
  }

  // Default to preview for builds
  console.log('No environment detected - defaulting to preview');
  return 'preview';
}

// Get environment configuration
function getEnvironmentConfig(): EnvironmentConfig {
  const env = getEnvironment();
  const config = configurations[env];
  
  console.log('=== Final Environment Configuration ===');
  console.log('Selected environment:', env);
  console.log('Configuration:', config);
  console.log('Constants.appOwnership:', Constants.appOwnership);
  console.log('Constants.executionEnvironment:', Constants.executionEnvironment);
  console.log('=== End Configuration Debug ===');
  
  return config;
}

export const environmentConfig = getEnvironmentConfig();

// Export configurations for debugging
export const allConfigurations = configurations;
export const currentEnvironment = getEnvironment();