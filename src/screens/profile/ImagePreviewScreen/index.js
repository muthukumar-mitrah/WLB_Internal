import React, {memo, useMemo} from 'react';
import {StatusBar, Image, ScrollView} from 'react-native';
import {useTheme} from '../../../theme';
import {Header, SafeContainer} from '../../../components/common';
import {APP_IMAGES} from '../../../constants';
import createStyles from './styles';

const ImagePreviewScreen = ({navigation, route}) => {
  const {colors, spacing} = useTheme();

  const styles = useMemo(
    () => createStyles({colors, spacing}),
    [colors, spacing],
  );

  const imageUri = route.params?.imageUri;

  const source = useMemo(() => {
    if (!imageUri) {
      return APP_IMAGES.userAvatar;
    }
    if (typeof imageUri === 'string') {
      return { uri: imageUri };
    }
    return imageUri;
  }, [imageUri]);

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />
      <Header title="Image Preview" showBack />

      <ScrollView
        contentContainerStyle={styles.imageContainer}
        maximumZoomScale={3}
        minimumZoomScale={1}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={source}
          style={styles.image}
          resizeMode="contain"
        />
      </ScrollView>
    </SafeContainer>
  );
};

export default memo(ImagePreviewScreen);
