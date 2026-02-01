/**
 * Odysseus Bank - Transfer Processing Screen
 * Shows transfer in progress with animated loading state
 * Actually calls transferApi and updates account state
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Icon } from '@components/ui';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import { componentSizes } from '@theme/componentSizes';
import type { RootStackScreenProps } from '@navigation/types';
import { formatCurrency } from '@utils/currency';
import { mockApi } from '@services/mocks';
import { useAccountStore } from '@stores/accountStore';
import { withRetry } from '@utils/retry';

type Props = RootStackScreenProps<'TransferProcessing'>;

type TransferStatus = 'processing' | 'success' | 'error';

const PROCESSING_STEPS = [
  { id: 1, text: 'Verifying account details...', duration: 600 },
  { id: 2, text: 'Checking transfer limits...', duration: 400 },
  { id: 3, text: 'Processing transaction...', duration: 600 },
  { id: 4, text: 'Confirming with recipient bank...', duration: 400 },
];

/**
 * Map API error codes to error screen types
 */
function mapErrorToType(
  error: Error
):
  | 'insufficient_funds'
  | 'network_error'
  | 'daily_limit'
  | 'monthly_limit'
  | 'recipient_not_found'
  | 'generic' {
  const message = error.message;

  if (message === 'INSUFFICIENT_FUNDS') {
    return 'insufficient_funds';
  }
  if (message === 'NETWORK_ERROR') {
    return 'network_error';
  }
  if (message === 'DAILY_LIMIT_EXCEEDED') {
    return 'daily_limit';
  }
  if (message === 'MONTHLY_LIMIT_EXCEEDED') {
    return 'monthly_limit';
  }
  if (message === 'INVALID_ACCOUNT') {
    return 'recipient_not_found';
  }

  return 'generic';
}

