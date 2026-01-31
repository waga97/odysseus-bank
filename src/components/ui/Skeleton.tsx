/**
 * Odysseus Bank - Skeleton Loader Component
 * Animated placeholder for loading states
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, type ViewStyle } from 'react-native';
import { colors } from '@theme/colors';
import { borderRadius } from '@theme/borderRadius';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius: radius = borderRadius.md,
  style,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: radius,
          opacity,
        },
        style,
      ]}
    />
  );
}

/**
 * Preset skeleton layouts for common use cases
 */

interface SkeletonCardProps {
  style?: ViewStyle;
}

export function SkeletonTransactionCard({ style }: SkeletonCardProps) {
  return (
    <View style={[styles.transactionCard, style]}>
      <Skeleton width={44} height={44} borderRadius={borderRadius.full} />
      <View style={styles.transactionInfo}>
        <Skeleton width="60%" height={14} />
        <Skeleton width="40%" height={12} style={styles.marginTop} />
      </View>
      <View style={styles.transactionAmount}>
        <Skeleton width={80} height={14} />
        <Skeleton width={60} height={16} style={styles.marginTop} />
      </View>
    </View>
  );
}

export function SkeletonAccountCard({ style }: SkeletonCardProps) {
  return (
    <View style={[styles.accountCard, style]}>
      <View style={styles.accountCardHeader}>
        <Skeleton width={32} height={32} borderRadius={borderRadius.lg} />
        <Skeleton width={18} height={18} />
      </View>
      <Skeleton width="70%" height={14} style={styles.marginTopLarge} />
      <Skeleton width="50%" height={12} style={styles.marginTop} />
      <Skeleton width="80%" height={18} style={styles.marginTopLarge} />
    </View>
  );
}

export function SkeletonBalanceCard({ style }: SkeletonCardProps) {
  return (
    <View style={[styles.balanceCard, style]}>
      <Skeleton width={120} height={14} />
      <View style={styles.balanceRow}>
        <Skeleton width={40} height={28} />
        <Skeleton width={150} height={48} style={styles.marginLeftSmall} />
      </View>
      <Skeleton
        width={160}
        height={32}
        borderRadius={borderRadius.full}
        style={styles.marginTopLarge}
      />
    </View>
  );
}

export function SkeletonRecipientCard({ style }: SkeletonCardProps) {
  return (
    <View style={[styles.recipientCard, style]}>
      <Skeleton width={48} height={48} borderRadius={borderRadius.full} />
      <View style={styles.recipientInfo}>
        <Skeleton width="70%" height={14} />
        <Skeleton width="50%" height={12} style={styles.marginTop} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.border.primary,
  },
  marginTop: {
    marginTop: 6,
  },
  marginTopLarge: {
    marginTop: 12,
  },
  marginLeftSmall: {
    marginLeft: 8,
  },
  // Transaction card skeleton
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.xl,
    marginBottom: 12,
    gap: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  // Account card skeleton
  accountCard: {
    width: 160,
    padding: 16,
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.xl,
  },
  accountCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Balance card skeleton
  balanceCard: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  // Recipient card skeleton
  recipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.xl,
    marginBottom: 12,
    gap: 12,
  },
  recipientInfo: {
    flex: 1,
  },
});

export default Skeleton;
