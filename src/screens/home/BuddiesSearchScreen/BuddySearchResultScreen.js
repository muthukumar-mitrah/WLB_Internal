import React, { memo, useMemo, useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  Image,
  TextInput
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import {
  AppText,
  SafeContainer,
  Header,
  InputBox,
  Button,
  ToastService,
  AppFlatList,
} from '../../../components/common';
import { useTranslation } from '../../../i18n/useTranslation';
import { ROUTES } from '../../../constants';
import createStyles from './styles';

// Mock Data
const MOCK_BUDDIES = [
  {
    id: '1',
    name: 'David J.',
    matchPercent: 96,
    description: 'Similar goal, prefers daily check-ins, and wants motivation support.',
    age: 32,
    country: 'United States',
    goalLbs: 40,
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  },
  {
    id: '2',
    name: 'Sarah M.',
    matchPercent: 88,
    description: 'Looking for a walking buddy and someone to share healthy meals with.',
    age: 28,
    country: 'Canada',
    goalLbs: 15,
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026703d',
  },
  {
    id: '3',
    name: 'Michael K.',
    matchPercent: 75,
    description: 'Beginner friendly support needed, focuses on consistency.',
    age: 41,
    country: 'United Kingdom',
    goalLbs: 25,
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026702d',
  },
];

const BuddyCard = memo(({ item, t, colors, isDark, styles, onProfilePress, onRequestPress }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: item.avatar }}
            style={styles.avatar}
          />
        </View>
        <View style={styles.userInfoContainer}>
          <View style={styles.nameRow}>
            <AppText style={styles.buddyName}>{item.name}</AppText>
            <View style={[styles.matchBadge, isDark && styles.matchBadgeDark]}>
              <AppText style={styles.matchBadgeText}>
                {t('buddiesSearch.matchPercent', { percent: item.matchPercent })}
              </AppText>
            </View>
          </View>

          <AppText style={styles.descriptionText} numberOfLines={2}>
            {item.description}
          </AppText>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <IonIcon name="calendar-outline" size={14} color={colors.textSecondary} />
              <AppText style={styles.infoText}>{`${item.age} year`}</AppText>
            </View>
            
            <View style={styles.infoItem}>
              <IonIcon name="location-outline" size={14} color={colors.textSecondary} />
              <AppText style={styles.infoText}>{item.country}</AppText>
            </View>
            
            <View style={styles.infoItem}>
              <Image source={require('../../../assets/icons/weight_outline.png')} style={styles.weightIcon} resizeMode="contain" />
              <AppText style={styles.infoText}>{`Lose ${item.goalLbs} lbs`}</AppText>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity 
          style={styles.viewProfileButton} 
          onPress={() => onProfilePress(item)}
          activeOpacity={0.8}
        >
          <AppText style={styles.btnViewProfileText}>
            {t('buddiesSearch.viewProfile')}
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.requestBuddyButton} 
          onPress={() => onRequestPress(item)}
          activeOpacity={0.8}
        >
          <AppText style={styles.btnRequestBuddyText}>
            {t('buddiesSearch.requestBuddy')}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const BuddySearchResultScreen = () => {
  const { colors, spacing, borderRadius, shadows, isDark } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius, shadows }),
    [colors, spacing, borderRadius, shadows]
  );

  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore) {
      setLoadingMore(true);
      setTimeout(() => {
        setLoadingMore(false);
      }, 1000);
    }
  }, [loadingMore]);

  const handleViewProfile = useCallback((buddy) => {
    // Navigating to profile requires userId, using 'VIEW_PROFILE' from routes
    navigation.navigate(ROUTES.VIEW_PROFILE, { userId: buddy.id });
  }, [navigation]);

  const handleRequestBuddy = useCallback((buddy) => {
    ToastService.show({
      type: 'success',
      title: 'Success',
      message: t('buddiesSearch.buddyRequestSuccess'),
    });
  }, [t]);

  const renderItem = useCallback(({ item }) => (
    <BuddyCard
      item={item}
      t={t}
      colors={colors}
      isDark={isDark}
      styles={styles}
      onProfilePress={handleViewProfile}
      onRequestPress={handleRequestBuddy}
    />
  ), [t, colors, isDark, styles, handleViewProfile, handleRequestBuddy]);

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <Header
        title={t('buddiesSearch.title')}
        onBack={() => navigation.goBack()}
        showDivider
      />
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.headerSearchContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={t('buddiesSearch.searchPlaceholder')}
              placeholderTextColor={colors.textTertiary}
              value={search}
              onChangeText={setSearch}
            />
            <TouchableOpacity style={styles.searchIcon} onPress={() => {
              ToastService.show({
                type: 'info',
                message: 'Coming Soon',
              });
            }}>
              <IonIcon name="search-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <AppFlatList
          data={MOCK_BUDDIES}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          isLoadingNext={loadingMore}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        />
      </KeyboardAvoidingView>
    </SafeContainer>
  );
};

export default memo(BuddySearchResultScreen);
