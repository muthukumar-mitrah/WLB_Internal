import React, { memo, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme';
import { AppText } from '../../../components/common';
import { useProfile } from '../../../context/ProfileContext';

const ProfileTabs = ({ activeTab = 'Posts', onTabChange }) => {
  const { colors, spacing } = useTheme();
  const styles = useMemo(() => createStyles({ colors, spacing }), [colors, spacing]);
  const { tabs: TABS } = useProfile();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {TABS?.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => onTabChange?.(tab)}
              style={[styles.tabBtn, isActive && styles.tabBtnActive]}
            >
              <AppText
                variant="subtitleMedium"
                color={isActive ? colors.primary : colors.textSecondary}
              >
                {tab}
              </AppText>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const createStyles = ({ colors, spacing }) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background, // crucial for sticking over content
      width: '100%',
      paddingTop: spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    scrollContent: {
      paddingHorizontal: spacing[4],
      paddingBottom: 2,
    },
    tabBtn: {
      marginRight: spacing[5],
      paddingBottom: spacing[2],
      position: 'relative',
    },
    tabBtnActive: {
      // additional active tab styling if needed
    },
    activeIndicator: {
      position: 'absolute',
      bottom: -3,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: colors.primary,
      borderRadius: 1,
    },
  });

export default memo(ProfileTabs);
