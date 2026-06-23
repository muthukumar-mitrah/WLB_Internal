import React, { forwardRef, useImperativeHandle, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Image, Clipboard } from 'react-native';
import { BottomSheetFooter } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';
import { useTranslation } from '../../i18n/useTranslation';
import { useTheme } from '../../theme';
import { CommonBottomSheet, AppText, Button, ToastService } from '../../components/common';

const MOCK_USERS = [
  { id: '1', name: 'Alexandra', image: require('../../assets/images/profile_avatar.png') },
  { id: '2', name: 'Emma', image: require('../../assets/images/profile_avatar.png') },
  { id: '3', name: 'David J.', image: require('../../assets/images/profile_avatar.png') },
  { id: '4', name: 'Alexandra', image: require('../../assets/images/profile_avatar.png') },
  { id: '5', name: 'Alexandra', image: require('../../assets/images/profile_avatar.png') },
  { id: '6', name: 'Alexandra', image: require('../../assets/images/profile_avatar.png') },
  { id: '7', name: 'Emma', image: require('../../assets/images/profile_avatar.png') },
  { id: '8', name: 'David J.', image: require('../../assets/images/profile_avatar.png') },
  { id: '9', name: 'Alexandra', image: require('../../assets/images/profile_avatar.png') },
  { id: '10', name: 'Alexandra', image: require('../../assets/images/profile_avatar.png') },
];

const ShareBottomSheet = forwardRef(({}, ref) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const bottomSheetRef = useRef(null);
  
  const [post, setPost] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useImperativeHandle(ref, () => ({
    open: (postData) => {
      setPost(postData);
      setSelectedUsers([]);
      bottomSheetRef.current?.expand();
    },
    close: () => {
      bottomSheetRef.current?.close();
    }
  }));

  const handleUserToggle = useCallback((userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  }, []);

  const handleCopyLink = useCallback(() => {
    if (!post) return;
    const shareUrl = `https://wlb.app/post/${post?.id || post}`;
    if (Clipboard?.setString) {
      Clipboard.setString(shareUrl);
      ToastService.show('Link copied to clipboard!', 'success');
    }
    bottomSheetRef.current?.close();
  }, [post]);

  const isSharing = useRef(false);

  const handleNativeShare = useCallback(async () => {
    if (!post || isSharing.current) return;
    
    isSharing.current = true;
    const shareMessage = post?.text || 'Check out this post on WLB!';
    const shareUrl = `https://wlb.app/post/${post?.id || post}`;
    
    // Close the bottom sheet first
    bottomSheetRef.current?.close();

    // Wait for the close animation to completely finish (typically ~300-500ms for bottom sheets)
    // We use a safe timeout to ensure the UI is unblocked and the native modal can present without conflict.
    setTimeout(async () => {
      try {
        await Share.open({
          title: 'Share Post',
          message: `Check out this post by @${post?.username || 'user'} on Weight Loss Buddy:\n\n"${shareMessage}"`,
          url: shareUrl,
          failOnCancel: false, // Prevents throwing when user cancels share
        });
      } catch (e) {
        console.log('[SharePress] Native share error or cancelled:', e);
      } finally {
        isSharing.current = false;
      }
    }, 600);
  }, [post]);

  const handleShareInsideApp = useCallback(() => {
     ToastService.show('Post shared successfully!', 'success');
     bottomSheetRef.current?.close();
  }, []);

  const renderUser = useCallback(({ item }) => {
    const isSelected = selectedUsers.includes(item.id);
    return (
      <TouchableOpacity 
        style={styles.userItem} 
        onPress={() => handleUserToggle(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <Image source={item.image} style={styles.avatar} />
          {isSelected && (
            <View style={[styles.checkCircle, { backgroundColor: colors.primary, borderColor: colors.surface }]}>
              <Icon name="checkmark" size={12} color="#FFF" />
            </View>
          )}
        </View>
        <AppText style={[styles.userName, { color: colors.textPrimary }]} numberOfLines={1}>
          {item.name}
        </AppText>
      </TouchableOpacity>
    );
  }, [selectedUsers, colors, handleUserToggle]);

  const renderFooter = useCallback(
    (props) => {
      if (selectedUsers.length === 0) return null;
      return (
        <BottomSheetFooter {...props} bottomInset={0}>
          <View style={styles.footer}>
            <Button
              title="Share post"
              onPress={handleShareInsideApp}
              style={styles.shareButton}
            />
          </View>
        </BottomSheetFooter>
      );
    },
    [selectedUsers.length, handleShareInsideApp]
  );

  return (
    <CommonBottomSheet
      ref={bottomSheetRef}
      snapPoints={['50%', '65%']}
      enablePanDownToClose
      index={-1}
      footerComponent={renderFooter}
    >
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <AppText style={[styles.title, { color: colors.textPrimary }]}>
          {t('bottomSheet.sharePost')}
        </AppText>

        <View style={styles.usersListContainer}>
          <FlatList
            data={MOCK_USERS}
            keyExtractor={item => item.id}
            renderItem={renderUser}
            numColumns={5}
            columnWrapperStyle={{ gap: 10 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.usersListContent}
          />
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionItem} onPress={handleCopyLink} activeOpacity={0.7}>
            <View style={[styles.actionIconCircle, { backgroundColor: colors.primarySurface }]}>
              <Icon name="link" size={24} color={colors.primary} />
            </View>
            <AppText style={[styles.actionLabel, { color: colors.textSecondary }]}>{t('bottomSheet.copyLink')}</AppText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={handleNativeShare} activeOpacity={0.7}>
            <View style={[styles.actionIconCircle, { backgroundColor: '#25D366' }]}>
              <Icon name="share-social" size={24} color="#FFF" />
            </View>
            <AppText style={[styles.actionLabel, { color: colors.textSecondary }]}>{t('bottomSheet.share')}</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </CommonBottomSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  usersListContainer: {
    marginBottom: 24,
  },
  usersListContent: {
    paddingHorizontal: 15,
    gap: 10,
    paddingBottom: 10,
  },
  userItem: {
    alignItems: 'center',
    width: 70,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  checkCircle: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 24,
  },
  actionItem: {
    alignItems: 'center',
    width: 70,
  },
  actionIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
  shareButton: {
    width: '100%',
  },
});

export default ShareBottomSheet;
