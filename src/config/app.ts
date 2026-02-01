/**
 * Odysseus Bank - App Configuration
 * Centralized configuration for app-wide settings
 */

export const appConfig = {
  /**
   * Simulated loading delay in milliseconds
   * Set to 0 for instant loading (production)
   * Set to 500-2000 for testing loading states
   */
  loadingDelay: 800,

  /**
   * Mock user data - change these to test different scenarios
   */
  mockUser: {
    name: 'Marcus Aurelius',
    email: 'marcus.aurelius@email.com',
    phone: '+60123456789',
  },

  /**
   * Mock account balances
   */
  mockBalances: {
    savings: 10000.0,
    current: 73566.75,
    investment: 25000.0,
  },

  /**
   * PIN code for fallback authentication
   * Used when biometric auth fails
   */
  pinCode: '123456',

  /**
   * Transfer limits - these control actual transfer validation
   * Reflected in Settings page and enforced during transfers
   */
  transferLimits: {
    daily: {
      limit: 10000, // Maximum daily transfer amount
      used: 2000, // Amount already used today
    },
    monthly: {
      limit: 20000, // Maximum monthly transfer amount
      used: 15000, // Amount already used this month
    },
    perTransaction: 6000, // Maximum single transfer amount
  },

  /**
   * API configuration
   */
  api: {
    baseUrl: 'https://api.odysseusbank.com',
    timeout: 30000,
  },

  /**
   * Mock API settings for testing
   */
  mockApi: {
    /**
     * Simulated network failure rate (0.0 to 1.0)
     * Set to 0 for no failures, 1.0 for 100% failure rate
     * Default: 0.05 (5% chance of network error)
     */
    networkFailureRate: 0.1,

    /**
     * Simulated transfer execution delay in milliseconds
     * Longer than normal API delay to simulate bank processing
     */
    transferDelay: 1500,
  },

  /**
   * Validation settings
   */
  validation: {
    /**
     * Warning threshold for approaching limits (0.0 to 1.0)
     * Shows warning when usage reaches this percentage of limit
     * Default: 0.8 (80%)
     */
    limitWarningThreshold: 0.8,
  },

  /**
   * Feature flags
   */
  features: {
    enableHaptics: true,
    enableBiometrics: true,
    enableOfflineMode: true,
  },
} as const;

export type AppConfig = typeof appConfig;
