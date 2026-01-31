/**
 * Odysseus Bank - Haptic Feedback Utilities
 * Provides consistent haptic feedback across the app
 */

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Check if haptics are supported
 */
const isHapticsSupported = Platform.OS === 'ios' || Platform.OS === 'android';

/**
 * Light haptic feedback for subtle interactions
 * Use for: keypad taps, toggle switches, selection changes
 */
export async function lightHaptic(): Promise<void> {
  if (!isHapticsSupported) {
    return;
  }
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Silently fail if haptics not available
  }
}

/**
 * Medium haptic feedback for standard interactions
 * Use for: button presses, card selections
 */
export async function mediumHaptic(): Promise<void> {
  if (!isHapticsSupported) {
    return;
  }
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {
    // Silently fail if haptics not available
  }
}

/**
 * Heavy haptic feedback for significant interactions
 * Use for: completing actions, confirming dialogs
 */
export async function heavyHaptic(): Promise<void> {
  if (!isHapticsSupported) {
    return;
  }
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch {
    // Silently fail if haptics not available
  }
}

/**
 * Success haptic feedback
 * Use for: successful transactions, completed actions
 */
export async function successHaptic(): Promise<void> {
  if (!isHapticsSupported) {
    return;
  }
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // Silently fail if haptics not available
  }
}

/**
 * Warning haptic feedback
 * Use for: approaching limits, validation warnings
 */
export async function warningHaptic(): Promise<void> {
  if (!isHapticsSupported) {
    return;
  }
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch {
    // Silently fail if haptics not available
  }
}

/**
 * Error haptic feedback
 * Use for: failed transactions, validation errors
 */
export async function errorHaptic(): Promise<void> {
  if (!isHapticsSupported) {
    return;
  }
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch {
    // Silently fail if haptics not available
  }
}

/**
 * Selection changed haptic
 * Use for: picker selections, tab changes
 */
export async function selectionHaptic(): Promise<void> {
  if (!isHapticsSupported) {
    return;
  }
  try {
    await Haptics.selectionAsync();
  } catch {
    // Silently fail if haptics not available
  }
}

/**
 * Convenience object for importing all haptics
 */
export const haptics = {
  light: lightHaptic,
  medium: mediumHaptic,
  heavy: heavyHaptic,
  success: successHaptic,
  warning: warningHaptic,
  error: errorHaptic,
  selection: selectionHaptic,
};

export default haptics;
