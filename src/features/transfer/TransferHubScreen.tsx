/**
 * Odysseus Bank - Transfer Hub Screen
 * Main transfer screen with tabs and recipient selection
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';
import { Text, Button } from '@components/ui';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { useRecentRecipients } from '@stores/accountStore';
import { useTransferStore } from '@stores/transferStore';
import type { Recipient } from '@types/models';
import {
  TransferHeader,
  SearchBar,
  TabBar,
  RecipientList,
  type TransferTab,
} from './components';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'TransferHub'
>;

export function TransferHubScreen() {
  const navigation = useNavigation<NavigationProp>();
  const recentRecipients = useRecentRecipients();
  const { setSelectedRecipient, setTransferMethod } = useTransferStore();

  const [activeTab, setActiveTab] = useState<TransferTab>('bank');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle back press
  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Handle tab change
  const handleTabChange = useCallback((tab: TransferTab) => {
    setActiveTab(tab);
    setSearchQuery('');
  }, []);

  // Handle recipient selection
  const handleRecipientPress = useCallback(
    (recipient: Recipient) => {
      setSelectedRecipient(recipient);
      setTransferMethod('recent');
      navigation.navigate('AmountEntry', {
        recipient: {
          id: recipient.id,
          name: recipient.name,
          accountNumber: recipient.accountNumber,
          phoneNumber: recipient.phoneNumber,
          bankName: recipient.bankName,
          avatar: recipient.avatar,
        },
      });
    },
    [navigation, setSelectedRecipient, setTransferMethod]
  );

  // Handle new transfer (bank selection)
  const handleNewTransfer = useCallback(() => {
    if (activeTab === 'mobile') {
      // DuitNow - go to contact picker
      setTransferMethod('duitnow');
      navigation.navigate('ContactPicker');
    } else {
      // Bank transfer - go to bank selection
      setTransferMethod('bank');
      navigation.navigate('BankSelection');
    }
  }, [activeTab, navigation, setTransferMethod]);

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'bank':
        return (
          <RecipientList
            recipients={recentRecipients.filter((r) => r.accountNumber)}
            onRecipientPress={handleRecipientPress}
            searchQuery={searchQuery}
            title="Recent"
          />
        );
      case 'mobile':
        return (
          <RecipientList
            recipients={recentRecipients.filter((r) => r.phoneNumber)}
            onRecipientPress={handleRecipientPress}
            searchQuery={searchQuery}
            title="Recent DuitNow"
          />
        );
      case 'others':
        return (
          <View style={styles.emptyTab}>
            <Text variant="bodyMedium" color="tertiary" align="center">
              Other transfer methods coming soon
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <TransferHeader title="Transfer" onBackPress={handleBackPress} />

      {/* Search */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={
          activeTab === 'mobile'
            ? 'Search by name or phone number'
            : 'Search name, mobile, or account'
        }
      />

      {/* Tabs */}
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Content */}
      <View style={styles.content}>{renderTabContent()}</View>

      {/* Bottom CTA */}
      <View style={styles.bottomContainer}>
        <View style={styles.gradient} />
        <View style={styles.buttonWrapper}>
          <Button
            variant="primary"
            size="large"
            fullWidth
            onPress={handleNewTransfer}
            rightIcon={<Text style={styles.buttonIcon}>→</Text>}
          >
            {activeTab === 'mobile'
              ? 'Choose from contacts'
              : 'Choose bank / recipient'}
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  content: {
    flex: 1,
  },
  emptyTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  gradient: {
    height: 48,
    backgroundColor: colors.background.secondary,
    opacity: 0.9,
  },
  buttonWrapper: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[8],
  },
  buttonIcon: {
    color: palette.primary.contrast,
    fontSize: 18,
    marginLeft: spacing[2],
  },
});

export default TransferHubScreen;
