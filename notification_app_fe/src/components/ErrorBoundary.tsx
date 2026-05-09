'use client';

import React, { Component, ReactNode } from 'react';
import { Box, Typography, Button, alpha } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import BugReportIcon from '@mui/icons-material/BugReport';
import { Log } from '@/lib/logger';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    Log('frontend', 'error', 'component',
      `ErrorBoundary caught: ${error.message} | ${errorInfo.componentStack?.substring(0, 200)}`
    );
  }

  handleReset = (): void => {
    Log('frontend', 'info', 'component', 'ErrorBoundary reset');
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, px: 3, textAlign: 'center' }}>
          <Box sx={{ width: 100, height: 100, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: alpha('#FF4C6A', 0.1), mb: 3 }}>
            <BugReportIcon sx={{ fontSize: 48, color: '#FF4C6A' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Something went wrong</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, maxWidth: 400 }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </Typography>
          <Button variant="contained" startIcon={<RefreshIcon />} onClick={this.handleReset}
            sx={{ backgroundColor: '#6C63FF', '&:hover': { backgroundColor: '#5A52E0' } }}>
            Try Again
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}
