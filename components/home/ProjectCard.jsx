'use client';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
} from '@mui/material';
import {
  MapPin,
  Bed,
  Maximize2,
  Heart,
  ArrowRight,
  BadgeCheck,
} from 'lucide-react';
import { 
  createSlug, 
  createProjectSlug, 
  getStatusStyle, 
  formatPrice,
  getLowestPrice,
  getUnitTypes,
  getAreaRange,
} from '@/lib/utils';

// Skeleton Loader for ProjectCard
export const ProjectCardSkeleton = () => (
  <Card
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 1.5,
      overflow: 'hidden',
      bgcolor: '#FFFFFF',
      border: '1px solid #F0F0F0',
    }}
  >
    <Skeleton variant="rectangular" height={180} animation="wave" />
    <CardContent sx={{ flexGrow: 1, p: 2 }}>
      <Skeleton variant="text" width="80%" height={24} sx={{ mb: 0.5 }} />
      <Skeleton variant="text" width="60%" height={16} sx={{ mb: 1.5 }} />
      <Box sx={{ display: 'flex', gap: 2, mb: 1.5, pb: 1.5, borderBottom: '1px solid #F0F2F5' }}>
        <Skeleton variant="text" width={50} height={16} />
        <Skeleton variant="text" width={70} height={16} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Skeleton variant="rounded" width={60} height={22} />
          <Skeleton variant="rounded" width={60} height={22} />
        </Box>
        <Skeleton variant="rounded" width={32} height={32} />
      </Box>
    </CardContent>
  </Card>
);

