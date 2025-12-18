'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Grid,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Slider,
  Drawer,
  IconButton,
  Divider,
  Pagination,
  useMediaQuery,
  useTheme,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  X,
  ChevronRight,
  MapPin,
  Building2,
  Home,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProjectCard, { ProjectCardSkeleton } from '@/components/home/ProjectCard';
import { useProjects } from '@/hooks/project/useProjecHook';

// Filter Options
const statusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Off-Plan', value: 'Off-Plan' },
  { label: 'Under Construction', value: 'Under Construction' },
  { label: 'Ready to Move', value: 'Ready to Move' },
];

const propertyTypeOptions = [
  { label: 'All Types', value: '' },
  { label: 'Apartment', value: 'Apartment' },
  { label: 'Villa', value: 'Villa' },
  { label: 'Townhouse', value: 'Townhouse' },
  { label: 'Penthouse', value: 'Penthouse' },
  { label: 'Studio', value: 'Studio' },
];

const bedroomOptions = [
  { label: 'Any Beds', value: '' },
  { label: 'Studio', value: '0' },
  { label: '1 Bedroom', value: '1' },
  { label: '2 Bedrooms', value: '2' },
  { label: '3 Bedrooms', value: '3' },
  { label: '4+ Bedrooms', value: '4' },
];

const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Name: A-Z', value: 'name_asc' },
];

const ITEMS_PER_PAGE = 12;

