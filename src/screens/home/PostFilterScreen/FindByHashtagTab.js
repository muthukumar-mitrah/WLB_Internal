/**
 * FindByHashtagTab — Filter By Hashtag tab content.
 *
 * Manages hashtag search, suggestions, selected chips.
 * Wrapped in React.memo — does not re-render when people-tab state changes.
 */
import React, { memo, useMemo, useState, useCallback } from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../theme';
import { AppText, Button } from '../../../components/common';
import { TextInput } from 'react-native';
import createStyles from './styles';

// ── Static hashtag data ───────────────────────────────────────────────────────
const ALL_HASHTAGS = [
  '#weightloss', '#fitness', '#healthyfood', '#workout',
  '#fatloss', '#diet', '#running', '#transformation',
];

// ── Pure sub-components ───────────────────────────────────────────────────────

const HashtagChip = memo(({ tag, onRemove, styles, colors }) => (
  <TouchableOpacity
    style={styles.chip}
    onPress={() => onRemove(tag)}
    activeOpacity={0.7}
  >
    <AppText style={styles.chipText}>{tag}</AppText>
    <Icon name="close-circle" size={15} color="#ffffff" />
  </TouchableOpacity>
));

// ── Main tab component ────────────────────────────────────────────────────────

const FindByHashtagTab = ({ onApply }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius],
  );

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.trim().toLowerCase();
    return ALL_HASHTAGS.filter(
      h => h.toLowerCase().includes(q) && !selected.includes(h),
    );
  }, [search, selected]);

  const handleAdd = useCallback(tag => {
    setSelected(prev => (prev.includes(tag) ? prev : [...prev, tag]));
    setSearch('');
  }, []);

  const handleRemove = useCallback(tag => {
    setSelected(prev => prev.filter(t => t !== tag));
  }, []);

  // Render items via stable callbacks so FlatList doesn't re-render unnecessarily
  const renderSuggestion = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleAdd(item)}
      activeOpacity={0.7}
    >
      <AppText style={styles.suggestionText}>{item}</AppText>
    </TouchableOpacity>
  ), [styles, handleAdd]);

  const keyExtractor = useCallback(item => item, []);

  return (
    <View style={styles.hashtagContent}>
      <TextInput
        placeholder="Search hashtags…"
        placeholderTextColor={colors.textSecondary}
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />

      {/* Suggestions — plain View list, no nested ScrollView */}
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={keyExtractor}
          renderItem={renderSuggestion}
          style={styles.suggestionsList}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      )}

      {search.trim().length > 0 && suggestions.length === 0 && (
        <AppText style={styles.emptyHashtagText}>No matching hashtags</AppText>
      )}

      {/* Selected chips */}
      {selected.length > 0 && (
        <>
          <AppText style={styles.selectedHashtagsTitle}>Selected Hashtags</AppText>
          <View style={styles.chipsContainer}>
            {selected.map(tag => (
              <HashtagChip
                key={tag}
                tag={tag}
                onRemove={handleRemove}
                styles={styles}
                colors={colors}
              />
            ))}
          </View>
        </>
      )}

      <View style={styles.flex1} />

      <View style={styles.hashtagFooter}>
        <Button title="Apply Filter" onPress={onApply} variant="primary" />
      </View>
    </View>
  );
};

export default memo(FindByHashtagTab);
