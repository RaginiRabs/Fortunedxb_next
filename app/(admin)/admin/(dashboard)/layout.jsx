'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  CircularProgress,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { MenuOutlined } from '@mui/icons-material';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';

const DRAWER_WIDTH = 250;

// Page titles config
const PAGE_CONFIG = {
  '/admin/dashboard': {
    title: 'Dashboard',
    subtitle: 'Welcome back! Here\'s what\'s happening.',
  },
  '/admin/developers': {
    title: 'Developers',
    subtitle: 'Manage property developers',
  },
  '/admin/developers/add': {
    title: 'Add Developer',
    subtitle: 'Create a new developer profile',
  },
  '/admin/projects': {
    title: 'Projects',
    subtitle: 'Manage property projects',
  },
  '/admin/projects/add': {
    title: 'Add Project',
    subtitle: 'Create a new project listing',
  },
  '/admin/offers': {
    title: 'Offers',
    subtitle: 'Manage special offers and promotions',
  },
  '/admin/offers/add': {
    title: 'Add Offer',
    subtitle: 'Create a new offer',
  },
  '/admin/leads': {
    title: 'Leads',
    subtitle: 'View and manage customer inquiries',
  },
  '/admin/users': {
    title: 'Users',
    subtitle: 'Manage admin users',
  },
};

// Get page config based on pathname
function getPageConfig(pathname) {
  if (PAGE_CONFIG[pathname]) {
    return PAGE_CONFIG[pathname];
  }

  // Dynamic routes
  if (pathname.match(/^\/admin\/developers\/\d+$/)) {
    return { title: 'Edit Developer', subtitle: 'Update developer details' };
  }
  if (pathname.match(/^\/admin\/projects\/\d+$/)) {
    return { title: 'Edit Project', subtitle: 'Update project details' };
  }
  if (pathname.match(/^\/admin\/offers\/\d+$/)) {
    return { title: 'Edit Offer', subtitle: 'Update offer details' };
  }

  return { title: 'Admin', subtitle: '' };
}

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageConfig = getPageConfig(pathname);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch('/api/auth/verify');
        const data = await res.json();

        if (!data.valid) {
          router.replace('/admin/login');
          return;
        }

        setUser(data.user);
        setLoading(false);
      } catch (error) {
        console.error('Session verification failed:', error);
        router.replace('/admin/login');
      }
    };

    verifySession();
  }, [router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#0B1A2F',
        }}
      >
        <CircularProgress sx={{ color: '#C6A962' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile App Bar */}
      <AppBar
        position="fixed"
        sx={{
          display: { xs: 'block', lg: 'none' },
          bgcolor: 'secondary.main',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuOutlined />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              color: 'primary.main',
              fontWeight: 700,
            }}
          >
            Fortune DXB
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Sidebar
        user={user}
        mobileOpen={mobileOpen}
        onClose={handleDrawerToggle}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'grey.50',
          minHeight: '100vh',
          overflow: 'auto',
          width: '100%',
          ml: { lg: `${DRAWER_WIDTH}px` },
          pt: { xs: '64px', lg: 0 },
        }}
      >
        {/* Header */}
        <Header 
          title={pageConfig.title} 
          subtitle={pageConfig.subtitle}
          user={user}
        />

        {/* Page Content */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}