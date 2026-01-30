/**
 * Odysseus Bank - API Endpoints
 * Uses mock API directly for development
 */

import { mockApi } from '../mocks/mockApi';
import type {
  User,
  Account,
  Recipient,
  Transaction,
  TransferLimits,
  Bank,
  TransferRequest,
  TransferValidationResult,
  PaginatedResponse,
} from '@types/models';

/**
 * User API
 */
export const userApi = {
  getProfile: (): Promise<User> => mockApi.getUser(),
  getLimits: (): Promise<TransferLimits> => mockApi.getLimits(),
};

/**
 * Account API
 */
export const accountApi = {
  getAccounts: (): Promise<Account[]> => mockApi.getAccounts(),
};

/**
 * Recipient API
 */
export const recipientApi = {
  getRecipients: (): Promise<Recipient[]> => mockApi.getRecipients(),
  lookupRecipient: (params: {
    accountNumber?: string;
    phoneNumber?: string;
  }): Promise<Recipient> => mockApi.lookupRecipient(params),
};

/**
 * Bank API
 */
export const bankApi = {
  getBanks: (): Promise<Bank[]> => mockApi.getBanks(),
};

/**
 * Transfer API
 */
export const transferApi = {
  validate: (request: TransferRequest): Promise<TransferValidationResult> =>
    mockApi.validateTransfer(request),
  execute: (
    request: TransferRequest & { recipientName?: string; bankName?: string }
  ): Promise<Transaction> => mockApi.executeTransfer(request),
};

/**
 * Transaction API
 */
export const transactionApi = {
  getTransactions: (params?: {
    limit?: number;
    page?: number;
  }): Promise<PaginatedResponse<Transaction>> =>
    mockApi.getTransactions(params),
  getTransaction: (id: string): Promise<Transaction> =>
    mockApi.getTransaction(id),
};
