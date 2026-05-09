/**
 * useNotifications Hook
 * 
 * Custom hook for fetching and managing notification data.
 * Uses React Query for caching, automatic refetching,
 * and optimistic UI updates.
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '@/api';
import { Log } from '@/lib/logger';
import { NotificationParams } from '@/types';

/** Query key factory for notifications */
export const notificationKeys = {
  all: ['notifications'] as const,
  list: (params: NotificationParams) => [...notificationKeys.all, params] as const,
};

/**
 * Fetches notifications with pagination and filtering.
 * Integrates logging for all lifecycle events.
 * 
 * @param params - Query parameters for the notification API
 * @returns React Query result with notification data
 */
export function useNotifications(params: NotificationParams = {}) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: async () => {
      Log('frontend', 'info', 'hook', `useNotifications: Fetching with params ${JSON.stringify(params)}`);
      
      try {
        const response = await getNotifications(params);
        Log('frontend', 'info', 'hook', `useNotifications: Successfully fetched notifications`);
        return response;
      } catch (error) {
        Log('frontend', 'error', 'hook', `useNotifications: Failed to fetch - ${(error as Error).message}`);
        throw error;
      }
    },
    staleTime: 30000,       // Data stays fresh for 30 seconds
    refetchOnWindowFocus: true,
    retry: 2,               // Retry failed requests twice
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
