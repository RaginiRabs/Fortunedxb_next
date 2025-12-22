'use client';
import { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Chip,
  Grid,
  Skeleton,
} from '@mui/material';
import { Award, BadgeCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDevelopers } from '@/hooks/developer/useDeveloperHook';

const TopDevelopers = () => {
  const router = useRouter();
  
  // Fetch developers from API
  const { developers: apiDevelopers, loading, error, fetchDevelopers } = useDevelopers();

  // Fetch on mount
  useEffect(() => {
    fetchDevelopers();
  }, [fetchDevelopers]);

  // Use API data (limit to 6)
  const developers = (apiDevelopers || []).slice(0, 6);

  // Handle image path
  const getImagePath = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  };

  // Create slug for navigation
  const createSlug = (text) => {
    return text?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
  };

  // Handle developer click
  const handleDeveloperClick = (developer) => {
    const slug = createSlug(developer.name);
    router.push(`/developers/${slug}-${developer.developer_id}`);
  };

  // Loading skeleton
  const DeveloperSkeleton = () => (
    <Box
      sx={{
        p: 2.5,
        textAlign: 'center',
        bgcolor: 'white',
        border: '1px solid #E2E8F0',
        borderRadius: 2,
      }}
    >
      <Skeleton 
        variant="rectangular" 
        width={100} 
        height={50} 
        sx={{ mx: 'auto', mb: 1.5, borderRadius: 1 }} 
      />
      <Skeleton variant="text" width="60%" sx={{ mx: 'auto', mb: 0.5 }} />
      <Skeleton variant="text" width="40%" sx={{ mx: 'auto' }} />
    </Box>
  );

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: '#FAFAFA',
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Chip
            icon={<Award size={14} color="#FFFFFF" />}
            label="Trusted Partners"
            size="small"
            sx={{
              bgcolor: '#C6A962',
              color: '#FFFFFF',
              fontWeight: 600,
              mb: 2,
              borderRadius: 1,
              fontFamily: '"Quicksand", sans-serif',
              fontStyle: 'italic',
              fontSize: '0.7rem',
              '& .MuiChip-icon': {
                color: '#FFFFFF',
              },
            }}
          />
          <Typography
            variant="h2"
            sx={{
              color: '#0B1A2A',
              mb: 1,
              fontFamily: '"Quicksand", sans-serif',
              fontStyle: 'italic',
              fontWeight: 600,
              fontSize: { xs: '1.5rem', md: '1.8rem' },
            }}
          >
            Premier Developers
          </Typography>
          <Typography
            sx={{
              color: '#64748B',
              maxWidth: 500,
              mx: 'auto',
              fontFamily: '"Quicksand", sans-serif',
              fontStyle: 'italic',
              fontSize: '0.85rem',
            }}
          >
            We partner with Dubai&apos;s most reputable developers to bring you exclusive off-plan opportunities.
          </Typography>
        </Box>

        {/* Loading State */}
        {loading && (
          <Grid container spacing={2} justifyContent="center">
            {[...Array(6)].map((_, index) => (
              <Grid item xs={6} sm={4} md={2} key={index}>
                <DeveloperSkeleton />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Error State */}
        {error && !loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="error" sx={{ fontFamily: '"Quicksand", sans-serif' }}>
              {error}
            </Typography>
          </Box>
        )}

        {/* Developers Grid */}
        {!loading && !error && developers.length > 0 && (
          <Grid container spacing={2} justifyContent="center">
            {developers.map((developer) => (
              <Grid item xs={6} sm={4} md={2} key={developer.developer_id}>
                <Box
                  onClick={() => handleDeveloperClick(developer)}
                  sx={{
                    p: 2.5,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      borderColor: '#C6A962',
                      boxShadow: '0 8px 25px rgba(198, 169, 98, 0.15)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  {/* Developer Logo */}
                  <Box
                    sx={{
                      width: 100,
                      height: 50,
                      mb: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {developer.logo_path ? (
                      <Box
                        component="img"
                        src={getImagePath(developer.logo_path)}
                        alt={developer.name}
                        sx={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {/* Fallback - First Letter */}
                    <Box
                      sx={{
                        display: developer.logo_path ? 'none' : 'flex',
                        width: 50,
                        height: 50,
                        borderRadius: 1.5,
                        bgcolor: '#0B1A2A',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        sx={{
                          color: '#C6A962',
                          fontWeight: 700,
                          fontSize: '1.25rem',
                          fontFamily: '"Quicksand", sans-serif',
                        }}
                      >
                        {developer.name?.charAt(0)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Developer Name with Verified Badge */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontFamily: '"Quicksand", sans-serif',
                        fontStyle: 'italic',
                        color: '#0B1A2A',
                        fontSize: '0.8rem',
                        lineHeight: 1.3,
                      }}
                    >
                      {developer.name}
                    </Typography>
                    {developer.is_verified === 1 && (
                      <BadgeCheck size={14} color="#C6A962" />
                    )}
                  </Box>

                  {/* Projects Count */}
                  <Typography
                    sx={{
                      color: '#94A3B8',
                      fontFamily: '"Quicksand", sans-serif',
                      fontStyle: 'italic',
                      fontSize: '0.7rem',
                    }}
                  >
                    {developer.total_projects || 0}+ Projects
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty State */}
        {!loading && !error && developers.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography sx={{ color: '#64748B', fontFamily: '"Quicksand", sans-serif' }}>
              No developers found
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default TopDevelopers;