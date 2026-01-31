/**
 * Odysseus Bank - Contact Picker Screen
 * Select contacts for DuitNow transfer with phone number - warm theme
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Contacts from 'expo-contacts';
import { Text, Icon, Input, Avatar, Button, Skeleton } from '@components/ui';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import type { RootStackScreenProps } from '@navigation/types';

type Props = RootStackScreenProps<'ContactPicker'>;

interface ContactItem {
  id: string;
  name: string;
  phoneNumbers: string[];
  avatar?: string;
}

type PermissionState = 'undetermined' | 'granted' | 'denied';

export function ContactPickerScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const [permissionStatus, setPermissionStatus] =
    useState<PermissionState>('undetermined');
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(
    null
  );
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);

  // Request permission and load contacts
  useEffect(() => {
    void requestPermissionAndLoadContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter contacts when search changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = contacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(query) ||
          contact.phoneNumbers.some((phone) => phone.includes(query))
      );
      setFilteredContacts(filtered);
    }
  }, [searchQuery, contacts]);

  const requestPermissionAndLoadContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();

      if (status === Contacts.PermissionStatus.GRANTED) {
        setPermissionStatus('granted');
        await loadContacts();
      } else {
        setPermissionStatus('denied');
        setIsLoading(false);
      }
    } catch {
      setPermissionStatus('denied');
      setIsLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        sort: Contacts.SortTypes.FirstName,
      });

      // Transform and filter contacts with phone numbers
      const transformedContacts: ContactItem[] = data
        .filter(
          (contact) => contact.phoneNumbers && contact.phoneNumbers.length > 0
        )
        .map((contact) => ({
          id: contact.id ?? `contact-${Math.random()}`,
          name: contact.name ?? 'Unknown',
          phoneNumbers:
            contact.phoneNumbers?.map((p) => p.number ?? '').filter(Boolean) ??
            [],
        }));

      setContacts(transformedContacts);
      setFilteredContacts(transformedContacts);
    } catch {
      Alert.alert('Error', 'Failed to load contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleOpenSettings = useCallback(() => {
    void Linking.openSettings();
  }, []);

  const navigateToAmount = useCallback(
    (contact: ContactItem, phone: string) => {
      const formattedPhone = phone.replace(/[\s\-()]/g, '');

      navigation.navigate('AmountEntry', {
        recipient: {
          id: contact.id,
          name: contact.name,
          phoneNumber: formattedPhone,
          bankName: 'DuitNow',
          avatar: contact.avatar,
        },
      });
    },
    [navigation]
  );

  const handleSelectContact = useCallback(
    (contact: ContactItem) => {
      if (contact.phoneNumbers.length === 1 && contact.phoneNumbers[0]) {
        navigateToAmount(contact, contact.phoneNumbers[0]);
      } else {
        setSelectedContact(contact);
      }
    },
    [navigateToAmount]
  );

  const handleSelectPhone = useCallback(
    (phone: string) => {
      if (selectedContact) {
        navigateToAmount(selectedContact, phone);
      }
    },
    [selectedContact, navigateToAmount]
  );

  const handleCancelPhoneSelection = useCallback(() => {
    setSelectedContact(null);
    setSelectedPhone(null);
  }, []);

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/[\s\-()]/g, '');
    if (cleaned.startsWith('+60')) {
      return cleaned.replace(/(\+60)(\d{2})(\d{3,4})(\d{4})/, '$1 $2-$3 $4');
    }
    if (cleaned.startsWith('0')) {
      return cleaned.replace(/^0(\d{2})(\d{3,4})(\d{4})/, '0$1-$2 $3');
    }
    return phone;
  };

  const renderContactSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View key={i} style={styles.contactItem}>
          <Skeleton width={48} height={48} borderRadius={24} />
          <View style={styles.contactInfo}>
            <Skeleton width="60%" height={15} />
            <Skeleton width="40%" height={13} style={styles.skeletonSpacing} />
          </View>
          <Skeleton width={20} height={20} borderRadius={4} />
        </View>
      ))}
    </View>
  );

  const renderContact = ({ item }: { item: ContactItem }) => (
    <Pressable
      style={({ pressed }) => [
        styles.contactItem,
        pressed && styles.contactItemPressed,
      ]}
      onPress={() => handleSelectContact(item)}
    >
      <Avatar name={item.name} size="medium" />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>
          {formatPhoneNumber(item.phoneNumbers[0] ?? '')}
          {item.phoneNumbers.length > 1 &&
            ` +${item.phoneNumbers.length - 1} more`}
        </Text>
      </View>
      <Icon name="chevron-right" size={20} color={colors.text.tertiary} />
    </Pressable>
  );

  // Permission Denied UI
  if (permissionStatus === 'denied') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-left" size={22} color={colors.text.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Select Contact</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.permissionContainer}>
          <View style={styles.permissionIconContainer}>
            <Icon name="users" size={48} color={colors.text.tertiary} />
          </View>
          <Text style={styles.permissionTitle}>Contact Access Required</Text>
          <Text style={styles.permissionText}>
            To send money via DuitNow, we need access to your contacts to find
            recipients by phone number.
          </Text>
          <Button variant="primary" size="large" onPress={handleOpenSettings}>
            Open Settings
          </Button>
          <Button variant="ghost" size="medium" onPress={handleBack}>
            Cancel
          </Button>
        </View>
      </View>
    );
  }

  // Phone Number Selection Modal
  if (selectedContact) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={handleCancelPhoneSelection}
          >
            <Icon name="arrow-left" size={22} color={colors.text.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Select Number</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.selectedContactHeader}>
          <Avatar name={selectedContact.name} size="large" />
          <Text style={styles.selectedContactName}>{selectedContact.name}</Text>
          <Text style={styles.selectedContactSubtitle}>
            Select a phone number for DuitNow transfer
          </Text>
        </View>

        <View style={styles.phoneListContainer}>
          {selectedContact.phoneNumbers.map((phone, index) => (
            <Pressable
              key={`${phone}-${index}`}
              style={({ pressed }) => [
                styles.phoneItem,
                pressed && styles.phoneItemPressed,
                selectedPhone === phone && styles.phoneItemSelected,
              ]}
              onPress={() => handleSelectPhone(phone)}
            >
              <View style={styles.phoneIconContainer}>
                <Icon name="phone" size={20} color={palette.accent.main} />
              </View>
              <View style={styles.phoneInfo}>
                <Text style={styles.phoneNumber}>
                  {formatPhoneNumber(phone)}
                </Text>
                <Text style={styles.phoneLabel}>Mobile</Text>
              </View>
              <Icon
                name="chevron-right"
                size={20}
                color={colors.text.tertiary}
              />
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  // Main Contact List UI
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-left" size={22} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Select Contact</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search contacts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={
            <Icon name="search" size={20} color={colors.text.tertiary} />
          }
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.infoBanner}>
        <Icon name="info" size={18} color={palette.accent.main} />
        <Text style={styles.infoBannerText}>
          Send money instantly using the recipient&apos;s phone number via
          DuitNow
        </Text>
      </View>

      {isLoading ? (
        renderContactSkeleton()
      ) : filteredContacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="users" size={48} color={colors.text.tertiary} />
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'No contacts found'
              : 'No contacts with phone numbers'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={renderContact}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface.secondary,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginHorizontal: spacing[4],
    marginBottom: spacing[3],
    padding: spacing[3],
    backgroundColor: colors.accent.bg,
    borderRadius: borderRadius.lg,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 13,
    color: colors.text.secondary,
  },
  listContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    gap: spacing[3],
    backgroundColor: palette.primary.contrast,
    borderRadius: borderRadius.lg,
    marginBottom: spacing[2],
  },
  contactItemPressed: {
    backgroundColor: colors.background.tertiary,
  },
  contactInfo: {
    flex: 1,
    gap: 2,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  contactPhone: {
    fontSize: 13,
    color: colors.text.tertiary,
  },
  skeletonContainer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
  },
  skeletonSpacing: {
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[6],
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  // Permission denied styles
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    gap: spacing[4],
  },
  permissionIconContainer: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: spacing[4],
  },
  // Phone selection styles
  selectedContactHeader: {
    alignItems: 'center',
    paddingVertical: spacing[6],
    gap: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  selectedContactName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  selectedContactSubtitle: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  phoneListContainer: {
    padding: spacing[4],
    gap: spacing[2],
  },
  phoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    gap: spacing[3],
    backgroundColor: palette.primary.contrast,
    borderRadius: borderRadius.lg,
  },
  phoneItemPressed: {
    backgroundColor: colors.background.tertiary,
  },
  phoneItemSelected: {
    borderColor: palette.accent.main,
    backgroundColor: colors.accent.bg,
  },
  phoneIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneInfo: {
    flex: 1,
    gap: 2,
  },
  phoneNumber: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
  },
  phoneLabel: {
    fontSize: 13,
    color: colors.text.tertiary,
  },
});

export default ContactPickerScreen;
