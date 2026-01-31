/**
 * Odysseus Bank - Mock Data
 * Realistic test data for development and testing
 */

import type {
  User,
  Account,
  Recipient,
  Transaction,
  TransferLimits,
  Bank,
} from '@types';

/**
 * Current logged-in user
 */
export const mockUser: User = {
  id: 'user-001',
  name: 'Ahmad Razak',
  email: 'ahmad.razak@email.com',
  phone: '+60123456789',
  avatar: 'https://i.pravatar.cc/150?u=ahmad',
};

/**
 * User's bank accounts
 */
export const mockAccounts: Account[] = [
  {
    id: 'acc-001',
    name: 'Savings Account',
    accountNumber: '1234567890',
    type: 'savings',
    balance: 4500.0,
    currency: 'RM',
    isDefault: true,
  },
  {
    id: 'acc-002',
    name: 'Current Account',
    accountNumber: '0987654321',
    type: 'current',
    balance: 12350.75,
    currency: 'RM',
    isDefault: false,
  },
  {
    id: 'acc-003',
    name: 'Investment',
    accountNumber: '5556667778',
    type: 'investment',
    balance: 25000.0,
    currency: 'RM',
    isDefault: false,
  },
];

/**
 * Transfer limits
 */
export const mockTransferLimits: TransferLimits = {
  daily: {
    limit: 10000,
    used: 2500,
    remaining: 7500,
  },
  monthly: {
    limit: 50000,
    used: 15000,
    remaining: 35000,
  },
  perTransaction: 5000,
};

/**
 * Saved/Recent recipients
 */
export const mockRecipients: Recipient[] = [
  {
    id: 'rec-001',
    name: 'Sarah Jenkins',
    accountNumber: '8829145678',
    bankId: 'bank-001',
    bankName: 'Maybank',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    isFavorite: true,
    lastTransferDate: '2026-01-28T10:30:00Z',
  },
  {
    id: 'rec-002',
    name: 'John Doe',
    accountNumber: '4492789012',
    bankId: 'bank-002',
    bankName: 'CIMB Bank',
    avatar: 'https://i.pravatar.cc/150?u=john',
    isFavorite: true,
    lastTransferDate: '2026-01-25T14:20:00Z',
  },
  {
    id: 'rec-003',
    name: 'Lisa Wong',
    phoneNumber: '+60198765432',
    bankId: 'bank-001',
    bankName: 'Maybank',
    avatar: 'https://i.pravatar.cc/150?u=lisa',
    isFavorite: false,
    lastTransferDate: '2026-01-20T09:15:00Z',
  },
  {
    id: 'rec-004',
    name: 'Michael Tan',
    accountNumber: '5567123456',
    bankId: 'bank-003',
    bankName: 'Public Bank',
    avatar: 'https://i.pravatar.cc/150?u=michael',
    isFavorite: false,
    lastTransferDate: '2026-01-15T16:45:00Z',
  },
  {
    id: 'rec-005',
    name: 'Nur Aisyah',
    phoneNumber: '+60176543210',
    bankId: 'bank-004',
    bankName: 'RHB Bank',
    isFavorite: false,
    lastTransferDate: '2026-01-10T11:00:00Z',
  },
  {
    id: 'rec-006',
    name: 'David Lee',
    accountNumber: '3345678901',
    bankId: 'bank-005',
    bankName: 'Hong Leong Bank',
    avatar: 'https://i.pravatar.cc/150?u=david',
    isFavorite: true,
    lastTransferDate: '2026-01-05T08:30:00Z',
  },
];

/**
 * Malaysian banks
 */
