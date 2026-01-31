/**
 * Odysseus Bank - Quick Actions
 * Horizontal row of action buttons (similar to Sendfie design)
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Icon } from '@components/ui';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';

interface QuickAction {
  id: string;
  label: string;
  iconName: string;
  isPrimary?: boolean;
  onPress: () => void;
}

interface QuickActionsProps {
  onDepositPress?: () => void;
  onPayPress?: () => void;
  onTransferPress?: () => void;
  onRequestPress?: () => void;
}

export function QuickActions({
  onDepositPress,
  onPayPress,
  onTransferPress,
  onRequestPress,
}: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: 'deposit',
      label: 'Deposit',
      iconName: 'arrow-down',
      onPress: onDepositPress ?? (() => {}),
    },
    {
      id: 'pay',
      label: 'Pay',
      iconName: 'credit-card',
      onPress: onPayPress ?? (() => {}),
    },
    {
      id: 'transfer',
      label: 'Transfer',
      iconName: 'arrow-up-right',
      isPrimary: true,
      onPress: onTransferPress ?? (() => {}),
    },
    {
      id: 'request',
      label: 'Request',
      iconName: 'arrow-down-left',
      onPress: onRequestPress ?? (() => {}),
    },
  ];

  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <Pressable
          key={action.id}
          style={styles.actionButton}
          onPress={action.onPress}
        >
          {({ pressed }) => (
            <>
              <View
                style={[
                  styles.iconContainer,
                  action.isPrimary && styles.iconContainerPrimary,
                  pressed && styles.iconContainerPressed,
                ]}
              >
                <Icon
                  name={action.iconName}
                  size={22}
                  color={
                    pressed
                      ? palette.accent.main
                      : action.isPrimary
                        ? palette.primary.contrast
                        : palette.accent.main
                  }
                />
              </View>
              <Text
                style={[
                  styles.labelText,
                  action.isPrimary && styles.labelTextPrimary,
                ]}
              >
                {action.label}
              </Text>
            </>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[4],
    marginTop: spacing[4],
  },
  actionButton: {
    alignItems: 'center',
    gap: spacing[1],
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[1],
  },
  iconContainer: {
    width: 64,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.accent.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.accent.light,
  },
  iconContainerPrimary: {
    backgroundColor: palette.accent.main,
    borderColor: palette.accent.main,
  },
  iconContainerPressed: {
    backgroundColor: palette.primary.main,
    borderColor: palette.primary.main,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  labelTextPrimary: {
    color: colors.text.primary,
    fontWeight: '600',
  },
});

export default QuickActions;
