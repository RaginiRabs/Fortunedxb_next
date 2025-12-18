'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Button,
  Breadcrumbs,
  Link as MuiLink,
  Skeleton,
  Tooltip,
} from '@mui/material';
import {
  Search,
  ChevronRight,
  Building2,
  BadgeCheck,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDevelopers } from '@/hooks/developer/useDeveloperHook';

// Skeleton for Developer Card
const DeveloperCardSkeleton = () => (
  <Box
    sx={{
      bgcolor: '#0B1A2A',
      borderRadius: 3,
      overflow: 'hidden',
      display: 'flex',
      height: 260,
    }}
  >
    <Box sx={{ width: '55%', p: 3 }}>
      <Skeleton variant="text" width="80%" height={32} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      <Skeleton variant="text" width="60%" height={20} sx={{ bgcolor: 'rgba(255,255,255,0.1)', mt: 1 }} />
      <Box sx={{ display: 'flex', gap: 4, mt: 3 }}>
        <Skeleton variant="text" width={60} height={50} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        <Skeleton variant="text" width={60} height={50} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      </Box>
      <Skeleton variant="rounded" width={140} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.1)', mt: 2 }} />
    </Box>
    <Skeleton variant="rectangular" width="45%" height="100%" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
  </Box>
);

// Developer Card Component - Matching the design
const DeveloperCard = ({ developer }) => {
  const router = useRouter();

  const {
    developer_id,
    name,
    cover_image,
    tagline,
    established_year,
    total_projects,
    is_verified,
  } = developer;

  // Calculate years in business
  const currentYear = new Date().getFullYear();
  const yearsInBusiness = established_year ? currentYear - established_year : null;

  // Handle image path
  const coverImg = cover_image
    ? cover_image.startsWith('/') ? cover_image : `/${cover_image}`
    : '/images/placeholder-cover.jpg';

  // Create slug for URL
  const createSlug = (text) => {
    return text?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
  };

  const handleViewProjects = () => {
    const slug = createSlug(name);
    router.push(`/developers/${slug}-${developer_id}`);
  };

  return (
    <Box
      sx={{
        bgcolor: '#0B1A2A',
        borderRadius: 3,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        minHeight: { xs: 'auto', sm: 260 },
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          '& .cover-image': {
            transform: 'scale(1.05)',
          },
        },
      }}
    >
      {/* Left Content */}
      <Box
        sx={{
          width: { xs: '100%', sm: '50%' },
          p: { xs: 2.5, sm: 3 },
          pr: { sm: 1 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Developer Name with Verified Badge */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, mb: 1 }}>
          {is_verified === 1 && (
            <Tooltip title="Verified Developer" arrow>
              <Box sx={{ display: 'flex', alignItems: 'center', height: { xs: '1.5rem', sm: '1.8rem' }, flexShrink: 0 }}>
                <BadgeCheck size={18} color="#FFFFFF" strokeWidth={2.5} />
              </Box>
            </Tooltip>
          )}
          <Typography
            sx={{
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              fontFamily: '"Quicksand", sans-serif',
              lineHeight: 1.2,
            }}
          >
            {name}
          </Typography>
        </Box>

        {/* Tagline */}
        {tagline && (
          <Typography
            sx={{
              color: '#94A3B8',
              fontSize: '0.85rem',
              fontFamily: '"Quicksand", sans-serif',
              mb: 2.5,
              lineHeight: 1.4,
            }}
          >
            {tagline}
          </Typography>
        )}

        {/* Stats */}
        <Box sx={{ display: 'flex', gap: { xs: 3, sm: 4 }, mb: 2.5 }}>
          {/* Projects Count */}
          <Box>
            <Typography
              sx={{
                color: '#C6A962',
                fontWeight: 700,
                fontSize: { xs: '1.75rem', sm: '2rem' },
                fontFamily: '"Quicksand", sans-serif',
                lineHeight: 1,
              }}
            >
              {total_projects || 0}+
            </Typography>
            <Typography
              sx={{
                color: '#64748B',
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 1,
                fontFamily: '"Quicksand", sans-serif',
                mt: 0.5,
              }}
            >
              Projects
            </Typography>
          </Box>

          {/* Years */}
          {yearsInBusiness && (
            <Box>
              <Typography
                sx={{
                  color: '#C6A962',
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', sm: '2rem' },
                  fontFamily: '"Quicksand", sans-serif',
                  lineHeight: 1,
                }}
              >
                {yearsInBusiness}
              </Typography>
              <Typography
                sx={{
                  color: '#64748B',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  fontFamily: '"Quicksand", sans-serif',
                  mt: 0.5,
                }}
              >
                Years
              </Typography>
            </Box>
          )}
        </Box>

        {/* View Projects Button */}
        <Button
          onClick={handleViewProjects}
          endIcon={<ArrowRight size={16} />}
          sx={{
            alignSelf: 'flex-start',
            bgcolor: 'transparent',
            color: '#FFFFFF',
            border: '1.5px solid #C6A962',
            borderRadius: 2,
            px: 2.5,
            py: 1,
            fontSize: '0.85rem',
            fontWeight: 600,
            fontFamily: '"Quicksand", sans-serif',
            textTransform: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: '#C6A962',
              color: '#0B1A2A',
              '& .MuiButton-endIcon': {
                transform: 'translateX(4px)',
              },
            },
            '& .MuiButton-endIcon': {
              transition: 'transform 0.3s ease',
            },
          }}
        >
          View Projects
        </Button>
      </Box>

      {/* Right Image */}
      <Box
        sx={{
          width: { xs: '100%', sm: '50%' },
          height: { xs: 180, sm: 'auto' },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={coverImg}
          alt={name}
          className="cover-image"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'transform 0.5s ease',
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/placeholder-cover.jpg';
          }}
        />
      </Box>
    </Box>
  );
};

