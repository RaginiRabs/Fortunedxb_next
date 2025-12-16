'use client';
import { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Gift,
  MapPin,
  ArrowRight,
  Percent,
  Zap,
  Sparkles,
  Crown,
  Timer,
  ChevronLeft,
  ChevronRight,
  Flame,
} from 'lucide-react';
import CountdownTimer from './CountdownTimer';

// Offer Type Config
const getOfferConfig = (type) => {
  switch (type) {
    case 'early-bird':
      return { icon: Zap, label: 'EARLY BIRD', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' };
    case 'limited':
      return { icon: Flame, label: 'LIMITED TIME', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.1)' };
    case 'exclusive':
      return { icon: Crown, label: 'EXCLUSIVE', color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.1)' };
    case 'discount':
      return { icon: Percent, label: 'DISCOUNT', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' };
    default:
      return { icon: Gift, label: 'SPECIAL', color: '#C6A962', bgColor: 'rgba(198, 169, 98, 0.1)' };
  }
};

// Perforated Edge Component
const PerforatedEdge = () => (
  <Box
    sx={{
      position: 'absolute',
      right: { xs: 80, sm: 90 },
      top: 0,
      bottom: 0,
      width: 20,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      py: 1,
      zIndex: 5,
    }}
  >
    <Box
      sx={{
        width: 20,
        height: 10,
        bgcolor: '#F0F4F8',
        borderRadius: '0 0 8px 8px',
        position: 'absolute',
        top: -1,
      }}
    />
    <Box
      sx={{
        flex: 1,
        width: 2,
        mt: 2,
        mb: 2,
        backgroundImage: 'repeating-linear-gradient(to bottom, #CBD5E1 0px, #CBD5E1 6px, transparent 6px, transparent 12px)',
      }}
    />
    <Box
      sx={{
        width: 20,
        height: 10,
        bgcolor: '#F0F4F8',
        borderRadius: '8px 8px 0 0',
        position: 'absolute',
        bottom: -1,
      }}
    />
  </Box>
);

// Ticket Card Component
const TicketCard = ({ project, isActive, handleInquiry, config, isMobile }) => {
  const Icon = config.icon;

  return (
    <Box
      sx={{
        display: 'flex',
        background: 'linear-gradient(145deg, #FFFFFF 0%, #FAFAFA 100%)',
        borderRadius: 1,
        overflow: 'hidden',
        border: isActive ? '2px solid rgba(198, 169, 98, 0.4)' : '1px solid #E2E8F0',
        boxShadow: isActive
          ? '0 25px 50px rgba(30, 58, 95, 0.15), 0 0 0 1px rgba(198, 169, 98, 0.1)'
          : '0 4px 12px rgba(0,0,0,0.05)',
        position: 'relative',
        height: '100%',
        width: '100%',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Left Section */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 2, sm: 2.5 },
          pr: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Image */}
        <Box
          sx={{
            position: 'relative',
            height: { xs: 100, sm: 120 },
            borderRadius: 1,
            overflow: 'hidden',
            mb: 1.5,
          }}
        >
          <Box
            component="img"
            src={project.image}
            alt={project.name}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: 'rgba(255,255,255,0.95)',
              borderRadius: 1,
              px: 1,
              py: 0.5,
              backdropFilter: 'blur(4px)',
            }}
          >
            <Typography
              sx={{
                color: '#0B1A2A',
                fontSize: '0.6rem',
                fontWeight: 600,
                fontFamily: '"Quicksand", sans-serif',
              }}
            >
              {project.developer}
            </Typography>
          </Box>
        </Box>

        {/* Project Info */}
        <Typography
          sx={{
            color: '#0B1A2A',
            fontWeight: 800,
            fontSize: { xs: '0.95rem', sm: '1.1rem' },
            fontFamily: '"Quicksand", sans-serif',
            mb: 0.25,
            lineHeight: 1.3,
          }}
        >
          {project.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <MapPin size={10} color="#C6A962" />
          <Typography
            sx={{
              color: '#64748B',
              fontSize: '0.65rem',
              fontFamily: '"Quicksand", sans-serif',
            }}
          >
            {project.location}
          </Typography>
        </Box>

        {/* Offer Details */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <Sparkles size={10} color="#C6A962" />
          <Typography
            sx={{
              color: '#A68B4B',
              fontWeight: 700,
              fontSize: '0.7rem',
              fontFamily: '"Quicksand", sans-serif',
            }}
          >
            {project.offer?.title}
          </Typography>
        </Box>

        <Typography
          sx={{
            color: '#64748B',
            fontSize: { xs: '0.6rem', sm: '0.65rem' },
            lineHeight: 1.4,
            mb: 1.5,
            flex: 1,
            fontFamily: '"Quicksand", sans-serif',
          }}
        >
          {project.offer?.description}
        </Typography>

        {/* Timer */}
        <Box>
          <Typography
            sx={{
              color: '#94A3B8',
              fontSize: '0.5rem',
              mb: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              fontFamily: '"Quicksand", sans-serif',
            }}
          >
            <Timer size={9} /> Expires in
          </Typography>
          <CountdownTimer validUntil={project.offer?.validUntil} />
        </Box>
      </Box>

      <PerforatedEdge />

      {/* Right Section - Stub */}
      <Box
        sx={{
          width: { xs: 80, sm: 90 },
          background: `linear-gradient(180deg, ${config.bgColor} 0%, rgba(255,255,255,0.5) 100%)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: { xs: 1, sm: 1.5 },
          py: { xs: 2, sm: 2.5 },
          borderLeft: 'none',
        }}
      >
        {/* Offer Type Badge */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
          <Box
            sx={{
              width: { xs: 32, sm: 36 },
              height: { xs: 32, sm: 36 },
              borderRadius: '50%',
              bgcolor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: `2px solid ${config.color}`,
            }}
          >
            <Icon size={isMobile ? 14 : 16} color={config.color} />
          </Box>
          <Typography
            sx={{
              color: config.color,
              fontWeight: 800,
              fontSize: '0.5rem',
              letterSpacing: 0.5,
              textAlign: 'center',
              fontFamily: '"Quicksand", sans-serif',
            }}
          >
            {config.label}
          </Typography>
        </Box>

        {/* Price */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              color: '#94A3B8',
              fontSize: '0.45rem',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              fontFamily: '"Quicksand", sans-serif',
            }}
          >
            From
          </Typography>
          <Typography
            sx={{
              color: '#0B1A2A',
              fontWeight: 800,
              fontSize: { xs: '0.75rem', sm: '0.85rem' },
              lineHeight: 1.2,
              fontFamily: '"Quicksand", sans-serif',
            }}
          >
            {project.price}
          </Typography>
        </Box>

        {/* CTA Button */}
        <Button
          variant="contained"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleInquiry(project);
          }}
          sx={{
            background: 'linear-gradient(135deg, #C6A962 0%, #A68B4B 100%)',
            color: '#FFFFFF',
            width: '100%',
            py: 0.6,
            borderRadius: 1,
            fontWeight: 700,
            fontSize: '0.55rem',
            textTransform: 'none',
            fontFamily: '"Quicksand", sans-serif',
            boxShadow: '0 2px 8px rgba(198, 169, 98, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #D4BC7D 0%, #C6A962 100%)',
            },
          }}
          endIcon={<ArrowRight size={10} color="#FFFFFF" />}
        >
          Claim
        </Button>
      </Box>
    </Box>
  );
};

const ExclusiveOffers = ({ projectsWithOffers, handleInquiry }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState('next');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const offersProjects = projectsWithOffers?.filter((project) => project.offer) || [];

  if (offersProjects.length === 0) return null;

  const handleNext = () => {
    if (isAnimating) return;
    setSlideDirection('next');
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % offersProjects.length);
      setIsAnimating(false);
    }, 300);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setSlideDirection('prev');
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + offersProjects.length) % offersProjects.length);
      setIsAnimating(false);
    }, 300);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Desktop: 5 cards visible (2 left, 1 center, 2 right) - Coverflow effect
  const getCardStyle = (index) => {
    const diff = index - activeIndex;
    const totalCards = offersProjects.length;

    let position = diff;
    if (diff > totalCards / 2) position = diff - totalCards;
    if (diff < -totalCards / 2) position = diff + totalCards;

    switch (position) {
      case 0:
        return {
          transform: 'translateX(0) scale(1)',
          zIndex: 50,
          opacity: 1,
          filter: 'blur(0px)',
          pointerEvents: 'auto',
        };
      case 1:
        return {
          transform: 'translateX(55%) scale(0.85)',
          zIndex: 40,
          opacity: 0.8,
          filter: 'blur(0.5px)',
          pointerEvents: 'auto',
        };
      case -1:
        return {
          transform: 'translateX(-55%) scale(0.85)',
          zIndex: 40,
          opacity: 0.8,
          filter: 'blur(0.5px)',
          pointerEvents: 'auto',
        };
      case 2:
        return {
          transform: 'translateX(95%) scale(0.7)',
          zIndex: 30,
          opacity: 0.5,
          filter: 'blur(1px)',
          pointerEvents: 'auto',
        };
      case -2:
        return {
          transform: 'translateX(-95%) scale(0.7)',
          zIndex: 30,
          opacity: 0.5,
          filter: 'blur(1px)',
          pointerEvents: 'auto',
        };
      default:
        return {
          transform: 'translateX(0) scale(0.5)',
          zIndex: 10,
          opacity: 0,
          filter: 'blur(4px)',
          pointerEvents: 'none',
        };
    }
  };

  return (
    <Box
      sx={{
        pt: { xs: 6, md: 8 },
        pb: { xs: 8, md: 10 },
        background: 'linear-gradient(180deg, #FAFAFA 0%, #F0F4F8 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.3,
          background: `
            radial-gradient(circle at 15% 25%, rgba(198, 170, 98, 0.5) 0%, transparent 35%),
            radial-gradient(circle at 85% 75%, rgba(11, 26, 42, 0.5) 0%, transparent 35%)
          `,
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
          <Typography
            variant="h4"
            sx={{
              color: '#0B1A2A',
              fontFamily: '"Quicksand", sans-serif',
              fontWeight: 600,
              fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.8rem' },
              mb: 0.5,
            }}
          >
            Exclusive{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #C6A962 0%, #A68B4B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Offers
            </Box>
          </Typography>

          <Typography
            sx={{
              color: '#64748B',
              fontSize: { xs: '0.75rem', md: '0.85rem' },
              fontFamily: '"Quicksand", sans-serif',
            }}
          >
            Grab these deals before they expire
          </Typography>
        </Box>

        {/* MOBILE & TABLET: Single Card with Animation */}
        {isTablet ? (
          <Box
            sx={{
              position: 'relative',
              px: { xs: 2, sm: 4 },
            }}
          >
            {/* Navigation Buttons */}
            <IconButton
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                left: { xs: -5, sm: 0 },
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                bgcolor: 'white',
                border: '1px solid #E2E8F0',
                borderRadius: 1,
                color: '#0B1A2A',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': { bgcolor: '#0B1A2A', color: 'white' },
              }}
            >
              <ChevronLeft size={18} />
            </IconButton>

            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: { xs: -5, sm: 0 },
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                bgcolor: 'white',
                border: '1px solid #E2E8F0',
                borderRadius: 1,
                color: '#0B1A2A',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': { bgcolor: '#0B1A2A', color: 'white' },
              }}
            >
              <ChevronRight size={18} />
            </IconButton>

            {/* Slider Container */}
            <Box
              sx={{
                overflow: 'hidden',
                mx: { xs: 3, sm: 5 },
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isAnimating
                    ? slideDirection === 'next'
                      ? 'translateX(-15%) scale(0.9) rotateY(-5deg)'
                      : 'translateX(15%) scale(0.9) rotateY(5deg)'
                    : 'translateX(0) scale(1) rotateY(0)',
                  opacity: isAnimating ? 0.4 : 1,
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: { xs: 320, sm: 380 },
                    height: { xs: 320, sm: 360 },
                  }}
                >
                  <TicketCard
                    project={offersProjects[activeIndex]}
                    isActive={true}
                    handleInquiry={handleInquiry}
                    config={getOfferConfig(offersProjects[activeIndex]?.offer?.type)}
                    isMobile={isMobile}
                  />
                </Box>
              </Box>
            </Box>

            {/* Progress Dots */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                mt: 3,
              }}
            >
              {offersProjects.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => {
                    if (isAnimating) return;
                    setSlideDirection(index > activeIndex ? 'next' : 'prev');
                    setIsAnimating(true);
                    setTimeout(() => {
                      setActiveIndex(index);
                      setIsAnimating(false);
                    }, 300);
                  }}
                  sx={{
                    width: index === activeIndex ? 24 : 10,
                    height: 10,
                    borderRadius: 1,
                    bgcolor: index === activeIndex ? '#C6A962' : '#CBD5E1',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: index === activeIndex ? '#C6A962' : '#94A3B8',
                      transform: 'scale(1.1)',
                    },
                  }}
                />
              ))}
            </Box>

            {/* Swipe Hint */}
            <Typography
              sx={{
                textAlign: 'center',
                color: '#94A3B8',
                fontSize: '0.65rem',
                mt: 1.5,
                fontFamily: '"Quicksand", sans-serif',
              }}
            >
              Swipe or tap arrows to explore
            </Typography>
          </Box>
        ) : (
          /* DESKTOP: 5 Cards Coverflow / Deck Style */
          <Box
            sx={{
              position: 'relative',
              height: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 8,
            }}
          >
            {/* Navigation Left */}
            <IconButton
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                left: 20,
                zIndex: 60,
                width: 40,
                height: 40,
                bgcolor: 'white',
                border: '1px solid #E2E8F0',
                borderRadius: 1,
                color: '#0B1A2A',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                '&:hover': { bgcolor: '#0B1A2A', color: 'white' },
              }}
            >
              <ChevronLeft size={20} />
            </IconButton>

            {/* Cards Container - Deck/Coverflow */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: 420,
                height: '100%',
              }}
            >
              {offersProjects.map((project, index) => {
                const cardStyle = getCardStyle(index);
                const config = getOfferConfig(project.offer?.type);

                return (
                  <Box
                    key={project.id}
                    onClick={() => {
                      if (index !== activeIndex && !isAnimating) {
                        setSlideDirection(index > activeIndex ? 'next' : 'prev');
                        setIsAnimating(true);
                        setActiveIndex(index);
                        setTimeout(() => setIsAnimating(false), 400);
                      }
                    }}
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: 380,
                      height: 360,
                      marginLeft: '-190px',
                      marginTop: '-180px',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: index === activeIndex ? 'default' : 'pointer',
                      ...cardStyle,
                    }}
                  >
                    <TicketCard
                      project={project}
                      isActive={index === activeIndex}
                      handleInquiry={handleInquiry}
                      config={config}
                      isMobile={false}
                    />
                  </Box>
                );
              })}
            </Box>

            {/* Navigation Right */}
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 20,
                zIndex: 60,
                width: 40,
                height: 40,
                bgcolor: 'white',
                border: '1px solid #E2E8F0',
                borderRadius: 1,
                color: '#0B1A2A',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                '&:hover': { bgcolor: '#0B1A2A', color: 'white' },
              }}
            >
              <ChevronRight size={20} />
            </IconButton>
          </Box>
        )}

        {/* Desktop Dots */}
        {!isTablet && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.75,
              mt: 3,
            }}
          >
            {offersProjects.map((_, index) => (
              <Box
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setSlideDirection(index > activeIndex ? 'next' : 'prev');
                    setIsAnimating(true);
                    setActiveIndex(index);
                    setTimeout(() => setIsAnimating(false), 400);
                  }
                }}
                sx={{
                  width: index === activeIndex ? 24 : 8,
                  height: 8,
                  borderRadius: 1,
                  bgcolor: index === activeIndex ? '#C6A962' : '#CBD5E1',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': { bgcolor: index === activeIndex ? '#C6A962' : '#94A3B8' },
                }}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ExclusiveOffers;