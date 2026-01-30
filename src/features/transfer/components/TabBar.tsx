/**
 * Odysseus Bank - Tab Bar
 * Horizontal tabs for transfer methods
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@components/ui';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';

export type TransferTab = 'bank' | 'mobile' | 'others';

interface Tab {
  id: TransferTab;
  label: string;
}

const tabs: Tab[] = [
  { id: 'bank', label: 'Bank/eWallet' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'others', label: 'Others' },
];

interface TabBarProps {
  activeTab: TransferTab;
  onTabChange: (tab: TransferTab) => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tabList}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              style={styles.tab}
              onPress={() => onTabChange(tab.id)}
            >
              <Text
                variant="labelMedium"
                color={isActive ? palette.primary.main : colors.text.tertiary}
                style={isActive && styles.activeTabText}
              >
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.secondary,
  },
  tabList: {
    flexDirection: 'row',
    paddingHorizontal: spacing[5],
    gap: spacing[6],
  },
  tab: {
    paddingBottom: spacing[3],
    position: 'relative',
  },
  activeTabText: {
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: palette.primary.main,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
});

export default TabBar;
