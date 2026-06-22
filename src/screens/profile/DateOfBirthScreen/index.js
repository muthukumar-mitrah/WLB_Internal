import React, {memo, useMemo, useState, useCallback} from 'react';
import {View, StatusBar, Image} from 'react-native';
import {useTheme} from '../../../theme';
import {
  Header,
  SafeContainer,
  Button,
  DateWheelPicker,
  InputBox,
} from '../../../components/common';
import {ROUTES} from '../../../constants';
import {APP_IMAGES} from '../../../constants';
import createStyles from './styles';
import {useTranslation} from 'react-i18next';

// Parse "25 Jan 2005" → Date object
const parseDate = dateStr => {
  if (!dateStr) {return new Date(2005, 0, 25);}
  const parsed = new Date(dateStr);
  if (!isNaN(parsed)) {return parsed;}
  // Fallback: manual parse of "DD Mon YYYY"
  const parts = dateStr.split(' ');
  if (parts.length === 3) {
    const months = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    const day = parseInt(parts[0], 10);
    const month = months[parts[1]];
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  return new Date(2005, 0, 25);
};

const formatDate = date =>
  date.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'});

const DateOfBirthScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const {colors, spacing, borderRadius, shadows, isDark} = useTheme();

  const styles = useMemo(
    () => createStyles({colors, spacing, borderRadius, shadows, isDark}),
    [colors, spacing, borderRadius, shadows, isDark],
  );

  const [currentDate, setCurrentDate] = useState(() =>
    parseDate(route.params?.currentDob),
  );
  const handleDateChange = useCallback(date => setCurrentDate(date), []);

  const handleDone = useCallback(() => {
    navigation.navigate(ROUTES.UPDATE_PROFILE, {
      updatedDob: formatDate(currentDate),
    });
  }, [navigation, currentDate]);

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />
      <Header title={t('profile.dob.title')} showBack />

      <View style={styles.content}>
        <View pointerEvents="none">
          <InputBox
            label={t('profile.dob.label')}
            value={formatDate(currentDate)}
            rightIcon={
              <Image
                source={APP_IMAGES.dateOfBirth}
                style={styles.calendarIcon}
                resizeMode="contain"
              />
            }
          />
        </View>

        <View style={styles.spacer} />

        <View style={styles.modalContent}>
          <View style={styles.pickerWrapper}>
            <DateWheelPicker date={currentDate} onDateChange={handleDateChange} />
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button title={t('common.buttons.done')} onPress={handleDone} variant="primary" size="lg" fullWidth />
      </View>
    </SafeContainer>
  );
};

export default memo(DateOfBirthScreen);
