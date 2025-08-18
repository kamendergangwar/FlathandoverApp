export interface ApiConfig {
  baseURL: string;
  timeout: number;
  environment: string;
}

export const API_ENVIRONMENTS = {
  development: {
    baseURL: 'http://restlotterydev.cidcohomes.com/rest-api/applicationservice',
    timeout: 12000,
    environment: 'development',
  },
  staging: {
    baseURL: 'http://restlotterydev.cidcohomes.com/rest-api/applicationservice',
    timeout: 12000,
    environment: 'staging',
  },
  preview: {
    baseURL: 'http://restlotterydev.cidcohomes.com/rest-api/applicationservice',
    timeout: 12000,
    environment: 'preview',
  },
  production: {
    baseURL: 'https://your-production-domain.com/rest-api/applicationservice',
    timeout: 15000,
    environment: 'production',
  },
} as const;

// Function to get current environment
function getCurrentEnvironment(): keyof typeof API_ENVIRONMENTS {
  // You can change this logic based on your needs
  // For now, defaulting to preview for builds
  if (__DEV__) {
    return 'development';
  }
  
  // For builds, use preview environment
  return 'preview';
}

// Export the current API configuration
export const currentApiConfig: ApiConfig = API_ENVIRONMENTS[getCurrentEnvironment()];

// Export for debugging
export const debugInfo = {
  currentEnvironment: getCurrentEnvironment(),
  isDev: __DEV__,
  allConfigs: API_ENVIRONMENTS,
};