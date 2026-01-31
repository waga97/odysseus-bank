/**
 * Odysseus Bank - Color Palette
 * Warm cream/orange theme inspired by modern fintech apps
 */

export const palette = {
  // Brand colors
  primary: {
    main: '#1a1a1a', // Black for header
    light: '#333333',
    dark: '#000000',
    contrast: '#ffffff',
  },

  // Accent color (Orange/Amber)
  accent: {
    main: '#f5a623', // Warm orange
    light: '#ffc966',
    dark: '#d4860c',
    contrast: '#ffffff',
  },

  // Neutrals (warm tinted)
  neutral: {
    50: '#faf8f5',
    100: '#f5f2ed',
    200: '#ebe6de',
    300: '#d9d2c7',
    400: '#a89f91',
    500: '#7a7265',
    600: '#5c5549',
    700: '#403b32',
    800: '#2a2620',
    900: '#1a1714',
  },

  // Semantic colors
  success: {
    main: '#22c55e',
    light: '#dcfce7',
    dark: '#16a34a',
  },
  warning: {
    main: '#f5a623',
    light: '#fef3c7',
    dark: '#d4860c',
  },
  error: {
    main: '#ef4444',
    light: '#fee2e2',
    dark: '#dc2626',
  },
  info: {
    main: '#3b82f6',
    light: '#dbeafe',
    dark: '#2563eb',
  },

  // Base
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const colors = {
  // Backgrounds (warm cream tones)
  background: {
    primary: '#f7f5f2', // Warm cream
    secondary: '#ffffff',
    tertiary: '#f0ebe4',
  },

  // Surfaces (cards, modals, etc.)
  surface: {
    primary: '#ffffff',
    secondary: '#faf8f5',
    elevated: '#ffffff',
  },

  // Text
  text: {
    primary: '#1a1714',
    secondary: '#5c5549',
    tertiary: '#a89f91',
    inverse: '#ffffff',
    disabled: '#d9d2c7',
  },

  // Borders
  border: {
    primary: '#ebe6de',
    secondary: '#f5f2ed',
    subtle: '#f5f2ed',
    focus: palette.accent.main,
    transparent: 'transparent',
  },

  // Interactive
  interactive: {
    primary: palette.primary.main,
    primaryHover: palette.primary.light,
    primaryPressed: palette.primary.dark,
    secondary: '#f5f2ed',
    secondaryHover: '#ebe6de',
    disabled: '#ebe6de',
  },

  // Accent (for highlights, CTAs)
  accent: {
    main: palette.accent.main,
    light: palette.accent.light,
    dark: palette.accent.dark,
    bg: '#fff8eb',
  },

  // Semantic
  semantic: {
    success: palette.success.main,
    successBackground: palette.success.light,
    warning: palette.warning.main,
    warningBackground: palette.warning.light,
    error: palette.error.main,
    errorBackground: palette.error.light,
    info: palette.info.main,
    infoBackground: palette.info.light,
  },

  // Status (alias for semantic - easier to use)
  status: {
    success: palette.success.main,
    successBg: palette.success.light,
    warning: palette.warning.main,
    warningBg: palette.warning.light,
    error: palette.error.main,
    errorBg: palette.error.light,
    info: palette.info.main,
    infoBg: palette.info.light,
  },

  // Primary colors (for direct access)
  primary: {
    50: '#f5f2ed',
    100: '#ebe6de',
    600: palette.primary.main,
    700: palette.primary.dark,
  },

  // Shadows (for iOS)
  shadow: {
    color: '#1a1714',
    opacity: 0.06,
  },
} as const;

export type Colors = typeof colors;
