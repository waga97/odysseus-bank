/**
 * Odysseus Bank - API Endpoints
 * Type-safe API methods for all endpoints
 */

import { apiClient } from './client';
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
  getProfile: () => apiClient.get<User>('/api/user'),

  getLimits: () => apiClient.get<TransferLimits>('/api/user/limits'),
};

/**
 * Account API
 */
export const accountApi = {
  getAccounts: () => apiClient.get<Account[]>('/api/accounts'),
};

/**
 * Recipient API
 */
export const recipientApi = {
  getRecipients: () => apiClient.get<Recipient[]>('/api/recipients'),

  lookupRecipient: (params: { accountNumber?: string; phoneNumber?: string }) =>
    apiClient.get<Recipient>('/api/recipients/lookup', params),

  addFavorite: (recipientId: string) =>
    apiClient.post<Recipient>('/api/recipients/favorite', { recipientId }),
};

/**
 * Bank API
 */
export const bankApi = {
  getBanks: () => apiClient.get<Bank[]>('/api/banks'),
};

/**
 * Transfer API
 */
export const transferApi = {
  validate: (request: TransferRequest) =>
    apiClient.post<TransferValidationResult>('/api/transfer/validate', request),

  execute: (
    request: TransferRequest & {
      recipientName?: string;
      bankName?: string;
    }
  ) => apiClient.post<Transaction>('/api/transfer', request),
};

/**
 * Transaction API
 */
export const transactionApi = {
  getTransactions: (params?: { limit?: number; page?: number }) =>
    apiClient.get<PaginatedResponse<Transaction>>('/api/transactions', params),

  getTransaction: (id: string) =>
    apiClient.get<Transaction>(`/api/transactions/${id}`),
};
