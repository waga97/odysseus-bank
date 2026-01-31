/**
 * Odysseus Bank - Bottom Navigation
 * Modern minimal bottom tab bar
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, Text } from '@components/ui';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';

type TabId = 'home' | 'cards' | 'transfer' | 'analytics' | 'settings';

interface BottomNavProps {
  activeTab?: TabId;
  onTabPress?: (tab: TabId) => void;
}

interface NavItem {
  id: TabId;
  iconName: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'home', iconName: 'home', label: 'Home' },
  { id: 'cards', iconName: 'credit-card', label: 'Cards' },
  { id: 'transfer', iconName: 'send', label: 'Send' },
  { id: 'analytics', iconName: 'pie-chart', label: 'Stats' },
  { id: 'settings', iconName: 'user', label: 'Profile' },
];

export function BottomNav({ activeTab = 'home', onTabPress }: BottomNavProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, spacing[2]) },
      ]}
    >
      <View style={styles.navBar}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.tabButton,
                pressed && styles.tabButtonPressed,
              ]}
              onPress={() => onTabPress?.(item.id)}
            >
              <View
                style={[styles.tabContent, isActive && styles.tabContentActive]}
              >
                <Icon
                  name={item.iconName}
                  size={20}
                  color={isActive ? palette.accent.main : colors.text.tertiary}
                />
                {isActive && (
                  <Text style={styles.activeLabel}>{item.label}</Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    backgroundColor: colors.background.primary,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: palette.primary.contrast,
    borderRadius: borderRadius['2xl'],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[2],
    shadowColor: colors.shadow.color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonPressed: {
    opacity: 0.7,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.full,
    gap: spacing[2],
  },
  tabContentActive: {
    backgroundColor: palette.accent.light + '30',
  },
  activeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.accent.main,
  },
});

export default BottomNav;