const ProjectCard = ({ project, savedProperties = [], handleSaveProperty, onSaveProperty, handleInquiry, onInquiry }) => {
  const router = useRouter();

  // Support both prop naming conventions
  const saveProperty = onSaveProperty || handleSaveProperty;

  // Extract data from API response format
  const id = project?.project_id;
  const name = project?.project_name;
  const developer = project?.developer_name;
  const locality = project?.locality;
  const city = project?.city || 'Dubai';
  const location = locality ? `${locality}, ${city}` : city;
  const status = project?.project_status || 'Available';
  const amenities = project?.amenities || [];
  const usageType = project?.usage_type;
  const configurations = project?.configurations || [];

  // Get unit types from configurations (e.g., "Studio, 1 BHK, 2 BHK")
  const unitTypes = getUnitTypes(configurations);
  
  // Get area range from configurations
  const areaRange = getAreaRange(configurations);
  
  // Get lowest price from configurations
  const lowestPrice = getLowestPrice(configurations);
  const displayPrice = lowestPrice ? formatPrice(lowestPrice) : 'Price on Request';

  // Get image - priority: gallery > project_logo > placeholder
  let image = '/images/placeholder-project.jpg';
  if (project?.gallery && project.gallery.length > 0) {
    const galleryPath = project.gallery[0]?.file_path;
    image = galleryPath?.startsWith('/') ? galleryPath : `/${galleryPath}`;
  } else if (project?.project_logo) {
    image = project.project_logo.startsWith('/') ? project.project_logo : `/${project.project_logo}`;
  }

  const statusStyle = getStatusStyle(status);
  const isSaved = savedProperties?.includes(id);

  const visibleAmenities = amenities?.slice(0, 3) || [];
  const hiddenAmenities = amenities?.slice(3) || [];
  const hiddenAmenitiesText = hiddenAmenities.join(', ');

  // Navigate with URL format: /city/developer/project-id
  const handleCardClick = () => {
    const citySlug = createSlug(city);
    const developerSlug = createSlug(developer);
    const projectSlug = createProjectSlug(name, id);
    router.push(`/${citySlug}/${developerSlug}/${projectSlug}`);
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    saveProperty?.(id);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 1.5,
        overflow: 'hidden',
        bgcolor: '#FFFFFF',
        border: '1px solid #F0F0F0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 20px 40px rgba(11, 26, 42, 0.12), 0 0 0 1px rgba(198, 169, 98, 0.2)',
          '& .project-image': { transform: 'scale(1.05)' },
        },
      }}
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="180"
          image={image}
          alt={name}
          className="project-image"
          sx={{ transition: 'transform 0.5s ease', objectFit: 'cover' }}
        />
        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(11,26,42,0.05) 0%, rgba(11,26,42,0.5) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Status Badge */}
        <Chip
          label={status}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            bgcolor: statusStyle.bg,
            color: statusStyle.text,
            fontWeight: 700,
            fontSize: '0.58rem',
            height: 22,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            borderRadius: 1,
            fontFamily: '"Quicksand", sans-serif',
            fontStyle: 'italic',
          }}
        />

        {/* Save Button */}
        <Tooltip title={isSaved ? 'Remove from saved' : 'Save property'} arrow placement="left">
          <IconButton
            size="small"
            onClick={handleSaveClick}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 32,
              height: 32,
              bgcolor: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(8px)',
              borderRadius: 1,
              '&:hover': { bgcolor: '#FFFFFF', transform: 'scale(1.1)' },
            }}
          >
            <Heart size={16} fill={isSaved ? '#EF4444' : 'none'} color={isSaved ? '#EF4444' : '#0B1A2A'} />
          </IconButton>
        </Tooltip>

        {/* Price Badge - Starting from */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            bgcolor: 'rgba(11, 26, 42, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 1,
            px: 1.5,
            py: 0.75,
            border: '1px solid rgba(198, 169, 98, 0.2)',
          }}
        >
          <Typography
            sx={{
              color: '#94A3B8',
              fontSize: '0.6rem',
              fontFamily: '"Quicksand", sans-serif',
              fontStyle: 'italic',
              lineHeight: 1,
              mb: 0.25,
            }}
          >
            Starting from
          </Typography>
          <Typography
            sx={{
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.95rem',
              fontFamily: '"Quicksand", sans-serif',
              fontStyle: 'italic',
              lineHeight: 1,
            }}
          >
            <Box component="span" sx={{ color: '#C6A962', fontSize: '0.7rem', fontWeight: 600 }}>
              AED{' '}
            </Box>
            {displayPrice}
          </Typography>
        </Box>

        {/* Developer Badge */}
        <Tooltip title={`Developed by ${developer}`} arrow placement="left">
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              bgcolor: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(8px)',
              borderRadius: 1,
              px: 1.25,
              py: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <BadgeCheck size={12} color="#C6A962" />
            <Typography
              sx={{
                fontSize: '0.62rem',
                fontWeight: 600,
                color: '#0B1A2A',
                maxWidth: 80,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
              }}
            >
              {developer}
            </Typography>
          </Box>
        </Tooltip>
      </Box>

      {/* Content Section */}
      <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
        {/* Project Name */}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '1rem',
            color: '#0B1A2A',
            fontFamily: '"Quicksand", sans-serif',
            fontStyle: 'italic',
            mb: 0.5,
            lineHeight: 1.25,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </Typography>

        {/* Location */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
          <MapPin size={13} color="#C6A962" />
          <Typography
            sx={{
              fontSize: '0.72rem',
              color: '#64748B',
              fontFamily: '"Quicksand", sans-serif',
              fontStyle: 'italic',
            }}
          >
            {location}
          </Typography>
        </Box>

        {/* Specs Row - Unit Types & Area */}
        <Box sx={{ display: 'flex', gap: 2, mb: 1.5, pb: 1.5, borderBottom: '1px solid #F0F2F5', flexWrap: 'wrap' }}>
          {/* Unit Types */}
          <Tooltip title="Unit Types" arrow>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'help' }}>
              <Bed size={13} color="#94A3B8" />
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  color: '#64748B',
                  fontWeight: 500,
                  fontFamily: '"Quicksand", sans-serif',
                  fontStyle: 'italic',
                  maxWidth: 120,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {unitTypes}
              </Typography>
            </Box>
          </Tooltip>
          
          {/* Area Range */}
          <Tooltip title="Area Range" arrow>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'help' }}>
              <Maximize2 size={13} color="#94A3B8" />
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  color: '#64748B',
                  fontWeight: 500,
                  fontFamily: '"Quicksand", sans-serif',
                  fontStyle: 'italic',
                }}
              >
                {areaRange} sqft
              </Typography>
            </Box>
          </Tooltip>
          
          {/* Usage Type */}
          {usageType && (
            <Tooltip title="Usage Type" arrow>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'help' }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    color: '#64748B',
                    fontWeight: 500,
                    fontFamily: '"Quicksand", sans-serif',
                    fontStyle: 'italic',
                  }}
                >
                  {usageType}
                </Typography>
              </Box>
            </Tooltip>
          )}
        </Box>

        {/* Amenities & Arrow */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {visibleAmenities.map((amenity, index) => (
              <Chip
                key={index}
                label={amenity}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.6rem',
                  bgcolor: 'rgba(198, 169, 98, 0.08)',
                  border: '1px solid rgba(198, 169, 98, 0.15)',
                  color: '#64748B',
                  borderRadius: 1,
                  fontFamily: '"Quicksand", sans-serif',
                  fontStyle: 'italic',
                }}
              />
            ))}
            {hiddenAmenities.length > 0 && (
              <Tooltip
                title={
                  <Box sx={{ p: 0.5 }}>
                    <Typography
                      sx={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        mb: 0.5,
                        fontFamily: '"Quicksand", sans-serif',
                        fontStyle: 'italic',
                      }}
                    >
                      More Amenities:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.65rem',
                        fontFamily: '"Quicksand", sans-serif',
                        fontStyle: 'italic',
                      }}
                    >
                      {hiddenAmenitiesText}
                    </Typography>
                  </Box>
                }
                arrow
                placement="top"
              >
                <Chip
                  label={`+${hiddenAmenities.length} more`}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '0.6rem',
                    bgcolor: 'rgba(198, 169, 98, 0.15)',
                    color: '#C6A962',
                    fontWeight: 600,
                    borderRadius: 1,
                    cursor: 'help',
                    fontFamily: '"Quicksand", sans-serif',
                    fontStyle: 'italic',
                    '&:hover': { bgcolor: 'rgba(198, 169, 98, 0.25)' },
                  }}
                />
              </Tooltip>
            )}
          </Box>

          {/* Arrow Button */}
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              background: 'linear-gradient(135deg, #C6A962 0%, #A68B4B 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              flexShrink: 0,
              '.MuiCard-root:hover &': {
                transform: 'scale(1.1)',
                boxShadow: '0 4px 12px rgba(198, 169, 98, 0.4)',
              },
            }}
          >
            <ArrowRight size={16} color="#FFFFFF" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;