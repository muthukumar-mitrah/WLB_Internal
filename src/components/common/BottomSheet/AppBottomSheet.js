/**
 * CommentBottomSheet — Reusable wrapper around @gorhom/bottom-sheet v5.
 *
 * Handles:
 *   - Themed background + handle indicator
 *   - Backdrop with fade
 *   - Keyboard handling via BottomSheetFooter for pinned input
 *   - Reliable open/close via snapToIndex
 */
import React, {forwardRef, useImperativeHandle, useRef, useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {BottomSheetModal, BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {useTheme} from '../../../theme';

const AppBottomSheet = forwardRef(
  (
    {
      snapPoints = ['50%', '90%'],
      children,
      onChange,
      onClose,
      index = -1,
      enablePanDownToClose = true,
      footerComponent,
    },
    ref,
  ) => {
    const {colors} = useTheme();
    const bottomSheetRef = useRef(null);

    useImperativeHandle(
      ref,
      () => ({
        expand: () => bottomSheetRef.current?.present(),
        collapse: () => bottomSheetRef.current?.snapToIndex(0),
        close: () => bottomSheetRef.current?.dismiss(),
        snapToIndex: idx => bottomSheetRef.current?.snapToIndex(idx),
        present: () => bottomSheetRef.current?.present(),
      }),
      [],
    );

    const renderBackdrop = useCallback(
      props => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        index={Math.max(0, index)}
        snapPoints={snapPoints}
        onChange={onChange}
        onDismiss={onClose}
        enablePanDownToClose={enablePanDownToClose}
        backdropComponent={renderBackdrop}
        backgroundStyle={[styles.background, {backgroundColor: colors.surface}]}
        handleIndicatorStyle={[
          styles.indicator,
          {backgroundColor: colors.gray300},
        ]}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        enableDynamicSizing={false}
        footerComponent={footerComponent}>
        {children}
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  background: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  indicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
});

export default AppBottomSheet;
