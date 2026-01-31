/**
 * Odysseus Bank - Common Styles
 * Reusable style patterns following DRY principle
 */

import { StyleSheet } from 'react-native';
import { palette } from './colors';
import { borderRadius } from './borderRadius';

/**
 * Icon container styles for consistent icon styling across the app
 *
 * Style 1: Black background, orange icon (like wallet icon in review screen)
 *   <View style={[commonStyles.iconContainer, commonStyles.iconContainerSmall]}>
 *     <Icon name="credit-card" size={20} color={iconContainerAccentColor} />
 *   </View>
 *
 * Style 2: Black background, orange border, white icon
 *   <View style={[commonStyles.iconContainerBordered, commonStyles.iconContainerSmall]}>
 *     <Icon name="shield" size={20} color={iconContainerWhiteColor} />
 *   </View>
 */
export const commonStyles = StyleSheet.create({
  // Base icon container - black bg, no border (wallet style)
  iconContainer: {
    backgroundColor: palette.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Icon container with orange border - black bg, orange border
  iconContainerBordered: {
    backgroundColor: palette.primary.main,
    borderWidth: 1.5,
    borderColor: palette.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Small icon container (36x36) - for settings rows
  iconContainerSmall: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.lg,
  },

  // Medium icon container (48x48) - for list items
  iconContainerMedium: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.xl,
  },

  // Large icon container (56x56) - for profile avatars
  iconContainerLarge: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
  },

  // Extra large icon container (72x72) - for hero sections
  iconContainerXL: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.full,
  },
});

// Orange icon color (for black bg without border - wallet style)
export const iconContainerAccentColor = palette.accent.main;

// White icon/text color (for black bg with orange border)
export const iconContainerWhiteColor = palette.primary.contrast;

// Legacy export for backwards compatibility
export const iconContainerContentColor = palette.accent.main;

export default commonStyles;
