import React, { forwardRef, useImperativeHandle, useRef, useState, useCallback, memo, useMemo } from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Keyboard, 
  Platform,
  ScrollView,
} from 'react-native';
import { BottomSheetFlatList, BottomSheetTextInput, BottomSheetFooter } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons';
import AppText from '../../components/common/AppText';
import AppBottomSheet from '../../components/common/BottomSheet/AppBottomSheet';
import { useTheme } from '../../theme';
import { fontFamily } from '../../theme/fonts';
import AppModal from '../../components/common/AppModal';

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

const CommentInputFooter = memo(({
  footerProps,
  replyTarget,
  handleCancelReply,
  handleSend,
  colors,
  inputRef,
  inputTextRef,
}) => {
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [inputText, setInputText] = useState('');

  const handleTextChange = useCallback((text) => {
    inputTextRef.current = text;
    setInputText(text);
    const isEmpty = text.trim().length === 0;
    setIsInputEmpty(isEmpty);
  }, [inputTextRef]);

  const onSendPress = useCallback(() => {
    handleSend();
    setInputText('');
    setIsInputEmpty(true);
  }, [handleSend]);

  const footerPaddingBottom = useMemo(() => {
    return Platform.OS === 'ios' ? 28 : 30;
  }, []);

  return (
    <BottomSheetFooter {...footerProps} bottomInset={0}>
      {/* Reply To Target Banner */}
      {replyTarget && (
        <View style={[styles.replyBanner, { backgroundColor: colors.backgroundSecondary }]}>
          <AppText variant="bodyMedium" style={{ color: colors.textSecondary, fontFamily: fontFamily.regular }}>
            Reply to <AppText style={{ color: colors.textPrimary, fontFamily: fontFamily.medium }}>@{replyTarget.username.split(' ')[0]}</AppText>
          </AppText>
          <TouchableOpacity onPress={handleCancelReply}>
            <Icon name="close" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Input Area */}
      <View style={[styles.inputContainer, { borderTopColor: colors.border, backgroundColor: colors.surface, paddingBottom: footerPaddingBottom }]}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' }} 
          style={[styles.avatar, styles.inputAvatar]} 
        />
        <View style={[styles.textInputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <BottomSheetTextInput
            ref={inputRef}
            style={[styles.input, { color: colors.textPrimary }]}
            placeholder="Write your comment here..."
            placeholderTextColor={colors.textSecondary}
            value={inputText}
            onChangeText={handleTextChange}
            onSubmitEditing={onSendPress}
            returnKeyType="send"
          />
        </View>
        <TouchableOpacity onPress={onSendPress} style={styles.actionBtn}>
          <Icon name={isInputEmpty ? "mic-outline" : "send"} size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </BottomSheetFooter>
  );
});

// Mock comments data representing screenshots
const MOCK_COMMENTS = [
  {
    id: '1',
    username: 'Daniel Brooks',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    comment: 'Proud of you for showing up today.',
    likeCount: 2,
    isLiked: true,
    createdAt: '15m ago',
    replies: []
  },
  {
    id: '2',
    username: 'Daniel Brooks',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    comment: 'Proud of you for showing up today.',
    likeCount: 2,
    isLiked: false,
    createdAt: '15m ago',
    replies: [
      {
        id: '2-1',
        username: 'Daniel Brooks',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        comment: 'Proud of you for showing up today.',
        replyTo: 'Daniel',
        likeCount: 2,
        isLiked: false,
        createdAt: '15m ago'
      },
      {
        id: '2-2',
        username: 'Daniel Brooks',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        comment: 'Proud of you for showing up today.',
        replyTo: 'Daniel',
        likeCount: 2,
        isLiked: false,
        createdAt: '15m ago'
      }
    ]
  },
  {
    id: '3',
    username: 'Daniel Brooks',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    comment: 'Proud of you for showing up today.',
    likeCount: 2,
    isLiked: false,
    createdAt: '15m ago',
    replies: []
  },
  {
    id: '4',
    username: 'Daniel Brooks',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    comment: 'Proud of you for showing up today.',
    likeCount: 2,
    isLiked: false,
    createdAt: '15m ago',
    replies: [
      {
        id: '4-1',
        username: 'Daniel Brooks',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        comment: 'Proud of you for showing up today.',
        replyTo: 'Daniel',
        likeCount: 2,
        isLiked: false,
        createdAt: '15m ago'
      }
    ]
  },
  {
    id: '5',
    username: 'Daniel Brooks',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    comment: 'Proud of you for showing up today.',
    likeCount: 2,
    isLiked: true,
    createdAt: '15m ago',
    replies: []
  }
];

const CommentsBottomSheet = forwardRef(({ onCommentCountChange }, ref) => {
  const { colors, spacing } = useTheme();
  const sheetRef = useRef(null);
  const inputRef = useRef(null);
  const inputTextRef = useRef('');

  // States
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [sheetIndex, setSheetIndex] = useState(-1);
  const [replyTarget, setReplyTarget] = useState(null); // { id, username, parentId }
  const [menuTarget, setMenuTarget] = useState(null); // { id, username, parentId, position }
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Expose sheet control methods
  useImperativeHandle(ref, () => ({
    open: () => {
      setIsSheetOpen(true);
      setSheetIndex(0);
      sheetRef.current?.present();
    },
    close: () => {
      Keyboard.dismiss();
      setSheetIndex(-1);
      sheetRef.current?.dismiss();
    }
  }), []);

  // Track sheet state changes for reliable reopen
  const handleSheetChange = useCallback((index) => {
    setSheetIndex(index);
    if (index === -1 || index === undefined) {
      // Sheet fully closed — reset state
      setIsSheetOpen(false);
      setReplyTarget(null);
      inputTextRef.current = '';
      inputRef.current?.clear();
      Keyboard.dismiss();
    }
  }, []);

  // ─── Handlers ──────────────────────────────────────────────────────────────
  
  const handleLikeComment = useCallback((id, parentId) => {
    setComments(prev => prev.map(c => {
      if (parentId && c.id === parentId) {
        return {
          ...c,
          replies: c.replies.map(r => r.id === id ? {
            ...r,
            isLiked: !r.isLiked,
            likeCount: r.isLiked ? r.likeCount - 1 : r.likeCount + 1
          } : r)
        };
      }
      if (!parentId && c.id === id) {
        return {
          ...c,
          isLiked: !c.isLiked,
          likeCount: c.isLiked ? c.likeCount - 1 : c.likeCount + 1
        };
      }
      return c;
    }));
  }, []);

  const handleReplyPress = useCallback((comment, parentId = null) => {
    setReplyTarget({
      id: comment.id,
      username: comment.username,
      parentId: parentId || comment.id
    });
    // Delay focus to let the reply banner render first
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const handleCancelReply = useCallback(() => {
    setReplyTarget(null);
  }, []);

  const handleSend = useCallback(() => {
    const text = inputTextRef.current.trim();
    if (!text) return;

    const newCommentId = generateId();
    const timestamp = 'Just now';

    if (replyTarget) {
      // Adding a nested reply
      setComments(prev => prev.map(c => {
        if (c.id === replyTarget.parentId) {
          const newReply = {
            id: newCommentId,
            username: 'Sarah Miller', // Mock current user
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
            comment: text,
            replyTo: replyTarget.username.split(' ')[0], // Extract first name
            likeCount: 0,
            isLiked: false,
            createdAt: timestamp
          };
          return {
            ...c,
            replies: [...c.replies, newReply]
          };
        }
        return c;
      }));
      setReplyTarget(null);
    } else {
      // Adding a parent comment
      const newParentComment = {
        id: newCommentId,
        username: 'Sarah Miller',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        comment: text,
        likeCount: 0,
        isLiked: false,
        createdAt: timestamp,
        replies: []
      };
      setComments(prev => [...prev, newParentComment]);
    }

    inputTextRef.current = '';
    inputRef.current?.clear();
    Keyboard.dismiss();
  }, [replyTarget]);

  const handleMenuPress = useCallback((comment, event, parentId = null) => {
    const { pageY } = event.nativeEvent;
    setMenuTarget({
      id: comment.id,
      username: comment.username,
      parentId,
      pageY: Math.min(pageY, 500) // Keep within viewport boundaries
    });
  }, []);

  const handleCloseMenu = useCallback(() => {
    setMenuTarget(null);
  }, []);

  const handleMenuOptionSelect = useCallback((action) => {
    if (!menuTarget) return;

    if (action === 'reply') {
      handleReplyPress(menuTarget, menuTarget.parentId);
    } else {
      console.log(`[Comments] Action ${action} performed on comment ${menuTarget.id}`);
    }
    setMenuTarget(null);
  }, [menuTarget, handleReplyPress]);

  // ─── Render Items ──────────────────────────────────────────────────────────

  const renderCommentItem = useCallback(({ item }) => {
    return (
      <View style={styles.commentRowContainer}>
        {/* Parent Comment */}
        <View style={styles.commentItem}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          
          <View style={styles.contentCol}>
            <View style={styles.metaRow}>
              <AppText variant="titleSmall" style={[styles.username, { color: colors.textPrimary }]}>
                {item.username}
              </AppText>
              <AppText variant="caption" style={[styles.timeAgo, { color: colors.textSecondary }]}>
                {item.createdAt}
              </AppText>
              
              <TouchableOpacity 
                onPress={(e) => handleMenuPress(item, e)} 
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon name="ellipsis-horizontal" size={16} color={colors.iconSecondary} />
              </TouchableOpacity>
            </View>

            <AppText variant="bodyMedium" style={[styles.commentText, { color: colors.textPrimary }]}>
              {item.comment}
            </AppText>

            <View style={styles.actionsRow}>
              <TouchableOpacity onPress={() => handleReplyPress(item)} activeOpacity={0.7}>
                <AppText variant="label" style={[styles.actionLabel, { color: colors.textSecondary }]}>
                  Reply
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Like Column */}
          <View style={styles.likeCol}>
            <TouchableOpacity onPress={() => handleLikeComment(item.id)} activeOpacity={0.7}>
              <Icon 
                name={item.isLiked ? 'heart' : 'heart-outline'} 
                size={16} 
                color={item.isLiked ? '#FF3B30' : colors.iconSecondary} 
              />
            </TouchableOpacity>
            <AppText variant="caption" style={[styles.likeCount, { color: colors.textSecondary }]}>
              {item.likeCount}
            </AppText>
          </View>
        </View>

        {/* Nested Replies */}
        {item.replies && item.replies.length > 0 && (
          <View style={styles.repliesList}>
            {item.replies.map(reply => (
              <View key={reply.id} style={styles.commentItem}>
                <Image source={{ uri: reply.avatar }} style={[styles.avatar, styles.replyAvatar]} />
                
                <View style={styles.contentCol}>
                  <View style={styles.metaRow}>
                    <AppText variant="titleSmall" style={[styles.username, { color: colors.textPrimary }]}>
                      {reply.username}
                    </AppText>
                    <AppText variant="caption" style={[styles.timeAgo, { color: colors.textSecondary }]}>
                      {reply.createdAt}
                    </AppText>
                    <TouchableOpacity 
                      onPress={(e) => handleMenuPress(reply, e, item.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Icon name="ellipsis-horizontal" size={16} color={colors.iconSecondary} />
                    </TouchableOpacity>
                  </View>

                  <AppText variant="bodyMedium" style={[styles.commentText, { color: colors.textPrimary }]}>
                    {reply.replyTo && (
                      <AppText variant="bodyMedium" style={[styles.replyMention, { color: colors.primary }]}>
                        @{reply.replyTo}{' '}
                      </AppText>
                    )}
                    {reply.comment}
                  </AppText>

                  <View style={styles.actionsRow}>
                    <TouchableOpacity onPress={() => handleReplyPress(reply, item.id)} activeOpacity={0.7}>
                      <AppText variant="label" style={[styles.actionLabel, { color: colors.textSecondary }]}>
                        Reply
                      </AppText>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Like Column */}
                <View style={styles.likeCol}>
                  <TouchableOpacity onPress={() => handleLikeComment(reply.id, item.id)} activeOpacity={0.7}>
                    <Icon 
                      name={reply.isLiked ? 'heart' : 'heart-outline'} 
                      size={16} 
                      color={reply.isLiked ? '#FF3B30' : colors.iconSecondary} 
                    />
                  </TouchableOpacity>
                  <AppText variant="caption" style={[styles.likeCount, { color: colors.textSecondary }]}>
                    {reply.likeCount}
                  </AppText>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }, [colors, handleLikeComment, handleReplyPress, handleMenuPress]);

  // ─── Footer (Input Area) ────────────────────────────────────────────────────
  // Rendered via BottomSheetFooter so it stays pinned above the keyboard
  const renderFooter = useCallback(
    (props) => (
      <CommentInputFooter
        footerProps={props}
        replyTarget={replyTarget}
        handleCancelReply={handleCancelReply}
        handleSend={handleSend}
        colors={colors}
        inputRef={inputRef}
        inputTextRef={inputTextRef}
      />
    ),
    [colors, replyTarget, handleSend, handleCancelReply],
  );

  return (
    <>
      <AppBottomSheet
        ref={sheetRef}
        index={sheetIndex}
        snapPoints={['65%', '95%']}
        onChange={handleSheetChange}
        footerComponent={renderFooter}
      >
        {/* Title Header */}
        <View style={styles.header}>
          <AppText variant="titleLarge" style={[styles.title, { color: colors.textPrimary }]}>
            Comments
          </AppText>
        </View>

        {/* FlatList for comments */}
        <BottomSheetFlatList
          data={comments}
          keyExtractor={item => item.id}
          renderItem={renderCommentItem}
          contentContainerStyle={[styles.listContainer, { paddingBottom: spacing[24] }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        />
      </AppBottomSheet>

      {/* Pop-up Options Modal */}
      <AppModal
        visible={!!menuTarget}
        onClose={handleCloseMenu}
        position="center"
        showHandle={false}
        showCloseButton={false}
        closeOnOverlay={true}
        overlayColor="rgba(0,0,0,0.1)"
        style={[
          styles.popupMenu,
          {
            top: menuTarget?.pageY || 300,
            backgroundColor: colors.surface,
            shadowColor: colors.textPrimary,
            // Override default center container styles to behave as absolute dropdown
            position: 'absolute',
            alignSelf: undefined,
            width: 130,
            borderRadius: 12,
            paddingHorizontal: 0,
            paddingBottom: 4,
            elevation: 8,
            shadowOpacity: 0.15,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
          }
        ]}
      >
        <TouchableOpacity 
          style={[styles.popupRow, { borderBottomWidth: 0.5, borderBottomColor: colors.border }]} 
          onPress={() => handleMenuOptionSelect('reply')}
        >
          <Icon name="arrow-undo-outline" size={18} color={colors.textPrimary} style={styles.popupIcon} />
          <AppText variant="bodyMedium" style={{ color: colors.textPrimary, fontFamily: fontFamily.regular }}>Reply</AppText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.popupRow, { borderBottomWidth: 0.5, borderBottomColor: colors.border }]} 
          onPress={() => handleMenuOptionSelect('report')}
        >
          <Icon name="alert-circle-outline" size={18} color={colors.textPrimary} style={styles.popupIcon} />
          <AppText variant="bodyMedium" style={{ color: colors.textPrimary, fontFamily: fontFamily.regular }}>Report</AppText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.popupRow} 
          onPress={() => handleMenuOptionSelect('block')}
        >
          <Icon name="person-remove-outline" size={18} color={colors.error} style={styles.popupIcon} />
          <AppText variant="bodyMedium" style={{ color: colors.error, fontFamily: fontFamily.regular }}>Block</AppText>
        </TouchableOpacity>
      </AppModal>
    </>
  );
});

const styles = StyleSheet.create({
  header: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  commentRowContainer: {
    marginBottom: 16,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 12,
  },
  replyAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
  },
  contentCol: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    marginRight: 8,
  },
  timeAgo: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    marginRight: 12,
  },
  commentText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 6,
  },
  replyMention: {
    fontFamily: fontFamily.medium,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
  },
  likeCol: {
    alignItems: 'center',
    width: 32,
    marginLeft: 8,
  },
  likeCount: {
    fontSize: 11,
    marginTop: 2,
  },
  repliesList: {
    paddingLeft: 46,
    marginTop: 10,
  },
  // Bottom Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
  },
  inputAvatar: {
    marginRight: 10,
  },
  textInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 40,
  },
  input: {
    flex: 1,
    height: '100%',
    padding: 0,
    fontFamily: fontFamily.regular,
    fontSize: 14,
  },
  actionBtn: {
    marginLeft: 12,
    padding: 4,
  },
  // Reply Banner
  replyBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  popupMenu: {
    position: 'absolute',
    right: 24,
    width: 130,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    paddingVertical: 4,
  },
  popupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  popupIcon: {
    marginRight: 10,
    width: 18,
    textAlign: 'center',
  },
});

export default memo(CommentsBottomSheet);