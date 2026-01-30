/**
 * Odysseus Bank - Placeholder Screen
 * Temporary screen component for navigation setup
 * Will be replaced with actual screens in Phase 3
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Text } from '@components/ui';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';

export function PlaceholderScreen() {
  const route = useRoute();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" color="primary">
        {route.name}
      </Text>
      <Text variant="bodyMedium" color="secondary" style={styles.subtitle}>
        Screen coming soon...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[4],
  },
  subtitle: {
    marginTop: spacing[2],
  },
});

export default PlaceholderScreen;
