/**
 * Odysseus Bank - Account Cards
 * Horizontal scrollable account cards
 */

import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, Icon } from '@components/ui';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import { useAccounts } from '@stores/accountStore';
import type { Account } from '@types';

interface AccountCardsProps {
  onAccountPress?: (account: Account) => void;
  onAddAccountPress?: () => void;
}

// Map account types to icons
const accountTypeIcons: Record<string, string> = {
  savings: 'dollar-sign',
  current: 'credit-card',
  investment: 'trending-up',
  default: 'credit-card',
};

// Card background colors based on account type
const DEFAULT_COLORS = { bg: '#1a1a1a', accent: palette.accent.main };
const DEFAULT_ICON = 'credit-card';

const accountTypeColors: Record<string, { bg: string; accent: string }> = {
  savings: { bg: '#1a1a1a', accent: palette.accent.main },
  current: { bg: '#2d2d2d', accent: '#ffffff' },
  investment: { bg: palette.accent.main, accent: '#ffffff' },
  default: DEFAULT_COLORS,
};

function formatAccountNumber(accountNumber: string): string {
  // Show last 4 digits only
  return `**** ${accountNumber.slice(-4)}`;
}

function formatBalance(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function AccountCards({
  onAccountPress,
  onAddAccountPress,
}: AccountCardsProps) {
  const accounts = useAccounts();

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Accounts</Text>
        <Pressable onPress={onAddAccountPress}>
          <Text style={styles.seeAllText}>See All</Text>
        </Pressable>
      </View>

      {/* Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {accounts.map((account: Account) => {
          const colorScheme = accountTypeColors[account.type] ?? DEFAULT_COLORS;
          const iconName = accountTypeIcons[account.type] ?? DEFAULT_ICON;

          return (
            <Pressable
              key={account.id}
              style={({ pressed }) => [
                styles.card,
                { backgroundColor: colorScheme.bg },
                pressed && styles.cardPressed,
              ]}
              onPress={() => onAccountPress?.(account)}
            >
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.cardIcon,
                    { backgroundColor: `${colorScheme.accent}20` },
                  ]}
                >
                  <Icon name={iconName} size={18} color={colorScheme.accent} />
                </View>
                <Icon
                  name="more-vertical"
                  size={18}
                  color={colorScheme.accent}
                />
              </View>

              {/* Account Name */}
              <Text
                style={[styles.accountName, { color: colorScheme.accent }]}
                numberOfLines={1}
              >
                {account.name}
              </Text>

              {/* Account Number */}
              <Text style={styles.accountNumber}>
                {formatAccountNumber(account.accountNumber)}
              </Text>

              {/* Balance */}
              <Text
                style={[styles.cardBalance, { color: colorScheme.accent }]}
                numberOfLines={1}
              >
                {formatBalance(account.balance, account.currency)}
              </Text>
            </Pressable>
          );
        })}

        {/* Add Account Card */}
        <Pressable
          style={({ pressed }) => [
            styles.addCard,
            pressed && styles.cardPressed,
          ]}
          onPress={onAddAccountPress}
        >
          <View style={styles.addIconContainer}>
            <Icon name="plus" size={24} color={colors.text.tertiary} />
          </View>
          <Text style={styles.addCardText}>Add Account</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing[6],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
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
  scrollContent: {
    paddingHorizontal: spacing[5],
    gap: spacing[3],
  },
  card: {
    width: 160,
    padding: spacing[4],
    borderRadius: borderRadius.xl,
    gap: spacing[2],
  },
  cardPressed: {
    opacity: 0.9,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountName: {
    fontSize: 14,
    fontWeight: '600',
  },
  accountNumber: {
    fontSize: 12,
    color: palette.neutral[400],
  },
  cardBalance: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing[2],
    lineHeight: 22,
  },
  addCard: {
    width: 160,
    padding: spacing[4],
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surface.secondary,
    borderWidth: 2,
    borderColor: colors.border.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  addIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCardText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.tertiary,
  },
});

export default AccountCards;
