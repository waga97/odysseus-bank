/**
 * Odysseus Bank - Mock API
 * Simple fetch mock for React Native (no MSW dependency)
 */

import {
  mockUser,
  mockAccounts,
  mockRecipients,
  mockTransactions,
  mockTransferLimits,
  mockBanks,
  generateReferenceId,
  generateTransactionId,
} from './data';
import type { Transaction, TransferRequest } from '@types';

// In-memory state for mutations
let currentBalance = mockAccounts[0]?.balance ?? 0;
let dailyUsed = mockTransferLimits.daily.used;
const transactions = [...mockTransactions];

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const randomDelay = () => delay(300 + Math.random() * 500);

/**
 * Mock API functions
 */
export const mockApi = {
  // User
  async getUser() {
    await randomDelay();
    return mockUser;
  },

  // Accounts
  async getAccounts() {
    await randomDelay();
    return mockAccounts.map((acc, index) =>
      index === 0 ? { ...acc, balance: currentBalance } : acc
    );
  },

  // Limits
  async getLimits() {
    await randomDelay();
    return {
      ...mockTransferLimits,
      daily: {
        ...mockTransferLimits.daily,
        used: dailyUsed,
        remaining: mockTransferLimits.daily.limit - dailyUsed,
      },
    };
  },

  // Recipients
  async getRecipients() {
    await randomDelay();
    return mockRecipients;
  },

  async lookupRecipient(params: {
    accountNumber?: string;
    phoneNumber?: string;
  }) {
    await randomDelay();

    // Simulate not found
    if (
      params.accountNumber === '0000000000' ||
      params.phoneNumber === '+60100000000'
    ) {
      throw new Error('RECIPIENT_NOT_FOUND');
    }

    return {
      id: `rec-new-${Date.now()}`,
      name: 'New Recipient',
      accountNumber: params.accountNumber,
      phoneNumber: params.phoneNumber,
      bankName: 'Maybank',
      isFavorite: false,
    };
  },

  // Banks
  async getBanks() {
    await randomDelay();
    return mockBanks;
  },

  // Transfer validation
  async validateTransfer(request: TransferRequest) {
    await randomDelay();

    const errors: { field: string; message: string }[] = [];
    const warnings: {
      type: 'daily_limit_warning' | 'duplicate_transfer';
      message: string;
      details?: Record<string, unknown>;
    }[] = [];

    // Check balance
    if (request.amount > currentBalance) {
      errors.push({
        field: 'amount',
        message: `Insufficient funds. Available balance: RM ${currentBalance.toFixed(2)}`,
      });
    }

    // Check daily limit
    const remainingLimit = mockTransferLimits.daily.limit - dailyUsed;
    if (request.amount > remainingLimit) {
      errors.push({
        field: 'amount',
        message: `Daily limit exceeded. Remaining limit: RM ${remainingLimit.toFixed(2)}`,
      });
    }

    // Check per-transaction limit
    if (request.amount > mockTransferLimits.perTransaction) {
      errors.push({
        field: 'amount',
        message: `Amount exceeds per-transaction limit of RM ${mockTransferLimits.perTransaction.toFixed(2)}`,
      });
    }

    // Warning for approaching daily limit
    const newDailyUsed = dailyUsed + request.amount;
    if (
      newDailyUsed >= mockTransferLimits.daily.limit * 0.8 &&
      errors.length === 0
    ) {
      warnings.push({
        type: 'daily_limit_warning' as const,
        message: `You're approaching your daily transfer limit.`,
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  },

  // Execute transfer
  async executeTransfer(
    request: TransferRequest & { recipientName?: string; bankName?: string }
  ): Promise<Transaction> {
    await delay(1500); // Longer delay for transfer

    // Simulate random network failure (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('NETWORK_ERROR');
    }

    // Check balance
    if (request.amount > currentBalance) {
      throw new Error('INSUFFICIENT_FUNDS');
    }

    // Check daily limit
    if (request.amount > mockTransferLimits.daily.limit - dailyUsed) {
      throw new Error('DAILY_LIMIT_EXCEEDED');
    }

    // Execute transfer
    currentBalance -= request.amount;
    dailyUsed += request.amount;

    const newTransaction: Transaction = {
      id: generateTransactionId(),
      type: 'transfer',
      status: 'completed',
      amount: request.amount,
      currency: 'RM',
      recipient: {
        id: request.recipientId ?? `rec-${Date.now()}`,
        name: request.recipientName ?? 'Unknown Recipient',
        accountNumber: request.recipientAccountNumber,
        phoneNumber: request.recipientPhoneNumber,
        bankName: request.bankName,
      },
      sender: {
        id: mockUser.id,
        name: mockUser.name,
        accountNumber: mockAccounts[0]?.accountNumber ?? '',
      },
      note: request.note,
      reference: generateReferenceId(),
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    transactions.unshift(newTransaction);
    return newTransaction;
  },

  // Transactions
  async getTransactions(params?: { limit?: number; page?: number }) {
    await randomDelay();
    const limit = params?.limit ?? 20;
    const page = params?.page ?? 1;
    const start = (page - 1) * limit;
    const end = start + limit;
    const items = transactions.slice(start, end);

    return {
      items,
      total: transactions.length,
      page,
      pageSize: limit,
      hasMore: end < transactions.length,
    };
  },

  async getTransaction(id: string) {
    await randomDelay();
    const transaction = transactions.find((t) => t.id === id);
    if (!transaction) {
      throw new Error('NOT_FOUND');
    }
    return transaction;
  },

  // Reset state (for testing)
  reset() {
    currentBalance = mockAccounts[0]?.balance ?? 0;
    dailyUsed = mockTransferLimits.daily.used;
    transactions.length = 0;
    transactions.push(...mockTransactions);
  },
};

export default mockApi;
