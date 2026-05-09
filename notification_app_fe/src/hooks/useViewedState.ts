/**
 * useViewedState Hook
 * 
 * Manages persistent viewed/unviewed state for notifications.
 * Uses localStorage for persistence across browser sessions.
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { Log } from '@/lib/logger';
import { ViewedState } from '@/types';

const STORAGE_KEY = 'notification_viewed_state';

/**
 * Loads viewed state from localStorage.
 * Returns empty object if no state exists or parsing fails.
 */
function loadViewedState(): ViewedState {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    Log('frontend', 'warn', 'state', `Failed to load viewed state from localStorage: ${(error as Error).message}`);
  }
  return {};
}

/**
 * Persists viewed state to localStorage.
 */
function saveViewedState(state: ViewedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    Log('frontend', 'error', 'state', `Failed to save viewed state: ${(error as Error).message}`);
  }
}

/**
 * Custom hook for managing notification viewed state.
 * Provides functions to mark notifications as viewed/unviewed
 * and check their current state.
 * 
 * @returns Object with viewed state and manipulation functions
 */
export function useViewedState() {
  const [viewedState, setViewedState] = useState<ViewedState>({});

  // Load initial state from localStorage on mount
  useEffect(() => {
    const initial = loadViewedState();
    setViewedState(initial);
    Log('frontend', 'info', 'state', `Loaded viewed state: ${Object.keys(initial).length} notifications tracked`);
  }, []);

  /** Mark a notification as viewed */
  const markAsViewed = useCallback((notificationId: string | number) => {
    const id = String(notificationId);
    setViewedState(prev => {
      const next = { ...prev, [id]: true };
      saveViewedState(next);
      Log('frontend', 'info', 'state', `Notification ${id} marked as viewed`);
      return next;
    });
  }, []);

  /** Mark a notification as unviewed */
  const markAsUnviewed = useCallback((notificationId: string | number) => {
    const id = String(notificationId);
    setViewedState(prev => {
      const next = { ...prev };
      delete next[id];
      saveViewedState(next);
      Log('frontend', 'info', 'state', `Notification ${id} marked as unviewed`);
      return next;
    });
  }, []);

  /** Toggle the viewed state of a notification */
  const toggleViewed = useCallback((notificationId: string | number) => {
    const id = String(notificationId);
    setViewedState(prev => {
      const isCurrentlyViewed = prev[id];
      const next = { ...prev };
      if (isCurrentlyViewed) {
        delete next[id];
      } else {
        next[id] = true;
      }
      saveViewedState(next);
      Log('frontend', 'info', 'state', `Notification ${id} toggled to ${!isCurrentlyViewed ? 'viewed' : 'unviewed'}`);
      return next;
    });
  }, []);

  /** Check if a notification has been viewed */
  const isViewed = useCallback((notificationId: string | number): boolean => {
    return viewedState[String(notificationId)] === true;
  }, [viewedState]);

  /** Get count of unviewed notifications */
  const getUnviewedCount = useCallback((notificationIds: (string | number)[]): number => {
    return notificationIds.filter(id => !viewedState[String(id)]).length;
  }, [viewedState]);

  return {
    viewedState,
    markAsViewed,
    markAsUnviewed,
    toggleViewed,
    isViewed,
    getUnviewedCount
  };
}
