import React, { memo } from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../../theme';

const Chart = ({
  labels = [],
  data = [],
  lineColor,
  fillColor,
  width,
  height = 160,
  formatYLabel,
  style,
  chartStyle,
  ...props
}) => {
  const { colors, fonts, isDark } = useTheme();
  const fontFamily = fonts?.fontFamily || {};

  const chartWidth = width || Dimensions.get('window').width - 32;
  const resolvedLineColor = lineColor || colors.primary;
  const labelColor = colors.textSecondary;
  const gridLineColor = colors.border;

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data.length > 0 ? data : [0],
        color: (opacity = 1) => resolvedLineColor,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: colors.surface,
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: colors.surface,
    backgroundGradientToOpacity: 0,
    decimalPlaces: 1,
    color: (opacity = 1) => resolvedLineColor,
    labelColor: (opacity = 1) => labelColor,
    fillShadowGradient: fillColor || resolvedLineColor,
    fillShadowGradientOpacity: isDark ? 0.10 : 0.08,
    fillShadowGradientFrom: fillColor || resolvedLineColor,
    fillShadowGradientFromOpacity: isDark ? 0.15 : 0.12,
    fillShadowGradientTo: fillColor || resolvedLineColor,
    fillShadowGradientToOpacity: 0.0,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeDasharray: '3 3',
      stroke: gridLineColor,
      strokeWidth: 0.8,
    },
    propsForLabels: {
      fontFamily: fontFamily.regular,
      fontSize: 10,
    },
    propsForDots: {
      r: '0',
    },
  };

  return (
    <View style={style}>
      <LineChart
        data={chartData}
        width={chartWidth}
        height={height}
        chartConfig={chartConfig}
        bezier
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={false}
        withShadow={true}
        segments={3}
        yAxisInterval={1}
        formatYLabel={formatYLabel || ((value) => parseFloat(value).toFixed(1))}
        style={chartStyle}
        {...props}
      />
    </View>
  );
};

export default memo(Chart);
