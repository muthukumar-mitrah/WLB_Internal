import React, { useEffect, useState, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { SafeContainer, Header, AppText, Button } from '../../../components/common';
import { useTheme } from '../../../theme';
import { createStyles } from './styles';
import aiBuddyService from '../../../api/services/aiBuddyService';
import { ROUTES } from '../../../constants';

const BuddyCard = React.memo(({ item, onPress, colors, styles }) => (
  <View style={styles.cardContainer}>
    <View style={styles.cardHeader}>
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <View style={styles.headerText}>
        <AppText variant="subtitleMedium" color={colors.textPrimary} style={styles.nameText}>
          {item.name}
        </AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          {item.role}
        </AppText>
      </View>
      <Button
        title="Explore"
        variant="primary"
        size="small"
        fullWidth={false}
        onPress={() => onPress(item.id)}
        style={styles.exploreBtn}
         textStyle={styles.exploreBtnText}
      />
    </View>
    <View style={styles.cardBody}>
      <AppText variant="bodySmall" color={colors.textPrimary} style={styles.descriptionText}>
        {item.description}
      </AppText>
    </View>
  </View>
));

const ChooseAIBuddyScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { colors, spacing } = useTheme();
  const styles = useMemo(() => createStyles({ colors, spacing }), [colors, spacing]);
  
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuddies = async () => {
      try {
        const response = await aiBuddyService.getAIBuddies();
        setBuddies(response.data);
      } catch (error) {
        console.error('Failed to load buddies', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBuddies();
  }, []);

  const handleExplore = (buddyId) => {
    navigation.navigate(ROUTES.AI_BUDDY_DETAILS, { buddyId });
  };

  return (
    <SafeContainer edges={['top', 'bottom']}>
      <Header
        title={t('aiBuddy.list.title')}
        onBackPress={() => navigation.goBack()}
      />
      <FlatList
        data={buddies}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <BuddyCard
            item={item}
            onPress={handleExplore}
            colors={colors}
            styles={styles}
          />
        )}
      />
    </SafeContainer>
  );
};

export default ChooseAIBuddyScreen;
