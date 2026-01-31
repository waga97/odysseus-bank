/**
 * Odysseus Bank - Transfer Success Screen
 * Shows successful transfer confirmation with receipt
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Icon, Button, Divider } from '@components/ui';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import { formatCurrency } from '@utils/currency';
import type { RootStackScreenProps } from '@navigation/types';

type Props = RootStackScreenProps<'TransferSuccess'>;

export function TransferSuccessScreen({ navigation, route }: Props) {
  const { transaction } = route.params;
  const insets = useSafeAreaInsets();

  // Animation values
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Animate checkmark
    Animated.spring(checkmarkScale, {
      toValue: 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
      delay: 100,
    }).start();

    // Animate content
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 400,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslate, {
        toValue: 0,
        duration: 400,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [checkmarkScale, contentOpacity, contentTranslate]);

  const handleDone = () => {
    // Navigate back to home
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const handleNewTransfer = () => {
    navigation.reset({
      index: 1,
      routes: [{ name: 'Home' }, { name: 'TransferHub' }],
    });
  };

  const handleShare = async () => {
    const message = `
Transfer Receipt - Odysseus Bank

Amount: ${formatCurrency(transaction.amount)}
To: ${transaction.recipientName}
${transaction.recipientAccount ? `Account: ****${transaction.recipientAccount.slice(-4)}` : ''}
${transaction.bankName ? `Bank: ${transaction.bankName}` : ''}
Date: ${formatDate(transaction.date)}
Reference: ${transaction.reference}
${transaction.note ? `Note: ${transaction.note}` : ''}

Thank you for using Odysseus Bank.
    `.trim();

    try {
      await Share.share({
        message,
        title: 'Transfer Receipt',
      });
    } catch {
      // Handle share error silently
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-MY', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formattedAmount = formatCurrency(transaction.amount);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.successHeader}>
          <Animated.View
            style={[
              styles.successIconContainer,
              { transform: [{ scale: checkmarkScale }] },
            ]}
          >
            <Icon name="check" size={48} color={colors.status.success} />
          </Animated.View>

          <Text variant="headlineSmall" color="primary" align="center">
            Transfer Successful!
          </Text>

          <Text style={styles.amountText}>{formattedAmount}</Text>

          <Text variant="bodyMedium" color="secondary" align="center">
            sent to {transaction.recipientName}
          </Text>
        </View>

        {/* Receipt Card */}
        <Animated.View
          style={[
            styles.receiptCard,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslate }],
            },
          ]}
        >
          {/* Zigzag top edge */}
          <View style={styles.zigzagTop} />

          <View style={styles.receiptContent}>
            <Text
              variant="labelMedium"
              color="tertiary"
              style={styles.receiptTitle}
            >
              TRANSACTION DETAILS
            </Text>

            <View style={styles.receiptRow}>
              <Text variant="bodySmall" color="secondary">
                Reference Number
              </Text>
              <Text
                variant="bodySmall"
                color="primary"
                style={styles.receiptValue}
              >
                {transaction.reference}
              </Text>
            </View>

            <Divider style={styles.receiptDivider} />

            <View style={styles.receiptRow}>
              <Text variant="bodySmall" color="secondary">
                To
              </Text>
              <Text
                variant="bodySmall"
                color="primary"
                style={styles.receiptValue}
              >
                {transaction.recipientName}
              </Text>
            </View>

            {transaction.recipientAccount && (
              <>
                <Divider style={styles.receiptDivider} />
                <View style={styles.receiptRow}>
                  <Text variant="bodySmall" color="secondary">
                    Account Number
                  </Text>
                  <Text
                    variant="bodySmall"
                    color="primary"
                    style={styles.receiptValue}
                  >
                    ****{transaction.recipientAccount.slice(-4)}
                  </Text>
                </View>
              </>
            )}

            {transaction.bankName && (
              <>
                <Divider style={styles.receiptDivider} />
                <View style={styles.receiptRow}>
                  <Text variant="bodySmall" color="secondary">
                    Bank
                  </Text>
                  <Text
                    variant="bodySmall"
                    color="primary"
                    style={styles.receiptValue}
                  >
                    {transaction.bankName}
                  </Text>
                </View>
              </>
            )}

            <Divider style={styles.receiptDivider} />

            <View style={styles.receiptRow}>
              <Text variant="bodySmall" color="secondary">
                Date &amp; Time
              </Text>
              <Text
                variant="bodySmall"
                color="primary"
                style={styles.receiptValue}
              >
                {formatDate(transaction.date)}
              </Text>
            </View>

            <Divider style={styles.receiptDivider} />

            <View style={styles.receiptRow}>
              <Text variant="bodySmall" color="secondary">
                Amount
              </Text>
              <Text
                variant="titleSmall"
                color="primary"
                style={styles.receiptValue}
              >
                {formattedAmount}
              </Text>
            </View>

            {transaction.note && (
              <>
                <Divider style={styles.receiptDivider} />
                <View style={styles.receiptRow}>
                  <Text variant="bodySmall" color="secondary">
                    Note
                  </Text>
                  <Text
                    variant="bodySmall"
                    color="primary"
                    style={styles.receiptValue}
                  >
                    {transaction.note}
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Zigzag bottom edge */}
          <View style={styles.zigzagBottom} />
        </Animated.View>

        {/* Share Button */}
        <Animated.View
          style={[
            styles.shareContainer,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslate }],
            },
          ]}
        >
          <Button
            variant="accent"
            size="medium"
            onPress={() => void handleShare()}
            leftIcon={<Icon name="share-2" size={18} color="#ffffff" />}
          >
            Share Receipt
          </Button>
        </Animated.View>

        {/* Bottom Buttons - Inside ScrollView */}
        <View
          style={[
            styles.bottomContainer,
            { paddingBottom: insets.bottom + 16 },
          ]}
        >
          <Button variant="primary" size="large" fullWidth onPress={handleDone}>
            Done
          </Button>
          <Button
            variant="ghost"
            size="large"
            fullWidth
            onPress={handleNewTransfer}
          >
            Make Another Transfer
          </Button>
        </View>
      </ScrollView>
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
    paddingTop: spacing[6],
  },
  successHeader: {
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.status.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  amountText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text.primary,
    lineHeight: 40,
    marginTop: spacing[1],
  },
  receiptCard: {
    backgroundColor: palette.primary.contrast,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  zigzagTop: {
    height: 8,
    backgroundColor: colors.background.primary,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  zigzagBottom: {
    height: 8,
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  receiptContent: {
    padding: spacing[4],
  },
  receiptTitle: {
    marginBottom: spacing[3],
    letterSpacing: 0.5,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing[2],
  },
  receiptValue: {
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing[4],
  },
  receiptDivider: {
    marginVertical: spacing[1],
  },
  shareContainer: {
    alignItems: 'center',
    marginTop: spacing[4],
  },
  bottomContainer: {
    marginTop: spacing[6],
    gap: spacing[2],
  },
});

export default TransferSuccessScreen;
