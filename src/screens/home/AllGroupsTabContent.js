import React, {
  memo,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../theme';
import { useTranslation } from '../../i18n/useTranslation';
import { AppText, InputBox, EmptyState } from '../../components/common';
import { APP_IMAGES } from '../../constants/images';
import { fontFamily } from '../../theme/fonts';
import groupService from '../../api/services/groupService';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../constants';

const GroupRowItem = memo(({ item, onJoinPress, colors, t }) => {
  const navigation = useNavigation();
  const imageSource = typeof item.groupImage === 'string' ? { uri: item.groupImage } : item.groupImage;

  const formattedCount = item.totalMembers.toLocaleString();

  const buttonLabel =
    item.status === 'pending'
      ? t('home.allGroups.pending')
      : item.status === 'joined'
      ? t('home.allGroups.pending')
      : t('home.allGroups.joinNow');

  return (
    <View style={[styles.groupRow, { borderBottomColor: colors.divider }]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate(ROUTES.GROUP_DETAILS, { groupId: item.id, groupName: item.groupName })}
        style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 }}
      >
        <Image source={imageSource} style={styles.rowImage} resizeMode="cover" />
        <View style={styles.metadataContainer}>
          <AppText style={[styles.groupNameText, { color: colors.textPrimary }]}>
            {item.groupName}
          </AppText>
          <AppText style={[styles.membersText, { color: colors.textSecondary }]}>
            {t('home.allGroups.members', { count: formattedCount })}
          </AppText>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.joinBtn, { backgroundColor: colors.primarySurface }]}
        activeOpacity={0.7}
        onPress={() => onJoinPress(item.id)}
        testID={`join-btn-${item.id}`}
      >
        <AppText style={[styles.joinBtnText, { color: colors.primary }]}>
          {buttonLabel}
        </AppText>
      </TouchableOpacity>
    </View>
  );
});

const AllGroupsTabContent = ({ selectedSortOption, onFilterPress }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAllGroups = useCallback(async (isRefreshing = false) => {
    if (!isRefreshing) setLoading(true);
    try {
      const res = await groupService.getAllGroups();
      setGroups(res.data);
    } catch (err) {
      console.warn('[AllGroupsTabContent] Error fetching groups:', err);
    } finally {
      if (!isRefreshing) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllGroups();
  }, [fetchAllGroups]);

  const handleJoinPress = useCallback((groupId) => {
    setGroups((prevGroups) =>
      prevGroups.map((g) => {
        if (g.id === groupId) {
          const nextStatus = g.status === 'pending' ? 'join_now' : 'pending';
          return { ...g, status: nextStatus };
        }
        return g;
      }),
    );
    groupService.joinGroup(groupId).catch(() => {
      setGroups((prevGroups) =>
        prevGroups.map((g) => {
          if (g.id === groupId) {
            const prevStatus = g.status === 'pending' ? 'join_now' : 'pending';
            return { ...g, status: prevStatus };
          }
          return g;
        }),
      );
    });
  }, []);

  const sortedAndFilteredGroups = useMemo(() => {
    let result = [...groups];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((g) => g.groupName.toLowerCase().includes(q));
    }
    switch (selectedSortOption) {
      case 'newest':
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'members':
        result.sort((a, b) => b.totalMembers - a.totalMembers);
        break;
      case 'alpha_asc':
        result.sort((a, b) => a.groupName.localeCompare(b.groupName));
        break;
      case 'alpha_desc':
        result.sort((a, b) => b.groupName.localeCompare(a.groupName));
        break;
      default:
        break;
    }
    return result;
  }, [groups, searchQuery, selectedSortOption]);

  const handleRefresh = useCallback(() => {
    fetchAllGroups(true);
  }, [fetchAllGroups]);

  const handleFilterPress = useCallback(() => {
    onFilterPress?.();
  }, [onFilterPress]);

  const searchIcon = useMemo(
    () => (
      <Image
        source={APP_IMAGES.search}
        style={[styles.searchIcon, { tintColor: colors.iconSecondary }]}
        resizeMode="contain"
      />
    ),
    [colors.iconSecondary],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <GroupRowItem
        item={item}
        onJoinPress={handleJoinPress}
        colors={colors}
        t={t}
      />
    ),
    [handleJoinPress, colors, t],
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const renderEmptyState = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }
    return (
      <EmptyState
        title={t('home.allGroups.emptyList')}
        style={styles.emptyStateContainer}
      />
    );
  }, [loading, colors.primary, t]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <View style={[styles.searchRow, { backgroundColor: colors.background }]}>
        <View style={styles.searchInputWrapper}>
          <InputBox
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('home.allGroups.searchPlaceholder')}
            rightIcon={searchIcon}
            containerStyle={styles.searchInputContainer}
            inputWrapperStyle={{ borderRadius: 12 }}
            testID="all-groups-search-input"
          />
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, { borderColor: colors.border, backgroundColor: colors.inputBackground }]}
          activeOpacity={0.7}
          onPress={handleFilterPress}
          testID="all-groups-filter-btn"
        >
          <Image
            source={APP_IMAGES.groupFilter}
            style={[styles.filterIcon, { tintColor: colors.iconPrimary }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedAndFilteredGroups}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={styles.list}
        contentContainerStyle={
          sortedAndFilteredGroups.length === 0 ? styles.listEmptyContent : styles.listContent
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshing={loading}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 10,
  },
  searchInputWrapper: {
    flex: 1,
  },
  searchInputContainer: {
    marginBottom: 0,
  },
  searchIcon: {
    width: 18,
    height: 18,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    width: 22,
    height: 22,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  listEmptyContent: {
    flexGrow: 1,
  },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  rowImage: {
    width: 75,
    height: 75,
    borderRadius: 16,
  },
  metadataContainer: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  groupNameText: {
    fontSize: 15,
    fontFamily: fontFamily.semiBold,
    marginBottom: 4,
  },
  membersText: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
  },
  joinBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinBtnText: {
    fontSize: 13,
    fontFamily: fontFamily.semiBold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(AllGroupsTabContent);
