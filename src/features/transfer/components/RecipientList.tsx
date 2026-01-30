/**
 * Odysseus Bank - Recipient List
 * List of recent/favorite recipients
 */

import React, { useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  FlatList,
  type ListRenderItem,
} from 'react-native';
import { Text, Avatar } from '@components/ui';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import type { Recipient } from '@types/models';

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
  return `•••• ${accountNumber.slice(-4)}`;
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
        <Avatar
          name={item.name}
          source={item.avatar ? { uri: item.avatar } : null}
          size="large"
        />

        <View style={styles.recipientInfo}>
          <Text variant="titleSmall" color="primary">
            {item.name}
          </Text>
          <Text variant="caption" color="tertiary">
            {item.accountNumber
              ? maskAccountNumber(item.accountNumber)
              : item.phoneNumber}
          </Text>
        </View>

        <Text style={styles.chevron}>›</Text>
      </Pressable>
    ),
    [onRecipientPress]
  );

  const keyExtractor = useCallback((item: Recipient) => item.id, []);

  const ListHeader = useMemo(
    () => (
      <View style={styles.header}>
        <Text variant="titleSmall" color="primary">
          {title}
        </Text>
        {onViewAllPress && (
          <Pressable onPress={onViewAllPress}>
            <Text variant="labelSmall" color={colors.interactive.primary}>
              View all
            </Text>
          </Pressable>
        )}
      </View>
    ),
    [title, onViewAllPress]
  );

  const ListEmpty = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <Text variant="bodyMedium" color="tertiary" align="center">
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
    paddingTop: spacing[6],
    paddingBottom: spacing[2],
  },
  listContent: {
    paddingBottom: spacing[32],
  },
  recipientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    marginHorizontal: spacing[3],
    borderRadius: borderRadius.xl,
  },
  recipientItemPressed: {
    backgroundColor: colors.background.tertiary,
  },
  recipientInfo: {
    flex: 1,
  },
  chevron: {
    fontSize: 24,
    color: colors.text.tertiary,
  },
  emptyContainer: {
    padding: spacing[8],
    alignItems: 'center',
  },
});

export default RecipientList;
