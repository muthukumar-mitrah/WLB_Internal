import React, { memo } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const ZoomableImage = memo(({ source }) => {
  const scale = useSharedValue(1);

  const savedScale = useSharedValue(1);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
  .onUpdate(event => {
  console.log('PINCH SCALE:', event.scale);

  scale.value = Math.max(
    1,
    Math.min(event.scale * savedScale.value, 5),
  );
})
  .onEnd(() => {
    savedScale.value = scale.value;

    if (scale.value < 1) {
      scale.value = withTiming(1);
      savedScale.value = 1;
    }
  });

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      if (scale.value <= 1) {
        return;
      }

      translateX.value =
        savedTranslateX.value + event.translationX;

      translateY.value =
        savedTranslateY.value + event.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        scale.value = withTiming(1);

        translateX.value = withTiming(0);
        translateY.value = withTiming(0);

        savedScale.value = 1;
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        scale.value = withTiming(2.5);
        savedScale.value = 2.5;
      }
    });

  const zoomGesture = Gesture.Simultaneous(
  pinchGesture,
  panGesture,
);

const composedGesture = Gesture.Exclusive(
  doubleTapGesture,
  zoomGesture,
);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
  <GestureDetector gesture={composedGesture}>
  <Animated.View
    style={[
      styles.imageWrapper,
      animatedStyle,
    ]}
  >
    <Image
      source={source}
      resizeMode="contain"
      style={styles.previewImage}
    />
  </Animated.View>
</GestureDetector>
  );
});

const PostPreviewModal = ({
  visible,
  image,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      position="center"
      showHandle={false}
      showCloseButton={false}
      closeOnOverlay={true}
      overlayColor="#000000"
      style={styles.previewModalOverride}
    >
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Icon
            name="close"
            size={28}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {image && (
          <ZoomableImage source={image} />
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default memo(PostPreviewModal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageWrapper: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  previewImage: {
    width,
    height: height * 0.8,
  },

  closeBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    zIndex: 999,

    width: 44,
    height: 44,
    borderRadius: 22,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  previewModalOverride: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    width: '100%',
    height: '100%',
    paddingHorizontal: 0,
    paddingBottom: 0,
    margin: 0,
    alignSelf: 'stretch',
    elevation: 0,
    shadowOpacity: 0,
  },
});