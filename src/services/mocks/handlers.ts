/**
 * Odysseus Bank - MSW Request Handlers
 * Mock API endpoints for development and testing
 */

import { http, HttpResponse, delay } from 'msw';
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
import type { Transaction, TransferRequest } from '@types/models';

const API_BASE = 'https://api.odysseusbank.com';

// Simulate realistic network delay
const NETWORK_DELAY = { min: 300, max: 800 };

async function simulateDelay() {
  const ms = Math.random() * (NETWORK_DELAY.max - NETWORK_DELAY.min) + NETWORK_DELAY.min;
  await delay(ms);
}

// In-memory state for mutations
let currentBalance = mockAccounts[0]?.balance ?? 0;
let dailyUsed = mockTransferLimits.daily.used;
const transactions = [...mockTransactions];

export const handlers = [
  /**
   * GET /api/user - Get current user profile
   */
  http.get(`${API_BASE}/api/user`, async () => {
    await simulateDelay();
    return HttpResponse.json({
      success: true,
      data: mockUser,
    });
  }),

  /**
   * GET /api/accounts - Get user's bank accounts
   */
  http.get(`${API_BASE}/api/accounts`, async () => {
    await simulateDelay();
    const accountsWithUpdatedBalance = mockAccounts.map((acc, index) =>
      index === 0 ? { ...acc, balance: currentBalance } : acc
    );
    return HttpResponse.json({
      success: true,
      data: accountsWithUpdatedBalance,
    });
  }),

  /**
   * GET /api/user/limits - Get transfer limits
   */
  http.get(`${API_BASE}/api/user/limits`, async () => {
    await simulateDelay();
    return HttpResponse.json({
      success: true,
      data: {
        ...mockTransferLimits,
        daily: {
          ...mockTransferLimits.daily,
          used: dailyUsed,
          remaining: mockTransferLimits.daily.limit - dailyUsed,
        },
      },
    });
  }),

  /**
   * GET /api/recipients - Get saved recipients
   */
  http.get(`${API_BASE}/api/recipients`, async () => {
    await simulateDelay();
    return HttpResponse.json({
      success: true,
      data: mockRecipients,
    });
  }),

  /**
   * GET /api/recipients/lookup - Lookup recipient by account/phone
   */
  http.get(`${API_BASE}/api/recipients/lookup`, async ({ request }) => {
    await simulateDelay();
    const url = new URL(request.url);
    const accountNumber = url.searchParams.get('accountNumber');
    const phoneNumber = url.searchParams.get('phoneNumber');

    // Simulate not found for specific test cases
    if (accountNumber === '0000000000' || phoneNumber === '+60100000000') {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'RECIPIENT_NOT_FOUND',
            message: 'No account found with the provided details',
          },
        },
        { status: 404 }
      );
    }

    // Return a mock recipient for valid lookups
    return HttpResponse.json({
      success: true,
      data: {
        id: `rec-new-${Date.now()}`,
        name: 'New Recipient',
        accountNumber: accountNumber ?? undefined,
        phoneNumber: phoneNumber ?? undefined,
        bankName: 'Maybank',
        isFavorite: false,
      },
    });
  }),

  /**
   * GET /api/banks - Get list of supported banks
   */
  http.get(`${API_BASE}/api/banks`, async () => {
    await simulateDelay();
    return HttpResponse.json({
      success: true,
      data: mockBanks,
    });
  }),

  /**
   * POST /api/transfer/validate - Validate transfer before execution
   */
  http.post(`${API_BASE}/api/transfer/validate`, async ({ request }) => {
    await simulateDelay();
    const body = (await request.json()) as TransferRequest;
    const { amount } = body;

    const errors: { field: string; message: string }[] = [];
    const warnings: { type: string; message: string; details?: Record<string, unknown> }[] = [];

    // Check balance
    if (amount > currentBalance) {
      errors.push({
        field: 'amount',
        message: `Insufficient funds. Available balance: RM ${currentBalance.toFixed(2)}`,
      });
    }

    // Check daily limit
    if (amount > mockTransferLimits.daily.limit - dailyUsed) {
      errors.push({
        field: 'amount',
        message: `Daily limit exceeded. Remaining limit: RM ${(mockTransferLimits.daily.limit - dailyUsed).toFixed(2)}`,
      });
    }

    // Check per-transaction limit
    if (amount > mockTransferLimits.perTransaction) {
      errors.push({
        field: 'amount',
        message: `Amount exceeds per-transaction limit of RM ${mockTransferLimits.perTransaction.toFixed(2)}`,
      });
    }

    // Warning for approaching daily limit (80%+)
    const newDailyUsed = dailyUsed + amount;
    if (newDailyUsed >= mockTransferLimits.daily.limit * 0.8 && errors.length === 0) {
      warnings.push({
        type: 'daily_limit_warning',
        message: `You're approaching your daily transfer limit. After this transfer, you'll have RM ${(mockTransferLimits.daily.limit - newDailyUsed).toFixed(2)} remaining.`,
      });
    }

    // Check for duplicate transfer (same amount to same recipient in last 5 mins)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const duplicateTxn = transactions.find(
      (t) =>
        t.amount === amount &&
        (t.recipient.id === body.recipientId ||
          t.recipient.accountNumber === body.recipientAccountNumber) &&
        t.createdAt > fiveMinutesAgo
    );

    if (duplicateTxn) {
      warnings.push({
        type: 'duplicate_transfer',
        message: 'You made a similar transfer recently. Are you sure you want to proceed?',
        details: {
          previousTransactionId: duplicateTxn.id,
          previousAmount: duplicateTxn.amount,
          previousDate: duplicateTxn.createdAt,
        },
      });
    }

    return HttpResponse.json({
      success: true,
      data: {
        isValid: errors.length === 0,
        errors,
        warnings,
      },
    });
  }),

  /**
   * POST /api/transfer - Execute transfer
   */
  http.post(`${API_BASE}/api/transfer`, async ({ request }) => {
    await delay(1500); // Longer delay for transfer
    const body = (await request.json()) as TransferRequest & {
      recipientName?: string;
      bankName?: string;
    };

    // Simulate random network failure (10% chance)
    if (Math.random() < 0.1) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'NETWORK_ERROR',
            message: 'Network error occurred. Please try again.',
          },
        },
        { status: 500 }
      );
    }

    // Check balance again
    if (body.amount > currentBalance) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'INSUFFICIENT_FUNDS',
            message: 'Insufficient funds for this transfer',
            details: {
              currentBalance,
              requiredAmount: body.amount,
            },
          },
        },
        { status: 400 }
      );
    }

    // Check daily limit
    if (body.amount > mockTransferLimits.daily.limit - dailyUsed) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'DAILY_LIMIT_EXCEEDED',
            message: "You've reached your daily transfer limit",
            details: {
              dailyLimit: mockTransferLimits.daily.limit,
              dailyUsed,
              remaining: mockTransferLimits.daily.limit - dailyUsed,
            },
          },
        },
        { status: 400 }
      );
    }

    // Execute transfer
    currentBalance -= body.amount;
    dailyUsed += body.amount;

    const newTransaction: Transaction = {
      id: generateTransactionId(),
      type: 'transfer',
      status: 'completed',
      amount: body.amount,
      currency: 'RM',
      recipient: {
        id: body.recipientId ?? `rec-${Date.now()}`,
        name: body.recipientName ?? 'Unknown Recipient',
        accountNumber: body.recipientAccountNumber,
        phoneNumber: body.recipientPhoneNumber,
        bankName: body.bankName,
      },
      sender: {
        id: mockUser.id,
        name: mockUser.name,
        accountNumber: mockAccounts[0]?.accountNumber ?? '',
      },
      note: body.note,
      reference: generateReferenceId(),
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    transactions.unshift(newTransaction);

    return HttpResponse.json({
      success: true,
      data: newTransaction,
    });
  }),

  /**
   * GET /api/transactions - Get transaction history
   */
  http.get(`${API_BASE}/api/transactions`, async ({ request }) => {
    await simulateDelay();
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') ?? '20', 10);
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);

    const start = (page - 1) * limit;
    const end = start + limit;
    const items = transactions.slice(start, end);

    return HttpResponse.json({
      success: true,
      data: {
        items,
        total: transactions.length,
        page,
        pageSize: limit,
        hasMore: end < transactions.length,
      },
    });
  }),

  /**
   * GET /api/transactions/:id - Get single transaction
   */
  http.get(`${API_BASE}/api/transactions/:id`, async ({ params }) => {
    await simulateDelay();
    const { id } = params;
    const transaction = transactions.find((t) => t.id === id);

    if (!transaction) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Transaction not found',
          },
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: transaction,
    });
  }),
];

export default handlers;
