'use client';
import {
  Box,
  Container,
  Typography,
  Chip,
} from '@mui/material';
import {
  Building2,
  Award,
  Users,
  TrendingUp,
} from 'lucide-react';
import SearchBox from './SearchBox';

const quickStats = [
  { value: '500+', label: 'Projects', icon: Building2 },
  { value: '50+', label: 'Developers', icon: Award },
  { value: '15K+', label: 'Investors', icon: Users },
  { value: 'AED 25B+', label: 'Investments', icon: TrendingUp },
];

const popularSearches = ['Palm Jumeirah', 'Dubai Marina', 'Downtown', 'Emaar'];

const HeroSection = ({
  searchQuery,
  setSearchQuery,
  selectedArea,
  setSelectedArea,
  propertyType,
  setPropertyType,
  bedrooms,
  setBedrooms,
  setFilterDrawerOpen,
  popularAreas,
}) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Dark Navy Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(11,26,42,0.85) 0%, rgba(11,26,42,0.9) 100%)',
        }}
      />

      {/* Subtle Gold Grid Pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: `
            linear-gradient(90deg, #C6A962 1px, transparent 1px),
            linear-gradient(0deg, #C6A962 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 0 } }}>
        <Box sx={{ textAlign: 'center' }}>
          {/* Badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 3,
              mt: { xs: 6, md: 8 },
            }}
          >
            <Box
              sx={{
                width: 50,
                height: 1,
                background: 'linear-gradient(90deg, transparent 0%, #C6A962 100%)',
              }}
            />
            <Typography
              sx={{
                color: '#C6A962',
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: 3,
                textTransform: 'uppercase',
                fontFamily: '"Quicksand", sans-serif',
              }}
            >
              #1 Off-Plan Portal
            </Typography>
            <Box
              sx={{
                width: 50,
                height: 1,
                background: 'linear-gradient(90deg, #C6A962 0%, transparent 100%)',
              }}
            />
          </Box>

          {/* Main Heading */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', sm: '2.8rem', md: '3.5rem' },
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              color: '#FFFFFF',
              lineHeight: 1.15,
              mb: 1.5,
            }}
          >
            Discover Your Dream
            <Box
              component="span"
              sx={{
                display: 'block',
                background: 'linear-gradient(135deg, #C6A962 0%, #E8D5A3 50%, #C6A962 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Investment in Dubai
            </Box>
          </Typography>

          {/* Subtitle */}
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: { xs: '0.85rem', md: '0.95rem' },
              maxWidth: 500,
              mx: 'auto',
              mb: 3,
              lineHeight: 1.6,
              fontFamily: '"Quicksand", sans-serif',
            }}
          >
            Explore 500+ exclusive off-plan projects from Dubai's top developers
          </Typography>

          {/* SearchBox Component */}
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            propertyType={propertyType}
            setPropertyType={setPropertyType}
            bedrooms={bedrooms}
            setBedrooms={setBedrooms}
            setFilterDrawerOpen={setFilterDrawerOpen}
            popularAreas={popularAreas}
          />

          {/* Popular Searches */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 1,
              mt: 2,
            }}
          >
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.4)',
                fontSize: '0.7rem',
                mr: 0.5,
                fontFamily: '"Quicksand", sans-serif',
              }}
            >
              Popular:
            </Typography>
            {popularSearches.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                clickable
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.65rem',
                  height: 24,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 1,
                  transition: 'all 0.3s ease',
                  fontFamily: '"Quicksand", sans-serif',
                  '&:hover': {
                    bgcolor: 'rgba(198, 169, 98, 0.2)',
                    borderColor: 'rgba(198, 169, 98, 0.4)',
                    color: '#C6A962',
                  },
                }}
              />
            ))}
          </Box>

          {/* Stats Bar - Single Line */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: { xs: 0.5, sm: 1, md: 2 },
              mt: 3,
              pt: 2,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {quickStats.map((stat, index) => (
              <Box
                key={index}
                sx={{
                  textAlign: 'center',
                  px: { xs: 1, sm: 1.5, md: 2 },
                  mt: 2,
                  mb:{ xs: 0, sm: 0, md: 3},
                  borderRight: {
                    xs: index < quickStats.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    sm: 'none',
                  },
                }}
              >
                <Box
                  sx={{
                    display: { xs: 'none', sm: 'inline-flex' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    bgcolor: 'rgba(198, 169, 98, 0.1)',
                    border: '1px solid rgba(198, 169, 98, 0.2)',
                    mb: 0.5,
                  }}
                >
                  <stat.icon size={14} color="#C6A962" />
                </Box>

                <Typography
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' },
                    fontFamily: '"Quicksand", sans-serif',
                    lineHeight: 1,
                    mb: 0.25,
                  }}
                >
                  {stat.value}
                </Typography>

                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: { xs: '0.5rem', sm: '0.55rem', md: '0.6rem' },
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    fontFamily: '"Quicksand", sans-serif',
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;