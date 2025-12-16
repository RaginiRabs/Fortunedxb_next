'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Button,
  IconButton,
  Badge,
  Tooltip,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Phone,
  Heart,
  Menu as MenuIcon,
} from 'lucide-react';
import MobileDrawer from './MobileDrawer';
import fortuneLogo from '../../asset/logo.png'; 

const Navbar = ({ savedProperties = [] }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuLinks = [
    { label: 'Projects', href: '/projects' },
    { label: 'Developers', href: '/developers' },
    { label: 'Areas', href: '/areas' },
    { label: 'Investment Guide', href: '/investment-guide' },
    { label: 'About', href: '/about' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={isScrolled ? 4 : 0}
        sx={{
          bgcolor: isScrolled ? 'rgba(255,255,255,0.98)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          transition: 'all 0.3s ease',
          borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.08)' : 'none',
          borderRadius: 0,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 1, px: { xs: 0, md: 2 } }}>

            {/* Logo */}
            <Box
              component={Link}
              href="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              <Box
                sx={{
                  width: { xs: 100, md: 120 },
                  height: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src={fortuneLogo}
                  alt="Fortune DXB Logo"
                  width={120}
                  height={40}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                  }}
                  priority
                />
              </Box>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {menuLinks.map((item) => (
                  <Button
                    key={item.label}
                    component={Link}
                    href={item.href}
                    sx={{
                      color: isScrolled ? 'secondary.main' : 'white',
                      fontWeight: 500,
                      fontFamily: '"Quicksand", sans-serif',
                      px: 2,
                      borderRadius: 0,
                      '&:hover': {
                        bgcolor: isScrolled
                          ? 'rgba(198, 169, 98, 0.1)'
                          : 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}

                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ mx: 1, borderColor: isScrolled ? 'divider' : 'rgba(255,255,255,0.2)' }}
                />

                <Tooltip title="Saved Properties">
                  <IconButton
                    component={Link}
                    href="/saved-properties"
                    sx={{ color: isScrolled ? 'secondary.main' : 'white' }}
                  >
                    <Badge badgeContent={savedProperties.length} color="primary">
                      <Heart size={20} />
                    </Badge>
                  </IconButton>
                </Tooltip>

                <Button
                  variant="contained"
                  component={Link}
                  href="/contact"
                  sx={{
                    background: 'linear-gradient(135deg, #C6A962 0%, #A68B4B 100%)',
                    color: '#FFFFFF',
                    px: 3,
                    ml: 1,
                    fontFamily: '"Quicksand", sans-serif',
                    fontWeight: 600,
                    borderRadius: 1,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #D4BC7D 0%, #C6A962 100%)',
                    },
                  }}
                  startIcon={<Phone size={18} />}
                >
                  Contact Us
                </Button>
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                sx={{ color: isScrolled ? 'secondary.main' : 'white' }}
              >
                <MenuIcon size={24} />
              </IconButton>
            )}

          </Toolbar>
        </Container>
      </AppBar>

      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};

export default Navbar;