'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Card,
  Typography,
  Button,
  Grid,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Backdrop,
  IconButton,
} from '@mui/material';
import {
  ArrowBackOutlined,
  EditOutlined,
  BusinessOutlined,
  LocationOnOutlined,
  ApartmentOutlined,
  CalendarTodayOutlined,
  ExpandMore,
  LinkOutlined,
  EmailOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  StarOutlined,
  CloseOutlined,
  ChevronLeftOutlined,
  ChevronRightOutlined,
  PictureAsPdfOutlined,
  DescriptionOutlined,
} from '@mui/icons-material';

const statusColors = {
  'New Launch': { bg: '#E3F2FD', color: '#1565C0' },
  'Under Construction': { bg: '#FFF3E0', color: '#E65100' },
  'Ready': { bg: '#E8F5E9', color: '#2E7D32' },
};

export default function ProjectViewPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      const data = await res.json();

      if (data.success) {
        setProject(data.data);
      } else {
        setError(data.message || 'Project not found');
      }
    } catch (err) {
      setError('Failed to fetch project');
    } finally {
      setLoading(false);
    }
  };

  // Open lightbox with images
  const openLightbox = (images, startIndex = 0) => {
    setLightboxImages(images);
    setLightboxIndex(startIndex);
    setLightboxOpen(true);
  };

  // Navigate lightbox
  const navigateLightbox = (direction) => {
    setLightboxIndex((prev) => {
      const newIndex = prev + direction;
      if (newIndex < 0) return lightboxImages.length - 1;
      if (newIndex >= lightboxImages.length) return 0;
      return newIndex;
    });
  };

  // Handle brochure click
  const handleBrochureClick = () => {
    if (project.files?.brochure?.file_path) {
      window.open(`/${project.files.brochure.file_path}`, '_blank');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const statusStyle = statusColors[project.project_status] || { bg: 'grey.100', color: 'text.primary' };

  return (
    <Box>
      <Box sx={{ p: 3 }}>
        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackOutlined />}
            onClick={() => router.push('/admin/projects')}
            sx={{ borderColor: 'grey.300', color: 'text.secondary' }}
          >
            Back to Projects
          </Button>
          <Button
            variant="contained"
            startIcon={<EditOutlined />}
            onClick={() => router.push(`/admin/projects/edit/${projectId}/basic`)}
            sx={{ bgcolor: 'primary.main' }}
          >
            Edit Project
          </Button>
        </Box>

        {/* Hero Section */}
        <Card
          elevation={0}
          sx={{ p: 4, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
            <Avatar
              src={project.project_logo ? `/${project.project_logo}` : undefined}
              variant="rounded"
              sx={{ width: 100, height: 60, bgcolor: 'grey.100' }}
            >
              <BusinessOutlined sx={{ fontSize: 32, color: 'grey.400' }} />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {project.project_name}
                </Typography>
                {project.featured && (
                  <Chip
                    icon={<StarOutlined />}
                    label="Featured"
                    size="small"
                    sx={{ bgcolor: 'primary.main', color: '#fff' }}
                  />
                )}
              </Box>
              {project.sub_headline && (
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {project.sub_headline}
                </Typography>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOnOutlined sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2">
                    {project.locality ? `${project.locality}, ` : ''}{project.city}, {project.country}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <BusinessOutlined sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2">{project.developer_name}</Typography>
                </Box>
                <Chip
                  label={project.project_status}
                  size="small"
                  sx={{ bgcolor: statusStyle.bg, color: statusStyle.color, fontWeight: 500 }}
                />
              </Box>
            </Box>
          </Box>

          {/* URL Preview */}
          {project.url && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                URL Preview
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinkOutlined sx={{ color: 'primary.main', fontSize: 18 }} />
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>
                  fortunedxb.com{project.url}
                </Typography>
              </Box>
            </Box>
          )}
        </Card>

        {/* Overview Stats */}
        <Card
          elevation={0}
          sx={{ p: 4, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Project Overview
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 6, md: 2.4 }}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <ApartmentOutlined sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {project.total_towers || '-'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Towers
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 2.4 }}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <BusinessOutlined sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {project.total_units || '-'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Units
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 2.4 }}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: 'primary.main', mb: 1, fontWeight: 600 }}>
                  {project.usage_type}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Usage Type
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 2.4 }}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: 'primary.main', mb: 1, fontWeight: 600 }}>
                  {project.furnishing_status || '-'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Furnishing
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 2.4 }}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <CalendarTodayOutlined sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {project.handover_date ? new Date(project.handover_date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '-'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Handover
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Configurations */}
        {project.configurations && project.configurations.length > 0 && (
          <Card
            elevation={0}
            sx={{ p: 4, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Unit Configurations
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Unit Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Area</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Units Available</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {project.configurations.map((config, index) => (
                    <TableRow key={index}>
                      <TableCell>{config.type || '-'}</TableCell>
                      <TableCell>{config.area || '-'}</TableCell>
                      <TableCell>{config.price || '-'}</TableCell>
                      <TableCell>{config.units_available || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pricing info */}
            <Box sx={{ display: 'flex', gap: 4, mt: 3, flexWrap: 'wrap' }}>
              {project.booking_amount && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Booking Amount</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{project.booking_amount}</Typography>
                </Box>
              )}
              {project.payment_plan && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Payment Plan</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{project.payment_plan}</Typography>
                </Box>
              )}
              {project.roi && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Expected ROI</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{project.roi}</Typography>
                </Box>
              )}
            </Box>
          </Card>
        )}

        {/* About */}
        {project.about && (
          <Card
            elevation={0}
            sx={{ p: 4, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              About Project
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {project.about}
            </Typography>
          </Card>
        )}

        {/* Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <Card
            elevation={0}
            sx={{ p: 4, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Highlights
            </Typography>
            <Box>
              {project.highlights.map((highlight, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                  <CheckCircleOutlined sx={{ color: 'primary.main', fontSize: 20, mt: 0.3 }} />
                  <Typography>{highlight}</Typography>
                </Box>
              ))}
            </Box>
          </Card>
        )}

        {/* Amenities */}
        {project.amenities && project.amenities.length > 0 && (
          <Card
            elevation={0}
            sx={{ p: 4, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Amenities
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {project.amenities.map((amenity, index) => (
                <Chip key={index} label={amenity} sx={{ bgcolor: 'grey.100' }} />
              ))}
            </Box>
          </Card>
        )}

        {/* Nearby Locations */}
        {project.nearby_locations && project.nearby_locations.length > 0 && (
          <Card
            elevation={0}
            sx={{ p: 4, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Nearby Locations
            </Typography>
            <Grid container spacing={2}>
              {project.nearby_locations.map((loc, index) => (
                <Grid size={{ xs: 12, md: 6 }} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <LocationOnOutlined sx={{ color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{loc.place_name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {loc.category} • {loc.distance_value} {loc.distance_unit}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>
        )}

        {/* Gallery with Lightbox */}
        {project.files?.gallery && project.files.gallery.length > 0 && (
          <Card
            elevation={0}
            sx={{ p: 4, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Gallery ({project.files.gallery.length} images)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {project.files.gallery.map((file, index) => (
                <Box
                  key={index}
                  onClick={() => openLightbox(
                    project.files.gallery.map(f => `/${f.file_path}`),
                    index
                  )}
                  sx={{
                    width: 200,
                    height: 150,
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'grey.200',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <img
                    src={`/${file.file_path}`}
                    alt={file.file_name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              ))}
            </Box>
          </Card>
        )}

        {/* Floor Plans with Lightbox */}
        {project.files?.floorplan && project.files.floorplan.length > 0 && (
          <Card
            elevation={0}
            sx={{ p: 4, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Floor Plans ({project.files.floorplan.length})
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {project.files.floorplan.map((file, index) => (
                <Box
                  key={index}
                  onClick={() => openLightbox(
                    project.files.floorplan.map(f => `/${f.file_path}`),
                    index
                  )}
                  sx={{
                    width: 200,
                    height: 150,
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'grey.200',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <img
                    src={`/${file.file_path}`}
                    alt={file.file_name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              ))}
            </Box>
          </Card>
        )}

        {/* Brochure */}
        {project.files?.brochure && (
          <Card
            elevation={0}
            sx={{ p: 4, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              E-Brochure
            </Typography>
            <Box
              onClick={handleBrochureClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 3,
                bgcolor: 'grey.50',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              <PictureAsPdfOutlined sx={{ fontSize: 48, color: 'error.main' }} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {project.files.brochure.file_name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Click to open in new tab
                </Typography>
              </Box>
            </Box>
          </Card>
        )}

        {/* FAQs */}
        {project.faqs && project.faqs.length > 0 && (
          <Card
            elevation={0}
            sx={{ p: 4, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              FAQs
            </Typography>
            {project.faqs.map((faq, index) => (
              <Accordion key={index} elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography sx={{ fontWeight: 500 }}>{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Card>
        )}

        {/* Contact */}
        {(project.email_1 || project.email_2 || project.phone_1 || project.phone_2) && (
          <Card
            elevation={0}
            sx={{ p: 4, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Contact
            </Typography>
            <Grid container spacing={2}>
              {project.email_1 && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailOutlined sx={{ color: 'primary.main' }} />
                    <Typography>{project.email_1}</Typography>
                  </Box>
                </Grid>
              )}
              {project.email_2 && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailOutlined sx={{ color: 'primary.main' }} />
                    <Typography>{project.email_2}</Typography>
                  </Box>
                </Grid>
              )}
              {project.phone_1 && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneOutlined sx={{ color: 'primary.main' }} />
                    <Typography>{project.phone_1}</Typography>
                  </Box>
                </Grid>
              )}
              {project.phone_2 && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneOutlined sx={{ color: 'primary.main' }} />
                    <Typography>{project.phone_2}</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Card>
        )}

        {/* SEO Details */}
        {project.seo && (
          <Card
            elevation={0}
            sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              SEO Details
            </Typography>
            <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary">Developer Name (SEO)</Typography>
                  <Typography>{project.seo.developer_name || '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary">City (SEO)</Typography>
                  <Typography>{project.seo.city || '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="text.secondary">Meta Title</Typography>
                  <Typography>{project.seo.meta_title || '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="text.secondary">Meta Keywords</Typography>
                  <Typography>{project.seo.meta_keywords || '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="text.secondary">Meta Description</Typography>
                  <Typography>{project.seo.meta_description || '-'}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Card>
        )}
      </Box>

      {/* Lightbox Modal */}
      <Modal
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            sx: { bgcolor: 'rgba(0,0,0,0.9)' },
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none',
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={() => setLightboxOpen(false)}
            sx={{
              position: 'fixed',
              top: 16,
              right: 16,
              color: '#fff',
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
              zIndex: 10,
            }}
          >
            <CloseOutlined />
          </IconButton>

          {/* Previous Button */}
          {lightboxImages.length > 1 && (
            <IconButton
              onClick={() => navigateLightbox(-1)}
              sx={{
                position: 'fixed',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#fff',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                zIndex: 10,
              }}
            >
              <ChevronLeftOutlined sx={{ fontSize: 32 }} />
            </IconButton>
          )}

          {/* Next Button */}
          {lightboxImages.length > 1 && (
            <IconButton
              onClick={() => navigateLightbox(1)}
              sx={{
                position: 'fixed',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#fff',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                zIndex: 10,
              }}
            >
              <ChevronRightOutlined sx={{ fontSize: 32 }} />
            </IconButton>
          )}

          {/* Image */}
          {lightboxImages[lightboxIndex] && (
            <Box
              component="img"
              src={lightboxImages[lightboxIndex]}
              alt="Preview"
              sx={{
                maxWidth: '85vw',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
          )}

          {/* Counter */}
          {lightboxImages.length > 1 && (
            <Typography
              sx={{
                position: 'fixed',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#fff',
                bgcolor: 'rgba(0,0,0,0.5)',
                px: 2,
                py: 0.5,
                borderRadius: 2,
                fontSize: 14,
              }}
            >
              {lightboxIndex + 1} / {lightboxImages.length}
            </Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
}