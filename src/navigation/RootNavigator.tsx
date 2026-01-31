/**
 * Odysseus Bank - Root Navigator
 * Main navigation structure for the app
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { colors } from '@theme/colors';

// Screens
import { HomeScreen } from '@features/home';
import { TransferHubScreen } from '@features/transfer';
import { BankSelectionScreen } from '@features/bank-selection';
import { RecipientDetailsScreen } from '@features/recipient';
import { AmountEntryScreen } from '@features/amount';
import { TransferReviewScreen } from '@features/review';
import { BiometricAuthScreen } from '@features/biometric';
import { TransferProcessingScreen } from '@features/processing';
import { TransferSuccessScreen } from '@features/success';
import { TransferErrorScreen } from '@features/error';
import { ContactPickerScreen } from '@features/contacts';
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
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* Transfer Flow */}
      <Stack.Screen name="TransferHub" component={TransferHubScreen} />
      <Stack.Screen name="BankSelection" component={BankSelectionScreen} />
      <Stack.Screen
        name="RecipientDetails"
        component={RecipientDetailsScreen}
      />
      <Stack.Screen name="ContactPicker" component={ContactPickerScreen} />
      <Stack.Screen name="AmountEntry" component={AmountEntryScreen} />
      <Stack.Screen name="TransferReview" component={TransferReviewScreen} />
      <Stack.Screen
        name="BiometricAuth"
        component={BiometricAuthScreen}
        options={{
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="TransferProcessing"
        component={TransferProcessingScreen}
        options={{
          gestureEnabled: false, // Prevent back gesture during processing
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="TransferSuccess"
        component={TransferSuccessScreen}
        options={{
          gestureEnabled: false, // Force user to use "Done" button
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="TransferError"
        component={TransferErrorScreen}
        options={{
          animation: 'fade',
        }}
      />

      {/* History */}
      <Stack.Screen name="TransferHistory" component={PlaceholderScreen} />
      <Stack.Screen name="TransactionDetails" component={PlaceholderScreen} />

      {/* Settings */}
      <Stack.Screen name="Settings" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}

export default RootNavigator;
