import React, { useRef, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { fontFamily } from '../../theme/fonts';
import { useTheme } from '../../theme';

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const WheelColumn = ({ data, selectedIndex, onSelect, width }) => {
  const { colors } = useTheme();
  const scrollRef = useRef(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    if (scrollRef.current && !isScrolling.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          y: selectedIndex * ITEM_HEIGHT,
          animated: false,
        });
      }, 50);
    }
  }, [selectedIndex]);

  const handleMomentumEnd = useCallback((e) => {
    isScrolling.current = false;
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, data.length - 1));

    scrollRef.current?.scrollTo({
      y: clampedIndex * ITEM_HEIGHT,
      animated: true,
    });

    if (clampedIndex !== selectedIndex) {
      onSelect(clampedIndex);
    }
  }, [data.length, selectedIndex, onSelect]);

  const handleScrollBegin = useCallback(() => {
    isScrolling.current = true;
  }, []);

  // Padding to center the first/last items
  const topPadding = ITEM_HEIGHT * 2;
  const bottomPadding = ITEM_HEIGHT * 2;

  return (
    <View style={[styles.columnContainer, { width }]}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        bounces={false}
        onScrollBeginDrag={handleScrollBegin}
        onMomentumScrollEnd={handleMomentumEnd}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: topPadding,
          paddingBottom: bottomPadding,
        }}
      >
        {data.map((item, index) => {
          const isSelected = index === selectedIndex;
          return (
            <View key={`${item}-${index}`} style={styles.itemContainer}>
              <Text
                style={[
                  styles.itemText,
                  { fontFamily: fontFamily.regular, color: colors.textTertiary },
                  isSelected && styles.itemTextSelected,
                  isSelected && { fontFamily: fontFamily.semiBold, color: colors.textPrimary },
                ]}
              >
                {item}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const DateWheelPicker = ({ date, onDateChange }) => {
  const { colors } = useTheme();
  const currentDay = date.getDate();
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();

  // Generate year range
  const startYear = 1950;
  const endYear = new Date().getFullYear();
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  // Generate days for current month
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const dayIndex = currentDay - 1;
  const monthIndex = currentMonth;
  const yearIndex = years.indexOf(currentYear);

  const handleDaySelect = useCallback((index) => {
    const newDay = index + 1;
    const maxDay = getDaysInMonth(currentMonth, currentYear);
    const safeDay = Math.min(newDay, maxDay);
    onDateChange(new Date(currentYear, currentMonth, safeDay));
  }, [currentMonth, currentYear, onDateChange]);

  const handleMonthSelect = useCallback((index) => {
    const maxDay = getDaysInMonth(index, currentYear);
    const safeDay = Math.min(currentDay, maxDay);
    onDateChange(new Date(currentYear, index, safeDay));
  }, [currentDay, currentYear, onDateChange]);

  const handleYearSelect = useCallback((index) => {
    const newYear = years[index];
    const maxDay = getDaysInMonth(currentMonth, newYear);
    const safeDay = Math.min(currentDay, maxDay);
    onDateChange(new Date(newYear, currentMonth, safeDay));
  }, [currentDay, currentMonth, years, onDateChange]);

  return (
    <View style={styles.pickerContainer}>
      {/* Highlight bar behind selected row */}
      <View style={[styles.highlightBar, { backgroundColor: colors.backgroundSecondary }]} pointerEvents="none" />
      {/* Separator lines */}
      <View style={[styles.separatorTop, { backgroundColor: colors.border }]} pointerEvents="none" />
      <View style={[styles.separatorBottom, { backgroundColor: colors.border }]} pointerEvents="none" />

      <View style={styles.columnsRow}>
        <WheelColumn
          data={days.map(String)}
          selectedIndex={dayIndex}
          onSelect={handleDaySelect}
          width={60}
        />
        <WheelColumn
          data={MONTHS}
          selectedIndex={monthIndex}
          onSelect={handleMonthSelect}
          width={120}
        />
        <WheelColumn
          data={years.map(String)}
          selectedIndex={yearIndex}
          onSelect={handleYearSelect}
          width={70}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    height: PICKER_HEIGHT,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  highlightBar: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 16,
    right: 16,
    height: ITEM_HEIGHT,
    backgroundColor: '#EDF2F7',
    borderRadius: 10,
    zIndex: 0,
  },
  separatorTop: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: '#E2E8F0',
    zIndex: 1,
  },
  separatorBottom: {
    position: 'absolute',
    top: ITEM_HEIGHT * 3 - 1,
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: '#E2E8F0',
    zIndex: 1,
  },
  columnsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: PICKER_HEIGHT,
    zIndex: 2,
  },
  columnContainer: {
    height: PICKER_HEIGHT,
    overflow: 'hidden',
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#B0B8C4',
    textAlign: 'center',
  },
  itemTextSelected: {
    fontSize: 18,
    color: '#1A202C',
  },
});

export default DateWheelPicker;
