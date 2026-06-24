import { memo, useState, useCallback, useMemo } from 'react';
import { FlatList, Image, TouchableOpacity, View, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import { useTranslation } from '../../../i18n/useTranslation';
import { AppText, SafeContainer, AppModal, Header } from '../../../components/common';
import Icon from 'react-native-vector-icons/Ionicons';
import { createStyles } from './styles';

const userAvatar = require('../../../assets/images/user.png');

const FILTER_OPTIONS = [
  { id: 'allTime', labelKey: 'leaderboard.allTime' },
  { id: 'week', labelKey: 'leaderboard.thisWeek' },
  { id: 'month', labelKey: 'leaderboard.thisMonth' },
];

const LEADERBOARD_DATA = {
  week: [
    { id: '1', rank: 1, name: 'Emma Carter', points: 28400, avatar: userAvatar },
    { id: '2', rank: 2, name: 'Liam Reynolds', points: 18000, avatar: userAvatar },
    { id: '3', rank: 3, name: 'Olivia Martinez', points: 5400, avatar: userAvatar },
    { id: '4', rank: 4, name: 'Noah Thompson', points: 800, avatar: userAvatar },
    { id: '5', rank: 5, name: 'Ava Wilson', points: 650, avatar: userAvatar },
    { id: '6', rank: 6, name: 'Benjamin Davis', points: 250, avatar: userAvatar },
    { id: '7', rank: 7, name: 'Albert Flores', points: 150, avatar: userAvatar },
    { id: '8', rank: 8, name: 'Ralph Edwards', points: 50, avatar: userAvatar },
  ],
  month: [
    { id: '1', rank: 1, name: 'Noah Thompson', points: 23499, avatar: userAvatar },
    { id: '2', rank: 2, name: 'Liam Reynolds', points: 17500, avatar: userAvatar },
    { id: '3', rank: 3, name: 'Benjamin Davis', points: 5200, avatar: userAvatar },
    { id: '4', rank: 4, name: 'Ava Wilson', points: 799, avatar: userAvatar },
    { id: '5', rank: 5, name: 'Albert Flores', points: 656, avatar: userAvatar },
    { id: '6', rank: 6, name: 'Olivia Martinez', points: 269, avatar: userAvatar },
    { id: '7', rank: 7, name: 'Emma Carter', points: 130, avatar: userAvatar },
    { id: '8', rank: 8, name: 'Ralph Edwards', points: 20, avatar: userAvatar },
  ],
  allTime: [
    { id: '1', rank: 1, name: 'Noah Thompson', points: 25560, avatar: userAvatar },
    { id: '2', rank: 2, name: 'Emma Carter', points: 16720, avatar: userAvatar },
    { id: '3', rank: 3, name: 'Liam Reynolds', points: 5600, avatar: userAvatar },
    { id: '4', rank: 4, name: 'Ava Wilson', points: 769, avatar: userAvatar },
    { id: '5', rank: 5, name: 'Olivia Martinez', points: 648, avatar: userAvatar },
    { id: '6', rank: 6, name: 'Albert Flores', points: 278, avatar: userAvatar },
    { id: '7', rank: 7, name: 'Benjamin Davis', points: 120, avatar: userAvatar },
    { id: '8', rank: 8, name: 'Ralph Edwards', points: 30, avatar: userAvatar },
  ],
};

const YOUR_RANK_DATA = {
  week: { rank: 12, points: 580 },
  month: { rank: 8, points: 25000 },
  allTime: { rank: 15, points: 8920 },
};

const formatPoints = (pts) => pts.toLocaleString();

const getRankIcon = (points) => {
  if (points >= 20000) return { imgUrl: require('../../../assets/icons/elite_icon.png') };
  if (points >= 10000) return { imgUrl: require('../../../assets/icons/legend_icon.png') };
  if (points >= 1000) return { imgUrl: require('../../../assets/icons/champion_icon.png') };
  if (points >= 700) return { imgUrl: require('../../../assets/icons/achiever_icon.png') };
  if (points >= 400) return { imgUrl: require('../../../assets/icons/energizer_icon.png') };
  if (points >= 200) return { imgUrl: require('../../../assets/icons/supporter_icon.png') };
  if (points >= 100) return { imgUrl: require('../../../assets/icons/rising_star_icon.png') };
  return { imgUrl: require('../../../assets/icons/starter_icon.png') };
};

const getRankImage = (points) => {
  if (points >= 20000) return require('../../../assets/images/elite.png');
  if (points >= 10000) return require('../../../assets/images/legend.png');
  if (points >= 1000) return require('../../../assets/images/champion.png');
  if (points >= 700) return require('../../../assets/images/achiever.png');
  if (points >= 400) return require('../../../assets/images/energizer_dark.png');
  if (points >= 200) return require('../../../assets/images/supporter.png');
  if (points >= 100) return require('../../../assets/images/rising_star.png');
  return require('../../../assets/images/starter.png');
};

const LeaderboardItem = memo(({ item, styles, colors, t, index }) => {
  const isFirst = index === 0;
  const rankIcon = getRankIcon(item.points);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
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
    </TouchableOpacity>
  );
});

const LeaderboardScreen = () => {
  const navigation = useNavigation();
  const { colors, spacing, borderRadius, shadows } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles({ colors, spacing, borderRadius }), [colors, spacing, borderRadius]);

  const [selectedFilter, setSelectedFilter] = useState('allTime');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const leaderboardData = useMemo(() => LEADERBOARD_DATA[selectedFilter], [selectedFilter]);
  const yourRank = useMemo(() => YOUR_RANK_DATA[selectedFilter], [selectedFilter]);

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
    const opt = FILTER_OPTIONS.find(o => o.id === selectedFilter);
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
            data={FILTER_OPTIONS}
            keyExtractor={(item) => item.id}
            renderItem={renderFilterItem}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </AppModal>
      </View>

      <FlatList
        data={leaderboardData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={closeDropdown}
        style={styles.list}
      />

      <View style={[styles.yourRankCard, shadows.card, styles.rowSelected]}>
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
          style={[styles.separator, { backgroundColor: colors.border }]}
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
