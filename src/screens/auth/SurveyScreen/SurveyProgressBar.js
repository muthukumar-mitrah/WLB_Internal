/**
 * SurveyProgressBar — shared dash-style progress indicator for all survey screens.
 * Only the CURRENT screen's dash is highlighted in primary colour; the rest are gray.
 *
 * Usage:
 *   <SurveyProgressBar total={10} current={1} />
 */
import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme';

const SurveyProgressBar = memo(({ total = 9, current }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dash,
            {
              backgroundColor:
                i === current - 1 ? colors.primary : colors.gray200,
            },
          ]}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dash: {
    height: 4,
    width: 18,
    borderRadius: 2,
  },
});

export default SurveyProgressBar;
