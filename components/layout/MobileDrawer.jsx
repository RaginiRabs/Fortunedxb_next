'use client';
import { useRouter } from 'next/navigation';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Divider,
} from '@mui/material';
import {
  X,
  ChevronRight,
  Phone,
  Home,
  Building2,
  Users,
  MapPin,
  BookOpen,
  Info,
  Mail,
} from 'lucide-react';

const menuItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Projects', href: '/projects', icon: Building2 },
  { label: 'Developers', href: '/developers', icon: Users },
  { label: 'Areas', href: '/areas', icon: MapPin },
  { label: 'Investment Guide', href: '/investment-guide', icon: BookOpen },
  { label: 'About', href: '/about', icon: Info },
  { label: 'Contact', href: '/contact', icon: Mail },
];

const MobileDrawer = ({ open, onClose }) => {
  const router = useRouter();

  const handleNavigation = (href) => {
    router.push(href);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: 280, sm: 320 }, // Fixed width, not full screen
          maxWidth: '85%',
          p: 2,
          bgcolor: '#FAFAFA',
          borderRadius: 1, // No border radius
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          pb: 2,
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              fontSize: '1.2rem',
              color: '#0B1A2A',
            }}
          >
            FORTUNE
            <Box
              component="span"
              sx={{
                color: '#C6A962',
                fontFamily: '"Quicksand", sans-serif',
                fontWeight: 600,
                fontSize: '0.75rem',
                ml: 1,
                letterSpacing: 2,
              }}
            >
              DXB
            </Box>
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            bgcolor: 'rgba(0,0,0,0.05)',
            borderRadius: 1,
            '&:hover': {
              bgcolor: 'rgba(198, 169, 98, 0.1)',
            },
          }}
        >
          <X size={20} color="#0B1A2A" />
        </IconButton>
      </Box>

      {/* Menu Items */}
      <List sx={{ flex: 1, py: 0 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.25 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.href)}
                sx={{
                  borderRadius: 1,
                  py: 1.25,
                  px: 1.5,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(198, 169, 98, 0.1)',
                    '& .menu-icon': {
                      color: '#C6A962',
                    },
                    '& .menu-arrow': {
                      transform: 'translateX(4px)',
                      color: '#C6A962',
                    },
                  },
                }}
              >
                <Icon
                  size={18}
                  className="menu-icon"
                  style={{
                    marginRight: 10,
                    color: '#64748B',
                    transition: 'color 0.3s ease',
                  }}
                />
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontFamily: '"Quicksand", sans-serif',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: '#0B1A2A',
                  }}
                />
                <ChevronRight
                  size={16}
                  className="menu-arrow"
                  style={{
                    color: '#94A3B8',
                    transition: 'all 0.3s ease',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ my: 1.5 }} />

      {/* CTA Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button
          fullWidth
          variant="contained"
          component="a"
          href="tel:+971588529900"
          sx={{
            background: 'linear-gradient(135deg, #C6A962 0%, #A68B4B 100%)',
            color: '#FFFFFF',
            py: 1.25,
            borderRadius: 1,
            fontFamily: '"Quicksand", sans-serif',
            fontWeight: 600,
            fontSize: '0.85rem',
            boxShadow: '0 4px 15px rgba(198, 169, 98, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #D4BC7D 0%, #C6A962 100%)',
            },
          }}
          startIcon={<Phone size={16} />}
        >
          Call Now
        </Button>

        <Button
          fullWidth
          variant="outlined"
          component="a"
          href="https://api.whatsapp.com/send?phone=+971588529900&text=Hello,%20I%20Am%20Interested%20In%20Dubai%20Properties"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            borderColor: '#25D366',
            color: '#25D366',
            py: 1.25,
            borderRadius: 1,
            fontFamily: '"Quicksand", sans-serif',
            fontWeight: 600,
            fontSize: '0.85rem',
            '&:hover': {
              borderColor: '#25D366',
              bgcolor: 'rgba(37, 211, 102, 0.08)',
            },
          }}
        >
          WhatsApp Us
        </Button>
      </Box>

      {/* Contact Info */}
      <Box
        sx={{
          mt: 2,
          p: 1.5,
          bgcolor: 'rgba(11, 26, 42, 0.03)',
          borderRadius: 1,
        }}
      >
        <Typography
          sx={{
            color: '#64748B',
            fontSize: '0.7rem',
            fontFamily: '"Quicksand", sans-serif',
            textAlign: 'center',
          }}
        >
          📍 Business Bay, Dubai, UAE
        </Typography>
        <Typography
          sx={{
            color: '#64748B',
            fontSize: '0.7rem',
            fontFamily: '"Quicksand", sans-serif',
            textAlign: 'center',
            mt: 0.5,
          }}
        >
          ✉️ info@fortunedxb.com
        </Typography>
      </Box>
    </Drawer>
  );
};

export default MobileDrawer;