/**
 * AppImage — image wrapper with loading placeholder and error fallback
 */
import React, {memo, useState} from 'react';
import {Image, View, ActivityIndicator, StyleSheet} from 'react-native';
import {useTheme} from '../../theme';

const AppImage = ({
  source,
  style,
  imageStyle,
  resizeMode = 'cover',
  fallback,
  showLoader = true,
  borderRadius: customRadius,
  ...rest
}) => {
  const {colors} = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const imgStyle = [
    style,
    customRadius !== undefined && {borderRadius: customRadius},
  ];

  if (error && fallback) {
    return (
      <Image
        source={fallback}
        style={imgStyle}
        resizeMode={resizeMode}
        {...rest}
      />
    );
  }

  return (
    <View style={[styles.wrapper, style]}>
      <Image
        source={source}
        style={[StyleSheet.absoluteFill, customRadius !== undefined && {borderRadius: customRadius}, imageStyle]}
        resizeMode={resizeMode}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        {...rest}
      />
      {loading && showLoader && (
        <View
          style={[
            StyleSheet.absoluteFill,
            styles.loader,
            {backgroundColor: colors.backgroundSecondary},
          ]}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(AppImage);
