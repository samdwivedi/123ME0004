/**
 * ErrorDisplay Component
 * 
 * Displays error states with retry functionality.
 * Shows contextual error messages and optional retry button.
 */

'use client';

import React from 'react';
import { Box, Typography, Button, alpha } from '@mui/material';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Log } from '@/lib/logger';

interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorDisplay({
  message = 'Something went wrong. Please try again.',
  onRetry
}: ErrorDisplayProps) {
  const handleRetry = () => {
    Log('frontend', 'info', 'component', 'User clicked retry button');
    onRetry?.();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={8}
      px={3}
      sx={{
        textAlign: 'center',
        animation: 'shake 0.5s ease-in-out',
        '@keyframes shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' }
        }
      }}
    >
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: alpha('#FF4C6A', 0.08),
          mb: 3
        }}
      >
        <ErrorOutlinedIcon sx={{ fontSize: 56, color: '#FF4C6A' }} />
      </Box>

      <Typography variant="h5" fontWeight={700} color="text.primary" mb={1}>
        Oops! Something went wrong
      </Typography>

      <Typography variant="body1" color="text.secondary" maxWidth={400} mb={3}>
        {message}
      </Typography>

      {onRetry && (
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRetry}
          sx={{
            backgroundColor: '#FF4C6A',
            '&:hover': {
              backgroundColor: '#CC3A55'
            }
          }}
        >
          Try Again
        </Button>
      )}
    </Box>
  );
}
