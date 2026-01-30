/**
 * Odysseus Bank - Root Navigator
 * Main navigation structure for the app
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { colors } from '@theme/colors';

// Screens - will be implemented in Phase 3
// For now, we'll use placeholder components
import { PlaceholderScreen } from './PlaceholderScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const defaultScreenOptions = {
  headerShown: false,
  contentStyle: {
    backgroundColor: colors.background.primary,
  },
  animation: 'slide_from_right' as const,
};

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={defaultScreenOptions}
    >
      {/* Main */}
      <Stack.Screen
        name="Home"
        component={PlaceholderScreen}
      />

      {/* Transfer Flow */}
      <Stack.Screen
        name="TransferHub"
        component={PlaceholderScreen}
      />
      <Stack.Screen
        name="BankSelection"
        component={PlaceholderScreen}
      />
      <Stack.Screen
        name="RecipientDetails"
        component={PlaceholderScreen}
      />
      <Stack.Screen
        name="ContactPicker"
        component={PlaceholderScreen}
      />
      <Stack.Screen
        name="AmountEntry"
        component={PlaceholderScreen}
      />
      <Stack.Screen
        name="TransferReview"
        component={PlaceholderScreen}
      />
      <Stack.Screen
        name="TransferProcessing"
        component={PlaceholderScreen}
        options={{
          gestureEnabled: false, // Prevent back gesture during processing
        }}
      />
      <Stack.Screen
        name="TransferSuccess"
        component={PlaceholderScreen}
        options={{
          gestureEnabled: false, // Force user to use "Done" button
        }}
      />
      <Stack.Screen
        name="TransferError"
        component={PlaceholderScreen}
      />

      {/* History */}
      <Stack.Screen
        name="TransferHistory"
        component={PlaceholderScreen}
      />
      <Stack.Screen
        name="TransactionDetails"
        component={PlaceholderScreen}
      />

      {/* Settings */}
      <Stack.Screen
        name="Settings"
        component={PlaceholderScreen}
      />
    </Stack.Navigator>
  );
}

export default RootNavigator;
