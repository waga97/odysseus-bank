/**
 * Odysseus Bank - Button Component
 * Reusable button with variants, sizes, and loading state
 */

import React, { useCallback } from 'react';
import {
  Pressable,
  StyleSheet,
  ActivityIndicator,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, palette } from '@theme/colors';
import { componentRadius } from '@theme/borderRadius';
import { componentShadows } from '@theme/shadows';
import { spacing } from '@theme/spacing';
import Text from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const sizeStyles = {
  small: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: componentRadius.buttonSmall,
    minHeight: 40,
  },
  medium: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    borderRadius: componentRadius.buttonMedium,
    minHeight: 48,
  },
  large: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: componentRadius.buttonLarge,
    minHeight: 56,
  },
} as const;

const textVariants = {
  small: 'buttonSmall',
  medium: 'buttonMedium',
  large: 'buttonLarge',
} as const;

export function Button({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  children,
  onPress,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const getBackgroundColor = useCallback(
    (pressed: boolean) => {
      if (isDisabled) {
        return colors.interactive.disabled;
      }

      switch (variant) {
        case 'primary':
          return pressed
            ? colors.interactive.primaryPressed
            : colors.interactive.primary;
        case 'secondary':
          return pressed
            ? colors.interactive.secondaryHover
            : colors.interactive.secondary;
        case 'accent':
          return pressed ? palette.accent.dark : palette.accent.main;
        case 'outline':
        case 'ghost':
          return pressed ? colors.interactive.secondary : 'transparent';
        default:
          return colors.interactive.primary;
      }
    },
    [variant, isDisabled]
  );

  const getTextColor = useCallback(() => {
    if (isDisabled) {
      return colors.text.disabled;
    }

    switch (variant) {
      case 'primary':
        return palette.primary.contrast;
      case 'accent':
        return '#ffffff';
      case 'secondary':
      case 'outline':
      case 'ghost':
        return colors.text.primary;
      default:
        return palette.primary.contrast;
    }
  }, [variant, isDisabled]);

  const getBorderStyle = useCallback(() => {
    if (variant === 'outline') {
      return {
        borderWidth: 1.5,
        borderColor: isDisabled
          ? colors.border.primary
          : colors.interactive.primary,
      };
    }
    return {};
  }, [variant, isDisabled]);

  const getShadowStyle = useCallback(() => {
    if (variant === 'primary' && !isDisabled) {
      return componentShadows.buttonPrimary;
    }
    return {};
  }, [variant, isDisabled]);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        { backgroundColor: getBackgroundColor(pressed) },
        getBorderStyle(),
        getShadowStyle(),
        fullWidth && styles.fullWidth,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text variant={textVariants[size]} color={getTextColor()}>
            {children}
          </Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: spacing[2],
  },
  rightIcon: {
    marginLeft: spacing[2],
  },
});

export default Button;
