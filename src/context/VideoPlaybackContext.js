import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const VideoPlaybackContext = createContext(null);

export const VideoPlaybackProvider = ({ children }) => {
  const [playingVideoId, setPlayingVideoId] = useState(null);

  const playVideo = useCallback((id) => {
    setPlayingVideoId(id);
  }, []);

  const pauseVideo = useCallback(() => {
    setPlayingVideoId(null);
  }, []);

  const value = useMemo(
    () => ({
      playingVideoId,
      playVideo,
      pauseVideo,
    }),
    [playingVideoId, playVideo, pauseVideo],
  );

  return (
    <VideoPlaybackContext.Provider value={value}>
      {children}
    </VideoPlaybackContext.Provider>
  );
};

export const useVideoPlayback = () => {
  const context = useContext(VideoPlaybackContext);
  if (!context) {
    throw new Error('useVideoPlayback must be used within a VideoPlaybackProvider');
  }
  return context;
};

export default VideoPlaybackContext;
