import React, {memo, useMemo, useState, useCallback} from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../../theme';
import {
  AppText,
  Header,
  SafeContainer,
  Button,
  InputBox,
  CountryListItem,
} from '../../../components/common';
import {ROUTES} from '../../../constants';
import {COUNTRIES} from '../../../constants/countries';
import createStyles from './styles';
import {useTranslation} from 'react-i18next';

const CountrySelectionScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const {colors, spacing, borderRadius, shadows} = useTheme();

  const styles = useMemo(
    () => createStyles({colors, spacing, borderRadius, shadows}),
    [colors, spacing, borderRadius, shadows],
  );

  const [selected, setSelected] = useState(
    route.params?.currentCountry || 'United States',
  );
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? COUNTRIES.filter(c => c.label.toLowerCase().includes(q))
      : COUNTRIES;

    if (!selected || q) return list;

    const selectedObj = list.find(c => c.label === selected);
    const rest = list.filter(c => c.label !== selected);
    return selectedObj ? [selectedObj, ...rest] : list;
  }, [selected, query]);

  const handleSelect = useCallback(item => setSelected(item.label), []);

  const handleDone = useCallback(() => {
    navigation.navigate(ROUTES.UPDATE_PROFILE, {
      updatedCountry: selected,
    });
  }, [navigation, selected]);

  const clearIcon = useMemo(
    () =>
      query ? (
        <TouchableOpacity
          onPress={() => setQuery('')}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="close-circle" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      ) : (
        <Icon name="magnify" size={18} color={colors.textSecondary} />
      ),
    [query, colors.textSecondary],
  );

  const renderItem = useCallback(
    ({item}) => {
      const isSelected = item.label === selected;
      return (
        <CountryListItem
          item={item}
          isSelected={isSelected}
          onPress={handleSelect}
        />
      );
    },
    [selected, handleSelect],
  );

  const keyExtractor = useCallback(item => item.value, []);

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />
      <Header title={t('profile.country.title')} showBack />

      {/* Search bar — uses common InputBox */}
      <View style={styles.searchWrapper}>
        <InputBox
          placeholder={t('profile.country.searchPlaceholder')}
          value={query}
          onChangeText={setQuery}
          leftIcon={<Icon name="magnify" size={20} color={colors.textSecondary} />}
          rightIcon={clearIcon}
          autoCorrect={false}
          containerStyle={styles.searchInputContainer}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <AppText style={styles.emptyText}>{t('profile.country.emptyText')}</AppText>
        }
      />

      <View style={styles.buttonContainer}>
        <Button title={t('common.buttons.done')} onPress={handleDone} variant="primary" size="lg" fullWidth />
      </View>
    </SafeContainer>
  );
};

export default memo(CountrySelectionScreen);
