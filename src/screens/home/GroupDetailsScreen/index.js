import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import PostCard from '../Feed';
import createStyles from './styles';
import { useTheme } from '../../../theme';
import { APP_IMAGES, ROUTES } from '../../../constants';
import { useTranslation } from '../../../i18n/useTranslation';
import {
  Header,
  Button,
  Card,
  Divider,
  AppText,
  SafeContainer,
  EmptyState,
  ToastService,
  AppModal,
  PostOptionsSheet,
  PostPreviewModal,
} from '../../../components/common';
import { useProfile } from '../../../context/ProfileContext';
import GroupOptionsMenu from '../components/GroupOptionsMenu';
import AssignAdminModal from '../components/AssignAdminModal';
import groupService from '../../../api/services/groupService';
import ProfileTabs from '../../profile/components/ProfileTabs';
import DeleteGroupConfirmModal from '../components/DeleteGroupConfirmModal';

import { StyleSheet } from 'react-native';
import { palette } from '../../../theme/colors';

const separatorStyles = StyleSheet.create({
  separator: {
    height: 3,
  },
});

const MOCK_MEMBERS = [
  {
    id: 'm0',
    name: 'Eleanor Pena',
    username: '@eleanorp',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    joinedDate: 'Jun 2026',
  },
  {
    id: 'm1',
    name: 'Jenny Wilson',
    username: '@jennyw',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    joinedDate: 'Jun 2026',
  },
  {
    id: 'm2',
    name: 'Ronald Richards',
    username: '@ronaldr',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    joinedDate: 'Jun 2026',
  },
  {
    id: 'm3',
    name: 'Leslie Alexander',
    username: '@lesliea',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    joinedDate: 'Jun 2026',
  },
  {
    id: 'm4',
    name: 'Floyd Miles',
    username: '@floydm',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    joinedDate: 'Jun 2026',
  },
  {
    id: 'm5',
    name: 'Bessie Cooper',
    username: '@bessiec',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    joinedDate: 'Jun 2026',
  },
];

const PostSeparator = () => <View style={separatorStyles.separator} />;

