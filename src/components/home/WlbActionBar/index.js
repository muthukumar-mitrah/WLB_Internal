import React, { memo, useMemo } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '../../../i18n/useTranslation';
import { useTheme } from '../../../theme';
import { AppText } from '../../common';
import { ToastService } from '../../common';
import { APP_IMAGES, ROUTES } from '../../../constants';
import createStyles from './styles';

const WlbActionBar = () => {
  const { t } = useTranslation();
  const { colors, spacing, borderRadius } = useTheme();
  const navigation = useNavigation();

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius],
  );

  const handleFilterPress = () => {
    navigation.navigate(ROUTES.POST_FILTER);
  };

  const handleAskAnythingPress = () => {
    ToastService.show('Coming Soon');
  };

  const handleSkiNewsPress = () => {
    ToastService.show('Coming Soon');
  };

  const iconColor = colors.isDark ? colors.text : colors.primary;

  return (
    <View style={styles.container}>
      <View style={styles.leftActions}>
        <TouchableOpacity style={styles.leftSection} activeOpacity={0.7} onPress={handleSkiNewsPress}>
          <Image 
            source={APP_IMAGES.newWlbLogo} 
            style={styles.skiNewsLogo} 
            resizeMode="cover" 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.filterBtn} 
          activeOpacity={0.7}
          onPress={handleFilterPress}
        >
          <Icon name="filter-outline" size={24} color={iconColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.rightActions}>
        <TouchableOpacity 
          style={styles.rightSection} 
          activeOpacity={0.7}
          onPress={handleAskAnythingPress}
        >
          <AppText style={styles.askAnythingText}>Ask anything!</AppText>
          <View style={styles.aiBuddyIconContainer}>
            <Image 
              source={APP_IMAGES.robi} 
              style={styles.aiBuddyIcon} 
              resizeMode="contain" 
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(WlbActionBar);
