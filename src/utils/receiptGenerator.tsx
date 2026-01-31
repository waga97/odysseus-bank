/**
 * Odysseus Bank - Receipt Generator
 * Generates shareable receipt images for transfers
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@components/ui/Text';
import { Icon } from '@components/ui/Icon';
import { palette, colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import { formatCurrency } from '@utils/currency';
import type { Recipient } from '@types';

interface ReceiptData {
  referenceId: string;
  amount: number;
  recipient: Recipient;
  note?: string;
  date: Date;
  senderName: string;
  senderAccountNumber: string;
}

interface ReceiptContentProps {
  data: ReceiptData;
}

/**
 * Receipt component that can be captured as an image
 */
export function ReceiptContent({ data }: ReceiptContentProps) {
  const formattedDate = data.date.toLocaleDateString('en-MY', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = data.date.toLocaleTimeString('en-MY', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Icon name="globe" size={32} color={palette.accent.main} />
        </View>
        <Text style={styles.bankName}>Odysseus Bank</Text>
      </View>

      {/* Success Badge */}
      <View style={styles.successBadge}>
        <Icon name="check-circle" size={48} color={palette.success.main} />
        <Text style={styles.successText}>Transfer Successful</Text>
      </View>

      {/* Amount */}
      <View style={styles.amountSection}>
        <Text style={styles.amountLabel}>Amount Transferred</Text>
        <Text style={styles.amount}>{formatCurrency(data.amount)}</Text>
      </View>

      {/* Details */}
      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>To</Text>
          <View style={styles.detailValue}>
            <Text style={styles.detailValuePrimary}>{data.recipient.name}</Text>
            <Text style={styles.detailValueSecondary}>
              {data.recipient.bankName} •{' '}
              {data.recipient.accountNumber
                ? `•••• ${data.recipient.accountNumber.slice(-4)}`
                : data.recipient.phoneNumber}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>From</Text>
          <View style={styles.detailValue}>
            <Text style={styles.detailValuePrimary}>{data.senderName}</Text>
            <Text style={styles.detailValueSecondary}>
              •••• {data.senderAccountNumber.slice(-4)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Reference</Text>
          <Text style={styles.detailValuePrimary}>{data.referenceId}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date & Time</Text>
          <View style={styles.detailValue}>
            <Text style={styles.detailValuePrimary}>{formattedDate}</Text>
            <Text style={styles.detailValueSecondary}>{formattedTime}</Text>
          </View>
        </View>

        {data.note && (
          <>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Note</Text>
              <Text style={styles.detailValuePrimary}>{data.note}</Text>
            </View>
          </>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Thank you for using Odysseus Bank</Text>
        <Text style={styles.footerSubtext}>
          This is a computer-generated receipt
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    padding: spacing[6],
    borderRadius: borderRadius.xl,
    gap: spacing[6],
  },
  header: {
    alignItems: 'center',
    gap: spacing[2],
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: palette.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  successBadge: {
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[4],
  },
  successText: {
    fontSize: 18,
    fontWeight: '600',
    color: palette.success.main,
  },
  amountSection: {
    alignItems: 'center',
    gap: spacing[1],
    paddingVertical: spacing[4],
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
  },
  amountLabel: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  amount: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text.primary,
  },
  detailsSection: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    gap: spacing[3],
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.text.tertiary,
    flex: 1,
  },
  detailValue: {
    flex: 2,
    alignItems: 'flex-end',
    gap: 2,
  },
  detailValuePrimary: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'right',
  },
  detailValueSecondary: {
    fontSize: 13,
    color: colors.text.tertiary,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.primary,
  },
  footer: {
    alignItems: 'center',
    gap: spacing[1],
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  footerSubtext: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
});

export default ReceiptContent;
