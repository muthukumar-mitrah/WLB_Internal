import React, { memo, useMemo, useState, useCallback, useRef, forwardRef } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../theme';
import { AppText, InputBox, CommonBottomSheet } from '../../../components/common';
import { COUNTRIES } from '../../../constants/countries';
import createStyles from './styles';

const DropdownField = ({ label, value, placeholder, onPress, styles, colors }) => (
  <View style={styles.dropdownField}>
    <AppText style={styles.label}>{label}</AppText>
    <TouchableOpacity style={styles.dropdownButton} onPress={onPress} activeOpacity={0.7}>
      <AppText style={value ? styles.dropdownButtonText : styles.dropdownButtonPlaceholder}>
        {value || placeholder}
      </AppText>
      <Icon name="chevron-down" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  </View>
);

const CountryBottomSheet = forwardRef(({ onSelect }, ref) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? COUNTRIES.filter(c => c.label.toLowerCase().includes(q))
      : COUNTRIES;
  }, [query]);

  const handleSelect = (item) => {
    onSelect(item.label);
    ref.current?.close();
  };

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={{
        paddingVertical: 14,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
      onPress={() => handleSelect(item)}
    >
      <AppText style={{ fontSize: 16, color: colors.text }}>{item.label}</AppText>
    </TouchableOpacity>
  ), [colors.border, colors.text, handleSelect]);

  const clearIcon = useMemo(
    () =>
      query ? (
        <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="close-circle" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      ) : (
        <Icon name="magnify" size={18} color={colors.textSecondary} />
      ),
    [query, colors.textSecondary],
  );

  return (
    <CommonBottomSheet ref={ref} snapPoints={['60%', '90%']} enablePanDownToClose>
      <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>
        <AppText style={{ fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 12 }}>
          Choose country
        </AppText>
        <InputBox
          placeholder="Search country..."
          value={query}
          onChangeText={setQuery}
          leftIcon={<Icon name="magnify" size={20} color={colors.textSecondary} />}
          rightIcon={clearIcon}
          autoCorrect={false}
        />
      </View>
      <BottomSheetFlatList
        data={filtered}
        keyExtractor={(item) => item.value}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <AppText style={{ textAlign: 'center', marginTop: 20, color: colors.textSecondary }}>
            No countries found
          </AppText>
        }
      />
    </CommonBottomSheet>
  );
});

export default memo(CountryBottomSheet);
