/**
 * SavedPostsContext — Context provider for the Saved Posts screen.
 *
 * Responsibilities:
 *  • Seeds state from savedPostsMockData (swap fetchSavedPosts for a real API call later)
 *  • Tracks activeTab and exposes filteredPosts derived from it
 *  • Exposes likePost and removePost for optimistic UI updates
 *  • Future-ready: fetchSavedPosts is a no-op stub; replace with an API call when ready
 */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { savedPostsMockData } from '../constants/mockData';

// ── Context ───────────────────────────────────────────────────────────────────

const SavedPostsContext = createContext(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export const SavedPostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Data fetching stub — replace body with a real API call when ready ──────
  const fetchSavedPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: replace with real API: const response = await savedPostsService.getSavedPosts();
      // Simulating async load with mock data
      await Promise.resolve();
      setPosts(savedPostsMockData);
    } catch (err) {
      setError(err?.message || 'Failed to fetch saved posts');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    fetchSavedPosts();
  }, [fetchSavedPosts]);

  // ── Filtered posts derived from activeTab ─────────────────────────────────
  const filteredPosts = useMemo(() => {
    switch (activeTab) {
      case 'Text':
        return posts.filter(p => p.type === 'text');
      case 'Photos':
        return posts.filter(p => p.type === 'photo');
      case 'Videos':
        return posts.filter(p => p.type === 'video');
      case 'Groups':
        return posts.filter(p => p.type === 'group');
      case 'All':
      default:
        return posts;
    }
  }, [posts, activeTab]);

  // ── Like / unlike (optimistic) ────────────────────────────────────────────
  const likePost = useCallback(async (postId) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id !== postId) return post;
        const nextLiked = !post.liked;
        return {
          ...post,
          liked: nextLiked,
          likes: nextLiked ? post.likes + 1 : Math.max(0, post.likes - 1),
        };
      }),
    );
    // TODO: await savedPostsService.likePost(postId);
  }, []);

  // ── Remove from saved list ────────────────────────────────────────────────
  const removePost = useCallback(async (postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
    // TODO: await savedPostsService.unsavePost(postId);
  }, []);

  // ── Refresh ───────────────────────────────────────────────────────────────
  const refresh = useCallback(() => {
    fetchSavedPosts();
  }, [fetchSavedPosts]);

  return (
    <SavedPostsContext.Provider
      value={{
        posts,
        filteredPosts,
        activeTab,
        setActiveTab,
        loading,
        error,
        likePost,
        removePost,
        refresh,
      }}
    >
      {children}
    </SavedPostsContext.Provider>
  );
};

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useSavedPosts = () => {
  const context = useContext(SavedPostsContext);
  if (!context) {
    throw new Error('useSavedPosts must be used within a SavedPostsProvider');
  }
  return context;
};

export default SavedPostsContext;
