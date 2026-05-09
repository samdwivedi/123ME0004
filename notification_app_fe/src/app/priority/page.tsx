'use client';

import React, { useEffect, useMemo } from 'react';
import { Box, Typography, Stack, Chip, alpha } from '@mui/material';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import {
  Navbar, DRAWER_WIDTH, NotificationCard, NotificationSkeleton,
  EmptyState, ErrorDisplay, ErrorBoundary
} from '@/components';
import { useNotifications, useViewedState } from '@/hooks';
import { Notification } from '@/types';
import { Log } from '@/lib/logger';

export default function PriorityPage() {
  const { viewedState, toggleViewed, getUnviewedCount } = useViewedState();
  const { data, isLoading, isError, error, refetch } = useNotifications({ limit: 50 });

  useEffect(() => {
    Log('frontend', 'info', 'page', 'Priority notifications page loaded');
  }, []);

  // Filter for high priority notifications
  const priorityNotifications: Notification[] = useMemo(() => {
    if (!data?.data) return [];
    const all: Notification[] = Array.isArray(data.data) ? data.data : (data.data.notifications || []);
    return all.filter((n: Notification) =>
      n.priority === 'high' || n.priority === 'urgent' || n.priority === 'critical'
    );
  }, [data]);

  const allIds = priorityNotifications.map((n) => n.id);
  const unviewedCount = getUnviewedCount(allIds);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar unviewedCount={unviewedCount} />
      <Box component="main" sx={{ flexGrow: 1, ml: { xs: 0, md: `${DRAWER_WIDTH}px` }, mt: '64px', p: { xs: 2, sm: 3, md: 4 }, maxWidth: 900 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Box sx={{ width: 48, height: 48, borderRadius: 2, background: 'linear-gradient(135deg, #FF4C6A 0%, #FFB347 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PriorityHighIcon sx={{ color: '#fff', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h3" fontWeight={800} sx={{ background: 'linear-gradient(135deg, #FF4C6A, #FFB347)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Priority
            </Typography>
            <Typography variant="body2" color="text.secondary">
              High priority notifications that need your attention
            </Typography>
          </Box>
          {priorityNotifications.length > 0 && (
            <Chip label={`${priorityNotifications.length} items`} size="small"
              sx={{ ml: 'auto', backgroundColor: alpha('#FF4C6A', 0.15), color: '#FF4C6A', fontWeight: 700 }} />
          )}
        </Box>

        {/* Content */}
        <ErrorBoundary>
          <Stack spacing={2}>
            {isLoading ? (
              <NotificationSkeleton count={3} />
            ) : isError ? (
              <ErrorDisplay message={(error as Error)?.message} onRetry={() => refetch()} />
            ) : priorityNotifications.length === 0 ? (
              <EmptyState
                title="No Priority Notifications"
                description="You're all caught up! No high-priority notifications at the moment."
                onRetry={() => refetch()}
              />
            ) : (
              priorityNotifications.map((notification, index) => (
                <Box key={notification.id ?? index} sx={{ animation: `slideIn 0.3s ease-out ${index * 0.05}s both`, '@keyframes slideIn': { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
                  <NotificationCard
                    notification={notification}
                    isViewed={viewedState[String(notification.id)] === true}
                    onToggleViewed={toggleViewed}
                  />
                </Box>
              ))
            )}
          </Stack>
        </ErrorBoundary>
      </Box>
    </Box>
  );
}
