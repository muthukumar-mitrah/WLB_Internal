import React, { memo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import AppText from './AppText';
import Divider from './Divider';
import RadioOption from '../../screens/profile/components/RadioOption';

const PrivacyInfo = ({
  title,
  options = [],
  selectedValue,
  onSelect,
  variant = 'card',
}) => {
  const { colors, spacing, borderRadius } = useTheme();

  return (
    <View style={styles.container}>
      {title && (
        <AppText style={[styles.headerTitle, { color: colors.textSecondary, marginTop: spacing[5], marginBottom: spacing[6] }]}>
          {title}
        </AppText>
      )}

      <View style={styles.listContainer}>
        {options.map((option, index) => {
          const isSelected = option.key === selectedValue;
          const isLast = index === options.length - 1;

          if (variant === 'card') {
            return (
              <TouchableOpacity
                key={option.key}
                activeOpacity={0.85}
                onPress={() => onSelect(option.key)}
                style={[
                  styles.cardRow,
                  {
                    borderRadius: borderRadius.xl || 16,
                    padding: spacing[4],
                    marginBottom: spacing[3],
                    borderWidth: 1.5,
                    borderColor: isSelected ? colors.primary : 'transparent',
                    backgroundColor: isSelected ? colors.primarySurface : 'transparent',
                  },
                ]}
              >
                {option.icon && (
                  <View style={styles.iconWrapper}>
                    <Ionicons
                      name={option.icon}
                      size={24}
                      color={isSelected ? colors.primary : colors.textPrimary}
                    />
                  </View>
                )}

                <View style={styles.textBlock}>
                  <AppText
                    style={[
                      styles.optionTitle,
                      {
                        color: isSelected ? colors.primary : colors.textPrimary,
                        fontFamily: 'Inter-Bold',
                        fontWeight: '700',
                      },
                    ]}
                  >
                    {option.title}
                  </AppText>
                  <AppText
                    style={[
                      styles.optionDesc,
                      { color: isSelected ? colors.primary : colors.textSecondary },
                    ]}
                  >
                    {option.description}
                  </AppText>
                </View>

                {isSelected && (
                  <View style={styles.checkmarkWrapper}>
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            );
          } else {
            return (
              <View key={option.key}>
                <TouchableOpacity
                  style={[styles.listRow, { paddingVertical: spacing[3] }]}
                  onPress={() => onSelect(option.key)}
                  activeOpacity={0.7}
                >
                  {option.icon && (
                    <View style={styles.iconWrapper}>
                      <Ionicons
                        name={option.icon}
                        size={22}
                        color={colors.textPrimary}
                      />
                    </View>
                  )}

                  <View style={styles.textBlock}>
                    <AppText style={[styles.optionTitle, { color: colors.textPrimary }]}>
                      {option.title}
                    </AppText>
                    {option.description && (
                      <AppText style={[styles.optionDesc, { color: colors.textSecondary }]}>
                        {option.description}
                      </AppText>
                    )}
                  </View>

                  <RadioOption selected={isSelected} />
                </TouchableOpacity>

                {!isLast && (
                  <Divider style={{ marginVertical: spacing[1] }} thickness={1} />
                )}
              </View>
            );
          }
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  },
  listContainer: {
    width: '100%',
  },
  cardRow: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  listRow: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    width: 28,
  },
  textBlock: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    fontWeight: '600',
  },
  optionDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 4,
  },
  checkmarkWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});

export default memo(PrivacyInfo);
