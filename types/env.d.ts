declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_BASE_URL: string;
      EXPO_PUBLIC_API_TIMEOUT: string;
      EXPO_PUBLIC_ENV: string;
    }
  }
}

// Ensure this file is treated as a module
export {};