/**
 * Odysseus Bank - Quick Actions
 * Modern action buttons with visual hierarchy and subtle shadows
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
  onScanPress?: () => void;
  onAddMoneyPress?: () => void;
  onTransferPress?: () => void;
  onReceivePress?: () => void;
}

export function QuickActions({
  onScanPress,
  onAddMoneyPress,
  onTransferPress,
  onReceivePress,
}: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: 'scan',
      label: 'Scan',
      iconName: 'maximize',
      onPress: onScanPress ?? (() => {}),
    },
    {
      id: 'add-money',
      label: 'Add Money',
      iconName: 'plus',
      onPress: onAddMoneyPress ?? (() => {}),
    },
    {
      id: 'transfer',
      label: 'Transfer',
      iconName: 'arrow-up-right',
      isPrimary: true,
      onPress: onTransferPress ?? (() => {}),
    },
    {
      id: 'receive',
      label: 'Receive',
      iconName: 'arrow-down-left',
      onPress: onReceivePress ?? (() => {}),
    },
  ];

  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <Pressable
          key={action.id}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={action.onPress}
        >
          {({ pressed }) => (
            <>
              <View
                style={[
                  styles.iconWrapper,
                  action.isPrimary && styles.iconWrapperPrimary,
                  pressed && styles.iconWrapperPressed,
                ]}
              >
                <Icon
                  name={action.iconName}
                  size={24}
                  color={
                    pressed || action.isPrimary
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    marginTop: spacing[5],
  },
  actionButton: {
    alignItems: 'center',
    gap: spacing[2],
  },
  actionButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.xl,
    backgroundColor: palette.primary.contrast,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow.color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  iconWrapperPrimary: {
    backgroundColor: palette.accent.main,
    shadowColor: palette.accent.dark,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  iconWrapperPressed: {
    backgroundColor: palette.primary.main,
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
