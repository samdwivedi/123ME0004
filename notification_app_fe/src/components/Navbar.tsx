'use client';

import React from 'react';
import {
  AppBar, Toolbar, Typography, Box, IconButton, Drawer, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Badge, alpha, useMediaQuery, useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DRAWER_WIDTH = 260;

const navItems = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Priority', path: '/priority', icon: <PriorityHighIcon /> },
];

interface NavbarProps { unviewedCount?: number; }

export function Navbar({ unviewedCount = 0 }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();

  const drawerContent = (
    <Box sx={{ pt: 2 }}>
      <Box px={3} pb={3} display="flex" alignItems="center" gap={1.5}>
        <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'linear-gradient(135deg, #6C63FF 0%, #00D9FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <NotificationsIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Typography variant="h6" fontWeight={800} sx={{ background: 'linear-gradient(135deg, #6C63FF, #00D9FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          NotifyHub
        </Typography>
      </Box>
      <List sx={{ px: 1.5 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton component={Link} href={item.path} onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2, py: 1.2,
                  backgroundColor: isActive ? alpha('#6C63FF', 0.15) : 'transparent',
                  color: isActive ? '#6C63FF' : 'text.secondary',
                  '&:hover': { backgroundColor: alpha('#6C63FF', 0.08) }
                }}>
                <ListItemIcon sx={{ color: isActive ? '#6C63FF' : 'text.secondary', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: '0.9rem' }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" elevation={0} sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Badge badgeContent={unviewedCount} color="error" max={99}>
            <NotificationsIcon sx={{ color: 'text.secondary' }} />
          </Badge>
        </Toolbar>
      </AppBar>

      {/* Desktop drawer */}
      <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, width: DRAWER_WIDTH, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', mt: '64px' } }}>
        {drawerContent}
      </Drawer>

      {/* Mobile drawer */}
      <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}
        ModalProps={{ keepMounted: true }}>
        {drawerContent}
      </Drawer>
    </>
  );
}

export { DRAWER_WIDTH };
