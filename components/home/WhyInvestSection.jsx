'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
} from '@mui/material';
import {
  Shield,
  Globe,
  TrendingUp,
  Calculator,
  Wallet,
  LineChart,
  ArrowUpRight,
} from 'lucide-react';

const keyStats = [
  { icon: Shield, value: '0%', label: 'Property Tax', subtext: 'Tax-free ownership' },
  { icon: TrendingUp, value: '10%', label: 'Rental ROI', subtext: 'High yield returns' },
  { icon: Globe, value: '100%', label: 'Ownership', subtext: 'Full foreign rights' },
];

const miniBenefits = [
  { icon: Wallet, title: 'Flexible Payments', description: 'Easy installment plans up to handover' },
  { icon: LineChart, title: 'Strong Growth', description: 'Consistent capital appreciation' },
];

const WhyInvestSection = ({ setRoiCalculatorOpen }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={sectionRef}
      sx={{
        py: { xs: 8, md: 10 },
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Accent */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(198, 169, 98, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: { xs: 4, lg: 6 },
            alignItems: 'center',
          }}
        >
          {/* Left - Image */}
          <Box
            sx={{
              flex: { lg: '0 0 42%' },
              width: '100%',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                aspectRatio: { xs: '16/10', lg: '4/3' },
                boxShadow: '0 20px 50px rgba(11, 26, 42, 0.12)',
              }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop&q=85"
                alt="Dubai Skyline"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.6s ease',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 50%, rgba(11, 26, 42, 0.4) 100%)',
                  pointerEvents: 'none',
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 1,
                  px: 1.5,
                  py: 0.75,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: '#10B981',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.5 },
                    },
                  }}
                />
                <Typography
                  sx={{
                    color: '#0B1A2A',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    fontFamily: '"Quicksand", sans-serif',
                    fontStyle: 'italic',
                  }}
                >
                  #1 Global Investment Hub
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right - Content */}
          <Box
            sx={{
              flex: 1,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDelay: '0.2s',
            }}
          >
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography
                sx={{
                  color: '#C6A962',
                  fontWeight: 600,
                  fontSize: '0.65rem',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  mb: 0.75,
                  fontFamily: '"Quicksand", sans-serif',
                  fontStyle: 'italic',
                }}
              >
                Smart Investment
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  color: '#0B1A2A',
                  fontFamily: '"Quicksand", sans-serif',
                  fontStyle: 'italic',
                  fontWeight: 600,
                  fontSize: { xs: '1.5rem', md: '1.8rem' },
                  lineHeight: 1.2,
                  mb: 1,
                }}
              >
                Why Dubai{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #C6A962 0%, #A68B4B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Real Estate?
                </Box>
              </Typography>

              <Typography
                sx={{
                  color: '#64748B',
                  fontSize: '0.85rem',
                  lineHeight: 1.6,
                  maxWidth: 380,
                  fontFamily: '"Quicksand", sans-serif',
                  fontStyle: 'italic',
                }}
              >
                Tax-free returns, full ownership rights, and world-class lifestyle await global investors.
              </Typography>
            </Box>

            {/* Stats Row */}
            <Box sx={{ display: 'flex', gap: { xs: 1.5, md: 2.5 }, mb: 4, flexWrap: 'wrap' }}>
              {keyStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Box
                    key={index}
                    sx={{
                      flex: { xs: '1 1 calc(33.33% - 12px)', sm: 1 },
                      minWidth: { xs: 90, sm: 'auto' },
                      textAlign: 'center',
                      p: { xs: 1.5, md: 2 },
                      borderRadius: 1.5,
                      bgcolor: 'white',
                      border: '1px solid #E2E8F0',
                      transition: 'all 0.3s ease',
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                      transitionDelay: `${0.3 + index * 0.1}s`,
                      '&:hover': {
                        borderColor: '#C6A962',
                        boxShadow: '0 8px 25px rgba(11, 26, 42, 0.08)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: 'rgba(198, 169, 98, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 1,
                      }}
                    >
                      <Icon size={14} color="#C6A962" strokeWidth={2} />
                    </Box>

                    <Typography
                      sx={{
                        color: '#0B1A2A',
                        fontWeight: 700,
                        fontSize: { xs: '1.3rem', md: '1.6rem' },
                        lineHeight: 1,
                        fontFamily: '"Quicksand", sans-serif',
                        fontStyle: 'italic',
                      }}
                    >
                      {stat.value}
                    </Typography>

                    <Typography
                      sx={{
                        color: '#0B1A2A',
                        fontWeight: 600,
                        fontSize: '0.65rem',
                        mt: 0.4,
                        fontFamily: '"Quicksand", sans-serif',
                        fontStyle: 'italic',
                      }}
                    >
                      {stat.label}
                    </Typography>

                    <Typography
                      sx={{
                        color: '#94A3B8',
                        fontSize: '0.55rem',
                        mt: 0.2,
                        fontFamily: '"Quicksand", sans-serif',
                        fontStyle: 'italic',
                      }}
                    >
                      {stat.subtext}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            {/* Mini Benefits */}
            <Box sx={{ display: 'flex', gap: 2.5, mb: 4, flexWrap: 'wrap' }}>
              {miniBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.25,
                      opacity: isVisible ? 1 : 0,
                      transitionDelay: `${0.6 + index * 0.1}s`,
                      transition: 'all 0.6s ease',
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: 1,
                        bgcolor: 'rgba(11, 26, 42, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={12} color="#0B1A2A" strokeWidth={2} />
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          color: '#0B1A2A',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          lineHeight: 1.2,
                          fontFamily: '"Quicksand", sans-serif',
                          fontStyle: 'italic',
                        }}
                      >
                        {benefit.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: '#94A3B8',
                          fontSize: '0.65rem',
                          lineHeight: 1.4,
                          fontFamily: '"Quicksand", sans-serif',
                          fontStyle: 'italic',
                        }}
                      >
                        {benefit.description}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>

            {/* CTA Button */}
            <Box
              sx={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.6s ease',
                transitionDelay: '0.8s',
              }}
            >
              <Button
                variant="contained"
                onClick={() => setRoiCalculatorOpen(true)}
                endIcon={<ArrowUpRight size={14} color="#FFFFFF" />}
                sx={{
                  background: 'linear-gradient(135deg, #0B1A2A 0%, #1E3A5F 100%)',
                  color: 'white',
                  px: 2.5,
                  py: 1,
                  borderRadius: 1,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  fontFamily: '"Quicksand", sans-serif',
                  fontStyle: 'italic',
                  boxShadow: '0 4px 15px rgba(11, 26, 42, 0.25)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1E3A5F 0%, #0B1A2A 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(11, 26, 42, 0.3)',
                  },
                  '& .MuiButton-endIcon': {
                    ml: 0.75,
                    transition: 'transform 0.3s ease',
                  },
                  '&:hover .MuiButton-endIcon': {
                    transform: 'translate(2px, -2px)',
                  },
                }}
              >
                <Calculator size={14} style={{ marginRight: 6 }} />
                Calculate Your ROI
              </Button>

              <Typography
                sx={{
                  color: '#94A3B8',
                  fontSize: '0.6rem',
                  mt: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontFamily: '"Quicksand", sans-serif',
                  fontStyle: 'italic',
                }}
              >
                <Shield size={10} color="#10B981" />
                Trusted by 50,000+ investors worldwide
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default WhyInvestSection;