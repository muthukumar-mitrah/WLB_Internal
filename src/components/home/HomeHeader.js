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
import { useTranslation } from '../../i18n/useTranslation';
import { TourGuideZone } from 'rn-tourguide';
import { useAppTour } from '../../hooks/useAppTour';


const HomeHeader = () => {
  const navigation = useNavigation();
  const { colors, spacing, borderRadius } = useTheme();
  const { activeTab } = useFeed();
  const { t } = useTranslation();
  const { steps } = useAppTour();

  const liveChatStep = useMemo(() => steps.find((s) => s.target === 'liveChat'), [steps]);
  const profileStep = useMemo(() => steps.find((s) => s.target === 'profile'), [steps]);

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
          {liveChatStep && (
            <TourGuideZone
              zone={liveChatStep.order}
              borderRadius={borderRadius.lg}
              text={JSON.stringify({
                title: t(liveChatStep.titleKey),
                body: t(liveChatStep.descKey),
              })}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
          )}
          <Image
            source={APP_IMAGES.message}
            style={[styles.messageIcon, { tintColor: colors.iconPrimary }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.avatarBtn}>
          {profileStep && (
            <TourGuideZone
              zone={profileStep.order}
              borderRadius={borderRadius.lg}
              text={JSON.stringify({
                title: t(profileStep.titleKey),
                body: t(profileStep.descKey),
              })}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
          )}
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
