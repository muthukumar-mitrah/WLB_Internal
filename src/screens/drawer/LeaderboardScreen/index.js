import { memo, useState, useCallback, useMemo } from 'react';
import { FlatList, Image, TouchableOpacity, View, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import { useTranslation } from '../../../i18n/useTranslation';
import { AppText, SafeContainer, AppModal, Header } from '../../../components/common';
import Icon from 'react-native-vector-icons/Ionicons';
import { createStyles } from './styles';
import { APP_IMAGES } from '../../../constants/images';
import {
  leaderboardFilterOptions,
  leaderboardData,
  yourRankData,
} from '../../../constants/mockData';



const formatPoints = (pts) => pts.toLocaleString();

const getRankIcon = (points) => {
  if (points >= 20000) return { imgUrl: APP_IMAGES.eliteIcon };
  if (points >= 10000) return { imgUrl: APP_IMAGES.legendIcon };
  if (points >= 1000) return { imgUrl: APP_IMAGES.championIcon };
  if (points >= 700) return { imgUrl: APP_IMAGES.achieverIcon };
  if (points >= 400) return { imgUrl: APP_IMAGES.energizerIcon };
  if (points >= 200) return { imgUrl: APP_IMAGES.supporterIcon };
  if (points >= 100) return { imgUrl: APP_IMAGES.risingStarIcon };
  return { imgUrl: APP_IMAGES.starterIcon };
};

const getRankImage = (points) => {
  if (points >= 20000) return APP_IMAGES.elite;
  if (points >= 10000) return APP_IMAGES.legend;
  if (points >= 1000) return APP_IMAGES.champion;
  if (points >= 700) return APP_IMAGES.achiever;
  if (points >= 400) return APP_IMAGES.energizerDark;
  if (points >= 200) return APP_IMAGES.supporter;
  if (points >= 100) return APP_IMAGES.risingStar;
  return APP_IMAGES.starter;
};

const LeaderboardItem = memo(({ item, styles, colors, t, index }) => {
  const isFirst = index === 0;
  const rankIcon = getRankIcon(item.points);

  return (
    <View
      style={[
        styles.row,
        isFirst && styles.rowFirst,]}
    >
      <View style={styles.rankIconContainer}>
        <Image source={rankIcon.imgUrl} style={styles.awardImage} />
      </View>

      <Image source={item.avatar} style={styles.avatar} resizeMode="cover" />

      <AppText variant="bodyMedium" color={colors.textPrimary} style={styles.nameText}>
        {item.name}
      </AppText>

      <View style={styles.pointsContainer}>
        <AppText variant="bodyLarge" color={isFirst ? colors.accent : colors.primaryDark} style={styles.pointText}>
          {formatPoints(item.points)}
        </AppText>
        <AppText variant="captionSmall" color={colors.textSecondary}>
          {t('leaderboard.pointsLabel')}
        </AppText>
      </View>
    </View>
  );
});

const LeaderboardScreen = () => {
  const navigation = useNavigation();
  const { colors, spacing, borderRadius, shadows } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles({ colors, spacing, borderRadius, shadows }), [colors, spacing, borderRadius, shadows]);

  const [selectedFilter, setSelectedFilter] = useState('allTime');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentLeaderboard = useMemo(() => leaderboardData[selectedFilter], [selectedFilter]);
  const yourRank = useMemo(() => yourRankData[selectedFilter], [selectedFilter]);

  const handlePrevious = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation]);

  const toggleDropdown = useCallback(() => {
    setDropdownOpen(prev => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setDropdownOpen(false);
  }, []);

  const handleFilterSelect = useCallback((filterId) => {
    setSelectedFilter(filterId);
    setDropdownOpen(false);
  }, []);

  const selectedLabel = useMemo(() => {
    const opt = leaderboardFilterOptions.find(o => o.id === selectedFilter);
    return t(opt?.labelKey || 'leaderboard.thisWeek');
  }, [selectedFilter, t]);

  const keyExtractor = useCallback((item) => item.id, []);

  const renderFilterItem = useCallback(({ item }) => {
    const isSelected = item.id === selectedFilter;
    return (
      <TouchableOpacity
        style={[
          styles.dropdownItem,
          isSelected && styles.dropdownItemSelected,
        ]}
        onPress={() => handleFilterSelect(item.id)}
        activeOpacity={0.7}
      >
        <AppText
          variant="body"
          color={isSelected ? colors.primary : colors.textPrimary}
          style={isSelected ? styles.selectedFilterText : undefined}
        >
          {t(item.labelKey)}
        </AppText>
        {isSelected && (
          <Icon name="checkmark-circle" size={20} color={colors.primary} />
        )}
      </TouchableOpacity>
    );
  }, [colors, selectedFilter, styles, handleFilterSelect, t]);

  const renderItem = useCallback(({ item, index }) => (
    <LeaderboardItem
      item={item}
      index={index}
      styles={styles}
      colors={colors}
      t={t}
    />
  ), [styles, colors, t]);

  return (
    <SafeContainer edges={['top']} style={styles.container}>

      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />
      <Header title={t('leaderboard.title')} showBack titleAlign="left" transparent={true} onBackPress={handlePrevious} />

      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={toggleDropdown}
          style={[styles.filterPill, dropdownOpen && styles.filterPillActive]}
          activeOpacity={0.7}
        >
          <AppText
            variant="body"
            color={colors.textPrimary}
            style={styles.filterPillText}
          >
            {selectedLabel}
          </AppText>
          <Icon
            name={dropdownOpen ? 'chevron-up' : 'chevron-down'}
            size={14}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        <AppModal
          visible={dropdownOpen}
          onClose={closeDropdown}
          title={t('leaderboard.title')}
        >
          <FlatList
            data={leaderboardFilterOptions}
            keyExtractor={(item) => item.id}
            renderItem={renderFilterItem}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </AppModal>
      </View>

      <FlatList
        data={currentLeaderboard}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={closeDropdown}
        style={styles.list}
      />

      <View style={[styles.yourRankCard, styles.rowSelected]}>
        <View style={styles.topRow}>
          <View style={styles.yourRankLeft}>
            <AppText
              variant="caption"
              color={colors.textSecondary}
              style={styles.yourRankLabel}>
              {t('leaderboard.yourRank')}
            </AppText>

            <View style={styles.yourRankValueRow}>
              <AppText
                variant="h2"
                color={colors.textPrimary}
                style={styles.yourRankNumber}>
                #{yourRank.rank}
              </AppText>

              <AppText variant="bodyMedium" color={colors.primary}>
                {formatPoints(yourRank.points)} {t('leaderboard.pointsLabel')}
              </AppText>
            </View>
          </View>
          <Image source={getRankImage(yourRank?.points ?? 0)} style={styles.thumbnailImage} />
        </View>

        <View
          style={styles.separator}
          pointerEvents="none"
        />

        <AppText
          variant="caption"
          color={colors.textTertiary}>
          {t('leaderboard.motivation')}
        </AppText>
      </View>

    </SafeContainer>
  );
};

export default memo(LeaderboardScreen);
