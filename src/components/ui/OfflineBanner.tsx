/**
 * Odysseus Bank - Offline Banner
 * Displays when device loses network connectivity
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from './Text';
import { Icon } from './Icon';
import { palette } from '@theme/colors';
import { spacing } from '@theme/spacing';

interface OfflineBannerProps {
  isOffline: boolean;
}

export function OfflineBanner({ isOffline }: OfflineBannerProps) {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-60))[0];

  useEffect(() => {
    if (isOffline) {
      setVisible(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else if (visible) {
      Animated.timing(slideAnim, {
        toValue: -60,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
      });
    }
  }, [isOffline, slideAnim, visible]);

  if (!visible && !isOffline) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingTop: Platform.OS === 'ios' ? insets.top : spacing[2],
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <Icon name="wifi-off" size={18} color={palette.primary.contrast} />
        <Text style={styles.text}>No internet connection</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: palette.error.main,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.primary.contrast,
  },
});

export default OfflineBanner;
