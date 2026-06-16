/**
 * FeedContext — Context Provider for Feed section APIs
 * Manages active tab, loading, error, post lists, likes, and bookmarks
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import feedService from '../api/services/feedService';

const FeedContext = createContext(null);

export const FeedProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('trending');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFeed = useCallback(async (tab) => {
    setLoading(true);
    setError(null);
    try {
      const response = await feedService.getFeed(tab);
      setPosts(response.data);
    } catch (err) {
      setError(err?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch feed on active tab change
  useEffect(() => {
    fetchFeed(activeTab);
  }, [activeTab, fetchFeed]);

  // Handle post liking/unliking via API and context update
  const likePost = useCallback(async (postId) => {
    // Optimistic UI update
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const nextLiked = !post.liked;
        return {
          ...post,
          liked: nextLiked,
          likes: nextLiked ? post.likes + 1 : Math.max(0, post.likes - 1),
        };
      }
      return post;
    }));

    try {
      await feedService.likePost(postId);
    } catch (err) {
      // Revert state on failure
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const prevLiked = !post.liked;
          return {
            ...post,
            liked: prevLiked,
            likes: prevLiked ? post.likes + 1 : Math.max(0, post.likes - 1),
          };
        }
        return post;
      }));
    }
  }, []);

  // Handle post saving/unsaving via API and context update
  const savePost = useCallback(async (postId) => {
    // Optimistic UI update
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          saved: !post.saved,
        };
      }
      return post;
    }));

    try {
      await feedService.savePost(postId);
    } catch (err) {
      // Revert state on failure
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            saved: !post.saved,
          };
        }
        return post;
      }));
    }
  }, []);

  const refreshFeed = useCallback(() => {
    fetchFeed(activeTab);
  }, [activeTab, fetchFeed]);

  return (
    <FeedContext.Provider
      value={{
        posts,
        activeTab,
        setActiveTab,
        loading,
        error,
        likePost,
        savePost,
        refreshFeed,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
};

export default FeedContext;
