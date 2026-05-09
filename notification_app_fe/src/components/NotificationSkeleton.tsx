/**
 * NotificationSkeleton Component
 * 
 * Loading skeleton that mimics the NotificationCard layout.
 * Provides visual feedback while notifications are being fetched.
 */

'use client';

import React from 'react';
import { Card, CardContent, Skeleton, Box } from '@mui/material';

interface NotificationSkeletonProps {
  count?: number;
}

export function NotificationSkeleton({ count = 5 }: NotificationSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          sx={{
            borderLeft: '4px solid rgba(148, 163, 184, 0.15)',
            animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s both`,
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(10px)' },
              to: { opacity: 1, transform: 'translateY(0)' }
            }
          }}
        >
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
              <Box flex={1}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Skeleton variant="rounded" width={80} height={24} />
                  <Skeleton variant="rounded" width={50} height={24} />
                </Box>
                <Skeleton variant="text" width="70%" height={28} sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="60%" height={20} />
              </Box>
              <Skeleton variant="circular" width={40} height={40} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
