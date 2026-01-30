/**
 * Odysseus Bank - Transfer Header
 * Header with back button and title
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@components/ui';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';

interface TransferHeaderProps {
  title: string;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
}

export function TransferHeader({
  title,
  onBackPress,
  rightElement,
}: TransferHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing[2] }]}>
      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={onBackPress} hitSlop={8}>
        <Text style={styles.backIcon}>←</Text>
      </Pressable>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text variant="headlineSmall" color="primary">
          {title}
        </Text>
      </View>

      {/* Right Element */}
      <View style={styles.rightContainer}>{rightElement}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    backgroundColor: colors.background.secondary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: colors.text.primary,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    width: 40,
  },
});

export default TransferHeader;
