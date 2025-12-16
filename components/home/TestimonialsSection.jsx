'use client';
import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Quote,
  Star,
  MapPin,
  BadgeCheck,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const testimonials = [
  {
    name: 'James Richardson',
    country: 'United Kingdom',
    flag: '🇬🇧',
    text: 'Investing in Dubai through Fortune DXB was seamless. Their team guided me through every step of purchasing my off-plan apartment in Downtown. The process was transparent and professional.',
    rating: 5,
    investment: 'AED 2.8M',
    project: 'Burj Royale',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
  },
  {
    name: 'Chen Wei',
    country: 'China',
    flag: '🇨🇳',
    text: 'The ROI calculator and market insights helped me make an informed decision. My Palm Jumeirah investment has exceeded all expectations. Highly recommend their services.',
    rating: 5,
    investment: 'AED 6.5M',
    project: 'Atlantis Residences',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  },
  {
    name: 'Mikhail Petrov',
    country: 'Russia',
    flag: '🇷🇺',
    text: 'Professional service with multilingual support. They handled everything including Golden Visa processing after my property purchase. Exceptional attention to detail.',
    rating: 5,
    investment: 'AED 4.2M',
    project: "One Za'abeel",
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
  },
  {
    name: 'Sarah Mitchell',
    country: 'USA',
    flag: '🇺🇸',
    text: 'From property selection to Golden Visa, Fortune DXB made my Dubai investment journey absolutely effortless. Their expertise in the market is unmatched.',
    rating: 5,
    investment: 'AED 3.5M',
    project: 'Dubai Creek Harbour',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  },
];

