/**
 * FilterHeader — horizontal filter/shortcut row below TopTabs on the Home Screen.
 *
 * Items:
 *   • Skinny News image → opens external browser
 *   • Filter icon → placeholder callback
 *   • Robi "Ask anything!" → triggers disclaimer flow
 */
import React, { memo, useCallback, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Linking,
  StyleSheet,
} from 'react-native';
import { AppText } from '../../components/common';
import { useTheme } from '../../theme';
import { useTranslation } from '../../i18n/useTranslation';
import { fontFamily } from '../../theme/fonts';

const SKINNY_NEWS_URL = 'https://skinnynews.com/';

const ASSETS = {
  skinnyNews: require('../../assets/images/skinnynews.png'),
  filter: require('../../assets/icons/filter_post.png'),
  robi: require('../../assets/icons/robi.png'),
};

const FilterHeader = ({ onRobiPress, onFilterPress }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { t } = useTranslation();

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius],
  );

  const handleSkinnyNewsPress = useCallback(() => {
    Linking.openURL(SKINNY_NEWS_URL)
  }, []);

  const handleFilterPress = useCallback(() => {
    onFilterPress?.();
  }, [onFilterPress]);

  const handleRobiPress = useCallback(() => {
    onRobiPress?.();
  }, [onRobiPress]);

  return (
    <View style={styles.container}>
      {/* Left side — Skinny News + Filter */}
      <View style={styles.leftGroup}>
        <TouchableOpacity
          onPress={handleSkinnyNewsPress}
          activeOpacity={0.7}
          style={styles.skinnyNewsBtn}
        >
          <Image
            source={ASSETS.skinnyNews}
            style={styles.skinnyNewsImage}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleFilterPress}
          activeOpacity={0.7}
          style={styles.filterBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Image
            source={ASSETS.filter}
            style={[styles.filterIcon, { tintColor: colors.iconPrimary }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Right side — Ask anything + Robi */}
      <TouchableOpacity
        onPress={handleRobiPress}
        activeOpacity={0.7}
        style={styles.robiBtn}
      >
        <AppText
          variant="bodyMedium"
          color={colors.textSecondary}
          style={styles.askText}
        >
          {t('home.filterHeader.askAnything')}
        </AppText>
        <Image
          source={ASSETS.robi}
          style={styles.robiImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const createStyles = ({ colors, spacing }) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      backgroundColor: colors.background,
    },
    leftGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[3],
    },
    skinnyNewsBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 2,
      borderColor: colors.primary,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
    },
    skinnyNewsImage: {
      width: 30,
      height: 30,
      borderRadius: 15,
    }, 
    filterBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    filterIcon: {
      width: 24,
      height: 24,
      resizeMode: 'contain',
    },
    robiBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[2],
    },
    askText: {
      fontFamily: fontFamily.medium,
      fontSize: 14,
    },
    robiImage: {
      width: 36,
      height: 36,
      borderRadius: 24,
    },
  });

export default memo(FilterHeader);
