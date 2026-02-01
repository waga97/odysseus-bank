/**
 * Odysseus Bank - Account Store
 * Manages user account data, recipients, and transactions
 */

import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type {
  Account,
  Recipient,
  Transaction,
  TransferLimits,
  Bank,
} from '@types';

interface AccountState {
  // State
  accounts: Account[];
  defaultAccount: Account | null;
  recipients: Recipient[];
  transactions: Transaction[];
  transferLimits: TransferLimits | null;
  banks: Bank[];
  isLoading: boolean;
  error: string | null;
  isBalanceHidden: boolean;

  // Account Actions
  setAccounts: (accounts: Account[]) => void;
  setDefaultAccount: (account: Account) => void;
  updateBalance: (accountId: string, newBalance: number) => void;

  // Recipient Actions
  setRecipients: (recipients: Recipient[]) => void;
  addRecipient: (recipient: Recipient) => void;
  updateRecipient: (id: string, updates: Partial<Recipient>) => void;
  toggleFavorite: (id: string) => void;

  // Transaction Actions
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransactionStatus: (id: string, status: Transaction['status']) => void;

  // Limits Actions
  setTransferLimits: (limits: TransferLimits) => void;
  updateDailyUsed: (amount: number) => void;
  updateMonthlyUsed: (amount: number) => void;
  updateLimitsUsed: (amount: number) => void;

  // Bank Actions
  setBanks: (banks: Bank[]) => void;

  // Utility Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  // Balance Visibility
  toggleBalanceVisibility: () => void;
  setBalanceHidden: (hidden: boolean) => void;
}

const initialState = {
  accounts: [],
  defaultAccount: null,
  recipients: [],
  transactions: [],
  transferLimits: null,
  banks: [],
  isLoading: false,
  error: null,
  isBalanceHidden: false,
};

export const useAccountStore = create<AccountState>((set, get) => ({
  ...initialState,

  // Account Actions
  setAccounts: (accounts) => {
    const defaultAccount =
      accounts.find((a) => a.isDefault) ?? accounts[0] ?? null;
    set({ accounts, defaultAccount });
  },

  setDefaultAccount: (account) => set({ defaultAccount: account }),

  updateBalance: (accountId, newBalance) =>
    set((state) => ({
      accounts: state.accounts.map((a) =>
        a.id === accountId ? { ...a, balance: newBalance } : a
      ),
      defaultAccount:
        state.defaultAccount?.id === accountId
          ? { ...state.defaultAccount, balance: newBalance }
          : state.defaultAccount,
    })),

  // Recipient Actions
  setRecipients: (recipients) => set({ recipients }),

  addRecipient: (recipient) =>
    set((state) => ({
      recipients: [recipient, ...state.recipients],
    })),

  updateRecipient: (id, updates) =>
    set((state) => ({
      recipients: state.recipients.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    })),

  toggleFavorite: (id) => {
    const { recipients } = get();
    const recipient = recipients.find((r) => r.id === id);
    if (recipient) {
      get().updateRecipient(id, { isFavorite: !recipient.isFavorite });
    }
  },

  // Transaction Actions
  setTransactions: (transactions) => set({ transactions }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),

  updateTransactionStatus: (id, status) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, status } : t
      ),
    })),

  // Limits Actions
  setTransferLimits: (limits) => set({ transferLimits: limits }),

  updateDailyUsed: (amount) =>
    set((state) => {
      if (!state.transferLimits) {
        return state;
      }
      const newUsed = state.transferLimits.daily.used + amount;
      return {
        transferLimits: {
          ...state.transferLimits,
          daily: {
            ...state.transferLimits.daily,
            used: newUsed,
            remaining: state.transferLimits.daily.limit - newUsed,
          },
        },
      };
    }),

  updateMonthlyUsed: (amount) =>
    set((state) => {
      if (!state.transferLimits) {
        return state;
      }
      const newUsed = state.transferLimits.monthly.used + amount;
      return {
        transferLimits: {
          ...state.transferLimits,
          monthly: {
            ...state.transferLimits.monthly,
            used: newUsed,
            remaining: state.transferLimits.monthly.limit - newUsed,
          },
        },
      };
    }),

  // Combined update for both daily and monthly - use this for transfers
  updateLimitsUsed: (amount) =>
    set((state) => {
      if (!state.transferLimits) {
        return state;
      }
      const newDailyUsed = state.transferLimits.daily.used + amount;
      const newMonthlyUsed = state.transferLimits.monthly.used + amount;
      return {
        transferLimits: {
          ...state.transferLimits,
          daily: {
            ...state.transferLimits.daily,
            used: newDailyUsed,
            remaining: state.transferLimits.daily.limit - newDailyUsed,
          },
          monthly: {
            ...state.transferLimits.monthly,
            used: newMonthlyUsed,
            remaining: state.transferLimits.monthly.limit - newMonthlyUsed,
          },
        },
      };
    }),

  // Bank Actions
  setBanks: (banks) => set({ banks }),

  // Utility Actions
  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),

  // Balance Visibility
  toggleBalanceVisibility: () =>
    set((state) => ({ isBalanceHidden: !state.isBalanceHidden })),

  setBalanceHidden: (hidden) => set({ isBalanceHidden: hidden }),
}));

/**
 * Selector hooks for optimized re-renders
 */
export const useDefaultAccount = () =>
  useAccountStore((state) => state.defaultAccount);
export const useAccounts = () => useAccountStore((state) => state.accounts);
export const useBalance = () =>
  useAccountStore((state) => state.defaultAccount?.balance ?? 0);
export const useRecipients = () => useAccountStore((state) => state.recipients);

/**
 * Computed selector: Returns recipients sorted by last transfer date (most recent first)
 * Limited to 10 items for performance
 */
export const useRecentRecipients = () =>
  useAccountStore((state) => {
    const sorted = [...state.recipients].sort((a, b) => {
      if (!a.lastTransferDate) {
        return 1;
      }
      if (!b.lastTransferDate) {
        return -1;
      }
      return (
        new Date(b.lastTransferDate).getTime() -
        new Date(a.lastTransferDate).getTime()
      );
    });
    return sorted.slice(0, 10);
  });

/**
 * Computed selector: Returns only favorite recipients
 */
export const useFavoriteRecipients = () =>
  useAccountStore((state) => state.recipients.filter((r) => r.isFavorite));
export const useTransactions = () =>
  useAccountStore((state) => state.transactions);
export const useTransferLimits = () =>
  useAccountStore((state) => state.transferLimits);
export const useBanks = () => useAccountStore((state) => state.banks);
export const useBalanceVisibility = () =>
  useAccountStore(
    useShallow((state) => ({
      isHidden: state.isBalanceHidden,
      toggle: state.toggleBalanceVisibility,
    }))
  );

/**
 * Optimized selector for multiple actions - uses shallow comparison
 */
export const useAccountActions = () =>
  useAccountStore(
    useShallow((state) => ({
      setAccounts: state.setAccounts,
      setRecipients: state.setRecipients,
      setTransactions: state.setTransactions,
      setTransferLimits: state.setTransferLimits,
      setBanks: state.setBanks,
      setLoading: state.setLoading,
      updateBalance: state.updateBalance,
      updateLimitsUsed: state.updateLimitsUsed,
      addTransaction: state.addTransaction,
    }))
  );
