/**
 * NotificationFilter Component
 * 
 * Filter bar with debounced notification type selection.
 * Uses Material UI Select and Chip components for a clean UX.
 */

'use client';

import React, { useCallback } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  SelectChangeEvent,
  alpha
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import EventIcon from '@mui/icons-material/Event';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkIcon from '@mui/icons-material/Work';
import { NotificationType } from '@/types';
import { Log } from '@/lib/logger';

interface NotificationFilterProps {
  selectedType: NotificationType | '';
  onTypeChange: (type: NotificationType | '') => void;
}

const filterOptions: { value: NotificationType | ''; label: string; icon: React.ReactNode; color: string }[] = [
  { value: '', label: 'All Types', icon: <FilterListIcon />, color: '#94A3B8' },
  { value: 'Event', label: 'Events', icon: <EventIcon />, color: '#6C63FF' },
  { value: 'Result', label: 'Results', icon: <EmojiEventsIcon />, color: '#00E676' },
  { value: 'Placement', label: 'Placements', icon: <WorkIcon />, color: '#FFB347' }
];

export function NotificationFilter({ selectedType, onTypeChange }: NotificationFilterProps) {
  const handleChange = useCallback((event: SelectChangeEvent<string>) => {
    const value = event.target.value as NotificationType | '';
    Log('frontend', 'info', 'component', `Filter changed to: ${value || 'All'}`);
    onTypeChange(value);
  }, [onTypeChange]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      {/* Quick filter chips */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {filterOptions.map((option) => (
          <Chip
            key={option.value || 'all'}
            label={option.label}
            icon={option.icon as React.ReactElement}
            onClick={() => {
              Log('frontend', 'info', 'component', `Quick filter: ${option.label}`);
              onTypeChange(option.value);
            }}
            sx={{
              cursor: 'pointer',
              backgroundColor: selectedType === option.value
                ? alpha(option.color, 0.2)
                : 'transparent',
              color: selectedType === option.value
                ? option.color
                : 'text.secondary',
              border: `1px solid ${selectedType === option.value
                ? alpha(option.color, 0.5)
                : 'rgba(148, 163, 184, 0.15)'}`,
              fontWeight: selectedType === option.value ? 700 : 500,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: alpha(option.color, 0.15),
                borderColor: alpha(option.color, 0.4)
              },
              '& .MuiChip-icon': {
                color: selectedType === option.value ? option.color : 'text.secondary'
              }
            }}
          />
        ))}
      </Box>

      {/* Dropdown select for mobile */}
      <FormControl
        size="small"
        sx={{
          minWidth: 160,
          display: { xs: 'flex', sm: 'none' },
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '& fieldset': {
              borderColor: 'rgba(148, 163, 184, 0.15)'
            }
          }
        }}
      >
        <InputLabel>Filter Type</InputLabel>
        <Select
          value={selectedType}
          label="Filter Type"
          onChange={handleChange}
        >
          {filterOptions.map((option) => (
            <MenuItem key={option.value || 'all'} value={option.value}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {option.icon}
                {option.label}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
