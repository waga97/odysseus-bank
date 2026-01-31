/**
 * Odysseus Bank - Home Screen
 * Main dashboard with warm cream/orange theme
 */

import React, { useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { useAuthStore } from '@stores/authStore';
import { useAccountStore } from '@stores/accountStore';
import {
  userApi,
  accountApi,
  recipientApi,
  transactionApi,
  bankApi,
} from '@services/api';
import {
  Header,
  BalanceCard,
  QuickActions,
  AccountCards,
  RecentActivity,
  BottomNav,
} from './components';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const setUser = useAuthStore((state) => state.setUser);
  const {
    setAccounts,
    setRecipients,
    setTransactions,
    setTransferLimits,
    setBanks,
    isLoading,
    setLoading,
  } = useAccountStore();

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [user, accounts, recipients, limits, transactions, banks] =
        await Promise.all([
          userApi.getProfile(),
          accountApi.getAccounts(),
          recipientApi.getRecipients(),
          userApi.getLimits(),
          transactionApi.getTransactions({ limit: 10 }),
          bankApi.getBanks(),
        ]);

      // Update stores
      setUser(user);
      setAccounts(accounts);
      setRecipients(recipients);
      setTransferLimits(limits);
      setTransactions(transactions.items);
      setBanks(banks);
    } catch (error) {
      // Handle error silently for now
      // In production, show error toast
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, [
    setUser,
    setAccounts,
    setRecipients,
    setTransferLimits,
    setTransactions,
    setBanks,
    setLoading,
  ]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // Navigation handlers
  const handleTransferPress = useCallback(() => {
    navigation.navigate('TransferHub');
  }, [navigation]);

  const handleSeeAllTransactions = useCallback(() => {
    navigation.navigate('TransferHistory');
  }, [navigation]);

  const handleSettingsPress = useCallback(() => {
    navigation.navigate('Settings');
  }, [navigation]);

  const handleTabPress = useCallback(
    (tab: string) => {
      switch (tab) {
        case 'transfer':
          navigation.navigate('TransferHub');
          break;
        case 'settings':
          navigation.navigate('Settings');
          break;
        case 'analytics':
          navigation.navigate('TransferHistory');
          break;
        default:
          break;
      }
    },
    [navigation]
  );

  return (
    <View style={styles.container}>
      {/* Status bar with light content for black header */}
      <StatusBar
        barStyle="light-content"
        backgroundColor={palette.primary.main}
      />

      {/* Black Header */}
      <Header onProfilePress={handleSettingsPress} />

      {/* Body with curved top - overlaps header */}
      <View style={styles.bodyContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => void loadData()}
              tintColor={palette.accent.main}
            />
          }
        >
          {/* Balance Display */}
          <BalanceCard />

          {/* Quick Actions */}
          <QuickActions onTransferPress={handleTransferPress} />

          {/* Account Cards - Horizontal Scroll */}
          <AccountCards />

          {/* Recent Transactions */}
          <RecentActivity onSeeAllPress={handleSeeAllTransactions} />
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <BottomNav activeTab="home" onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.primary.main, // Black behind the header
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -spacing[4], // Pull up to overlap header
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing[6],
  },
});

export default HomeScreen;
