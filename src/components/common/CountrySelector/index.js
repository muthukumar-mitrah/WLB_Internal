import React, { memo, useMemo, useState, useCallback } from 'react';
import { View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { AppText, AppModal } from '../';
import { COUNTRIES, countryCodeToFlag } from '../../../constants/countries';
import { useTranslation } from '../../../i18n/useTranslation';
import { useTheme } from '../../../theme';
import createStyles from './styles';

const CountrySelector = memo(({ value, onSelect, placeholder = "All Countries" }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius]
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const selectedCountry = useMemo(
    () => COUNTRIES.find(c => c.value === value) || null,
    [value],
  );

  const filteredCountries = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(c => c.label.toLowerCase().includes(q));
  }, [countrySearch]);

  const handleOpen = useCallback(() => {
    setCountrySearch('');
    setModalVisible(true);
  }, []);

  const handleClose = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleSelect = useCallback((val) => {
    onSelect(val);
    setModalVisible(false);
  }, [onSelect]);

  const renderItem = useCallback(({ item }) => {
    const isSelected = item.value === value;
    return (
      <TouchableOpacity
        style={[
          styles.countryItemRow,
          isSelected && styles.countryItemRowSelected
        ]}
        onPress={() => handleSelect(item.value)}
        activeOpacity={0.7}
      >
        <View style={styles.countryItemContent}>
          <AppText style={styles.countryItemFlag}>
            {countryCodeToFlag(item.value)}
          </AppText>
          <AppText
            variant="body"
            color={isSelected ? colors.primary : colors.textPrimary}
            style={isSelected ? styles.countryItemTextSelected : undefined}
          >
            {item.label}
          </AppText>
        </View>
        {isSelected ? <IonIcon name="checkmark-circle" size={20} color={colors.primary} /> : null}
      </TouchableOpacity>
    );
  }, [value, colors, handleSelect, styles]);

  const keyExtractor = useCallback(item => item.value, []);

  return (
    <>
      <AppText style={styles.formLabel}>
        {t('basicInfo.countryLabel')}
      </AppText>
      <TouchableOpacity
        style={styles.countryDropdown}
        onPress={handleOpen}
        activeOpacity={0.8}
      >
        {selectedCountry ? (
          <View style={styles.countryDropdownContent}>
            <AppText style={styles.countryDropdownFlag}>
              {countryCodeToFlag(selectedCountry.value)}
            </AppText>
            <AppText variant="body" style={styles.countryDropdownText}>
              {selectedCountry.label}
            </AppText>
          </View>
        ) : (
          <AppText variant="body" style={styles.countryDropdownPlaceholder}>
            {placeholder}
          </AppText>
        )}
        <IonIcon name="chevron-down" size={18} color={colors.textSecondary} />
      </TouchableOpacity>

      <AppModal
        visible={modalVisible}
        onClose={handleClose}
        title={t('modals.selectCountry.title')}
        style={styles.modalStyle}
      >
        <View style={styles.countrySearchContainerModal}>
          <IonIcon name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.countrySearchInputModal}
            placeholder="Search country..."
            placeholderTextColor={colors.textSecondary}
            value={countrySearch}
            onChangeText={setCountrySearch}
            autoCorrect={false}
            autoCapitalize="words"
            clearButtonMode="while-editing"
          />
        </View>
        <FlatList
          data={filteredCountries}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          style={styles.countryListContainer}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <AppText variant="body" color={colors.textSecondary} style={styles.countryEmptyText}>
              No countries found
            </AppText>
          }
        />
      </AppModal>
    </>
  );
});

export default CountrySelector;
