/**
 * PostFilterScreen — parent screen.
 *
 * Owns only: selectedTab, navigation, onApply.
 * All tab content and state lives in FindMyPeopleTab / FindByHashtagTab.
 */
import React, { memo, useMemo, useState, useCallback } from 'react';
import { View, TouchableOpacity, StatusBar } from 'react-native';
import { useTheme } from '../../../theme';
import { AppText, Header, SafeContainer } from '../../../components/common';
import { ROUTES } from '../../../constants';
import createStyles from './styles';
import FindMyPeopleTab from './FindMyPeopleTab';
import FindByHashtagTab from './FindByHashtagTab';

const PostFilterScreen = ({ navigation }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius],
  );

  const [activeTab, setActiveTab] = useState('people');

  const handleTabPeople = useCallback(() => setActiveTab('people'), []);
  const handleTabHashtag = useCallback(() => setActiveTab('hashtag'), []);

  const handleApply = useCallback(() => {
    navigation.navigate(ROUTES.DRAWER, { selectedTab: 'WLB' });
  }, [navigation]);

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.flex1}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />

      <Header title="Filter Posts" titleAlign="left" transparent showBack />

      {/* Tab selector */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'people' && styles.tabButtonActive]}
          onPress={handleTabPeople}
          activeOpacity={0.8}
        >
          <AppText style={[styles.tabText, activeTab === 'people' && styles.tabTextActive]}>
            Filter By People
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'hashtag' && styles.tabButtonActive]}
          onPress={handleTabHashtag}
          activeOpacity={0.8}
        >
          <AppText style={[styles.tabText, activeTab === 'hashtag' && styles.tabTextActive]}>
            Filter By hashtags
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Tab content — rendered via conditional mount so each tab keeps own state */}
      {activeTab === 'people'
        ? <FindMyPeopleTab onApply={handleApply} />
        : <FindByHashtagTab onApply={handleApply} />
      }
    </SafeContainer>
  );
};

export default memo(PostFilterScreen);
