/**
 * Odysseus Bank - Avatar Component
 * User profile picture with fallback initials
 */

import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type ImageSourcePropType,
} from 'react-native';
import { palette } from '@theme/colors';
import { borderRadius } from '@theme/borderRadius';
import Text from './Text';

type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';

interface AvatarProps {
  source?: ImageSourcePropType | null;
  name?: string;
  size?: AvatarSize;
  style?: StyleProp<ViewStyle>;
}

const sizeMap = {
  small: 32,
  medium: 40,
  large: 48,
  xlarge: 64,
} as const;

const textVariantMap = {
  small: 'labelSmall',
  medium: 'labelMedium',
  large: 'labelLarge',
  xlarge: 'titleMedium',
} as const;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0]?.charAt(0).toUpperCase() ?? '';
  }
  return (
    (parts[0]?.charAt(0).toUpperCase() ?? '') +
    (parts[parts.length - 1]?.charAt(0).toUpperCase() ?? '')
  );
}

export function Avatar({
  source,
  name = '',
  size = 'medium',
  style,
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);
  const dimension = sizeMap[size];
  const initials = getInitials(name);

  const containerStyle: ViewStyle = {
    width: dimension,
    height: dimension,
    borderRadius: borderRadius.full,
  };

  // Show image if source exists and no error
  if (source && !imageError) {
    return (
      <View style={[styles.container, containerStyle, style]}>
        <Image
          source={source}
          style={[styles.image, { width: dimension, height: dimension }]}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      </View>
    );
  }

  // Fallback to initials
  return (
    <View style={[styles.container, styles.fallback, containerStyle, style]}>
      <Text variant={textVariantMap[size]} color={palette.primary.contrast}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    borderRadius: borderRadius.full,
  },
  fallback: {
    backgroundColor: palette.primary.main,
  },
});

export default Avatar;
