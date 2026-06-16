// ─── Single Post Card ─────────────────────────────────────────────────────────
import React, {
    memo,
    useCallback,
    useState,
    useRef,
    useEffect,
} from 'react';
import {
    Image,
    Pressable,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import { useTranslation } from '../../../i18n/useTranslation';
import { AppText, LikeAnimationOverlay } from '../../../components/common';
import styles from './styles';

const PostCard = memo(({ post, colors, showChat, onLikePress, onSavePress, onMenuPress, onImagePreview, onCommentPress, onSharePress, onLikesCountPress }) => {
    const { t } = useTranslation();
    const liked = post.liked ?? false;
    const likesCount = post.likes;
    const saved = post.saved;
    const [animationTrigger, setAnimationTrigger] = useState(0);
    const [aspectRatio, setAspectRatio] = useState(() => {
        if (post.image) {
            if (typeof post.image === 'number') {
                try {
                    const source = Image.resolveAssetSource(post.image);
                    if (source && source.width && source.height) {
                        return source.width / source.height;
                    }
                } catch (e) {
                    console.warn('Error resolving asset size:', e);
                }
            }
        }
        return 1;
    });

    useEffect(() => {
        if (!post.image) return;

        if (typeof post.image === 'string') {
            Image.getSize(
                post.image,
                (w, h) => {
                    if (w && h) setAspectRatio(w / h);
                },
                (err) => console.warn('Error getting image size:', err)
            );
        } else if (typeof post.image === 'object' && post.image.uri) {
            Image.getSize(
                post.image.uri,
                (w, h) => {
                    if (w && h) setAspectRatio(w / h);
                },
                (err) => console.warn('Error getting image size:', err)
            );
        } else if (typeof post.image === 'number') {
            try {
                const source = Image.resolveAssetSource(post.image);
                if (source && source.width && source.height) {
                    setAspectRatio(source.width / source.height);
                }
            } catch (e) {
                console.warn('Error resolving asset size:', e);
            }
        }
    }, [post.image]);

    const lastTap = useRef(0);
    const tapTimeout = useRef(null);

    useEffect(() => {
        return () => {
            if (tapTimeout.current) {
                clearTimeout(tapTimeout.current);
            }
        };
    }, []);

    const handleLike = useCallback((isDoubleTap) => {
        if (isDoubleTap) {
            if (!liked) {
                onLikePress?.(post.id);
            }
            setAnimationTrigger(prev => prev + 1);
        } else {
            onLikePress?.(post.id);
            if (!liked) {
                setAnimationTrigger(prev => prev + 1);
            }
        }
    }, [liked, post.id, onLikePress]);

    const handlePress = useCallback(() => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;
        if (now - lastTap.current < DOUBLE_TAP_DELAY) {
            if (tapTimeout.current) {
                clearTimeout(tapTimeout.current);
                tapTimeout.current = null;
            }
            handleLike(true);
        } else {
            lastTap.current = now;
            if (tapTimeout.current) {
                clearTimeout(tapTimeout.current);
            }
            tapTimeout.current = setTimeout(() => {
                if (onImagePreview && post.image) {
                    onImagePreview(post.image);
                }
                tapTimeout.current = null;
            }, DOUBLE_TAP_DELAY);
        }
    }, [handleLike, onImagePreview, post.image]);

    const handleAnimationFinish = useCallback(() => {
        // Optionally perform completion logic
    }, []);

    // ─── Avatar placeholder (initials circle) ────────────────────────────────────
    const AvatarPlaceholder = memo(({ username, size = 38 }) => {
        const initials = (username || '?')
            .split(' ')
            .map(w => w[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();

        const hue = username
            .split('')
            .reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 360;

        return (
            <View
                style={[
                    styles.avatar,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        backgroundColor: `hsl(${hue},55%,50%)`,
                    },
                ]}
            >
                <AppText style={[styles.avatarText, { fontSize: size * 0.35 }]}>
                    {initials}
                </AppText>
            </View>
        );
    });

    return (
        <View style={[styles.card, { backgroundColor: colors.background }]}>
            {/* Header row */}
            <View style={styles.cardHeader}>
                {post.avatar ? (
                    <Image source={{ uri: post.avatar }} style={styles.avatar} />
                ) : (
                    <AvatarPlaceholder username={post.username} />
                )}

                <View style={styles.cardHeaderInfo}>
                    <AppText style={[styles.cardUsername, { color: colors.textPrimary }]}>
                        {post.username}
                    </AppText>
                    <AppText style={[styles.cardMeta, { color: colors.textSecondary }]}>
                        {t('home.feed.cw')}{post.currentWeight} · {post.timeAgo}
                    </AppText>
                </View>

                <View style={styles.cardHeaderRight}>
                    {/* Chat button (shown when there's a buddy relationship) */}
                    {showChat && (
                        <TouchableOpacity
                            style={[styles.chatBtn, { backgroundColor: colors.primary }]}
                            activeOpacity={0.8}
                        >
                            <AppText style={styles.chatBtnLabel}>{t('home.feed.chat')}</AppText>
                        </TouchableOpacity>
                    )}

                    {/* Three-dot menu */}
                    <TouchableOpacity
                        style={styles.menuBtn}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        onPress={() => onMenuPress(post)}
                        activeOpacity={0.6}
                    >
                        <Icon name="ellipsis-horizontal" size={20} color={colors.iconSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Post content area */}
            <View style={styles.postContentContainer}>
                {/* Post text */}
                <Pressable onPress={handlePress} style={styles.textPressable}>
                    <AppText style={[styles.cardText, { color: colors.textPrimary }]}>
                        {post.text}
                    </AppText>
                </Pressable>

                {/* Post image (optional) */}
                {post.image && (
                    <View style={styles.imageContainer}>
                        <Pressable onPress={handlePress} style={styles.imagePressable}>
                            <Image
                                source={post.image}
                                style={[styles.postImage, { aspectRatio, height: undefined }]}
                                resizeMode="contain"
                            />
                        </Pressable>
                        <LikeAnimationOverlay
                            trigger={animationTrigger}
                            onAnimationFinish={handleAnimationFinish}
                        />
                    </View>
                )}

                {/* Post video (optional) */}
                {post.video && (
                    <View style={styles.imageContainer}>
                        <Pressable onPress={handlePress} style={styles.imagePressable}>
                            <Video
                                source={post.video}
                                style={styles.postImage}
                                resizeMode="cover"
                                paused={true}
                                muted={true}
                                repeat={true}
                            />
                        </Pressable>
                        <LikeAnimationOverlay
                            trigger={animationTrigger}
                            onAnimationFinish={handleAnimationFinish}
                        />
                    </View>
                )}

                {/* If no image and no video, render overlay centered over the text block content area */}
                {!post.image && !post.video && (
                    <LikeAnimationOverlay
                        trigger={animationTrigger}
                        onAnimationFinish={handleAnimationFinish}
                    />
                )}
            </View>

            {/* Reaction row */}
            <View style={styles.reactionsRow}>
                <View style={styles.reactionBtn}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleLike(false)}
                    >
                        <Icon
                            name={liked ? 'heart' : 'heart-outline'}
                            size={20}
                            color={liked ? '#FF3B30' : colors.iconSecondary}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => onLikesCountPress?.(post)}
                    >
                        <AppText style={[styles.reactionCount, { color: colors.textSecondary }]}>
                            {likesCount}
                        </AppText>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.reactionBtn}
                    activeOpacity={0.7}
                    onPress={() => onCommentPress(post)}
                >
                    <Icon name="chatbubble-outline" size={20} color={colors.iconSecondary} />
                    <AppText style={[styles.reactionCount, { color: colors.textSecondary }]}>
                        {post.comments}
                    </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.reactionBtn}
                    activeOpacity={0.7}
                    onPress={() => onSharePress?.(post)}
                >
                    <Icon name="paper-plane-outline" size={20} color={colors.iconSecondary} />
                    <AppText style={[styles.reactionCount, { color: colors.textSecondary }]}>
                        {post.shares}
                    </AppText>
                </TouchableOpacity>

                {/* Spacer */}
                <View style={{ flex: 1 }} />

                {/* Bookmark */}
                <TouchableOpacity
                    style={styles.reactionBtn}
                    activeOpacity={0.7}
                    onPress={() => onSavePress?.(post.id)}
                >
                    <Icon
                        name={saved ? 'bookmark' : 'bookmark-outline'}
                        size={20}
                        color={saved ? colors.primary : colors.iconSecondary}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
});

export default PostCard