export function TransferProcessingScreen({ navigation, route }: Props) {
  const { recipient, amount, note } = route.params;
  const insets = useSafeAreaInsets();

  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<TransferStatus>('processing');
  const [statusText, setStatusText] = useState(
    PROCESSING_STEPS[0]?.text ?? 'Processing...'
  );

  // Store actions
  const { updateBalance, updateLimitsUsed, addTransaction, defaultAccount } =
    useAccountStore();

  // Animation values
  const spinValue = useRef(new Animated.Value(0)).current;
  const progressValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;

  // Track if processing has started to prevent re-runs
  const hasStartedRef = useRef(false);

  // Spinning animation
  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spin.start();

    return () => spin.stop();
  }, [spinValue]);

  // Main processing flow - runs once on mount
  useEffect(() => {
    // Prevent re-running if already started
    if (hasStartedRef.current) {
      return;
    }
    hasStartedRef.current = true;

    let isMounted = true;
    let stepTimeout: ReturnType<typeof setTimeout>;

    const runProcessing = async () => {
      // Start API call in background with retry for network errors
      const apiPromise = withRetry(
        () =>
          mockApi.executeTransfer({
            amount,
            recipientId: recipient.id,
            recipientAccountNumber: recipient.accountNumber,
            recipientPhoneNumber: recipient.phoneNumber,
            recipientName: recipient.name,
            bankName: recipient.bankName,
            note,
            fromAccountId: defaultAccount?.id ?? '',
          }),
        { maxAttempts: 3, baseDelayMs: 1000 }
      );

      // Step through visual progress
      for (let i = 0; i < PROCESSING_STEPS.length; i++) {
        if (!isMounted) {
          return;
        }

        const step = PROCESSING_STEPS[i];
        if (!step) {
          continue;
        }

        setCurrentStep(i);
        setStatusText(step.text);

        Animated.timing(progressValue, {
          toValue: (i + 1) / PROCESSING_STEPS.length,
          duration: step.duration,
          useNativeDriver: false,
        }).start();

        await new Promise((resolve) => {
          stepTimeout = setTimeout(resolve, step.duration);
        });
      }

      // Wait for API to complete
      try {
        const transaction = await apiPromise;

        if (!isMounted) {
          return;
        }

        // Update store state
        if (defaultAccount) {
          updateBalance(defaultAccount.id, defaultAccount.balance - amount);
        }
        updateLimitsUsed(amount);
        addTransaction(transaction);

        // Success animation
        setStatus('success');
        setStatusText('Transfer Complete!');

        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 0.8,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.spring(scaleValue, {
            toValue: 1,
            friction: 3,
            tension: 100,
            useNativeDriver: true,
          }),
        ]).start();

        Animated.spring(checkmarkScale, {
          toValue: 1,
          friction: 3,
          tension: 100,
          useNativeDriver: true,
        }).start();

        // Navigate to success after brief delay
        setTimeout(() => {
          if (!isMounted) {
            return;
          }

          navigation.replace('TransferSuccess', {
            transaction: {
              id: transaction.id,
              amount: transaction.amount,
              recipientName: transaction.recipient.name,
              recipientAccount: transaction.recipient.accountNumber,
              bankName: transaction.recipient.bankName,
              date: transaction.createdAt,
              reference: transaction.reference,
              note: transaction.note,
            },
          });
        }, 1000);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        // Error - navigate to error screen
        const errorType = mapErrorToType(error as Error);

        navigation.replace('TransferError', {
          errorType,
          // Don't pass raw error codes - let error screen use friendly copy
        });
      }
    };

    // Start after initial delay
    const initialTimeout = setTimeout(() => {
      void runProcessing();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(initialTimeout);
      clearTimeout(stepTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const formattedAmount = formatCurrency(amount);
  const isComplete = status === 'success';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        {/* Amount Display */}
        <View style={styles.amountContainer}>
          <Text variant="bodySmall" color="tertiary">
            Sending
          </Text>
          <Text style={styles.amountText}>{formattedAmount}</Text>
          <Text variant="bodySmall" color="tertiary">
            to {recipient.name}
          </Text>
        </View>

        {/* Loading Indicator */}
        <Animated.View
          style={[
            styles.loadingContainer,
            { transform: [{ scale: scaleValue }] },
            isComplete && styles.loadingContainerSuccess,
          ]}
        >
          {isComplete ? (
            <Animated.View style={{ transform: [{ scale: checkmarkScale }] }}>
              <Icon name="check" size={48} color={colors.status.success} />
            </Animated.View>
          ) : (
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Icon name="refresh-cw" size={40} color={palette.primary.main} />
            </Animated.View>
          )}
        </Animated.View>

        {/* Status Text */}
        <Text variant="titleSmall" color="primary" align="center">
          {statusText}
        </Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressBar,
                { width: progressWidth },
                isComplete && styles.progressBarSuccess,
              ]}
            />
          </View>
          <Text variant="caption" color="tertiary" style={styles.progressText}>
            {isComplete
              ? 'Done'
              : `Step ${currentStep + 1} of ${PROCESSING_STEPS.length}`}
          </Text>
        </View>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <Icon name="lock" size={16} color={colors.text.tertiary} />
          <Text variant="caption" color="tertiary">
            Secure transaction
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    gap: spacing[6],
  },
  amountContainer: {
    alignItems: 'center',
    gap: spacing[1],
  },
  amountText: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text.primary,
    lineHeight: 44,
    marginVertical: spacing[1],
  },
  loadingContainer: {
    width: componentSizes.icon.xlarge,
    height: componentSizes.icon.xlarge,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: palette.primary.main,
  },
  loadingContainerSuccess: {
    backgroundColor: colors.status.successBg,
    borderColor: colors.status.success,
  },
  progressContainer: {
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
    gap: spacing[2],
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: colors.border.primary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: palette.primary.main,
    borderRadius: borderRadius.full,
  },
  progressBarSuccess: {
    backgroundColor: colors.status.success,
  },
  progressText: {
    marginTop: spacing[1],
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[8],
  },
});

export default TransferProcessingScreen;
