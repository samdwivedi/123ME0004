/**
 * Material UI Theme Configuration
 * 
 * Defines a premium dark theme with vibrant accent colors,
 * custom typography, and component overrides for a polished UI.
 */

'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';

/** Custom color palette with carefully selected colors */
const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#6C63FF',      // Vibrant purple
      light: '#9D97FF',
      dark: '#4A42D4',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#00D9FF',      // Electric cyan
      light: '#66E8FF',
      dark: '#00A3CC',
      contrastText: '#000000'
    },
    background: {
      default: '#0A0E1A',   // Deep navy
      paper: '#111827'       // Slightly lighter navy
    },
    error: {
      main: '#FF4C6A',      // Vivid coral red
      light: '#FF7A8F',
      dark: '#CC3A55'
    },
    warning: {
      main: '#FFB347',      // Warm amber
      light: '#FFC87A',
      dark: '#CC8F38'
    },
    success: {
      main: '#00E676',      // Bright green
      light: '#66FF99',
      dark: '#00B35E'
    },
    info: {
      main: '#29B6F6',      // Sky blue
      light: '#73D4FF',
      dark: '#0091CC'
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
      disabled: '#475569'
    },
    divider: 'rgba(148, 163, 184, 0.12)'
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      lineHeight: 1.2
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.3
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700,
      letterSpacing: '-0.01em'
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 600
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.7
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#94A3B8'
    },
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#334155 #0A0E1A',
          '&::-webkit-scrollbar': {
            width: '8px'
          },
          '&::-webkit-scrollbar-track': {
            background: '#0A0E1A'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#334155',
            borderRadius: '4px'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(17, 24, 39, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            border: '1px solid rgba(108, 99, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(108, 99, 255, 0.15)',
            transform: 'translateY(-2px)'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.9rem',
          transition: 'all 0.2s ease-in-out'
        },
        contained: {
          boxShadow: '0 4px 14px 0 rgba(108, 99, 255, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px 0 rgba(108, 99, 255, 0.5)',
            transform: 'translateY(-1px)'
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.8rem'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(10, 14, 26, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.08)'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0F1629',
          borderRight: '1px solid rgba(148, 163, 184, 0.08)'
        }
      }
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(148, 163, 184, 0.08)'
        }
      }
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            color: '#94A3B8',
            '&.Mui-selected': {
              backgroundColor: '#6C63FF',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#5A52E0'
              }
            }
          }
        }
      }
    }
  }
};

export const theme = createTheme(themeOptions);
