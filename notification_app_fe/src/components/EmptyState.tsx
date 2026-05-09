/**
 * EmptyState Component
 * 
 * Displays a visually appealing empty state when no
 * notifications are available. Includes animated icon
 * and contextual messaging.
 */

'use client';

import React from 'react';
import { Box, Typography, Button, alpha } from '@mui/material';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import RefreshIcon from '@mui/icons-material/Refresh';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function EmptyState({
  title = 'No Notifications',
  description = 'There are no notifications to display at the moment. Check back later!',
  onRetry
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 3,
        textAlign: 'center',
        animation: 'fadeIn 0.5s ease-in-out',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      }}
    >
      {/* Animated empty icon */}
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: alpha('#6C63FF', 0.08),
          mb: 3,
          animation: 'float 3s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' }
          }
        }}
      >
        <NotificationsOffIcon sx={{ fontSize: 56, color: alpha('#6C63FF', 0.4) }} />
      </Box>

      <Typography
        variant="h5"
        sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}
      >
        {title}
      </Typography>

      <Typography
        variant="body1"
        sx={{ color: 'text.secondary', maxWidth: 400, mb: 3 }}
      >
        {description}
      </Typography>

      {onRetry && (
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
          sx={{
            borderColor: alpha('#6C63FF', 0.4),
            color: '#6C63FF',
            '&:hover': {
              borderColor: '#6C63FF',
              backgroundColor: alpha('#6C63FF', 0.08)
            }
          }}
        >
          Retry
        </Button>
      )}
    </Box>
  );
}
