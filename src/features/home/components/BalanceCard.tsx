/**
 * Odysseus Bank - Balance Card
 * Large balance display with hide/show toggle
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Icon } from '@components/ui';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import { useBalance } from '@stores/accountStore';

export function BalanceCard() {
  const balance = useBalance();
  const [isHidden, setIsHidden] = useState(false);

  const toggleVisibility = useCallback(() => {
    setIsHidden((prev) => !prev);
  }, []);

  const formatBalance = (
    amount: number
  ): { whole: string; decimal: string } => {
    const formatted = amount.toLocaleString('en-MY', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const [whole, decimal] = formatted.split('.');
    return { whole: whole ?? '0', decimal: decimal ?? '00' };
  };

  const { whole, decimal } = formatBalance(balance);

  return (
    <View style={styles.container}>
      {/* Label with visibility toggle */}
      <View style={styles.labelRow}>
        <Text style={styles.labelText}>Available Balance</Text>
        <Pressable
          style={styles.visibilityButton}
          onPress={toggleVisibility}
          hitSlop={12}
        >
          <Icon
            name={isHidden ? 'eye-off' : 'eye'}
            size={18}
            color={colors.text.tertiary}
          />
        </Pressable>
      </View>

      {/* Balance Amount */}
      <View style={styles.balanceRow}>
        <Text style={styles.currencyText}>RM</Text>
        <Text style={styles.balanceText}>{isHidden ? '****' : whole}</Text>
        {!isHidden && <Text style={styles.decimalText}>.{decimal}</Text>}
      </View>

      {/* Monthly Insight */}
      <View style={styles.insightContainer}>
        <View style={styles.insightBadge}>
          <Icon name="trending-up" size={14} color={palette.accent.main} />
          <Text style={styles.insightText}>+RM 2,450.00 this month</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[6],
    paddingBottom: spacing[4],
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  labelText: {
    fontSize: 14,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  visibilityButton: {
    padding: spacing[1],
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currencyText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
    marginRight: spacing[2],
    lineHeight: 32,
  },
  balanceText: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text.primary,
    lineHeight: 56,
  },
  decimalText: {
    fontSize: 24,
    fontWeight: '500',
    color: colors.text.tertiary,
    lineHeight: 32,
  },
  insightContainer: {
    marginTop: spacing[3],
  },
  insightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: palette.primary.main,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  insightText: {
    fontSize: 13,
    fontWeight: '500',
    color: palette.accent.main,
  },
});

export default BalanceCard;
