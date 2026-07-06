import { StyleSheet } from 'react-native';

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: '#000',
      position: 'relative',
    },
    video: {
      flex: 1,
      width: '100%',
    },
    thumbnail: {
      flex: 1,
      width: '100%',
    },
    controlsOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2,
    },
    mediaFill: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    spinnerOverlay: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(0,0,0,0.6)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    playIconCentered: {
      marginLeft: 4,
    },
    initialPlayOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    playIconCircle: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    bottomBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 16,
      zIndex: 3,
    },
    controlRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    controlButton: {
      padding: 4,
    },
    timeText: {
      color: '#FFF',
      fontSize: 13,
      fontVariant: ['tabular-nums'],
      marginLeft: 12,
    },
    spacer: {
      flex: 1,
    },
    progressBarContainer: {
      height: 20,
      justifyContent: 'center',
    },
    progressBarBackground: {
      height: 4,
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: 2,
      width: '100%',
    },
    progressBarFill: {
      height: 4,
      backgroundColor: theme.colors.primary,
      borderRadius: 2,
      position: 'absolute',
      left: 0,
      top: 0,
    },
    progressThumb: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#FFF',
      position: 'absolute',
      top: -4,
      transform: [{ translateX: -6 }],
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
    },
    durationBadgeContainer: {
      position: 'absolute',
      bottom: 8,
      right: 8,
      backgroundColor: 'rgba(0,0,0,0.65)',
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 2,
      zIndex: 2,
    },
    durationBadgeText: {
      color: '#FFF',
      fontSize: 12,
    },
    hidden: {
      opacity: 0,
    },
  });

export default createStyles;
