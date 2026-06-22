import React, { memo, useMemo, useState, useCallback, forwardRef } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useTheme } from '../../../theme';
import { AppText, InputBox, CommonBottomSheet } from '../../../components/common';
import { COUNTRIES } from '../../../constants/countries';


const CountryBottomSheet = forwardRef(({ onSelect }, ref) => {
  const { colors } = useTheme();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? COUNTRIES.filter(c => c.label.toLowerCase().includes(q))
      : COUNTRIES;
  }, [query]);

const handleSelect = useCallback((item) => {
  onSelect(item.label);
  ref.current?.close();
}, [onSelect, ref]);

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
