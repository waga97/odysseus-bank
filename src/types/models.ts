/**
 * Odysseus Bank - Data Models
 * Type definitions for all data entities
 */

/**
 * User / Account Types
 */
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Account {
  id: string;
  name: string;
  accountNumber: string;
  type: 'savings' | 'current' | 'investment';
  balance: number;
  currency: string;
  isDefault: boolean;
}

export interface TransferLimits {
  daily: {
    limit: number;
    used: number;
    remaining: number;
  };
  monthly: {
    limit: number;
    used: number;
    remaining: number;
  };
  perTransaction: number;
}

/**
 * Recipient Types
 */
export interface Recipient {
  id: string;
  name: string;
  accountNumber?: string;
  phoneNumber?: string;
  bankId?: string;
  bankName?: string;
  avatar?: string;
  isFavorite: boolean;
  lastTransferDate?: string;
}

export interface Bank {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  isPopular: boolean;
}

/**
 * Transaction Types
 */
export type TransactionStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed';
export type TransactionType = 'transfer' | 'payment' | 'topup' | 'withdrawal';

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  recipient: {
    id: string;
    name: string;
    accountNumber?: string;
    phoneNumber?: string;
    bankName?: string;
  };
  sender: {
    id: string;
    name: string;
    accountNumber: string;
  };
  note?: string;
  reference: string;
  createdAt: string;
  completedAt?: string;
}

/**
 * Transfer Request Types
 */
export interface TransferRequest {
  recipientId?: string;
  recipientAccountNumber?: string;
  recipientPhoneNumber?: string;
  bankId?: string;
  amount: number;
  note?: string;
  fromAccountId: string;
}

export interface TransferValidationResult {
  isValid: boolean;
  errors: {
    field: string;
    message: string;
  }[];
  warnings: {
    type: 'daily_limit_warning' | 'monthly_limit_warning';
    message: string;
  }[];
}

/**
 * Biometric Types
 */
export type BiometricType = 'fingerprint' | 'facial' | 'iris';

export interface BiometricStatus {
  isAvailable: boolean;
  isEnrolled: boolean;
  supportedTypes: BiometricType[];
  preferredType?: BiometricType;
}

/**
 * API Response Types
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
