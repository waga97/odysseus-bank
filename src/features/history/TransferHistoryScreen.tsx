/**
 * Odysseus Bank - Transfer History Screen
 * List of past transactions with pagination and pull-to-refresh
 */

import React, { useCallback, useState, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Icon, Avatar } from '@components/ui';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import { formatCurrency } from '@utils/currency';
import type { RootStackScreenProps } from '@navigation/types';
import type { Transaction } from '@types';
import { appConfig } from '@config/app';
import { SkeletonTransactionCard } from '@components/ui';

type Props = RootStackScreenProps<'TransferHistory'>;

// Mock transaction data
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-001',
    type: 'transfer',
    status: 'completed',
    amount: 250.0,
    currency: 'MYR',
    recipient: {
      id: 'r1',
      name: 'Sarah Jenkins',
      accountNumber: '1234567890',
      bankName: 'Maybank',
    },
    sender: { id: 's1', name: 'You', accountNumber: '9876543210' },
    reference: 'ODS-12345',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    completedAt: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
  },
  {
    id: 'txn-002',
    type: 'transfer',
    status: 'completed',
    amount: 1500.0,
    currency: 'MYR',
    recipient: {
      id: 'r2',
      name: 'Ahmad Rizal',
      phoneNumber: '+60123456789',
      bankName: 'CIMB Bank',
    },
    sender: { id: 's1', name: 'You', accountNumber: '9876543210' },
    reference: 'ODS-12344',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 'txn-003',
    type: 'transfer',
    status: 'completed',
    amount: 89.5,
    currency: 'MYR',
    recipient: {
      id: 'r3',
      name: 'Lisa Wong',
      accountNumber: '5678901234',
      bankName: 'Public Bank',
    },
    sender: { id: 's1', name: 'You', accountNumber: '9876543210' },
    note: 'Lunch payment',
    reference: 'ODS-12343',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'txn-004',
    type: 'transfer',
    status: 'failed',
    amount: 500.0,
    currency: 'MYR',
    recipient: {
      id: 'r4',
      name: 'John Tan',
      accountNumber: '1122334455',
      bankName: 'RHB Bank',
    },
    sender: { id: 's1', name: 'You', accountNumber: '9876543210' },
    reference: 'ODS-12342',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: 'txn-005',
    type: 'transfer',
    status: 'completed',
    amount: 2000.0,
    currency: 'MYR',
    recipient: {
      id: 'r5',
      name: 'Mei Ling',
      phoneNumber: '+60198765432',
      bankName: 'Hong Leong Bank',
    },
    sender: { id: 's1', name: 'You', accountNumber: '9876543210' },
    note: 'Monthly rent',
    reference: 'ODS-12341',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'txn-006',
    type: 'transfer',
    status: 'completed',
    amount: 350.0,
    currency: 'MYR',
    recipient: {
      id: 'r6',
      name: 'David Lee',
      accountNumber: '9988776655',
      bankName: 'AmBank',
    },
    sender: { id: 's1', name: 'You', accountNumber: '9876543210' },
    reference: 'ODS-12340',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
];

// Group transactions by date
interface TransactionGroup {
  title: string;
  data: Transaction[];
}