const TestimonialsSection = () => {
  const [featured, setFeatured] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Auto slide every 10 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setFeatured((prev) => (prev + 1) % testimonials.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setFeatured((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAutoPlaying(true), 30000);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setFeatured((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAutoPlaying(true), 30000);
  };

  // Featured Card Component
  const FeaturedCard = () => (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        minHeight: { xs: 380, md: 430 },
        background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(198, 169, 98, 0.25)',
        p: { xs: 2.5, md: 4 },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Quote Icon */}
      <Box
        sx={{
          width: 45,
          height: 45,
          borderRadius: 2.5,
          background: 'linear-gradient(135deg, #C6A962 0%, #A68B4B 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          boxShadow: '0 8px 25px rgba(198, 169, 98, 0.3)',
        }}
      >
        <Quote size={22} color="#0B1A2A" />
      </Box>

      {/* Rating */}
      <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} fill="#C6A962" color="#C6A962" />
        ))}
      </Box>

      {/* Quote Text */}
      <Typography
        sx={{
          color: 'white',
          fontSize: { xs: '0.95rem', md: '1.1rem' },
          lineHeight: 1.8,
          fontStyle: 'italic',
          fontFamily: '"Quicksand", sans-serif',
          flex: 1,
          mb: 2,
        }}
      >
        "{testimonials[featured].text}"
      </Typography>

      {/* Author Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          pt: 2,
          borderTop: '1px solid rgba(198, 169, 98, 0.2)',
        }}
      >
        <Avatar
          src={testimonials[featured].image}
          sx={{
            width: { xs: 50, md: 55 },
            height: { xs: 50, md: 55 },
            border: '3px solid #C6A962',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
            <Typography
              sx={{
                color: 'white',
                fontWeight: 700,
                fontSize: { xs: '0.9rem', md: '1rem' },
                fontFamily: '"Quicksand", sans-serif',
              }}
            >
              {testimonials[featured].name}
            </Typography>
            <Typography sx={{ fontSize: '1rem' }}>
              {testimonials[featured].flag}
            </Typography>
            <BadgeCheck size={14} color="#C6A962" />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <MapPin size={11} color="#C6A962" />
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.65rem',
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
              }}
            >
              {testimonials[featured].country}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1,
              py: 0.3,
              borderRadius: '100px',
              bgcolor: 'rgba(198, 169, 98, 0.15)',
              border: '1px solid rgba(198, 169, 98, 0.3)',
            }}
          >
            <TrendingUp size={10} color="#C6A962" />
            <Typography
              sx={{
                fontSize: '0.6rem',
                fontWeight: 600,
                color: '#C6A962',
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
              }}
            >
              {testimonials[featured].investment} • {testimonials[featured].project}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Buttons */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 16, md: 24 },
          right: { xs: 16, md: 24 },
          display: 'flex',
          gap: 1,
        }}
      >
        <IconButton
          onClick={handlePrev}
          sx={{
            width: 36,
            height: 36,
            bgcolor: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(198, 169, 98, 0.3)',
            color: 'white',
            borderRadius: 1,
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: '#C6A962',
              color: '#0B1A2A',
              borderColor: '#C6A962',
            },
          }}
        >
          <ChevronLeft size={18} />
        </IconButton>
        <IconButton
          onClick={handleNext}
          sx={{
            width: 36,
            height: 36,
            bgcolor: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(198, 169, 98, 0.3)',
            color: 'white',
            borderRadius: 1,
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: '#C6A962',
              color: '#0B1A2A',
              borderColor: '#C6A962',
            },
          }}
        >
          <ChevronRight size={18} />
        </IconButton>
      </Box>

      {/* Progress Dots */}
      <Box
        sx={{
          position: 'absolute',
          alignSelf: 'center',
          bottom: { xs: 6, md: 10 },
          display: 'flex',
          gap: 0.75,
        }}
      >
        {testimonials.map((_, i) => (
          <Box
            key={i}
            onClick={() => {
              setIsAutoPlaying(false);
              setFeatured(i);
              setTimeout(() => setIsAutoPlaying(true), 30000);
            }}
            sx={{
              width: featured === i ? 20 : 8,
              height: 8,
              borderRadius: 4,
              bgcolor: featured === i ? '#C6A962' : 'rgba(255,255,255,0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: featured === i ? '#C6A962' : 'rgba(255,255,255,0.5)',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        py: { xs: 4, md: 5 },
        background: 'linear-gradient(180deg, #0B1A2A 0%, #1E3A5F 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: `
            linear-gradient(90deg, #C6A962 1px, transparent 1px),
            linear-gradient(0deg, #C6A962 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Gold Glow Effects */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '-10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(198, 169, 98, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 1.5,
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
                fontStyle: 'italic',
              }}
            >
              Client Stories
            </Typography>
            <Box
              sx={{
                width: 50,
                height: 1,
                background: 'linear-gradient(90deg, #C6A962 0%, transparent 100%)',
              }}
            />
          </Box>

          <Typography
            sx={{
              color: 'white',
              fontFamily: '"Quicksand", sans-serif',
              fontWeight: 600,
              fontSize: { xs: '1.5rem', md: '1.8rem' },
              mb: 0.5,
            }}
          >
            Trusted by{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #C6A962 0%, #E8D5A3 50%, #C6A962 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Global Investors
            </Box>
          </Typography>

          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.85rem',
              fontFamily: '"Quicksand", sans-serif',
              fontStyle: 'italic',
            }}
          >
            Real success stories from investors worldwide
          </Typography>
        </Box>

        {/* Mobile/Tablet: Only Slider Card */}
        {isTablet ? (
          <FeaturedCard />
        ) : (
          /* Desktop: Magazine Layout */
          <Box
            sx={{
              display: 'flex',
              gap: 3,
            }}
          >
            {/* Left - Featured Card */}
            <Box sx={{ flex: '0 0 58%' }}>
              <FeaturedCard />
            </Box>

            {/* Right - Testimonial List */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              {testimonials.map((t, i) => (
                <Box
                  key={i}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setFeatured(i);
                    setTimeout(() => setIsAutoPlaying(true), 30000);
                  }}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: featured === i
                      ? 'rgba(198, 169, 98, 0.15)'
                      : 'rgba(255,255,255,0.03)',
                    border: '1px solid',
                    borderColor: featured === i
                      ? 'rgba(198, 169, 98, 0.4)'
                      : 'rgba(255,255,255,0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'rgba(198, 169, 98, 0.4)',
                      bgcolor: 'rgba(198, 169, 98, 0.1)',
                      transform: 'translateX(8px)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      src={t.image}
                      sx={{
                        width: 46,
                        height: 46,
                        border: featured === i
                          ? '2px solid #C6A962'
                          : '2px solid rgba(255,255,255,0.2)',
                        transition: 'all 0.3s ease',
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            color: featured === i ? '#C6A962' : 'white',
                            fontFamily: '"Quicksand", sans-serif',
                            fontStyle: 'italic',
                            transition: 'color 0.3s ease',
                          }}
                        >
                          {t.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.9rem' }}>{t.flag}</Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '0.6rem',
                          color: 'rgba(255,255,255,0.4)',
                          fontFamily: '"Quicksand", sans-serif',
                          fontStyle: 'italic',
                        }}
                      >
                        {t.investment} • {t.project}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.25 }}>
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={11} fill="#C6A962" color="#C6A962" />
                      ))}
                    </Box>
                  </Box>
                </Box>
              ))}

              {/* Stats Row */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  mt: 'auto',
                  pt: 1,
                }}
              >
                {[
                  { value: '500+', label: 'Investors' },
                  { value: '45+', label: 'Countries' },
                  { value: '4.9', label: 'Rating' },
                ].map((stat, i) => (
                  <Box
                    key={i}
                    sx={{
                      flex: 1,
                      textAlign: 'center',
                      py: 1.5,
                      borderRadius: 1,
                      bgcolor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(198, 169, 98, 0.15)',
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#C6A962',
                        fontWeight: 700,
                        fontSize: '1rem',
                        fontFamily: '"Quicksand", sans-serif',
                        lineHeight: 1,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgba(255,255,255,0.4)',
                        fontSize: '0.55rem',
                        mt: 0.25,
                        fontFamily: '"Quicksand", sans-serif',
                        fontStyle: 'italic',
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}

        {/* Mobile Stats Row */}
        {isTablet && (
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              mt: 3,
            }}
          >
            {[
              { value: '500+', label: 'Investors' },
              { value: '45+', label: 'Countries' },
              { value: '4.9', label: 'Rating' },
            ].map((stat, i) => (
              <Box
                key={i}
                sx={{
                  flex: 1,
                  textAlign: 'center',
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(198, 169, 98, 0.15)',
                }}
              >
                <Typography
                  sx={{
                    color: '#C6A962',
                    fontWeight: 700,
                    fontSize: '1rem',
                    fontFamily: '"Quicksand", sans-serif',
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '0.55rem',
                    mt: 0.25,
                    fontFamily: '"Quicksand", sans-serif',
                    fontStyle: 'italic',
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default TestimonialsSection;