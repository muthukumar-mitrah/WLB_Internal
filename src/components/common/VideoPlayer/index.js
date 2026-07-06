import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { View, Pressable, Text, Image, PanResponder, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import createStyles from './styles';

const formatTime = (seconds) => {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const VideoPlayer = ({
  videoUri,
  thumbnail,
  aspectRatio,
  paused,
  onTogglePlay,
  onDoubleTap,
  durationBadge,
  style,
}) => {
  const { colors, spacing, borderRadius } = useTheme();
  const styles = useMemo(() => createStyles({ colors }), [colors]);

  const videoRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const hideControlsTimeout = useRef(null);

  useEffect(() => {
    if (!paused && !hasStarted) {
      setHasStarted(true);
    }
  }, [paused, hasStarted]);

  useEffect(() => {
    if (!paused && hasStarted && showControls) {
      startHideControlsTimer();
    } else {
      clearHideControlsTimer();
    }
    return clearHideControlsTimer;
  }, [paused, showControls, hasStarted]);

  const startHideControlsTimer = () => {
    clearHideControlsTimer();
    hideControlsTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const clearHideControlsTimer = () => {
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
      hideControlsTimeout.current = null;
    }
  };

  const lastTap = useRef(0);

  const toggleControls = useCallback(() => {
    setShowControls((prev) => !prev);
  }, []);

  const handleVideoAreaPress = useCallback((e) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (onDoubleTap) onDoubleTap();
    } else {
      lastTap.current = now;
      // For a more responsive feel, we toggle controls immediately.
      toggleControls();
    }
  }, [toggleControls, onDoubleTap]);

  const handlePlayPause = useCallback((e) => {
    if (e) e.stopPropagation();
    if (isEnded) {
      videoRef.current?.seek(0);
      setIsEnded(false);
    }
    if (hasError) {
      setHasError(false);
    }
    onTogglePlay();
    startHideControlsTimer();
  }, [isEnded, hasError, onTogglePlay]);

  const handleSeek = useCallback((amount, e) => {
    if (e) e.stopPropagation();
    if (!duration) return;
    let newTime = currentTime + amount;
    if (newTime < 0) newTime = 0;
    if (newTime > duration) newTime = duration;
    videoRef.current?.seek(newTime);
    setCurrentTime(newTime);
    if (isEnded && newTime < duration) {
      setIsEnded(false);
    }
    startHideControlsTimer();
  }, [currentTime, duration, isEnded]);

  const [progressWidth, setProgressWidth] = useState(0);
  const [dragPercent, setDragPercent] = useState(null);
  const isDragging = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => {
        isDragging.current = true;
        clearHideControlsTimer();
        const locationX = e.nativeEvent.locationX;
        gestureState.initialLocationX = locationX;
        if (progressWidth > 0) {
          const initialPercent = Math.max(0, Math.min(1, locationX / progressWidth));
          setDragPercent(initialPercent * 100);
        }
      },
      onPanResponderMove: (e, gestureState) => {
        if (!progressWidth) return;
        const currentX = gestureState.initialLocationX + gestureState.dx;
        const percent = Math.max(0, Math.min(1, currentX / progressWidth));
        setDragPercent(percent * 100);
      },
      onPanResponderRelease: (e, gestureState) => {
        isDragging.current = false;
        if (!duration || !progressWidth) return;
        const currentX = gestureState.initialLocationX + gestureState.dx;
        const percent = Math.max(0, Math.min(1, currentX / progressWidth));
        const newTime = percent * duration;
        videoRef.current?.seek(newTime);
        setCurrentTime(newTime);
        setDragPercent(null);
        if (isEnded) setIsEnded(false);
        startHideControlsTimer();
      },
      onPanResponderTerminate: () => {
        isDragging.current = false;
        setDragPercent(null);
        startHideControlsTimer();
      },
    })
  ).current;

  const onProgressBarLayout = useCallback((e) => {
    setProgressWidth(e.nativeEvent.layout.width);
  }, []);

  const onProgress = useCallback((data) => {
    if (!isEnded && !isDragging.current) {
      setCurrentTime(data.currentTime);
    }
  }, [isEnded]);

  const onLoad = useCallback((data) => {
    setDuration(data.duration);
    setHasError(false);
  }, []);

  const onEnd = useCallback(() => {
    setIsEnded(true);
    setShowControls(true);
    if (!paused) {
      onTogglePlay(); // pause it externally
    }
  }, [paused, onTogglePlay]);

  const handleBuffer = useCallback((meta) => {
    setIsBuffering(meta.isBuffering);
  }, []);

  const handleError = useCallback((error) => {
    console.error('Video onError:', error);
    setHasError(true);
    if (!paused) {
      onTogglePlay();
    }
  }, [paused, onTogglePlay]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const displayPercent = isDragging.current && dragPercent !== null ? dragPercent : progressPercent;

  // Render before the video has started playing, or if it errored out
  if (!hasStarted || hasError) {
    return (
      <View style={[styles.container, { aspectRatio }, style]}>
        <Pressable style={styles.thumbnail} onPress={handlePlayPause}>
          {thumbnail && (
            <Image
              source={thumbnail}
              style={styles.mediaFill}
              resizeMode="cover"
            />
          )}
          <View pointerEvents="none" style={styles.initialPlayOverlay}>
            <View style={styles.playIconCircle}>
              <Icon name="play" size={36} color={colors.primary} style={styles.playIconCentered} />
            </View>
          </View>
          {durationBadge && (
            <View pointerEvents="none" style={styles.durationBadgeContainer}>
              <Text style={styles.durationBadgeText}>{durationBadge}</Text>
            </View>
          )}
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { aspectRatio }, style]}>
      <Pressable style={styles.video} onPress={handleVideoAreaPress}>
        <Video
          ref={videoRef}
          source={videoUri}
          style={styles.mediaFill}
          resizeMode="cover"
          paused={paused}
          onProgress={onProgress}
          onLoad={onLoad}
          onEnd={onEnd}
          onBuffer={handleBuffer}
          onError={handleError}
          repeat={false}
          muted={false} // Enable audio now that we have real playback controls
        />

        {/* Show loader if it's buffering and we don't have an error */}
        {!paused && !hasError && isBuffering && (
          <View pointerEvents="none" style={styles.initialPlayOverlay}>
            <View style={styles.spinnerOverlay}>
              <ActivityIndicator size="small" color="#FFF" />
            </View>
          </View>
        )}

        {/* Big centered play button if paused AFTER it has started */}
        {paused && !hasError && (
          <View pointerEvents="none" style={styles.initialPlayOverlay}>
            <View style={styles.playIconCircle}>
              <Icon name={isEnded ? "refresh" : "play"} size={24} color={colors.primary} style={!isEnded ? styles.playIconCentered : null} />
            </View>
          </View>
        )}
        
        {/* Custom Interactive Controls */}
        {showControls && (
          <View style={styles.bottomBar}>
            <View style={styles.controlRow}>
              <Pressable style={styles.controlButton} onPress={handlePlayPause}>
                {isEnded ? (
                  <Icon name="refresh" size={24} color="#FFF" />
                ) : (
                  <Icon name={paused ? 'play' : 'pause'} size={24} color="#FFF" />
                )}
              </Pressable>

              <Text style={styles.timeText}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>

              <View style={styles.spacer} />

              <Pressable style={styles.controlButton}>
                <Icon name="expand" size={20} color="#FFF" />
              </Pressable>
            </View>

            <View 
              style={styles.progressBarContainer}
              onLayout={onProgressBarLayout}
              {...panResponder.panHandlers}
            >
              <View style={styles.progressBarBackground} />
              <View style={[styles.progressBarFill, { width: `${displayPercent}%` }]} />
              <View style={[styles.progressThumb, { left: `${displayPercent}%` }]} />
            </View>
          </View>
        )}
      </Pressable>
    </View>
  );
};

export default React.memo(VideoPlayer);
