/**
 * Odysseus Bank - Search Bar
 * Search input for recipients
 */

import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Text } from '@components/ui';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import { typography } from '@theme/typography';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search name, mobile, or account',
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.tertiary}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[4],
  },
  searchIcon: {
    fontSize: 20,
    color: colors.text.tertiary,
    marginRight: spacing[2],
  },
  input: {
    flex: 1,
    height: '100%',
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
});

export default SearchBar;
