/**
 * Odysseus Bank - Bank Selection Screen
 * Choose a bank for new recipient transfer
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  type ListRenderItem,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Input, Icon, Avatar, Skeleton } from '@components/ui';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import type { RootStackScreenProps } from '@navigation/types';
import type { Bank } from '@types';
import { useBanks } from '@stores/accountStore';

type Props = RootStackScreenProps<'BankSelection'>;

type ListItem = Bank | { type: 'header'; title: string };

// Skeleton component for bank items
function BankItemSkeleton() {
  return (
    <View style={styles.bankItem}>
      <Skeleton width={48} height={48} borderRadius={borderRadius.full} />
      <View style={styles.bankInfo}>
        <Skeleton width="70%" height={15} />
        <Skeleton width="40%" height={13} style={styles.skeletonSpacing} />
      </View>
      <Skeleton width={20} height={20} borderRadius={4} />
    </View>
  );
}

export function BankSelectionScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const banks = useBanks(); // Use pre-loaded banks from store
  const isLoading = banks.length === 0;

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleBankSelect = useCallback(
    (bank: Bank) => {
      navigation.navigate('RecipientDetails', {
        bankId: bank.id,
        bankName: bank.name,
      });
    },
    [navigation]
  );

  // Separate popular and other banks, sorted alphabetically
  const { popularBanks, otherBanks } = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const filtered = query
      ? banks.filter(
          (b) =>
            b.name.toLowerCase().includes(query) ||
            b.shortName?.toLowerCase().includes(query)
        )
      : banks;

    const sortByName = (a: Bank, b: Bank) => a.name.localeCompare(b.name);

    return {
      popularBanks: filtered.filter((b) => b.isPopular).sort(sortByName),
      otherBanks: filtered.filter((b) => !b.isPopular).sort(sortByName),
    };
  }, [banks, searchQuery]);

  const renderBankItem = useCallback(
    (bank: Bank) => (
      <Pressable
        style={({ pressed }) => [
          styles.bankItem,
          pressed && styles.bankItemPressed,
        ]}
        onPress={() => handleBankSelect(bank)}
      >
        <Avatar name={bank.shortName ?? bank.name} size="medium" />
        <View style={styles.bankInfo}>
          <Text style={styles.bankName}>{bank.name}</Text>
          {bank.shortName && (
            <Text style={styles.bankShortName}>{bank.shortName}</Text>
          )}
        </View>
        <Icon name="chevron-right" size={20} color={colors.text.tertiary} />
      </Pressable>
    ),
    [handleBankSelect]
  );

  const ListHeaderComponent = useMemo(
    () => (
      <View>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search banks"
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={
              <Icon name="search" size={20} color={colors.text.tertiary} />
            }
          />
        </View>

        {/* Popular Banks Section */}
        {popularBanks.length > 0 && (
          <View style={styles.section}>
            <Text
              variant="labelMedium"
              color="tertiary"
              style={styles.sectionTitle}
            >
              POPULAR BANKS
            </Text>
          </View>
        )}
      </View>
    ),
    [searchQuery, popularBanks.length]
  );

  // Combine data with section markers
  const listData = useMemo((): ListItem[] => {
    const data: ListItem[] = [];

    if (popularBanks.length > 0) {
      data.push(...popularBanks);
    }

    if (otherBanks.length > 0 && popularBanks.length > 0) {
      data.push({ type: 'header', title: 'ALL BANKS' });
    }

    if (otherBanks.length > 0) {
      data.push(...otherBanks);
    }

    return data;
  }, [popularBanks, otherBanks]);

  const renderItem: ListRenderItem<ListItem> = useCallback(
    ({ item }) => {
      if ('type' in item && item.type === 'header') {
        return (
          <View style={styles.section}>
            <Text
              variant="labelMedium"
              color="tertiary"
              style={styles.sectionTitle}
            >
              {item.title}
            </Text>
          </View>
        );
      }
      return renderBankItem(item as Bank);
    },
    [renderBankItem]
  );

  const ListEmptyComponent = useMemo(
    () =>
      isLoading ? (
        <View style={styles.skeletonContainer}>
          <BankItemSkeleton />
          <BankItemSkeleton />
          <BankItemSkeleton />
          <BankItemSkeleton />
          <BankItemSkeleton />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="search" size={48} color={colors.text.disabled} />
          <Text
            variant="bodyMedium"
            color="tertiary"
            align="center"
            style={styles.emptyText}
          >
            {searchQuery
              ? `No banks found for "${searchQuery}"`
              : 'No banks available'}
          </Text>
        </View>
      ),
    [isLoading, searchQuery]
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
        <Text variant="titleMedium" color="primary" style={styles.headerTitle}>
          Select Bank
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Bank List */}
      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => ('type' in item ? item.title : item.id)}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
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
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  section: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  },
  sectionTitle: {
    letterSpacing: 0.5,
  },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    gap: spacing[3],
    backgroundColor: palette.primary.contrast,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing[4],
    marginBottom: spacing[2],
  },
  bankItemPressed: {
    backgroundColor: colors.background.tertiary,
  },
  bankInfo: {
    flex: 1,
    gap: 2,
  },
  bankName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  bankShortName: {
    fontSize: 13,
    color: colors.text.tertiary,
  },
  listContent: {
    paddingBottom: spacing[8],
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[16],
    gap: spacing[4],
  },
  emptyText: {
    paddingHorizontal: spacing[8],
  },
  skeletonContainer: {
    paddingTop: spacing[2],
  },
  skeletonSpacing: {
    marginTop: 4,
  },
});

export default BankSelectionScreen;
