/**
 * Odysseus Bank - Home Header
 * Black header with logo, greeting, and profile avatar
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Avatar, Icon } from '@components/ui';
import { palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import { useUser } from '@stores/authStore';

interface HeaderProps {
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export function Header({ onNotificationPress, onProfilePress }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const user = useUser();

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good morning';
    }
    if (hour < 17) {
      return 'Good afternoon';
    }
    return 'Good evening';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing[3] }]}>
      {/* Left - Logo and Greeting */}
      <View style={styles.leftContent}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Icon name="globe" size={24} color={palette.accent.main} />
          </View>
          <Text style={styles.logoText}>Odysseus</Text>
        </View>
        <Text style={styles.greetingText}>
          {getGreeting()}, {user?.name?.split(' ')[0] ?? 'there'}
        </Text>
      </View>

      {/* Right - Actions */}
      <View style={styles.actions}>
        {/* Notifications */}
        <Pressable
          style={styles.notificationButton}
          onPress={onNotificationPress}
        >
          <Icon name="bell" size={22} color={palette.primary.contrast} />
          <View style={styles.notificationDot} />
        </Pressable>

        {/* Profile Avatar */}
        <Pressable onPress={onProfilePress}>
          <Avatar name={user?.name ?? 'User'} size="medium" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[8],
    backgroundColor: palette.primary.main,
    // Straight edge - the body will have the curve
  },
  leftContent: {
    gap: spacing[1],
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  logoIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.primary.contrast,
    letterSpacing: 0.5,
  },
  greetingText: {
    fontSize: 14,
    color: palette.neutral[400],
    marginTop: spacing[1],
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  notificationButton: {
    position: 'relative',
    padding: spacing[1],
  },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: palette.accent.main,
  },
});

export default Header;
