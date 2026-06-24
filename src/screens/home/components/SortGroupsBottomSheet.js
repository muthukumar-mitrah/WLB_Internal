import React, { forwardRef, useImperativeHandle, useRef, useState, useCallback, memo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../../../theme';
import { fontFamily } from '../../../theme/fonts';
import { useTranslation } from '../../../i18n/useTranslation';
import { CommonBottomSheet, AppText, Button } from '../../../components/common';

const OPTIONS = [
  {
    value: 'newest',
    titleKey: 'groupDetails.options.sortNewestGroups',
    descKey: 'groupDetails.options.sortNewestGroupsDesc',
  },
  {
    value: 'members',
    titleKey: 'groupDetails.options.sortMostMembers',
    descKey: 'groupDetails.options.sortMostMembersDesc',
  },
  {
    value: 'alpha_asc',
    titleKey: 'groupDetails.options.sortGroupNameAZ',
    descKey: 'groupDetails.options.sortGroupNameAZDesc',
  },
  {
    value: 'alpha_desc',
    titleKey: 'groupDetails.options.sortGroupNameZA',
    descKey: 'groupDetails.options.sortGroupNameZADesc',
  },
];

const SortGroupsBottomSheet = forwardRef(({ selectedValue, onApply }, ref) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { t } = useTranslation();
  const bottomSheetRef = useRef(null);

  const [tempSelectedValue, setTempSelectedValue] = useState(selectedValue || 'newest');

  useImperativeHandle(ref, () => ({
    open: () => {
      setTempSelectedValue(selectedValue || 'newest');
      bottomSheetRef.current?.expand();
    },
    close: () => {
      bottomSheetRef.current?.close();
    }
  }), [selectedValue]);

  const handleSelect = useCallback((val) => {
    setTempSelectedValue(val);
  }, []);

  const handleApplyPress = useCallback(() => {
    onApply?.(tempSelectedValue);
    bottomSheetRef.current?.close();
  }, [onApply, tempSelectedValue]);

  const handleCancelPress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  return (
    <CommonBottomSheet
      ref={bottomSheetRef}
      snapPoints={['62%', '80%']}
      enablePanDownToClose
      index={-1}
    >
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <AppText style={[styles.title, { color: colors.textSecondary }]}>
          {t('groupDetails.options.sortGroupsTitle')}
        </AppText>

        <View style={[styles.optionsContainer,]}>
          {OPTIONS.map((opt) => {
            const isSelected = tempSelectedValue === opt.value;
            const containerBg = isSelected ? colors.primarySurface : colors.surface;
            const containerBorder = isSelected ? colors.primary : colors.transparent;
            const titleColor = isSelected ? colors.primary : colors.textPrimary;
            const descColor = isSelected ? colors.primary : colors.textSecondary;

            return (
              <TouchableOpacity
                key={opt.value}
                activeOpacity={0.7}
                onPress={() => handleSelect(opt.value)}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: containerBg,
                    borderColor: containerBorder,
                    borderRadius: borderRadius.xl,
                  }
                ]}
              >
                <View style={styles.optionTextWrapper}>
                  <AppText style={[styles.optionTitle, { color: titleColor }]}>
                    {t(opt.titleKey)}
                  </AppText>
                  <AppText style={[styles.optionDesc, { color: descColor }]}>
                    {t(opt.descKey)}
                  </AppText>
                </View>

                {isSelected && (
                  <View style={[styles.checkCircle, { backgroundColor: colors.primary }]}>
                    <Icon name="checkmark" size={14} color="#FFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
          <View style={[styles.buttonWrapper, { gap: spacing[3] }]}>
            <Button
              title={t('groupDetails.options.cancel')}
              onPress={handleCancelPress}
              variant="gray"
              style={styles.actionButton}
            />
            <Button
              title={t('groupDetails.options.apply')}
              onPress={handleApplyPress}
              variant="primary"
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </CommonBottomSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    lineHeight: 26,
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'column',
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
  },
  optionTextWrapper: {
    flex: 1,
    paddingRight: 12,
  },
  optionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 2,
  },
  optionDesc: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    flexDirection: 'column',
    top: 10
  },
  actionButton: {
    width: '100%',
    height: 40,
  },
});

export default memo(SortGroupsBottomSheet);
