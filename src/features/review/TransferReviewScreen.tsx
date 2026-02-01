/**
 * Odysseus Bank - Transfer Review Screen
 * Review and confirm transfer details before biometric auth
 */

import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Text,
  Avatar,
  Icon,
  Button,
  Divider,
  ScreenHeader,
} from '@components/ui';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import type { RootStackScreenProps } from '@navigation/types';
import { useAccountStore } from '@stores/accountStore';
import { formatCurrency } from '@utils/currency';
import { shouldWarnForLimit } from '@utils/validateTransfer';

type Props = RootStackScreenProps<'TransferReview'>;

export function TransferReviewScreen({ navigation, route }: Props) {
  const { recipient, amount, note } = route.params;
  const insets = useSafeAreaInsets();

  const { defaultAccount, transferLimits } = useAccountStore();

  const [isLoading, setIsLoading] = useState(false);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleConfirm = useCallback(() => {
    setIsLoading(true);

    // Navigate to biometric authentication
    navigation.navigate('BiometricAuth', {
      recipient,
      amount,
      note,
    });

    // Reset loading state after navigation
    setTimeout(() => setIsLoading(false), 500);
  }, [amount, recipient, note, navigation]);

  // Format amount
  const formattedAmount = formatCurrency(amount);

  // Calculate new balance
  const currentBalance = defaultAccount?.balance ?? 0;
  const newBalance = currentBalance - amount;

  // Check if approaching limit - uses shared threshold for consistency
  const dailyUsed = transferLimits?.daily.used ?? 0;
  const dailyLimit = transferLimits?.daily.limit ?? 10000;
  const dailyRemaining = transferLimits?.daily.remaining ?? 10000;
  const isApproachingLimit = shouldWarnForLimit(amount, dailyUsed, dailyLimit);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      <ScreenHeader title="Review Transfer" onBack={handleBack} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Amount Card */}
        <View style={styles.amountCard}>
          <Text variant="labelMedium" color="tertiary">
            You&apos;re sending
          </Text>
          <Text style={styles.amountText}>{formattedAmount}</Text>
          {note ? (
            <View style={styles.noteContainer}>
              <Icon name="file-text" size={14} color={colors.text.tertiary} />
              <Text variant="bodySmall" color="tertiary">
                {note}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Recipient Card */}
        <View style={styles.detailsCard}>
          <Text
            variant="labelMedium"
            color="tertiary"
            style={styles.sectionLabel}
          >
            TO
          </Text>
          <View style={styles.recipientRow}>
            <Avatar name={recipient.name} size="large" />
            <View style={styles.recipientInfo}>
              <Text variant="titleSmall" color="primary">
                {recipient.name}
              </Text>
              <Text variant="caption" color="tertiary">
                {recipient.bankName}
              </Text>
              <Text variant="caption" color="tertiary">
                {recipient.accountNumber
                  ? `Account: •••• ${recipient.accountNumber.slice(-4)}`
                  : `Phone: ${recipient.phoneNumber}`}
              </Text>
            </View>
          </View>
        </View>

        {/* From Account */}
        <View style={styles.detailsCard}>
          <Text
            variant="labelMedium"
            color="tertiary"
            style={styles.sectionLabel}
          >
            FROM
          </Text>
          <View style={styles.accountRow}>
            <View style={styles.accountIcon}>
              <Icon name="credit-card" size={20} color={palette.accent.main} />
            </View>
            <View style={styles.accountInfo}>
              <Text variant="titleSmall" color="primary">
                Odysseus Bank
              </Text>
              <Text variant="caption" color="tertiary">
                {defaultAccount?.type === 'savings' ? 'Savings' : 'Current'}{' '}
                Account ••••{' '}
                {defaultAccount?.accountNumber?.slice(-4) ?? '0000'}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Balance Info */}
          <View style={styles.balanceRow}>
            <Text variant="bodySmall" color="secondary">
              Current balance
            </Text>
            <Text variant="bodySmall" color="primary">
              {formatCurrency(currentBalance)}
            </Text>
          </View>
          <View style={styles.balanceRow}>
            <Text variant="bodySmall" color="secondary">
              After transfer
            </Text>
            <Text
              variant="bodySmall"
              color={newBalance < 100 ? colors.status.warning : 'primary'}
            >
              {formatCurrency(newBalance)}
            </Text>
          </View>
        </View>

        {/* Warning if approaching limit */}
        {isApproachingLimit && (
          <View style={styles.warningCard}>
            <Icon
              name="alert-triangle"
              size={20}
              color={colors.status.warning}
            />
            <Text
              variant="bodySmall"
              color="secondary"
              style={styles.warningText}
            >
              You&apos;re approaching your daily transfer limit. Remaining after
              this transfer: {formatCurrency(dailyRemaining - amount)}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View
        style={[styles.bottomContainer, { paddingBottom: insets.bottom + 16 }]}
      >
        <Text
          variant="caption"
          color="tertiary"
          align="center"
          style={styles.disclaimer}
        >
          By confirming, you agree that this transfer is final and cannot be
          reversed.
        </Text>
        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={handleConfirm}
          loading={isLoading}
        >
          Confirm &amp; Transfer
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing[4],
    gap: spacing[4],
  },
  amountCard: {
    alignItems: 'center',
    padding: spacing[6],
    backgroundColor: palette.primary.contrast,
    borderRadius: borderRadius['2xl'],
    gap: spacing[2],
  },
  amountText: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text.primary,
    lineHeight: 44,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingTop: spacing[2],
  },
  detailsCard: {
    padding: spacing[4],
    backgroundColor: palette.primary.contrast,
    borderRadius: borderRadius.xl,
  },
  sectionLabel: {
    marginBottom: spacing[3],
    letterSpacing: 0.5,
  },
  recipientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  recipientInfo: {
    flex: 1,
    gap: 2,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  accountIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: palette.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountInfo: {
    flex: 1,
    gap: 2,
  },
  divider: {
    marginVertical: spacing[4],
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[1],
  },
  warningCard: {
    flexDirection: 'row',
    gap: spacing[3],
    padding: spacing[4],
    backgroundColor: colors.status.warningBg,
    borderRadius: borderRadius.lg,
    alignItems: 'flex-start',
  },
  warningText: {
    flex: 1,
    lineHeight: 20,
  },
  bottomContainer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    gap: spacing[3],
  },
  disclaimer: {
    lineHeight: 18,
  },
});

export default TransferReviewScreen;
