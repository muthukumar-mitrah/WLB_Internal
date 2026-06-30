/**
 * CommonTabs
 *
 * Single reusable horizontal tab bar that replaces both `ProfileTabs` and
 * the `Tabs` common component.
 *
 * Props
 * ─────
 *  tabs           string[]   — tab labels to render
 *  activeTab      string     — currently selected label
 *  onTabPress     fn(tab)    — called when a tab is tapped
 *
 *  scrollable     bool       — wrap tabs in a horizontal ScrollView (default true)
 *  showDivider    bool       — show the bottom border/divider (default true)
 *
 *  rightSlot      ReactNode  — optional element rendered to the right of the
 *                             scroll area (e.g. a "Create Group" button)
 *
 *  containerStyle ViewStyle  — override the outer container
 *  tabStyle       ViewStyle  — override every tab button
 *  activeTabStyle ViewStyle  — additional style for the active tab button
 *  textStyle      TextStyle  — override tab label text
 *  activeTextStyle TextStyle — additional style for the active label
 *  indicatorStyle ViewStyle  — override the active underline indicator
 */
import React, { memo, useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../../theme';
import AppText from '../AppText';
import createStyles from './styles';

const Tabs = ({
  tabs = [],
  activeTab,
  onTabPress,
  scrollable = true,
  showDivider = true,
  rightSlot,
  containerStyle,
  tabStyle,
  activeTabStyle,
  textStyle,
  activeTextStyle,
  indicatorStyle,
}) => {
  const { colors, spacing } = useTheme();
  const styles = useMemo(() => createStyles({ colors, spacing }), [colors, spacing]);

  const containerStyles = useMemo(
    () => [
      styles.container,
      !showDivider && { borderBottomWidth: 0 },
      containerStyle,
    ],
    [styles, showDivider, containerStyle],
  );

  const tabList = (
    <>
      {tabs.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onTabPress?.(tab)}
            activeOpacity={0.7}
            style={[
              styles.tabBtn,
              tabStyle,
              isActive && styles.tabBtnActive,
              isActive && activeTabStyle,
            ]}
          >
            <AppText
              variant="subtitleMedium"
              style={StyleSheet.flatten([
                styles.tabText,
                isActive ? styles.tabTextActive : null,
                textStyle,
                isActive && activeTextStyle,
              ])}
            >
              {tab}
            </AppText>
            {isActive && (
              <View style={[styles.activeIndicator, indicatorStyle]} />
            )}
          </TouchableOpacity>
        );
      })}
    </>
  );

  return (
    <View style={containerStyles}>
      <View style={styles.headerRow}>
        {scrollable ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            style={styles.scrollFlex}
          >
            {tabList}
          </ScrollView>
        ) : (
          <View style={[styles.scrollContent, styles.scrollFlex]}>{tabList}</View>
        )}
        {rightSlot && (
          <View style={styles.rightSlot}>{rightSlot}</View>
        )}
      </View>
    </View>
  );
};

export default memo(Tabs);
