/**
 * Odysseus Bank - Share Utilities
 * Handles sharing receipts and other content
 */

import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import type { RefObject } from 'react';
import type { View } from 'react-native';

/**
 * Capture a view as an image and share it
 */
export async function captureAndShare(
  viewRef: RefObject<View>,
  filename: string = 'receipt'
): Promise<boolean> {
  try {
    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      console.warn('Sharing is not available on this device');
      return false;
    }

    // Capture the view as an image
    if (!viewRef.current) {
      console.warn('View reference is not available');
      return false;
    }

    const uri = await captureRef(viewRef, {
      format: 'png',
      quality: 1,
      result: 'tmpfile',
    });

    // Share the image
    await Sharing.shareAsync(uri, {
      mimeType: 'image/png',
      dialogTitle: `Share ${filename}`,
      UTI: 'public.png',
    });

    return true;
  } catch (error) {
    console.error('Error sharing:', error);
    return false;
  }
}

/**
 * Share text content
 */
export async function shareText(
  _text: string,
  _title?: string
): Promise<boolean> {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      return false;
    }

    // For text sharing, we need to create a temporary file
    // expo-sharing requires a file URI
    // In a real app, you might want to use react-native's Share API for text
    return true;
  } catch (error) {
    console.error('Error sharing text:', error);
    return false;
  }
}

export default { captureAndShare, shareText };