export const mockBanks: Bank[] = [
  { id: 'bank-001', name: 'Maybank', shortName: 'MBB', isPopular: true },
  { id: 'bank-002', name: 'CIMB Bank', shortName: 'CIMB', isPopular: true },
  { id: 'bank-003', name: 'Public Bank', shortName: 'PBB', isPopular: true },
  { id: 'bank-004', name: 'RHB Bank', shortName: 'RHB', isPopular: true },
  {
    id: 'bank-005',
    name: 'Hong Leong Bank',
    shortName: 'HLB',
    isPopular: true,
  },
  { id: 'bank-006', name: 'AmBank', shortName: 'AMB', isPopular: false },
  { id: 'bank-007', name: 'Bank Islam', shortName: 'BIMB', isPopular: false },
  { id: 'bank-008', name: 'Bank Rakyat', shortName: 'BKRM', isPopular: false },
  { id: 'bank-009', name: 'OCBC Bank', shortName: 'OCBC', isPopular: false },
  { id: 'bank-010', name: 'UOB Malaysia', shortName: 'UOB', isPopular: false },
  {
    id: 'bank-011',
    name: 'Standard Chartered',
    shortName: 'SCB',
    isPopular: false,
  },
  {
    id: 'bank-012',
    name: 'HSBC Malaysia',
    shortName: 'HSBC',
    isPopular: false,
  },
  { id: 'bank-013', name: 'Affin Bank', shortName: 'AFIN', isPopular: false },
  { id: 'bank-014', name: 'Alliance Bank', shortName: 'ABM', isPopular: false },
  { id: 'bank-015', name: 'Bank Muamalat', shortName: 'BMM', isPopular: false },
];

/**
 * Transaction history
 */
export const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    type: 'transfer',
    status: 'completed',
    amount: 250.0,
    currency: 'RM',
    recipient: {
      id: 'rec-001',
      name: 'Sarah Jenkins',
      accountNumber: '8829145678',
      bankName: 'Maybank',
    },
    sender: {
      id: 'user-001',
      name: 'Ahmad Razak',
      accountNumber: '1234567890',
    },
    note: 'Lunch money',
    reference: 'ODS-88291',
    createdAt: '2026-01-28T10:30:00Z',
    completedAt: '2026-01-28T10:30:05Z',
  },
  {
    id: 'txn-002',
    type: 'transfer',
    status: 'completed',
    amount: 1500.0,
    currency: 'RM',
    recipient: {
      id: 'rec-002',
      name: 'John Doe',
      accountNumber: '4492789012',
      bankName: 'CIMB Bank',
    },
    sender: {
      id: 'user-001',
      name: 'Ahmad Razak',
      accountNumber: '1234567890',
    },
    note: 'Rent payment',
    reference: 'ODS-88290',
    createdAt: '2026-01-25T14:20:00Z',
    completedAt: '2026-01-25T14:20:08Z',
  },
  {
    id: 'txn-003',
    type: 'transfer',
    status: 'completed',
    amount: 100.0,
    currency: 'RM',
    recipient: {
      id: 'rec-003',
      name: 'Lisa Wong',
      phoneNumber: '+60198765432',
      bankName: 'Maybank',
    },
    sender: {
      id: 'user-001',
      name: 'Ahmad Razak',
      accountNumber: '1234567890',
    },
    reference: 'ODS-88289',
    createdAt: '2026-01-20T09:15:00Z',
    completedAt: '2026-01-20T09:15:03Z',
  },
  {
    id: 'txn-004',
    type: 'transfer',
    status: 'completed',
    amount: 500.0,
    currency: 'RM',
    recipient: {
      id: 'rec-004',
      name: 'Michael Tan',
      accountNumber: '5567123456',
      bankName: 'Public Bank',
    },
    sender: {
      id: 'user-001',
      name: 'Ahmad Razak',
      accountNumber: '1234567890',
    },
    note: 'Birthday gift',
    reference: 'ODS-88288',
    createdAt: '2026-01-15T16:45:00Z',
    completedAt: '2026-01-15T16:45:06Z',
  },
  {
    id: 'txn-005',
    type: 'transfer',
    status: 'completed',
    amount: 150.0,
    currency: 'RM',
    recipient: {
      id: 'rec-005',
      name: 'Nur Aisyah',
      phoneNumber: '+60176543210',
      bankName: 'RHB Bank',
    },
    sender: {
      id: 'user-001',
      name: 'Ahmad Razak',
      accountNumber: '1234567890',
    },
    reference: 'ODS-88287',
    createdAt: '2026-01-10T11:00:00Z',
    completedAt: '2026-01-10T11:00:04Z',
  },
];

/**
 * Generate unique reference ID
 */
export function generateReferenceId(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `ODS-${num}`;
}

/**
 * Generate unique transaction ID
 */
export function generateTransactionId(): string {
  return `txn-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
