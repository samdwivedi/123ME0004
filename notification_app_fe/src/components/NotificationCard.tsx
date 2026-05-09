/**
 * NotificationCard Component
 * 
 * Displays a single notification with type indicator,
 * viewed status, and interactive actions.
 * Uses glassmorphism design with smooth animations.
 */

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  alpha
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkIcon from '@mui/icons-material/Work';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Notification, NotificationType } from '@/types';

interface NotificationCardProps {
  notification: Notification;
  isViewed: boolean;
  onToggleViewed: (id: string | number) => void;
}

/** Maps notification types to colors and icons */
const typeConfig: Record<NotificationType, { color: string; icon: React.ReactNode; label: string }> = {
  Event: {
    color: '#6C63FF',
    icon: <EventIcon sx={{ fontSize: 18 }} />,
    label: 'Event'
  },
  Result: {
    color: '#00E676',
    icon: <EmojiEventsIcon sx={{ fontSize: 18 }} />,
    label: 'Result'
  },
  Placement: {
    color: '#FFB347',
    icon: <WorkIcon sx={{ fontSize: 18 }} />,
    label: 'Placement'
  }
};

export function NotificationCard({ notification, isViewed, onToggleViewed }: NotificationCardProps) {
  const type = notification.notification_type as NotificationType;
  const config = typeConfig[type] || typeConfig.Event;

  return (
    <Card
      sx={{
        position: 'relative',
        opacity: isViewed ? 0.75 : 1,
        borderLeft: `4px solid ${config.color}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          opacity: 1,
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 32px ${alpha(config.color, 0.2)}`
        }
      }}
    >
      {/* Unviewed indicator dot */}
      {!isViewed && (
        <FiberManualRecordIcon
          sx={{
            position: 'absolute',
            top: 12,
            right: 48,
            fontSize: 12,
            color: '#00D9FF',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { opacity: 1 },
              '50%': { opacity: 0.4 },
              '100%': { opacity: 1 }
            }
          }}
        />
      )}

      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
          <Box flex={1} minWidth={0}>
            {/* Notification type chip */}
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Chip
                icon={config.icon as React.ReactElement}
                label={config.label}
                size="small"
                sx={{
                  backgroundColor: alpha(config.color, 0.15),
                  color: config.color,
                  fontWeight: 600,
                  '& .MuiChip-icon': { color: config.color }
                }}
              />
              {notification.priority && (
                <Chip
                  label={notification.priority}
                  size="small"
                  color={notification.priority === 'high' ? 'error' : 'default'}
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              )}
              {notification.timestamp && (
                <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                  {new Date(notification.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
              )}
            </Box>

            {/* Title */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '1rem',
                mb: 0.5,
                color: isViewed ? 'text.secondary' : 'text.primary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {notification.title}
            </Typography>

            {/* Message */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.6
              }}
            >
              {notification.message}
            </Typography>
          </Box>

          {/* View toggle button */}
          <Tooltip title={isViewed ? 'Mark as unread' : 'Mark as read'}>
            <IconButton
              onClick={() => onToggleViewed(notification.id)}
              sx={{
                color: isViewed ? 'text.secondary' : config.color,
                '&:hover': {
                  backgroundColor: alpha(config.color, 0.1)
                }
              }}
            >
              {isViewed ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}
