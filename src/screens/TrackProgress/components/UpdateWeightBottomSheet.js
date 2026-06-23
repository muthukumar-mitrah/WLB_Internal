import React, { forwardRef, useImperativeHandle, useRef, useState, useCallback, memo, useMemo, useEffect } from 'react';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import { BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import { useTranslation } from '../../../i18n/useTranslation';
import { useTheme } from '../../../theme';
import { AppText, CommonBottomSheet } from '../../../components/common';
import createStyles from './styles';

const UpdateWeightBottomSheet = forwardRef(({
  visible,
  initialWeight,
  unit,
  onClose,
  onSave,
  onSubmit,
  initialUnit
}, ref) => {
  const { t } = useTranslation();
  const { colors, spacing, borderRadius, shadows, isDark } = useTheme();

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius, shadows, isDark }),
    [colors, spacing, borderRadius, shadows, isDark]
  );

  const bottomSheetRef = useRef(null);
  const inputRef = useRef(null);
  const isFirstRender = useRef(true);

  const [sheetIndex, setSheetIndex] = useState(-1);

  // Local bottom sheet states
  const [inputWeight, setInputWeight] = useState(String(initialWeight || ''));
  const [inputUnit, setInputUnit] = useState(unit || initialUnit || 'lbs');

  // Sync internal state when sheet becomes visible
  useEffect(() => {
    if (visible) {
      setInputWeight(String(initialWeight || ''));
      setInputUnit(unit || initialUnit || 'lbs');
    }
  }, [visible, initialWeight, unit, initialUnit]);

  // Sync sheet visibility with prop
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (visible) {
      setSheetIndex(0);
      setTimeout(() => {
        bottomSheetRef.current?.present();
      }, 0);
    } else if (visible === false) {
      Keyboard.dismiss();
      setSheetIndex(-1);
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  // Setup keyboard hide listener to automatically blur text input and collapse bottom sheet
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        inputRef.current?.blur();
        bottomSheetRef.current?.snapToIndex(0);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  // Expose sheet control methods to the parent screen (backward compatibility)
  useImperativeHandle(ref, () => ({
    open: (weight, targetUnit) => {
      setInputWeight(String(weight || ''));
      setInputUnit(targetUnit || 'lbs');
      setSheetIndex(0);
      setTimeout(() => {
        bottomSheetRef.current?.present();
      }, 0);
    },
    close: () => {
      Keyboard.dismiss();
      setSheetIndex(-1);
      bottomSheetRef.current?.close();
    }
  }), []);

  const handleSheetChange = useCallback((index) => {
    setSheetIndex(index);
    if (index === -1) {
      if (onClose) {
        onClose();
      }
    }
  }, [onClose]);

  const handleSaveWeightSubmit = useCallback(() => {
    if (onSave) {
      onSave(inputWeight, inputUnit);
    } else if (onSubmit) {
      onSubmit(inputWeight, inputUnit);
    }
  }, [inputWeight, inputUnit, onSave, onSubmit]);

  const toggleInputUnit = useCallback((newUnit) => {
    setInputUnit(newUnit);
    // Convert input field value dynamically
    const val = parseFloat(inputWeight);
    if (!isNaN(val) && val > 0) {
      if (newUnit === 'Kg') {
        setInputWeight(String(parseFloat((val * 0.45359237).toFixed(1))));
      } else {
        setInputWeight(String(parseFloat((val / 0.45359237).toFixed(1))));
      }
    }
  }, [inputWeight]);

  return (
    <CommonBottomSheet
      ref={bottomSheetRef}
      index={sheetIndex}
      onChange={handleSheetChange}
      snapPoints={["40%", "60%"]}
      enablePanDownToClose={true}
    >
      <BottomSheetView style={styles.bottomSheetContent}>
        <AppText variant="h3" color={colors.textPrimary} style={styles.bottomSheetTitle}>
          {t('tracker.bottomSheet.title', 'Update Weight')}
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.bottomSheetDesc}>
          {t('tracker.bottomSheet.description', 'Enter your current weight to keep your journey on track.')}
        </AppText>

        {/* Weight Input Box with Nested Unit Selector */}
        <View style={styles.inputCard}>
          <BottomSheetTextInput
            ref={inputRef}
            style={styles.weightInput}
            keyboardType="decimal-pad"
            value={inputWeight}
            onChangeText={setInputWeight}
            placeholder={t('tracker.bottomSheet.inputPlaceholder', '0.0')}
            placeholderTextColor={colors.textTertiary}
            onSubmitEditing={() => Keyboard.dismiss()}
            onBlur={() => bottomSheetRef.current?.snapToIndex(0)}
          />
          <View style={styles.unitSwitchContainer}>
            <TouchableOpacity
              style={[styles.unitSwitchBtn, inputUnit === 'Kg' && styles.unitSwitchBtnActive]}
              onPress={() => toggleInputUnit('Kg')}
              activeOpacity={0.8}
            >
              <AppText style={inputUnit === 'Kg' ? styles.unitSwitchTextActive : styles.unitSwitchTextInactive}>
                {t('tracker.bodyWeight.unitKg', 'Kg')}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitSwitchBtn, inputUnit === 'lbs' && styles.unitSwitchBtnActive]}
              onPress={() => toggleInputUnit('lbs')}
              activeOpacity={0.8}
            >
              <AppText style={inputUnit === 'lbs' ? styles.unitSwitchTextActive : styles.unitSwitchTextInactive}>
                {t('tracker.bodyWeight.unitLbs', 'lbs')}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Save button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveWeightSubmit}
          activeOpacity={0.8}
        >
          <AppText style={styles.saveButtonText}>
            {t('tracker.bottomSheet.saveButton', 'Save Weight')}
          </AppText>
        </TouchableOpacity>
      </BottomSheetView>
    </CommonBottomSheet>
  );
});

export default memo(UpdateWeightBottomSheet);
