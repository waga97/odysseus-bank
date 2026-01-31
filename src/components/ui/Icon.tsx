/**
 * Odysseus Bank - Icon Component
 * Using Feather icons from @expo/vector-icons
 */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import { Feather } from '@expo/vector-icons';
import { colors } from '@theme/colors';
import type { StyleProp, ViewStyle } from 'react-native';

type IconSizeName = 'small' | 'medium' | 'large' | 'xlarge';
type IconSize = IconSizeName | number;

// Feather icon names type
type FeatherIconName = string;

interface IconProps {
  name: string;
  size?: IconSize;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export type { IconSize };

const sizeMap = {
  small: 18,
  medium: 24,
  large: 28,
  xlarge: 32,
} as const;

// Map custom icon names to Feather icon names
const iconNameMap: Record<string, FeatherIconName> = {
  // Navigation
  'arrow-left': 'arrow-left',
  'arrow-right': 'arrow-right',
  arrow_back: 'arrow-left',
  arrow_forward: 'arrow-right',
  'chevron-right': 'chevron-right',
  'chevron-left': 'chevron-left',
  'chevron-down': 'chevron-down',
  'chevron-up': 'chevron-up',
  close: 'x',
  x: 'x',
  'more-vertical': 'more-vertical',
  more_vert: 'more-vertical',
  menu: 'menu',

  // Actions
  send: 'send',
  add: 'plus',
  plus: 'plus',
  remove: 'minus',
  minus: 'minus',
  check: 'check',
  search: 'search',
  edit: 'edit-2',
  'edit-2': 'edit-2',
  'edit-3': 'edit-3',
  delete: 'delete',
  trash: 'trash-2',
  'trash-2': 'trash-2',
  share: 'share',
  'share-2': 'share-2',
  copy: 'copy',
  'file-text': 'file-text',
  download: 'download',
  upload: 'upload',
  refresh: 'refresh-cw',
  'refresh-cw': 'refresh-cw',
  'external-link': 'external-link',

  // Finance
  'credit-card': 'credit-card',
  'dollar-sign': 'dollar-sign',
  'trending-up': 'trending-up',
  'trending-down': 'trending-down',

  // Status
  'alert-circle': 'alert-circle',
  'alert-triangle': 'alert-triangle',
  info: 'info',
  'check-circle': 'check-circle',
  'x-circle': 'x-circle',
  bell: 'bell',
  notifications: 'bell',

  // User
  user: 'user',
  users: 'users',
  person: 'user',

  // Communication
  phone: 'phone',
  mail: 'mail',
  'message-circle': 'message-circle',
  'message-square': 'message-square',

  // Security
  lock: 'lock',
  unlock: 'unlock',
  shield: 'shield',
  eye: 'eye',
  'eye-off': 'eye-off',
  visibility: 'eye',
  visibility_off: 'eye-off',

  // Misc
  home: 'home',
  settings: 'settings',
  clock: 'clock',
  history: 'clock',
  calendar: 'calendar',
  star: 'star',
  heart: 'heart',
  bookmark: 'bookmark',
  flag: 'flag',
  'map-pin': 'map-pin',
  globe: 'globe',
  wifi: 'wifi',
  'wifi-off': 'wifi-off',
  bluetooth: 'bluetooth',
  camera: 'camera',
  image: 'image',
  grid: 'grid',
  list: 'list',
  filter: 'filter',
  sliders: 'sliders',
  maximize: 'maximize',
  minimize: 'minimize',
  'log-out': 'log-out',
  'log-in': 'log-in',
  'help-circle': 'help-circle',
  'qr-code': 'grid',
  qr_code: 'grid',
  scan: 'maximize',

  // Arrows
  'arrow-up': 'arrow-up',
  'arrow-down': 'arrow-down',
  'arrow-up-right': 'arrow-up-right',
  'arrow-down-left': 'arrow-down-left',
  'arrow-up-left': 'arrow-up-left',
  'arrow-down-right': 'arrow-down-right',
  'corner-up-right': 'corner-up-right',
  'corner-down-right': 'corner-down-right',

  // Charts
  'bar-chart': 'bar-chart',
  'bar-chart-2': 'bar-chart-2',
  'pie-chart': 'pie-chart',
  activity: 'activity',

  // Transfer
  repeat: 'repeat',
  'rotate-cw': 'rotate-cw',
  'rotate-ccw': 'rotate-ccw',

  // Shopping
  'shopping-bag': 'shopping-bag',
  'shopping-cart': 'shopping-cart',
  package: 'package',
};

export function Icon({
  name,
  size = 'medium',
  color = colors.text.primary,
  style,
}: IconProps) {
  // Calculate icon size - use numeric value directly or look up from size map
  let iconSize: number;
  if (typeof size === 'number') {
    iconSize = size;
  } else {
    iconSize = sizeMap[size];
  }

  // Get the Feather icon name from our mapping, fallback to 'circle'
  const mappedName = iconNameMap[name];
  const featherName: FeatherIconName =
    mappedName !== undefined ? mappedName : 'circle';

  return (
    <Feather name={featherName} size={iconSize} color={color} style={style} />
  );
}

export default Icon;