export default function DevelopersPage() {
  // Fetch developers from database
  const { developers, loading, error, fetchDevelopers } = useDevelopers();
  
  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch developers on mount
  useEffect(() => {
    fetchDevelopers();
  }, [fetchDevelopers]);

  // Filter developers based on search
  const filteredDevelopers = useMemo(() => {
    if (!developers || developers.length === 0) return [];
    
    let result = [...developers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name?.toLowerCase().includes(query) ||
          d.tagline?.toLowerCase().includes(query) ||
          d.headquarters?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [developers, searchQuery]);

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      {/* Hero Header - Same as Projects Page */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0B1A2A 0%, #1a3a5c 100%)',
          pt: { xs: 12, md: 14 },
          pb: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          {/* Breadcrumbs */}
          <Breadcrumbs
            separator={<ChevronRight size={14} color="#94A3B8" />}
            sx={{ mb: 2 }}
          >
            <MuiLink
              component={Link}
              href="/"
              underline="hover"
              sx={{ color: '#94A3B8', fontSize: '0.85rem', fontFamily: '"Quicksand", sans-serif' }}
            >
              Home
            </MuiLink>
            <Typography sx={{ color: '#C6A962', fontSize: '0.85rem', fontFamily: '"Quicksand", sans-serif' }}>
              Developers
            </Typography>
          </Breadcrumbs>

          {/* Title */}
          <Typography
            variant="h1"
            sx={{
              color: '#FFFFFF',
              fontFamily: '"Quicksand", sans-serif',
              fontWeight: 700,
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              mb: 1,
            }}
          >
            Top{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #C6A962 0%, #E8D5A3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Real Estate Developers
            </Box>
          </Typography>

          <Typography
            sx={{
              color: '#94A3B8',
              fontSize: '0.95rem',
              fontFamily: '"Quicksand", sans-serif',
              maxWidth: 500,
              mb: 3,
            }}
          >
            Discover trusted developers shaping Dubai&apos;s iconic skyline with luxury properties
          </Typography>

          {/* Search Bar */}
          <Box sx={{ maxWidth: 400 }}>
            <TextField
              placeholder="Search developers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} color="#64748B" />
                  </InputAdornment>
                ),
              }}
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontFamily: '"Quicksand", sans-serif',
                  '& fieldset': { border: 'none' },
                },
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Results Count */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography
            sx={{
              color: '#64748B',
              fontSize: '0.875rem',
              fontFamily: '"Quicksand", sans-serif',
            }}
          >
            {filteredDevelopers.length} {filteredDevelopers.length === 1 ? 'Developer' : 'Developers'}
          </Typography>

          {searchQuery && (
            <Button
              startIcon={<RotateCcw size={14} />}
              onClick={() => setSearchQuery('')}
              sx={{
                color: '#C6A962',
                fontSize: '0.8rem',
                fontFamily: '"Quicksand", sans-serif',
                textTransform: 'none',
                '&:hover': { bgcolor: 'rgba(198, 169, 98, 0.1)' },
              }}
            >
              Clear Search
            </Button>
          )}
        </Box>

        {/* Loading State */}
        {loading && (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
                <DeveloperCardSkeleton />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Error State */}
        {error && !loading && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              bgcolor: '#FFFFFF',
              borderRadius: 3,
              border: '1px solid #E2E8F0',
            }}
          >
            <Typography color="error" sx={{ mb: 2, fontFamily: '"Quicksand", sans-serif' }}>
              {error}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => fetchDevelopers()}
              sx={{ borderColor: '#C6A962', color: '#C6A962' }}
            >
              Try Again
            </Button>
          </Box>
        )}

        {/* Developers Grid */}
        {!loading && !error && (
          <>
            {filteredDevelopers.length > 0 ? (
              <Grid container spacing={3}>
                {filteredDevelopers.map((developer) => (
                  <Grid size={{ xs: 12, md: 6 }} key={developer.developer_id}>
                    <DeveloperCard developer={developer} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  bgcolor: '#FFFFFF',
                  borderRadius: 3,
                  border: '1px solid #E2E8F0',
                }}
              >
                <Building2 size={48} color="#CBD5E1" style={{ marginBottom: 16 }} />
                <Typography
                  sx={{
                    color: '#64748B',
                    fontFamily: '"Quicksand", sans-serif',
                    mb: 2,
                  }}
                >
                  No developers found
                </Typography>
                {searchQuery && (
                  <Button
                    variant="outlined"
                    onClick={() => setSearchQuery('')}
                    startIcon={<RotateCcw size={16} />}
                    sx={{
                      borderColor: '#C6A962',
                      color: '#C6A962',
                      fontFamily: '"Quicksand", sans-serif',
                      '&:hover': { bgcolor: 'rgba(198, 169, 98, 0.1)' },
                    }}
                  >
                    Clear Search
                  </Button>
                )}
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}