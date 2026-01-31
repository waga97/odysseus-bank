/**
 * Odysseus Bank - Bottom Navigation
 * Floating bottom tab bar with warm theme
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@components/ui';
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
  isCenter?: boolean;
}

const navItems: NavItem[] = [
  { id: 'home', iconName: 'home' },
  { id: 'cards', iconName: 'credit-card' },
  { id: 'transfer', iconName: 'repeat', isCenter: true },
  { id: 'analytics', iconName: 'bar-chart-2' },
  { id: 'settings', iconName: 'settings' },
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

          if (item.isCenter) {
            return (
              <Pressable
                key={item.id}
                style={({ pressed }) => [
                  styles.centerButton,
                  pressed && styles.centerButtonPressed,
                ]}
                onPress={() => onTabPress?.(item.id)}
              >
                <Icon
                  name={item.iconName}
                  size={24}
                  color={palette.primary.contrast}
                />
              </Pressable>
            );
          }

          return (
            <Pressable
              key={item.id}
              style={styles.tabButton}
              onPress={() => onTabPress?.(item.id)}
            >
              <View
                style={[
                  styles.tabIndicator,
                  isActive && styles.tabIndicatorActive,
                ]}
              >
                <Icon
                  name={item.iconName}
                  size={22}
                  color={isActive ? palette.accent.main : colors.text.tertiary}
                />
              </View>
              {isActive && <View style={styles.activeIndicatorDot} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[1],
    backgroundColor: colors.background.primary,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.primary,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    shadowColor: colors.shadow.color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[1],
    gap: 0,
  },
  tabIndicator: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIndicatorActive: {
    backgroundColor: palette.primary.main,
  },
  activeIndicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.accent.main,
    marginTop: 2,
  },
  centerButton: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.full,
    backgroundColor: palette.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -spacing[5],
    borderWidth: 3,
    borderColor: colors.surface.primary,
    shadowColor: palette.accent.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  centerButtonPressed: {
    backgroundColor: palette.accent.dark,
  },
});

export default BottomNav;
