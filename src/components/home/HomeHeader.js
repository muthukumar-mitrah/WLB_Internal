/**
 * HomeHeader — Top header for the Home screen.
 */
import React, { memo, useCallback, useMemo } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { useFeed } from '../../context/FeedContext';
import { APP_IMAGES, ROUTES } from '../../constants';

const HomeHeader = () => {
  const navigation = useNavigation();
  const { colors, spacing } = useTheme();
  const { activeTab } = useFeed();
  const styles = useMemo(() => createStyles({ colors, spacing }), [colors, spacing]);

  const handleOpenDrawer = useCallback(() => {
    navigation.openDrawer();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleOpenDrawer}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.iconBtn}>
        <Icon name="menu-outline" size={26} color={colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.logoWrapper}>
        <Image
          source={APP_IMAGES.headerWlbLogo}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.rightRow}>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.iconBtn}>
          <Image
            source={APP_IMAGES.message}
            style={[styles.messageIcon, { tintColor: colors.iconPrimary }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.avatarBtn}>
          <Image
            source={APP_IMAGES.userAvatar}
            style={styles.avatar}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = ({ colors, spacing }) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      backgroundColor: colors.background,
    },
    iconBtn: {
      padding: 4,
    },
    logoWrapper: {
      flex: 1,
      marginLeft: spacing[2],
    },
    logo: {
      width: 160,
      height: 30,
    },
    rightRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    messageIcon: {
      width: 24,
      height: 24,
    },
    avatarBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      overflow: 'hidden',
    },
    avatar: {
      width: 34,
      height: 34,
      borderRadius: 17,
    },
  });

export default memo(HomeHeader);
