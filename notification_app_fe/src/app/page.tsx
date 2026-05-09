'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  Box, Typography, Pagination, Stack, Chip, alpha, Tooltip, IconButton
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useSnackbar } from 'notistack';
import {
  Navbar, DRAWER_WIDTH, NotificationCard, NotificationFilter,
  NotificationSkeleton, EmptyState, ErrorDisplay, ErrorBoundary
} from '@/components';
import { useNotifications, useViewedState } from '@/hooks';
import { NotificationType, Notification } from '@/types';
import { Log } from '@/lib/logger';

export default function DashboardPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filterType, setFilterType] = useState<NotificationType | ''>('');
  const { enqueueSnackbar } = useSnackbar();
  const { viewedState, toggleViewed, getUnviewedCount } = useViewedState();

  const params = {
    page,
    limit,
    ...(filterType ? { notification_type: filterType } : {})
  };

  const { data, isLoading, isError, error, refetch, isFetching } = useNotifications(params);

  useEffect(() => {
    Log('frontend', 'info', 'page', 'Dashboard page loaded');
  }, []);

  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, value: number) => {
    Log('frontend', 'info', 'page', `Pagination: page changed to ${value}`);
    setPage(value);
  }, []);

  const handleFilterChange = useCallback((type: NotificationType | '') => {
    Log('frontend', 'info', 'page', `Filter changed: ${type || 'All'}`);
    setFilterType(type);
    setPage(1);
  }, []);

  const handleRefresh = useCallback(() => {
    Log('frontend', 'info', 'page', 'Manual refresh triggered');
    refetch();
    enqueueSnackbar('Refreshing notifications...', { variant: 'info' });
  }, [refetch, enqueueSnackbar]);

  // Extract notifications array from response
  const notifications: Notification[] = React.useMemo(() => {
    if (!data?.data) return [];
    if (Array.isArray(data.data)) return data.data;
    if (data.data.notifications && Array.isArray(data.data.notifications)) return data.data.notifications;
    return [];
  }, [data]);

  const totalPages = React.useMemo(() => {
    if (data?.metadata?.total) return Math.ceil(data.metadata.total / limit);
    if (notifications.length < limit) return page;
    return page + 1;
  }, [data, notifications.length, limit, page]);

  const allIds = notifications.map((n: Notification) => n.id);
  const unviewedCount = getUnviewedCount(allIds);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar unviewedCount={unviewedCount} />
      <Box component="main" sx={{ flexGrow: 1, ml: { xs: 0, md: `${DRAWER_WIDTH}px` }, mt: '64px', p: { xs: 2, sm: 3, md: 4 }, maxWidth: 900 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h3" fontWeight={800} sx={{ background: 'linear-gradient(135deg, #F1F5F9, #94A3B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Notifications
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Stay updated with your latest notifications
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            {unviewedCount > 0 && (
              <Chip label={`${unviewedCount} unread`} size="small" sx={{ backgroundColor: alpha('#00D9FF', 0.15), color: '#00D9FF', fontWeight: 700 }} />
            )}
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh} disabled={isFetching}
                sx={{ color: '#6C63FF', animation: isFetching ? 'spin 1s linear infinite' : 'none', '@keyframes spin': { '100%': { transform: 'rotate(360deg)' } } }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Filters */}
        <Box mb={3}>
          <ErrorBoundary>
            <NotificationFilter selectedType={filterType} onTypeChange={handleFilterChange} />
          </ErrorBoundary>
        </Box>

        {/* Content */}
        <ErrorBoundary>
          <Stack spacing={2}>
            {isLoading ? (
              <NotificationSkeleton count={5} />
            ) : isError ? (
              <ErrorDisplay message={(error as Error)?.message || 'Failed to load notifications'} onRetry={() => refetch()} />
            ) : notifications.length === 0 ? (
              <EmptyState
                title={filterType ? `No ${filterType} Notifications` : 'No Notifications'}
                description={filterType ? `There are no ${filterType.toLowerCase()} notifications. Try a different filter.` : 'No notifications available right now.'}
                onRetry={() => refetch()}
              />
            ) : (
              notifications.map((notification: Notification, index: number) => (
                <Box key={notification.id ?? index} sx={{ animation: `slideIn 0.3s ease-out ${index * 0.05}s both`, '@keyframes slideIn': { from: { opacity: 0, transform: 'translateX(-10px)' }, to: { opacity: 1, transform: 'translateX(0)' } } }}>
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

        {/* Pagination */}
        {!isLoading && !isError && notifications.length > 0 && (
          <Box display="flex" justifyContent="center" mt={4} mb={2}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" size="large"
              sx={{ '& .MuiPaginationItem-root': { fontWeight: 600 } }} />
          </Box>
        )}
      </Box>
    </Box>
  );
}
