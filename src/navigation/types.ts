/**
 * Odysseus Bank - Navigation Types
 * Type definitions for all navigation routes and params
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * Root Stack - Main app navigation
 */
export type RootStackParamList = {
  // Main tabs
  Home: undefined;

  // Transfer flow
  TransferHub: undefined;
  BankSelection: undefined;
  RecipientDetails: {
    bankId: string;
    bankName: string;
  };
  ContactPicker: undefined;
  AmountEntry: {
    recipient: {
      id: string;
      name: string;
      accountNumber?: string;
      phoneNumber?: string;
      bankName?: string;
      avatar?: string;
    };
  };
  TransferReview: {
    recipient: {
      id: string;
      name: string;
      accountNumber?: string;
      phoneNumber?: string;
      bankName?: string;
      avatar?: string;
    };
    amount: number;
    note?: string;
  };
  BiometricAuth: {
    recipient: {
      id: string;
      name: string;
      accountNumber?: string;
      phoneNumber?: string;
      bankName?: string;
      avatar?: string;
    };
    amount: number;
    note?: string;
  };
  TransferProcessing: {
    transferId: string;
    recipient: {
      id: string;
      name: string;
      accountNumber?: string;
      phoneNumber?: string;
      bankName?: string;
      avatar?: string;
    };
    amount: number;
    note?: string;
  };
  TransferSuccess: {
    transaction: {
      id: string;
      amount: number;
      recipientName: string;
      recipientAccount?: string;
      bankName?: string;
      date: string;
      reference: string;
      note?: string;
    };
  };
  TransferError: {
    errorType:
      | 'insufficient_funds'
      | 'network_error'
      | 'daily_limit'
      | 'monthly_limit'
      | 'recipient_not_found'
      | 'duplicate_transfer'
      | 'generic';
    errorMessage?: string;
    details?: Record<string, unknown>;
  };

  // History
  TransferHistory: undefined;
  TransactionDetails: {
    transactionId: string;
  };

  // Settings
  Settings: undefined;
};

/**
 * Screen props helper types
 */
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

/**
 * Navigation prop type for useNavigation hook
 */
export type { NativeStackNavigationProp } from '@react-navigation/native-stack';

/**
 * Route prop type for useRoute hook
 */
export type { RouteProp } from '@react-navigation/native';
