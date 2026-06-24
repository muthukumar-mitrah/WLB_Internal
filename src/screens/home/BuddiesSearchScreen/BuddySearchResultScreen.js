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
import { AI_BUDDIES } from '../../../constants/aiBuddyConstants';
import createStyles from './styles';

// Enhance AI_BUDDIES with mock match percent for the result screen
const AI_BUDDY_RESULTS = AI_BUDDIES.map((buddy, index) => ({
  ...buddy,
  matchPercent: 96 - (index * 3), // mock match percentage
}));

const BuddyCard = memo(({ item, t, colors, isDark, styles, onProfilePress, onRequestPress }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.avatar}
          />
        </View>
        <View style={styles.userInfoContainer}>
          <View style={styles.nameRow}>
            <AppText style={styles.buddyName}>{item.name}</AppText>
            <View style={[styles.matchBadge, isDark && styles.matchBadgeDark]}>
              <AppText style={styles.matchBadgeText}>
                {t('buddiesSearch.matchPercent', { percent: item.matchPercent || 90 })}
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
    navigation.navigate(ROUTES.AI_BUDDY_DETAILS, { buddyId: buddy.id });
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
          data={AI_BUDDY_RESULTS}
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
