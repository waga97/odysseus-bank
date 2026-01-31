/**
 * Odysseus Bank - Recipient List
 * List of recent/favorite recipients - warm theme
 */

import React, { useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  FlatList,
  type ListRenderItem,
} from 'react-native';
import { Text, Avatar, Icon } from '@components/ui';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import type { Recipient } from '@types';

interface RecipientListProps {
  recipients: Recipient[];
  onRecipientPress: (recipient: Recipient) => void;
  onViewAllPress?: () => void;
  title?: string;
  searchQuery?: string;
}

function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) {
    return accountNumber;
  }
  return `**** ${accountNumber.slice(-4)}`;
}

export function RecipientList({
  recipients,
  onRecipientPress,
  onViewAllPress,
  title = 'Recent',
  searchQuery = '',
}: RecipientListProps) {
  // Filter recipients based on search
  const filteredRecipients = useMemo(() => {
    if (!searchQuery.trim()) {
      return recipients;
    }

    const query = searchQuery.toLowerCase();
    return recipients.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r.accountNumber?.includes(query) ||
        r.phoneNumber?.includes(query)
    );
  }, [recipients, searchQuery]);

  const renderItem: ListRenderItem<Recipient> = useCallback(
    ({ item }) => (
      <Pressable
        style={({ pressed }) => [
          styles.recipientItem,
          pressed && styles.recipientItemPressed,
        ]}
        onPress={() => onRecipientPress(item)}
      >
        <Avatar name={item.name} size="large" />

        <View style={styles.recipientInfo}>
          <Text style={styles.recipientName}>{item.name}</Text>
          <Text style={styles.recipientDetail}>
            {item.accountNumber
              ? maskAccountNumber(item.accountNumber)
              : item.phoneNumber}
          </Text>
        </View>

        <Icon name="chevron-right" size={20} color={colors.text.tertiary} />
      </Pressable>
    ),
    [onRecipientPress]
  );

  const keyExtractor = useCallback((item: Recipient) => item.id, []);

  const ListHeader = useMemo(
    () => (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        {onViewAllPress && (
          <Pressable onPress={onViewAllPress}>
            <Text style={styles.viewAllText}>View all</Text>
          </Pressable>
        )}
      </View>
    ),
    [title, onViewAllPress]
  );

  const ListEmpty = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <Icon name="users" size={40} color={colors.text.tertiary} />
        <Text style={styles.emptyText}>
          {searchQuery ? 'No recipients found' : 'No recent recipients'}
        </Text>
      </View>
    ),
    [searchQuery]
  );

  return (
    <FlatList
      data={filteredRecipients}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={ListHeader}
      ListEmptyComponent={ListEmpty}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[5],
    paddingBottom: spacing[3],
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: palette.accent.main,
  },
  listContent: {
    paddingBottom: spacing[32],
  },
  recipientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    marginHorizontal: spacing[4],
    marginBottom: spacing[2],
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface.primary,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  recipientItemPressed: {
    backgroundColor: colors.background.tertiary,
  },
  recipientInfo: {
    flex: 1,
    gap: 2,
  },
  recipientName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  recipientDetail: {
    fontSize: 13,
    color: colors.text.tertiary,
  },
  emptyContainer: {
    padding: spacing[8],
    alignItems: 'center',
    gap: spacing[3],
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
});

export default RecipientList;
