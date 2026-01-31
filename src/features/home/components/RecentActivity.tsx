/**
 * Odysseus Bank - Recent Activity
 * List of recent transactions with warm theme
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Icon, Avatar, Skeleton } from '@components/ui';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import { useTransactions } from '@stores/accountStore';
import type { Transaction } from '@types';

interface RecentActivityProps {
  onSeeAllPress?: () => void;
  onTransactionPress?: (transaction: Transaction) => void;
  isLoading?: boolean;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Today, ${date.toLocaleTimeString('en-MY', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })}`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.toLocaleDateString('en-MY', { weekday: 'long' });
  } else {
    return date.toLocaleDateString('en-MY', {
      month: 'short',
      day: 'numeric',
    });
  }
}

function formatAmount(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function TransactionSkeleton() {
  return (
    <View style={styles.transactionItem}>
      <Skeleton width={48} height={48} borderRadius={borderRadius.full} />
      <View style={styles.details}>
        <Skeleton width="60%" height={15} />
        <Skeleton width="40%" height={13} style={styles.skeletonSpacing} />
      </View>
      <Skeleton width={80} height={15} />
    </View>
  );
}

export function RecentActivity({
  onSeeAllPress,
  onTransactionPress,
  isLoading = false,
}: RecentActivityProps) {
  const transactions = useTransactions();
  const recentTransactions = transactions.slice(0, 5);

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <TransactionSkeleton />
          <TransactionSkeleton />
          <TransactionSkeleton />
        </>
      );
    }

    if (recentTransactions.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Icon name="clock" size={40} color={colors.text.tertiary} />
          <Text style={styles.emptyText}>No recent transactions</Text>
        </View>
      );
    }

    return recentTransactions.map((transaction) => (
      <Pressable
        key={transaction.id}
        style={({ pressed }) => [
          styles.transactionItem,
          pressed && styles.transactionItemPressed,
        ]}
        onPress={() => onTransactionPress?.(transaction)}
      >
        {/* Avatar */}
        <Avatar name={transaction.recipient.name} size="medium" />

        {/* Details */}
        <View style={styles.details}>
          <Text style={styles.recipientName} numberOfLines={1}>
            {transaction.recipient.name}
          </Text>
          <Text style={styles.dateText}>
            {formatDate(transaction.createdAt)}
          </Text>
        </View>

        {/* Amount */}
        <Text style={styles.amountText}>
          -{formatAmount(transaction.amount, transaction.currency)}
        </Text>
      </Pressable>
    ));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Transactions</Text>
        <Pressable onPress={onSeeAllPress} disabled={isLoading}>
          <Text style={[styles.seeAllText, isLoading && styles.seeAllDisabled]}>
            See All
          </Text>
        </Pressable>
      </View>

      {/* Transaction List */}
      <View style={styles.list}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing[6],
    paddingHorizontal: spacing[5],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: palette.accent.main,
  },
  seeAllDisabled: {
    opacity: 0.5,
  },
  list: {
    gap: spacing[2],
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[3],
    backgroundColor: palette.primary.contrast,
    borderRadius: borderRadius.lg,
  },
  transactionItemPressed: {
    backgroundColor: colors.background.tertiary,
  },
  details: {
    flex: 1,
    gap: 2,
  },
  recipientName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  dateText: {
    fontSize: 13,
    color: colors.text.tertiary,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  emptyState: {
    padding: spacing[8],
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    backgroundColor: colors.surface.secondary,
    borderRadius: borderRadius.lg,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  skeletonSpacing: {
    marginTop: 4,
  },
});

export default RecentActivity;
