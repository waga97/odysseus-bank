/**
 * Odysseus Bank - Recipient Details Screen
 * Enter account number for new recipient
 */

import React, { useCallback, useState, useRef } from 'react';
import type { TextInput } from 'react-native';
import {
  View,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Input, Button, Icon, Avatar } from '@components/ui';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import type { RootStackScreenProps } from '@navigation/types';
import { recipientApi } from '@services/api/endpoints';
import { useTransferStore } from '@stores/transferStore';

type Props = RootStackScreenProps<'RecipientDetails'>;

export function RecipientDetailsScreen({ navigation, route }: Props) {
  const { bankId, bankName } = route.params;
  const insets = useSafeAreaInsets();
  const accountInputRef = useRef<TextInput>(null);

  const { setSelectedRecipient, setTransferMethod } = useTransferStore();

  const [accountNumber, setAccountNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleAccountChange = useCallback((text: string) => {
    // Only allow numbers
    const cleaned = text.replace(/[^0-9]/g, '');
    setAccountNumber(cleaned);
    setError(null);
  }, []);

  const handleContinue = useCallback(async () => {
    // Validate
    if (accountNumber.length < 8) {
      setError('Account number must be at least 8 digits');
      return;
    }

    if (accountNumber.length > 16) {
      setError('Account number cannot exceed 16 digits');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Look up recipient
      const recipient = await recipientApi.lookupRecipient({
        accountNumber,
      });

      // Update store
      setSelectedRecipient({
        id: recipient.id,
        name: recipient.name,
        accountNumber: recipient.accountNumber,
        bankId,
        bankName,
        isFavorite: false,
      });
      setTransferMethod('bank');

      // Navigate to amount entry
      navigation.navigate('AmountEntry', {
        recipient: {
          id: recipient.id,
          name: recipient.name,
          accountNumber: recipient.accountNumber,
          bankName,
        },
      });
    } catch (err) {
      if (err instanceof Error && err.message === 'RECIPIENT_NOT_FOUND') {
        setError('Account not found. Please check the account number.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    accountNumber,
    bankId,
    bankName,
    navigation,
    setSelectedRecipient,
    setTransferMethod,
  ]);

  const isValid = accountNumber.length >= 8 && accountNumber.length <= 16;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.inner, { paddingTop: insets.top }]}>
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
          <Text
            variant="titleMedium"
            color="primary"
            style={styles.headerTitle}
          >
            Recipient Details
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Bank Info */}
          <View style={styles.bankCard}>
            <Avatar name={bankName} size="medium" />
            <View style={styles.bankInfo}>
              <Text style={styles.bankName}>{bankName}</Text>
              <Text style={styles.bankSubtitle}>
                Enter account number below
              </Text>
            </View>
          </View>

          {/* Account Number Input */}
          <Input
            ref={accountInputRef}
            label="Account Number"
            placeholder="e.g. 1234567890"
            value={accountNumber}
            onChangeText={handleAccountChange}
            keyboardType="number-pad"
            maxLength={16}
            autoFocus
            error={error ?? undefined}
            hint="Enter 8-16 digit account number"
          />

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Icon name="info" size={18} color={palette.accent.main} />
            <Text variant="bodySmall" color="secondary" style={styles.infoText}>
              Make sure the account number is correct. Transfers to wrong
              accounts cannot be reversed.
            </Text>
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View
          style={[
            styles.bottomContainer,
            { paddingBottom: insets.bottom + 16 },
          ]}
        >
          <Button
            variant="primary"
            size="large"
            fullWidth
            onPress={() => void handleContinue()}
            disabled={!isValid}
            loading={isLoading}
          >
            Continue
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  inner: {
    flex: 1,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing[4],
    gap: spacing[6],
  },
  bankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[3],
    backgroundColor: palette.primary.contrast,
    borderRadius: borderRadius.lg,
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
  bankSubtitle: {
    fontSize: 13,
    color: colors.text.tertiary,
  },
  infoCard: {
    flexDirection: 'row',
    gap: spacing[2],
    padding: spacing[3],
    backgroundColor: colors.accent.bg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    lineHeight: 20,
  },
  bottomContainer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
});

export default RecipientDetailsScreen;
