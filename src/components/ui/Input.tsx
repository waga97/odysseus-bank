/**
 * Odysseus Bank - Input Component
 *
 * Styles:
 * - Inactive: Orange border
 * - Active/Focused: Black border
 * - Background: Always white
 * - Text color: Primary
 */

import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, palette } from '@theme/colors';
import { typography } from '@theme/typography';
import { borderRadius } from '@theme/borderRadius';
import { spacing } from '@theme/spacing';
import Text from './Text';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      disabled = false,
      containerStyle,
      inputStyle,
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (
      e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]
    ) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (
      e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]
    ) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <View style={[styles.wrapper, containerStyle]}>
        {label && (
          <Text variant="labelMedium" color="secondary" style={styles.label}>
            {label}
          </Text>
        )}

        <View
          style={[
            styles.inputContainer,
            isFocused && styles.inputContainerFocused,
            error && styles.inputContainerError,
            disabled && styles.inputContainerDisabled,
          ]}
        >
          {leftIcon}

          <TextInput
            ref={ref}
            style={[styles.input, inputStyle]}
            placeholderTextColor={colors.text.tertiary}
            editable={!disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardAppearance="light"
            accessibilityLabel={label}
            accessibilityState={{ disabled }}
            accessibilityHint={hint}
            {...rest}
          />

          {rightIcon}
        </View>

        {(error || hint) && (
          <Text
            variant="caption"
            color={error ? colors.semantic.error : 'tertiary'}
            style={styles.helperText}
          >
            {error || hint}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    marginBottom: spacing[2],
    marginLeft: spacing[1],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: palette.primary.contrast, // Always white
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[4],
    gap: spacing[3],
    borderWidth: 2,
    borderColor: palette.accent.main, // Orange border when inactive
  },
  inputContainerFocused: {
    borderColor: palette.primary.main, // Black border when active
  },
  inputContainerError: {
    borderColor: colors.semantic.error,
  },
  inputContainerDisabled: {
    backgroundColor: colors.background.tertiary,
    borderColor: colors.border.primary,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: typography.bodyMedium?.fontFamily,
    fontWeight: typography.bodyMedium?.fontWeight,
    color: colors.text.primary,
    textAlignVertical: 'center',
    paddingVertical: 0,
    includeFontPadding: false,
  },
  helperText: {
    marginTop: spacing[1],
    marginLeft: spacing[1],
  },
});

export default Input;
