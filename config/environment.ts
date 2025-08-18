import { currentApiConfig, debugInfo } from './api-config';

// Re-export API configuration as environment configuration for backward compatibility
export const environmentConfig = currentApiConfig;

// Export configurations for debugging
export const allConfigurations = debugInfo.allConfigs;
export const currentEnvironment = debugInfo.currentEnvironment;