export default function ProjectsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch projects from database
  const { projects, loading, error, fetchProjects } = useProjects();
  // Read URL search params
  const searchParams = useSearchParams();

  // View & Layout
  const [viewMode, setViewMode] = useState('grid');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filters
  // const [searchQuery, setSearchQuery] = useState('');
  // const [selectedStatus, setSelectedStatus] = useState('');
  // const [selectedType, setSelectedType] = useState('');
  // const [selectedBedrooms, setSelectedBedrooms] = useState('');
  // const [priceRange, setPriceRange] = useState([0, 50000000]);
  // const [sortBy, setSortBy] = useState('newest');
  // Filters - Initialize from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [selectedBedrooms, setSelectedBedrooms] = useState(searchParams.get('beds') || '');
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [sortBy, setSortBy] = useState('newest');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Saved Properties
  const [savedProperties, setSavedProperties] = useState([]);

  // ✅ Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // ✅ Debug - log projects when they change
  useEffect(() => {
    if (projects.length > 0) {
      console.log('✅ Projects loaded:', projects.length);
      console.log('📦 First project:', projects[0]);
    }
  }, [projects]);

  // Load saved properties from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedProperties');
    if (saved) {
      setSavedProperties(JSON.parse(saved));
    }
  }, []);

  // ✅ Filter and sort projects - FIXED price filter
  const filteredProjects = useMemo(() => {
    if (!projects || projects.length === 0) return [];

    let result = [...projects];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.project_name?.toLowerCase().includes(query) ||
          p.location?.toLowerCase().includes(query) ||
          p.locality?.toLowerCase().includes(query) ||
          p.developer_name?.toLowerCase().includes(query) ||
          p.area_name?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (selectedStatus) {
      result = result.filter((p) => p.project_status === selectedStatus);
    }

    // Property type filter
    if (selectedType) {
      result = result.filter((p) => p.property_type === selectedType);
    }

    // Bedrooms filter
    if (selectedBedrooms) {
      if (selectedBedrooms === '4') {
        result = result.filter((p) => p.bedrooms >= 4);
      } else {
        result = result.filter((p) => p.bedrooms === parseInt(selectedBedrooms));
      }
    }

    // ✅ Price range filter - ONLY apply if user has changed the range
    // AND only filter projects that actually have a price
    const isPriceFilterActive = priceRange[0] > 0 || priceRange[1] < 50000000;
    if (isPriceFilterActive) {
      result = result.filter((p) => {
        const price = p.starting_price || p.price || 0;
        // If project has no price, include it anyway
        if (!price) return true;
        return price >= priceRange[0] && price <= priceRange[1];
      });
    }

    // Sorting
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => (a.starting_price || a.price || 0) - (b.starting_price || b.price || 0));
        break;
      case 'price_desc':
        result.sort((a, b) => (b.starting_price || b.price || 0) - (a.starting_price || a.price || 0));
        break;
      case 'name_asc':
        result.sort((a, b) => (a.project_name || '').localeCompare(b.project_name || ''));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        break;
    }

    return result;
  }, [projects, searchQuery, selectedStatus, selectedType, selectedBedrooms, priceRange, sortBy]);

  // Paginated projects
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedType, selectedBedrooms, priceRange, sortBy]);

  // Update filters when URL params change
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setSelectedStatus(searchParams.get('status') || '');
    setSelectedType(searchParams.get('type') || '');
    setSelectedBedrooms(searchParams.get('beds') || '');
    
    const area = searchParams.get('area');
    if (area) {
      setSearchQuery(prev => prev || area);
    }
  }, [searchParams]);
  
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

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('');
    setSelectedType('');
    setSelectedBedrooms('');
    setPriceRange([0, 50000000]);
    setSortBy('newest');
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || selectedStatus || selectedType || selectedBedrooms || priceRange[0] > 0 || priceRange[1] < 50000000;

  // Format price for display
  const formatPrice = (value) => {
    if (value >= 1000000) {
      return `AED ${(value / 1000000).toFixed(1)}M`;
    }
    return `AED ${(value / 1000).toFixed(0)}K`;
  };

  // Quick filter chips based on status
  const statusChips = statusOptions.slice(1); // Exclude "All"

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      {/* Hero Header */}
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
              Projects
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
            Explore{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #C6A962 0%, #E8D5A3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Premium Projects
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
            Discover exceptional off-plan and ready properties across Dubai&apos;s most prestigious locations
          </Typography>

          {/* Search Bar */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', md: 'row' },
              maxWidth: 800,
            }}
          >
            <TextField
              placeholder="Search by project, location, or developer..."
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
            <Button
              variant="contained"
              startIcon={<SlidersHorizontal size={18} />}
              onClick={() => setFilterDrawerOpen(true)}
              sx={{
                bgcolor: '#C6A962',
                color: '#FFFFFF',
                px: 3,
                borderRadius: 2,
                fontFamily: '"Quicksand", sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: '#B89A52' },
              }}
            >
              Filters {hasActiveFilters && `(${[selectedStatus, selectedType, selectedBedrooms].filter(Boolean).length + (priceRange[0] > 0 || priceRange[1] < 50000000 ? 1 : 0)})`}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Quick Filters & Controls */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mb: 3,
          }}
        >
          {/* Status Quick Filters */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="All"
              onClick={() => setSelectedStatus('')}
              sx={{
                bgcolor: !selectedStatus ? '#C6A962' : 'transparent',
                color: !selectedStatus ? '#FFFFFF' : '#0B1A2A',
                border: '1.5px solid',
                borderColor: !selectedStatus ? '#C6A962' : '#E2E8F0',
                fontWeight: 600,
                fontFamily: '"Quicksand", sans-serif',
                '&:hover': { bgcolor: !selectedStatus ? '#C6A962' : 'rgba(198, 169, 98, 0.1)' },
              }}
            />
            {statusChips.map((status) => (
              <Chip
                key={status.value}
                label={status.label}
                onClick={() => setSelectedStatus(status.value)}
                sx={{
                  bgcolor: selectedStatus === status.value ? '#C6A962' : 'transparent',
                  color: selectedStatus === status.value ? '#FFFFFF' : '#0B1A2A',
                  border: '1.5px solid',
                  borderColor: selectedStatus === status.value ? '#C6A962' : '#E2E8F0',
                  fontWeight: 600,
                  fontFamily: '"Quicksand", sans-serif',
                  '&:hover': {
                    bgcolor: selectedStatus === status.value ? '#C6A962' : 'rgba(198, 169, 98, 0.1)',
                  },
                }}
              />
            ))}
          </Box>

          {/* Right Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Results Count */}
            <Typography
              sx={{
                color: '#64748B',
                fontSize: '0.875rem',
                fontFamily: '"Quicksand", sans-serif',
              }}
            >
              {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'}
            </Typography>

            {/* Sort */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                startAdornment={<ArrowUpDown size={14} style={{ marginRight: 8 }} />}
                sx={{
                  fontFamily: '"Quicksand", sans-serif',
                  fontSize: '0.875rem',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                }}
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* View Toggle */}
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                bgcolor: '#FFFFFF',
                borderRadius: 1,
                border: '1px solid #E2E8F0',
              }}
            >
              <IconButton
                onClick={() => setViewMode('grid')}
                sx={{
                  bgcolor: viewMode === 'grid' ? '#C6A962' : 'transparent',
                  color: viewMode === 'grid' ? '#FFFFFF' : '#64748B',
                  borderRadius: 1,
                  '&:hover': { bgcolor: viewMode === 'grid' ? '#C6A962' : '#F1F5F9' },
                }}
              >
                <Grid3X3 size={18} />
              </IconButton>
              <IconButton
                onClick={() => setViewMode('list')}
                sx={{
                  bgcolor: viewMode === 'list' ? '#C6A962' : 'transparent',
                  color: viewMode === 'list' ? '#FFFFFF' : '#64748B',
                  borderRadius: 1,
                  '&:hover': { bgcolor: viewMode === 'list' ? '#C6A962' : '#F1F5F9' },
                }}
              >
                <List size={18} />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
            {searchQuery && (
              <Chip
                label={`Search: "${searchQuery}"`}
                onDelete={() => setSearchQuery('')}
                size="small"
                sx={{ fontFamily: '"Quicksand", sans-serif' }}
              />
            )}
            {selectedType && (
              <Chip
                label={`Type: ${selectedType}`}
                onDelete={() => setSelectedType('')}
                size="small"
                sx={{ fontFamily: '"Quicksand", sans-serif' }}
              />
            )}
            {selectedBedrooms && (
              <Chip
                label={`Beds: ${selectedBedrooms === '0' ? 'Studio' : selectedBedrooms === '4' ? '4+' : selectedBedrooms}`}
                onDelete={() => setSelectedBedrooms('')}
                size="small"
                sx={{ fontFamily: '"Quicksand", sans-serif' }}
              />
            )}
            {(priceRange[0] > 0 || priceRange[1] < 50000000) && (
              <Chip
                label={`Price: ${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`}
                onDelete={() => setPriceRange([0, 50000000])}
                size="small"
                sx={{ fontFamily: '"Quicksand", sans-serif' }}
              />
            )}
            <Chip
              icon={<RotateCcw size={14} />}
              label="Reset All"
              onClick={resetFilters}
              size="small"
              sx={{
                fontFamily: '"Quicksand", sans-serif',
                color: '#C6A962',
                borderColor: '#C6A962',
                '&:hover': { bgcolor: 'rgba(198, 169, 98, 0.1)' },
              }}
              variant="outlined"
            />
          </Box>
        )}

        {/* Loading State */}
        {loading && (
          <Grid container spacing={3}>
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <Grid item xs={12} sm={6} md={viewMode === 'grid' ? 4 : 6} key={index}>
                <ProjectCardSkeleton />
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
              borderRadius: 2,
              border: '1px solid #E2E8F0',
            }}
          >
            <Typography color="error" sx={{ mb: 2, fontFamily: '"Quicksand", sans-serif' }}>
              {error}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => fetchProjects()}
              sx={{ borderColor: '#C6A962', color: '#C6A962' }}
            >
              Try Again
            </Button>
          </Box>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <>
            {paginatedProjects.length > 0 ? (
              <Grid container spacing={2.5}>
                {paginatedProjects.map((project) => (
                  <Grid
                    size={{ xs: 12, sm: 6, md: viewMode === 'grid' ? 4 : 6 }}
                    key={project.project_id}
                  >
                    <ProjectCard
                      project={project}
                      savedProperties={savedProperties}
                      onSaveProperty={handleSaveProperty}
                      onInquiry={() => console.log('Inquiry:', project.project_id)}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  bgcolor: '#FFFFFF',
                  borderRadius: 2,
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
                  No projects found matching your criteria
                </Typography>
                <Button
                  variant="outlined"
                  onClick={resetFilters}
                  startIcon={<RotateCcw size={16} />}
                  sx={{
                    borderColor: '#C6A962',
                    color: '#C6A962',
                    fontFamily: '"Quicksand", sans-serif',
                    '&:hover': { bgcolor: 'rgba(198, 169, 98, 0.1)' },
                  }}
                >
                  Clear Filters
                </Button>
              </Box>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontFamily: '"Quicksand", sans-serif',
                      fontWeight: 600,
                      '&.Mui-selected': {
                        bgcolor: '#C6A962',
                        color: '#FFFFFF',
                        '&:hover': { bgcolor: '#B89A52' },
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>

      {/* Filter Drawer */}
      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: isMobile ? '100%' : 380,
            height: isMobile ? '85vh' : '100%',
            borderRadius: isMobile ? '16px 16px 0 0' : 0,
          },
        }}
      >
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography
              sx={{
                fontFamily: '"Quicksand", sans-serif',
                fontWeight: 700,
                fontSize: '1.25rem',
                color: '#0B1A2A',
              }}
            >
              Filter Projects
            </Typography>
            <IconButton onClick={() => setFilterDrawerOpen(false)}>
              <X size={20} />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Filter Content */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {/* Property Type */}
            <Box sx={{ mb: 4 }}>
              <Typography
                sx={{
                  fontFamily: '"Quicksand", sans-serif',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#0B1A2A',
                  mb: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Home size={16} />
                Property Type
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  displayEmpty
                  sx={{ fontFamily: '"Quicksand", sans-serif' }}
                >
                  {propertyTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Bedrooms */}
            <Box sx={{ mb: 4 }}>
              <Typography
                sx={{
                  fontFamily: '"Quicksand", sans-serif',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#0B1A2A',
                  mb: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Building2 size={16} />
                Bedrooms
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {bedroomOptions.map((option) => (
                  <Chip
                    key={option.value}
                    label={option.label}
                    onClick={() => setSelectedBedrooms(option.value)}
                    sx={{
                      bgcolor: selectedBedrooms === option.value ? '#C6A962' : 'transparent',
                      color: selectedBedrooms === option.value ? '#FFFFFF' : '#0B1A2A',
                      border: '1px solid',
                      borderColor: selectedBedrooms === option.value ? '#C6A962' : '#E2E8F0',
                      fontFamily: '"Quicksand", sans-serif',
                      '&:hover': {
                        bgcolor: selectedBedrooms === option.value ? '#C6A962' : 'rgba(198, 169, 98, 0.1)',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Price Range */}
            <Box sx={{ mb: 4 }}>
              <Typography
                sx={{
                  fontFamily: '"Quicksand", sans-serif',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#0B1A2A',
                  mb: 1.5,
                }}
              >
                Price Range
              </Typography>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={priceRange}
                  onChange={(_, newValue) => setPriceRange(newValue)}
                  min={0}
                  max={50000000}
                  step={500000}
                  valueLabelDisplay="auto"
                  valueLabelFormat={formatPrice}
                  sx={{
                    color: '#C6A962',
                    '& .MuiSlider-thumb': { bgcolor: '#C6A962' },
                    '& .MuiSlider-track': { bgcolor: '#C6A962' },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.8rem', color: '#64748B', fontFamily: '"Quicksand", sans-serif' }}>
                    {formatPrice(priceRange[0])}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#64748B', fontFamily: '"Quicksand", sans-serif' }}>
                    {formatPrice(priceRange[1])}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Project Status */}
            <Box sx={{ mb: 4 }}>
              <Typography
                sx={{
                  fontFamily: '"Quicksand", sans-serif',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#0B1A2A',
                  mb: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <MapPin size={16} />
                Project Status
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  displayEmpty
                  sx={{ fontFamily: '"Quicksand", sans-serif' }}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Footer Actions */}
          <Box sx={{ pt: 2, borderTop: '1px solid #E2E8F0' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={resetFilters}
                sx={{
                  borderColor: '#E2E8F0',
                  color: '#64748B',
                  fontFamily: '"Quicksand", sans-serif',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => setFilterDrawerOpen(false)}
                sx={{
                  bgcolor: '#C6A962',
                  color: '#FFFFFF',
                  fontFamily: '"Quicksand", sans-serif',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#B89A52' },
                }}
              >
                Apply Filters
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}