function groupTransactionsByDate(
  transactions: Transaction[]
): TransactionGroup[] {
  const groups: Record<string, Transaction[]> = {};
  const now = new Date();
  const today = now.toDateString();
  const yesterday = new Date(now.getTime() - 86400000).toDateString();

  transactions.forEach((txn) => {
    const date = new Date(txn.createdAt);
    const dateStr = date.toDateString();

    let groupKey: string;
    if (dateStr === today) {
      groupKey = 'Today';
    } else if (dateStr === yesterday) {
      groupKey = 'Yesterday';
    } else {
      groupKey = date.toLocaleDateString('en-MY', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey]?.push(txn);
  });

  return Object.entries(groups).map(([title, data]) => ({ title, data }));
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-MY', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function TransferHistoryScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Initial load with skeleton delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setTransactions(MOCK_TRANSACTIONS);
      setIsLoading(false);
    }, appConfig.loadingDelay);

    return () => clearTimeout(timer);
  }, []);

  const groupedTransactions = useMemo(
    () => groupTransactionsByDate(transactions),
    [transactions]
  );

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setTransactions(MOCK_TRANSACTIONS);
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (loadingMore) {
      return;
    }
    setLoadingMore(true);
    // Simulate loading more
    setTimeout(() => {
      // In real app, fetch more from API
      setLoadingMore(false);
    }, 1000);
  }, [loadingMore]);

  const handleTransactionPress = useCallback(
    (transaction: Transaction) => {
      navigation.navigate('TransactionDetails', {
        transactionId: transaction.id,
      });
    },
    [navigation]
  );

  const renderTransactionItem = useCallback(
    ({ item }: { item: Transaction }) => {
      const isCompleted = item.status === 'completed';
      const isFailed = item.status === 'failed';

      return (
        <Pressable
          style={({ pressed }) => [
            styles.transactionCard,
            pressed && styles.transactionCardPressed,
          ]}
          onPress={() => handleTransactionPress(item)}
        >
          <Avatar name={item.recipient.name} size="medium" />

          <View style={styles.transactionInfo}>
            <Text style={styles.recipientName} numberOfLines={1}>
              {item.recipient.name}
            </Text>
            <Text style={styles.transactionMeta} numberOfLines={1}>
              {item.recipient.bankName} {'\u2022'} {formatTime(item.createdAt)}
            </Text>
            {item.note ? (
              <Text style={styles.transactionNote} numberOfLines={1}>
                {item.note}
              </Text>
            ) : null}
          </View>

          <View style={styles.transactionAmount}>
            <Text
              style={[styles.amountText, isFailed && styles.amountTextFailed]}
            >
              -{formatCurrency(item.amount)}
            </Text>
            <View
              style={[
                styles.statusBadge,
                isCompleted && styles.statusBadgeSuccess,
                isFailed && styles.statusBadgeFailed,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  isCompleted && styles.statusTextSuccess,
                  isFailed && styles.statusTextFailed,
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>
        </Pressable>
      );
    },
    [handleTransactionPress]
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: TransactionGroup }) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
    ),
    []
  );

  const renderFooter = useCallback(() => {
    if (!loadingMore) {
      return null;
    }
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={palette.accent.main} />
      </View>
    );
  }, [loadingMore]);

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Icon name="inbox" size={48} color={colors.text.tertiary} />
        </View>
        <Text style={styles.emptyTitle}>No transactions yet</Text>
        <Text style={styles.emptySubtitle}>
          Your transfer history will appear here
        </Text>
      </View>
    ),
    []
  );

  // Render skeleton loading state
  const renderSkeleton = useCallback(
    () => (
      <View style={styles.skeletonContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonTransactionCard key={i} />
        ))}
      </View>
    ),
    []
  );

  // Flatten grouped data for FlatList with section headers
  const flatData = useMemo(() => {
    const result: Array<Transaction | { type: 'header'; title: string }> = [];
    groupedTransactions.forEach((group) => {
      result.push({ type: 'header', title: group.title });
      result.push(...group.data);
    });
    return result;
  }, [groupedTransactions]);

  const renderItem = useCallback(
    ({ item }: { item: Transaction | { type: 'header'; title: string } }) => {
      if ('type' in item && item.type === 'header') {
        return renderSectionHeader({
          section: { title: item.title, data: [] },
        });
      }
      return renderTransactionItem({ item });
    },
    [renderSectionHeader, renderTransactionItem]
  );

  const keyExtractor = useCallback(
    (item: Transaction | { type: 'header'; title: string }, _index: number) => {
      if ('type' in item && item.type === 'header') {
        return `header-${item.title}`;
      }
      return item.id;
    },
    []
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={handleBack}
        >
          <Icon name="arrow-left" size={24} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Transfer History</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Transaction List or Skeleton */}
      {isLoading ? (
        renderSkeleton()
      ) : (
        <FlatList
          data={flatData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={palette.accent.main}
              colors={[palette.accent.main]}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonPressed: {
    backgroundColor: colors.background.tertiary,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  listContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
  },
  sectionHeader: {
    paddingVertical: spacing[3],
    paddingTop: spacing[4],
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    backgroundColor: palette.primary.contrast,
    borderRadius: borderRadius.xl,
    marginBottom: spacing[3],
    gap: spacing[3],
  },
  transactionCardPressed: {
    backgroundColor: colors.background.tertiary,
  },
  transactionInfo: {
    flex: 1,
    gap: 2,
  },
  recipientName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  transactionMeta: {
    fontSize: 13,
    color: colors.text.tertiary,
  },
  transactionNote: {
    fontSize: 12,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: 'flex-end',
    gap: spacing[1],
  },
  amountText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  amountTextFailed: {
    color: colors.text.tertiary,
    textDecorationLine: 'line-through',
  },
  statusBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
  },
  statusBadgeSuccess: {
    backgroundColor: colors.status.successBg,
  },
  statusBadgeFailed: {
    backgroundColor: colors.status.errorBg,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text.tertiary,
    textTransform: 'capitalize',
  },
  statusTextSuccess: {
    color: colors.status.success,
  },
  statusTextFailed: {
    color: colors.status.error,
  },
  loadingFooter: {
    paddingVertical: spacing[4],
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[16],
    gap: spacing[3],
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  skeletonContainer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
  },
});

export default TransferHistoryScreen;