const GroupDetailsScreen = () => {
  const { colors, spacing, borderRadius, shadows, isDark } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius, shadows, isDark }),
    [colors, spacing, borderRadius, shadows, isDark]
  );

  const { profile } = useProfile();
  const [menuVisible, setMenuVisible] = useState(false);
  const [assignWarningVisible, setAssignWarningVisible] = useState(false);
  const [activeMemberMenuId, setActiveMemberMenuId] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberMenuPageY, setMemberMenuPageY] = useState(300);
  const [makeHostConfirmVisible, setMakeHostConfirmVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const { groupId, groupName } = route.params || {};

  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);

  const membersToShow = useMemo(() => {
    if (!group) return [];
    const count = group.totalMembers || 0;
    const list = [];
    for (let i = 0; i < count; i++) {
      const template = MOCK_MEMBERS[i % MOCK_MEMBERS.length];
      list.push({
        ...template,
        id: `${template.id}_${i}`,
        name: i < MOCK_MEMBERS.length ? template.name : `${template.name} ${Math.floor(i / MOCK_MEMBERS.length) + 1}`,
        username: i < MOCK_MEMBERS.length ? template.username : `${template.username}${Math.floor(i / MOCK_MEMBERS.length) + 1}`,
      });
    }
    return list;
  }, [group]);

  const coverImageSource = useMemo(() => {
    if (!group?.groupCoverImage) return null;
    return typeof group.groupCoverImage === 'number'
      ? group.groupCoverImage
      : { uri: group.groupCoverImage };
  }, [group?.groupCoverImage]);

  const profileImageSource = useMemo(() => {
    if (!group?.groupProfileImage) return APP_IMAGES.profileAvatar;
    return typeof group.groupProfileImage === 'number'
      ? group.groupProfileImage
      : { uri: group.groupProfileImage };
  }, [group?.groupProfileImage]);

  const profileImageResizeMode = useMemo(() => {
    if (
      profileImageSource === APP_IMAGES.findRobi ||
      profileImageSource === APP_IMAGES.findBuddy ||
      profileImageSource === APP_IMAGES.surveyDance
    ) {
      return 'contain';
    }
    return 'cover';
  }, [profileImageSource]);

  const hasMoreMembers = membersToShow.length > 50;
  const displayedMembers = useMemo(() => {
    return showAllMembers ? membersToShow : membersToShow.slice(0, 50);
  }, [showAllMembers, membersToShow]);

  const TABS = useMemo(
    () => ({
      POSTS: t('groupDetails.tabs.posts'),
      APPROVAL: t('groupDetails.tabs.userApproval'),
      MEMBERS: `${t('groupDetails.tabs.members')}`,
      ABOUT: t('groupDetails.tabs.about'),
    }),
    [t]
  );

  const tabList = useMemo(
    () => [TABS.POSTS, TABS.APPROVAL, TABS.MEMBERS, TABS.ABOUT],
    [TABS]
  );

  const [activeTab, setActiveTab] = useState(TABS.ABOUT);


  useEffect(() => {
    let active = true;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const detailsRes = await groupService.getGroupDetails(groupId);
        if (active) {
          setGroup(detailsRes.data);
        }
      } catch (err) {
        console.warn('[GroupDetailsScreen] Error fetching group details:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchDetails();

    return () => {
      active = false;
    };
  }, [groupId]);

  useEffect(() => {
    let active = true;
    if (activeTab === TABS.POSTS) {
      const fetchPosts = async () => {
        setPostsLoading(true);
        try {
          const postsRes = await groupService.getGroupPosts(groupId);
          if (active) {
            const mapped = postsRes.data.map((gp) => ({
              id: gp.id,
              username: gp.userName || gp.groupName,
              avatar: gp.userProfileImage || gp.groupImage,
              text: gp.postDescription,
              image: gp.postImage,
              timeAgo: gp.createdAt,
              likes: gp.likeCount,
              comments: gp.commentCount,
              shares: gp.shareCount,
              liked: gp.liked,
              saved: gp.saved,
              currentWeight: '',
              userId: gp.userId,
              groupId: gp.groupId,
              isGroupPost: false,
            }));
            setPosts(mapped);
          }
        } catch (err) {
          console.warn('[GroupDetailsScreen] Error fetching posts:', err);
        } finally {
          if (active) setPostsLoading(false);
        }
      };
      fetchPosts();
    }
    return () => {
      active = false;
    };
  }, [groupId, activeTab, TABS.POSTS]);

  const handleLikePost = useCallback((postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.liked;
          return {
            ...p,
            liked: nextLiked,
            likes: nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
          };
        }
        return p;
      })
    );
  }, []);

  const handleSavePost = useCallback((postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, saved: !p.saved };
        }
        return p;
      })
    );
  }, []);

  const handleAvatarPress = useCallback((post) => {
    if (!post) return;
    navigation.navigate(ROUTES.VIEW_PROFILE, { userId: post.userId || post.username });
  }, [navigation]);

  const handleCreatePost = useCallback(() => {
    console.log('[GroupDetailsScreen] Create Post clicked');
  }, []);

  const isAdmin = useMemo(() => {
    return group?.admin?.name === profile?.name;
  }, [group, profile]);

  const isMember = useMemo(() => {
    return group?.status === 'joined';
  }, [group]);

  const isJoined = useMemo(() => {
    return group?.status === 'joined';
  }, [group]);

  const handleSelectOption = useCallback((actionKey) => {
    switch (actionKey) {
      case 'editGroup':
        ToastService.show({ type: 'info', message: t('common.comingSoon', 'Coming Soon') });
        break;
      case 'deleteGroup':
        setDeleteConfirmVisible(true);
        break;
      case 'muteNotifications':
        ToastService.show({ type: 'success', message: 'Notifications muted' });
        break;
      case 'leaveGroup':
        if (isAdmin) {
          setAssignWarningVisible(true);
        } else {
          ToastService.show({ type: 'success', message: 'Left the group' });
          navigation.goBack();
        }
        break;
      case 'shareGroup':
        ToastService.show({ type: 'success', message: 'Group shared successfully' });
        break;
      case 'copyLink':
        ToastService.show({ type: 'success', message: t('profile.toast.copied', 'Copied') });
        break;
      default:
        break;
    }
  }, [isAdmin, navigation, t]);

  const handleConfirmDelete = useCallback(() => {
    setDeleteConfirmVisible(false);
    ToastService.show({ type: 'success', message: 'Group deleted successfully' });
    navigation.goBack();
  }, [navigation]);

  const handleConfirmAssignAdmin = useCallback(() => {
    setAssignWarningVisible(false);
    setActiveTab(TABS.MEMBERS);
    ToastService.show({
      type: 'info',
      message: t('groupDetails.options.assignNewAdminDescription'),
    });
  }, [TABS.MEMBERS, t]);

  const handlePostMenuPress = useCallback((post) => {
    setSelectedPost(post);
  }, []);

  const handlePostMenuSelect = useCallback((action) => {
    if (!selectedPost) return;
    switch (action) {
      case 'save':
        handleSavePost(selectedPost.id);
        break;
      case 'message':
        ToastService.show({
          type: 'info',
          message: `${t('home.postOptions.message', { username: selectedPost.username })}...`,
        });
        break;
      case 'profile':
        navigation.navigate(ROUTES.VIEW_PROFILE, { userId: selectedPost.userId || selectedPost.username });
        break;
      case 'hide':
        ToastService.show({ type: 'success', message: 'Post hidden' });
        break;
      case 'report':
        ToastService.show({ type: 'success', message: 'Post reported' });
        break;
      case 'block':
        ToastService.show({
          type: 'success',
          message: `${t('home.postOptions.block', { username: selectedPost.username })}`,
        });
        break;
      default:
        break;
    }
  }, [selectedPost, handleSavePost, navigation, t]);

  const handleMemberMenuPress = useCallback((member, event) => {
    const { pageY } = event.nativeEvent;
    setActiveMemberMenuId(member.id);
    setSelectedMember(member);
    setMemberMenuPageY(pageY);
  }, []);

  const handleMemberOptionSelect = useCallback((action) => {
    if (!selectedMember) return;
    setActiveMemberMenuId(null);
    switch (action) {
      case 'viewProfile':
        navigation.navigate(ROUTES.VIEW_PROFILE, { userId: selectedMember.name });
        break;
      case 'message':
        ToastService.show({
          type: 'info',
          message: `${t('groupDetails.options.message')} ${selectedMember.name}...`,
        });
        break;
      case 'makeHost':
        setMakeHostConfirmVisible(true);
        break;
      case 'removeFromGroup':
        ToastService.show({
          type: 'success',
          message: `${selectedMember.name} ${t('groupDetails.options.removeFromGroup').toLowerCase()}`,
        });
        break;
      default:
        break;
    }
  }, [selectedMember, navigation, t]);

  const handleConfirmMakeHost = useCallback(() => {
    if (selectedMember) {
      ToastService.show({
        type: 'success',
        message: `${selectedMember.name} is now a host!`,
      });
    }
    setMakeHostConfirmVisible(false);
  }, [selectedMember]);

  const renderRightHeaderComponent = useMemo(() => {
    return (
      <TouchableOpacity
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        onPress={() => setMenuVisible(true)}
        accessibilityLabel="Menu"
        accessibilityRole="button">
        <MaterialCommunityIcons name="dots-vertical" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
    );
  }, [colors.textPrimary, setMenuVisible]);

  if (loading || !group) {
    return (
      <SafeContainer style={styles.container}>
        <Header title={groupName || t('groupDetails.title')} showBack titleAlign="left" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeContainer>
    );
  }

  const isPrivate = group.privacyType === 'private';
  const privacyText = isPrivate ? t('groupDetails.privateGroup') : t('groupDetails.publicGroup');
  const createdText = group.createdDate;
  const membersText = group.totalMembers === 1
    ? `1 ${t('groupDetails.activity.member')}`
    : `${group.totalMembers} ${t('groupDetails.activity.members')}`;

  const renderContent = () => {
    if (activeTab === TABS.POSTS) {
      if (postsLoading) {
        return (
          <View style={styles.postsLoadingContainer}>
            <ActivityIndicator size="medium" color={colors.primary} />
          </View>
        );
      }
      return (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              colors={colors}
              onLikePress={handleLikePost}
              onSavePress={handleSavePost}
              onAvatarPress={handleAvatarPress}
              onMenuPress={handlePostMenuPress}
            />
          )}
          ItemSeparatorComponent={PostSeparator}
          ListEmptyComponent={
            <View style={styles.emptyStateWrapper}>
              <EmptyState title={t('home.myGroups.emptyPosts')} icon={null} />
            </View>
          }
        />
      );
    }

    if (activeTab === TABS.MEMBERS) {
      return (
        <View style={{ paddingTop: spacing[2] }}>
          <FlatList
            data={displayedMembers}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={[styles.memberRow, { borderBottomColor: colors.divider }]}>
                <Image source={{ uri: item.profileImage }} style={styles.memberAvatar} />
                <View style={styles.memberInfo}>
                  <AppText style={[styles.memberName, { color: colors.textPrimary }]}>
                    {item.name}
                  </AppText>
                  <AppText style={[styles.memberSinceText, { color: colors.textSecondary }]}>
                    {t('groupDetails.options.memberSince', { date: item.joinedDate })}
                  </AppText>
                </View>
                <TouchableOpacity
                  style={styles.memberMenuBtn}
                  onPress={(e) => handleMemberMenuPress(item, e)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyStateWrapper}>
                <EmptyState title={t('common.noRecordsFound', 'No records found')} icon={null} />
              </View>
            }
            ListFooterComponent={
              hasMoreMembers && !showAllMembers ? (
                <TouchableOpacity
                  style={styles.viewAllBtn}
                  onPress={() => setShowAllMembers(true)}
                  activeOpacity={0.8}
                >
                  <AppText style={styles.viewAllText}>
                    {t('groupDetails.viewAll')}
                  </AppText>
                </TouchableOpacity>
              ) : null
            }
          />
        </View>
      );
    }

    if (activeTab === TABS.ABOUT) {
      return (
        <View style={styles.aboutContainer}>
          <Card padding={spacing[4]} elevation={false}>
            <AppText style={styles.cardTitle}>{t('groupDetails.admin.title')}</AppText>
            <View style={styles.adminCardRow}>
              <View style={styles.adminProfile}>
                <Image
                  source={
                    typeof group.admin.avatar === 'number'
                      ? group.admin.avatar
                      : { uri: group.admin.avatar }
                  }
                  style={styles.adminAvatar}
                  resizeMode="cover"
                />
                <View style={styles.adminInfo}>
                  <AppText style={styles.adminName}>{group.admin.name}</AppText>
                  <AppText style={styles.adminRole}>{t('groupDetails.admin.creatorRole')}</AppText>
                </View>
              </View>
              <View style={styles.adminBadge}>
                <AppText style={styles.adminBadgeText}>{t('groupDetails.admin.badge')}</AppText>
              </View>
            </View>
          </Card>

          <Card padding={spacing[4]} elevation={false}>
            <AppText style={styles.cardTitle}>{t('groupDetails.activity.title')}</AppText>
            
            <View style={styles.activityRow}>
              <AppText style={styles.activityLabel}>{t('groupDetails.activity.postsToday')}</AppText>
              <AppText style={styles.activityValue}>{t('groupDetails.activity.noNewPosts')}</AppText>
            </View>
            <Divider />

            <View style={styles.activityRow}>
              <AppText style={styles.activityLabel}>{t('groupDetails.activity.postsThisMonth')}</AppText>
              <AppText style={styles.activityValue}>{t('groupDetails.activity.noPosts')}</AppText>
            </View>
            <Divider />

            <View style={styles.activityRow}>
              <AppText style={styles.activityLabel}>{t('groupDetails.activity.totalMembers')}</AppText>
              <AppText style={styles.activityValue}>{group.activity.totalMembers}</AppText>
            </View>
            <Divider />

            <View style={styles.activityRow}>
              <AppText style={styles.activityLabel}>{t('groupDetails.activity.newMembersThisWeek')}</AppText>
              <AppText style={styles.activityValue}>{group.activity.newMembersThisWeek}</AppText>
            </View>
          </Card>
        </View>
      );
    }

    return (
      <View style={styles.emptyStateWrapper}>
        <EmptyState title={t('common.noRecordsFound', 'No records found')} icon={null} />
      </View>
    );
  };

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />
      <Header
        title={t('groupDetails.title')}
        showBack
        titleAlign="left"
        rightComponent={renderRightHeaderComponent}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerWrapper}>
          <View style={styles.coverContainer}>
            {coverImageSource ? (
              <Image
                source={coverImageSource}
                style={styles.coverImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.coverBackground}>
                <View style={styles.coverCircleLarge} />
                <View style={styles.coverCircleSmall} />
              </View>
            )}
            <TouchableOpacity
              style={styles.profileImageWrapper}
              onPress={() => setPreviewImage(profileImageSource)}
              activeOpacity={0.9}
            >
              <Image
                source={profileImageSource}
                style={styles.profileImage}
                resizeMode={profileImageResizeMode}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <AppText style={styles.groupName}>{group.groupName}</AppText>
          <AppText style={styles.groupDescription}>{group.groupDescription}</AppText>
          
          <View style={styles.metadataRow}>
            <View style={styles.metadataItem}>
              <Image
                source={APP_IMAGES.lock}
                style={[styles.metadataIcon, styles.privacyIconStyle]}
                resizeMode="contain"
              />
              <AppText style={styles.metadataText}>{privacyText}</AppText>
            </View>
            <View style={styles.metadataItem}>
              <Image
                source={APP_IMAGES.calendarOutline}
                style={[styles.metadataIcon, styles.calendarIconStyle]}
                resizeMode="contain"
              />
              <AppText style={styles.metadataText}>{createdText}</AppText>
            </View>
            <View style={styles.metadataItem}>
              <Image
                source={APP_IMAGES.groupUsers}
                style={[styles.metadataIcon, styles.groupIconStyle]}
                resizeMode="contain"
              />
              <AppText style={styles.metadataText}>{membersText}</AppText>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={t('groupDetails.createPost')}
            onPress={handleCreatePost}
            variant="primary"
            size="md"
            fullWidth
            style={styles.createPostBtn}
          />
        </View>

        <ProfileTabs
          tabs={tabList}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {renderContent()}
      </ScrollView>
      <GroupOptionsMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        isAdmin={isAdmin}
        isMember={isMember}
        isJoined={isJoined}
        onSelect={handleSelectOption}
      />
      <AssignAdminModal
        visible={assignWarningVisible}
        onClose={() => setAssignWarningVisible(false)}
        onConfirmAssign={handleConfirmAssignAdmin}
      />
      <DeleteGroupConfirmModal
        visible={deleteConfirmVisible}
        onClose={() => setDeleteConfirmVisible(false)}
        onConfirmDelete={handleConfirmDelete}
      />
      <PostOptionsSheet
        visible={!!selectedPost}
        username={selectedPost?.username ?? ''}
        onClose={() => setSelectedPost(null)}
        onSelect={handlePostMenuSelect}
      />
      <PostPreviewModal
        visible={!!previewImage}
        image={previewImage}
        onClose={() => setPreviewImage(null)}
      />

      <AppModal
        visible={activeMemberMenuId !== null}
        onClose={() => setActiveMemberMenuId(null)}
        position="top"
        showHandle={false}
        showCloseButton={false}
        closeOnOverlay={true}
        overlayColor="transparent"
        style={[
          styles.memberPopupMenu,
          {
            top: Math.max(100, memberMenuPageY - 20),
            backgroundColor: colors.surface,
            shadowColor: colors.textPrimary,
            borderRadius: borderRadius.lg,
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.menuRow} 
          onPress={() => handleMemberOptionSelect('viewProfile')}
        >
          <AppText style={[styles.menuRowText, { color: colors.textPrimary }]}>
            {t('groupDetails.options.viewProfile')}
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.menuRow} 
          onPress={() => handleMemberOptionSelect('message')}
        >
          <AppText style={[styles.menuRowText, { color: colors.textPrimary }]}>
            {t('groupDetails.options.message')}
          </AppText>
        </TouchableOpacity>
        {isAdmin && (
          <>
            <TouchableOpacity 
              style={styles.menuRow} 
              onPress={() => handleMemberOptionSelect('makeHost')}
            >
              <AppText style={[styles.menuRowText, { color: colors.textPrimary }]}>
                {t('groupDetails.options.makeHost')}
              </AppText>
            </TouchableOpacity>
            <View style={[styles.menuDivider, { backgroundColor: isDark ? palette.gray700 : colors.divider }]} />
            <TouchableOpacity 
              style={styles.menuRow} 
              onPress={() => handleMemberOptionSelect('removeFromGroup')}
            >
              <AppText style={[styles.menuRowText, { color: colors.error }]}>
                {t('groupDetails.options.removeFromGroup')}
              </AppText>
            </TouchableOpacity>
          </>
        )}
      </AppModal>

      <AppModal
        visible={makeHostConfirmVisible}
        onClose={() => setMakeHostConfirmVisible(false)}
        position="center"
        showHandle={false}
        showCloseButton={true}
        closeOnOverlay={true}
        style={[
          styles.makeHostModalStyle,
          {
            backgroundColor: colors.surface,
            borderRadius: borderRadius['3xl'],
          }
        ]}
      >
        <View style={styles.makeHostContent}>
          {selectedMember && (
            <Image 
              source={{ uri: selectedMember.profileImage }} 
              style={styles.makeHostAvatar} 
            />
          )}
          <AppText style={[styles.makeHostTitle, { color: colors.textPrimary }]}>
            {t('groupDetails.options.makeHostTitle', { name: selectedMember?.name })}
          </AppText>
          <AppText style={[styles.makeHostDescription, { color: colors.textSecondary }]}>
            {t('groupDetails.options.makeHostDescription')}
          </AppText>
          <View style={[styles.makeHostButtonsRow, { gap: spacing[3] }]}>
            <TouchableOpacity
              style={[styles.makeHostCancelBtn, { borderColor: colors.border }]}
              onPress={() => setMakeHostConfirmVisible(false)}
            >
              <AppText style={[styles.makeHostCancelText, { color: colors.textSecondary }]}>
                {t('groupDetails.options.cancel')}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.makeHostConfirmBtn, { backgroundColor: colors.primary }]}
              onPress={handleConfirmMakeHost}
            >
              <AppText style={[styles.makeHostConfirmText, { color: colors.textInverse }]}>
                {t('groupDetails.options.confirm')}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </AppModal>
    </SafeContainer>
  );
};

export default GroupDetailsScreen;
