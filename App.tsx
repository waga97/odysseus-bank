/**
 * Odysseus Bank - App Entry Point
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { OfflineBanner } from './src/components/ui';
import { useNetworkStatus } from './src/hooks/useNetworkStatus';

function AppContent() {
  const { isOffline } = useNetworkStatus();

  return (
    <View style={styles.container}>
      <OfflineBanner isOffline={isOffline} />
      <RootNavigator />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <AppContent />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
