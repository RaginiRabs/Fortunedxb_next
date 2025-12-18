'use client';
  import { useState, useEffect, useRef, useCallback } from 'react';
  import {
    Box,
    Container,
    Typography,
    Button,
    Chip,
    Grid,
    CircularProgress,
  } from '@mui/material';
  import { ArrowRight } from 'lucide-react';
  import { useRouter } from 'next/navigation';
  import ProjectCard, { ProjectCardSkeleton } from './ProjectCard';
  import { useProjects } from '@/hooks/project/useProjecHook';

  const filterOptions = [
    { id: 0, label: 'All', value: '' },
    { id: 1, label: 'Off-Plan', value: 'Off-Plan' },
    { id: 2, label: 'Under Construction', value: 'Under Construction' },
    { id: 3, label: 'Ready to Move', value: 'Ready to Move' },
  ];

  const FeaturedProjects = ({ limit = 6 }) => {
    const router = useRouter();
    const sectionRef = useRef(null);
    
    // ✅ Hook for fetching projects
    const { projects, loading, error, fetchProjects } = useProjects();
    
    // Local state
    const [activeTab, setActiveTab] = useState(0);
    const [savedProperties, setSavedProperties] = useState([]);
    const [visibleCards, setVisibleCards] = useState([]);

    // ✅ Fetch projects on mount
    useEffect(() => {
      fetchProjects();
    }, [fetchProjects]);

    // Load saved properties from localStorage
    useEffect(() => {
      const saved = localStorage.getItem('savedProperties');
      if (saved) {
        setSavedProperties(JSON.parse(saved));
      }
    }, []);

    // ✅ Filter projects based on active tab
    // const filteredProjects = useCallback(() => {
    //   const filterValue = filterOptions[activeTab]?.value || '';
      
    //   let result = [...projects];
      
    //   // Filter by status
    //   if (filterValue) {
    //     result = result.filter((p) => p.project_status === filterValue);
    //   }
      
    //   // Only featured projects (optional - can remove if not needed)
    //   // result = result.filter((p) => p.featured);
      
    //   // Limit results
    //   return result.slice(0, limit);
    // }, [projects, activeTab, limit]);

    // ✅ Filter projects based on active tab - ONLY FEATURED
    const filteredProjects = useCallback(() => {
      const filterValue = filterOptions[activeTab]?.value || '';
      
      let result = [...projects];
      
      // ✅ Only featured projects
      result = result.filter((p) => p.featured === 1 || p.featured === true);
      
      // Filter by status
      if (filterValue) {
        result = result.filter((p) => p.project_status === filterValue);
      }
      
      // Limit results
      return result.slice(0, limit);
    }, [projects, activeTab, limit]);

    // Animation on scroll
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            filteredProjects()?.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index]);
              }, index * 80);
            });
          }
        },
        { threshold: 0.1 }
      );

      if (sectionRef.current) observer.observe(sectionRef.current);
      return () => observer.disconnect();
    }, [filteredProjects]);

    // Reset animation on tab change
    useEffect(() => {
      setVisibleCards([]);
      const timer = setTimeout(() => {
        filteredProjects()?.forEach((_, index) => {
          setTimeout(() => {
            setVisibleCards((prev) => [...prev, index]);
          }, index * 60);
        });
      }, 100);
      return () => clearTimeout(timer);
    }, [activeTab, filteredProjects]);

    // Handle tab change
    const handleTabChange = (_, newValue) => {
      setActiveTab(newValue);
    };

    // Handle save property
    const handleSaveProperty = useCallback((projectId) => {
      setSavedProperties((prev) => {
        const newSaved = prev.includes(projectId)
          ? prev.filter((id) => id !== projectId)
          : [...prev, projectId];
        localStorage.setItem('savedProperties', JSON.stringify(newSaved));
        return newSaved;
      });
    }, []);

    // Handle inquiry (optional)
    const handleInquiry = (projectId) => {
      console.log('Inquiry for project:', projectId);
    };

    // Total count for button
    // const totalCount = projects?.length || 0;

    // Total count for button (all projects, not just featured)
    const totalCount = projects?.length || 0;
    
    // Featured count
    const featuredCount = projects?.filter((p) => p.featured === 1 || p.featured === true)?.length || 0;

    return (
      <Box
        ref={sectionRef}
        sx={{
          pt: { xs: 6, md: 8 },
          pb: { xs: 8, md: 10 },
          bgcolor: '#FFFFFF',
        }}
      >
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                color: '#0B1A2A',
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: { xs: '1.5rem', md: '1.8rem' },
                mb: 0.5,
              }}
            >
              Featured{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #C6A962 0%, #A68B4B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Off-Plan Projects
              </Box>
            </Typography>

            <Box
              sx={{
                width: 50,
                height: 2,
                background: 'linear-gradient(90deg, transparent 0%, #C6A962 50%, transparent 100%)',
                mx: 'auto',
                mb: 1,
              }}
            />

            <Typography
              sx={{
                color: '#64748B',
                fontSize: '0.85rem',
                maxWidth: 450,
                mx: 'auto',
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
              }}
            >
              Handpicked luxury developments offering exceptional investment opportunities
            </Typography>
          </Box>

          {/* Filter Pills */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
              mb: 4,
              flexWrap: 'wrap',
            }}
          >
            {filterOptions.map((filter) => (
              <Chip
                key={filter.id}
                label={filter.label}
                onClick={() => handleTabChange(null, filter.id)}
                sx={{
                  height: 32,
                  px: 0.5,
                  borderRadius: 1,
                  bgcolor: activeTab === filter.id ? '#C6A962' : 'transparent',
                  color: activeTab === filter.id ? '#FFFFFF' : '#0B1A2A',
                  border: '1.5px solid',
                  borderColor: activeTab === filter.id ? '#C6A962' : '#E2E8F0',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  fontFamily: '"Quicksand", sans-serif',
                  fontStyle: 'italic',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: activeTab === filter.id ? '#C6A962' : 'rgba(198, 169, 98, 0.1)',
                    borderColor: '#C6A962',
                  },
                  '& .MuiChip-label': { px: 1.5 },
                }}
              />
            ))}
          </Box>

          {/* Loading State */}
          {loading && (
            <Grid container spacing={2.5}>
              {Array.from({ length: limit }).map((_, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                  <ProjectCardSkeleton />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Error State */}
          {error && !loading && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
              <Button 
                variant="outlined" 
                onClick={() => fetchProjects()}
                sx={{ borderColor: '#C6A962', color: '#C6A962' }}
              >
                Retry
              </Button>
            </Box>
          )}

          {/* Projects Grid */}
          {!loading && !error && (
            <>
              {filteredProjects()?.length > 0 ? (
                <Grid container spacing={2.5}>
                  {filteredProjects().map((project, index) => (
                    <Grid
                      size={{ xs: 12, sm: 6, md: 4 }}
                      key={project?.project_id}
                      sx={{
                        opacity: visibleCards.includes(index) ? 1 : 0,
                        transform: visibleCards.includes(index) ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      <ProjectCard
                        project={project}
                        savedProperties={savedProperties}
                        onSaveProperty={handleSaveProperty}
                        onInquiry={handleInquiry}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography sx={{ color: '#64748B', fontFamily: '"Quicksand", sans-serif' }}>
                    No projects found for this filter
                  </Typography>
                </Box>
              )}
            </>
          )}

          {/* View All Button */}
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button
              variant="contained"
              endIcon={<ArrowRight size={16} color="#FFFFFF" />}
              onClick={() => router.push('/projects')}
              sx={{
                background: 'linear-gradient(135deg, #C6A962 0%, #A68B4B 100%)',
                color: '#FFFFFF',
                px: 4,
                py: 1.25,
                borderRadius: 1,
                fontWeight: 700,
                fontSize: '0.8rem',
                textTransform: 'none',
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
                boxShadow: '0 4px 20px rgba(198, 169, 98, 0.25)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #D4B36E 0%, #C6A962 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 30px rgba(198, 169, 98, 0.35)',
                },
                '& .MuiButton-endIcon': {
                  ml: 0.75,
                  transition: 'transform 0.3s ease',
                },
                '&:hover .MuiButton-endIcon': {
                  transform: 'translateX(3px)',
                },
              }}
            >
              View All {totalCount}+ Projects
            </Button>
          </Box>
        </Container>
      </Box>
    );
  };

  export default FeaturedProjects;