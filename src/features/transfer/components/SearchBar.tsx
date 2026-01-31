/**
 * Odysseus Bank - Search Bar
 * Search input for recipients - uses standardized Input component
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Icon } from '@components/ui';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';

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
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        leftIcon={<Icon name="search" size={20} color={colors.text.tertiary} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2],
    backgroundColor: colors.background.primary,
  },
});

export default SearchBar;
