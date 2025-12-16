'use client';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from 'lucide-react';

const Footer = () => {
  const quickLinks = ['All Projects', 'Hot Selling', 'New Launches', 'Upcoming', 'Developers'];
  const popularAreas = ['Downtown Dubai', 'Palm Jumeirah', 'Dubai Marina', 'Business Bay', 'JVC'];
  const resources = ['Investment Guide', 'ROI Calculator', 'Golden Visa', 'Mortgage Info', 'Market Reports'];

  const socialIcons = [
    { icon: Facebook, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Linkedin, href: '#' },
    { icon: Youtube, href: '#' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: '#0F0F1A',
        color: 'white',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Logo & Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 700,
                    color: '#FFFFFF',
                  }}
                >
                  FORTUNE
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#C6A962',
                    fontWeight: 600,
                    letterSpacing: 2,
                  }}
                >
                  DXB
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.6)',
                mb: 3,
                lineHeight: 1.8,
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
              }}
            >
              Dubai's premier off-plan property portal, connecting global investors
              with exclusive real estate opportunities since 2015.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialIcons.map((social, index) => {
                const Icon = social.icon;
                return (
                  <IconButton
                    key={index}
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.1)',
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: '#C6A962',
                      },
                    }}
                  >
                    <Icon size={18} color="white" />
                  </IconButton>
                );
              })}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: '#C6A962',
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
              }}
            >
              Quick Links
            </Typography>
            {quickLinks.map((link) => (
              <Typography
                key={link}
                component={Link}
                href={`/${link.toLowerCase().replace(' ', '-')}`}
                sx={{
                  display: 'block',
                  color: 'rgba(255,255,255,0.6)',
                  mb: 1.5,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  fontFamily: '"Quicksand", sans-serif',
                  fontStyle: 'italic',
                  fontSize: '0.875rem',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: '#C6A962',
                  },
                }}
              >
                {link}
              </Typography>
            ))}
          </Grid>

          {/* Popular Areas */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: '#C6A962',
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
              }}
            >
              Popular Areas
            </Typography>
            {popularAreas.map((area) => (
              <Typography
                key={area}
                component={Link}
                href={`/areas/${area.toLowerCase().replace(' ', '-')}`}
                sx={{
                  display: 'block',
                  color: 'rgba(255,255,255,0.6)',
                  mb: 1.5,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  fontFamily: '"Quicksand", sans-serif',
                  fontStyle: 'italic',
                  fontSize: '0.875rem',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: '#C6A962',
                  },
                }}
              >
                {area}
              </Typography>
            ))}
          </Grid>

          {/* Resources */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: '#C6A962',
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
              }}
            >
              Resources
            </Typography>
            {resources.map((resource) => (
              <Typography
                key={resource}
                component={Link}
                href={`/${resource.toLowerCase().replace(' ', '-')}`}
                sx={{
                  display: 'block',
                  color: 'rgba(255,255,255,0.6)',
                  mb: 1.5,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  fontFamily: '"Quicksand", sans-serif',
                  fontStyle: 'italic',
                  fontSize: '0.875rem',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: '#C6A962',
                  },
                }}
              >
                {resource}
              </Typography>
            ))}
          </Grid>

          {/* Contact */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: '#C6A962',
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
              }}
            >
              Contact
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Phone size={16} color="#C6A962" />
              <Typography
                component="a"
                href="tel:+97140000000"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  fontFamily: '"Quicksand", sans-serif',
                  fontStyle: 'italic',
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: '#C6A962',
                  },
                }}
              >
                +971 4 XXX XXXX
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Mail size={16} color="#C6A962" />
              <Typography
                component="a"
                href="mailto:info@fortunedxb.com"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  fontFamily: '"Quicksand", sans-serif',
                  fontStyle: 'italic',
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: '#C6A962',
                  },
                }}
              >
                info@fortunedxb.com
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <MapPin size={16} color="#C6A962" style={{ marginTop: 2 }} />
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                  fontFamily: '"Quicksand", sans-serif',
                  fontStyle: 'italic',
                  fontSize: '0.875rem',
                }}
              >
                Business Bay, Dubai, UAE
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255,255,255,0.5)',
              fontFamily: '"Quicksand", sans-serif',
              fontStyle: 'italic',
            }}
          >
            © {new Date().getFullYear()} Fortune DXB. All rights reserved. | RERA Licensed
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
              <Typography
                key={link}
                component={Link}
                href={`/${link.toLowerCase().replace(/ /g, '-')}`}
                sx={{
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  fontFamily: '"Quicksand", sans-serif',
                  fontStyle: 'italic',
                  fontSize: '0.75rem',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: '#C6A962',
                  },
                }}
              >
                {link}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;