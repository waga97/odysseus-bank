/**
 * Odysseus Bank - Transfer Processing Screen
 * Shows transfer in progress with animated loading state
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Icon } from '@components/ui';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import type { RootStackScreenProps } from '@navigation/types';
import { formatCurrency } from '@utils/currency';

type Props = RootStackScreenProps<'TransferProcessing'>;

const PROCESSING_STEPS = [
  { id: 1, text: 'Verifying account details...', duration: 800 },
  { id: 2, text: 'Checking transfer limits...', duration: 600 },
  { id: 3, text: 'Processing transaction...', duration: 1000 },
  { id: 4, text: 'Confirming with recipient bank...', duration: 800 },
  { id: 5, text: 'Completing transfer...', duration: 600 },
];

export function TransferProcessingScreen({ navigation, route }: Props) {
  const { transferId, recipient, amount, note } = route.params;
  const insets = useSafeAreaInsets();

  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Animation values
  const spinValue = useRef(new Animated.Value(0)).current;
  const progressValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;

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

  // Progress through steps
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const processStep = (stepIndex: number) => {
      const step = PROCESSING_STEPS[stepIndex];
      if (stepIndex < PROCESSING_STEPS.length && step) {
        setCurrentStep(stepIndex);

        // Animate progress bar
        Animated.timing(progressValue, {
          toValue: (stepIndex + 1) / PROCESSING_STEPS.length,
          duration: step.duration,
          useNativeDriver: false,
        }).start();

        timeout = setTimeout(() => {
          processStep(stepIndex + 1);
        }, step.duration);
      } else {
        // Complete
        setIsComplete(true);

        // Animate success
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
        timeout = setTimeout(() => {
          navigation.replace('TransferSuccess', {
            transaction: {
              id: transferId,
              amount,
              recipientName: recipient.name,
              recipientAccount: recipient.accountNumber,
              bankName: recipient.bankName,
              date: new Date().toISOString(),
              reference: `ODS-${Math.floor(10000 + Math.random() * 90000)}`,
              note,
            },
          });
        }, 1000);
      }
    };

    // Start processing after initial delay
    timeout = setTimeout(() => processStep(0), 300);

    return () => clearTimeout(timeout);
  }, [
    navigation,
    transferId,
    recipient,
    amount,
    note,
    progressValue,
    scaleValue,
    checkmarkScale,
  ]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const formattedAmount = formatCurrency(amount);

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
          {isComplete
            ? 'Transfer Complete!'
            : (PROCESSING_STEPS[currentStep]?.text ?? 'Processing...')}
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
    width: 100,
    height: 100,
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
