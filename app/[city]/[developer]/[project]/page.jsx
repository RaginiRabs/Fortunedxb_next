'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Chip,
  IconButton,
  Avatar,
  Paper,
  Divider,
  TextField,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogContent,
  Skeleton,
  Collapse,
} from '@mui/material';
import {
  MapPin,
  Bed,
  Maximize2,
  Calendar,
  Building2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Heart,
  Share2,
  Download,
  Phone,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  Play,
  X,
  Home,
  Navigation,
  TrendingUp,
  Shield,
  Award,
  BadgeCheck,
  Car,
  Dumbbell,
  Waves,
  TreePine,
  ShoppingBag,
  GraduationCap,
  Stethoscope,
  Utensils,
  Wifi,
  Lock,
  Sun,
  Wind,
  Image,
  ArrowUpRight,
  Sparkles,
  Train,
  Plane,
  UtensilsCrossed,
  School,
  Hospital,
  Store,
} from 'lucide-react';
import { 
  getStatusStyle, 
  extractIdFromSlug,
  formatPrice,
  getLowestPrice,
  getUnitTypes,
  getAreaRange,
  formatConfigArea,
  formatConfigPrice,
} from '@/lib/utils';
import { useProject } from '@/hooks/project/useProjecHook';

// Dynamic import for LocationMap (Google Maps iframe - NO SSR)
const LocationMap = dynamic(
  () => import('@/components/LocationMap/LocationMap'),
  { 
    ssr: false,
    loading: () => (
      <Box 
        sx={{ 
          height: '100%',
          minHeight: { xs: 250, md: 400 },
          bgcolor: '#E8EEF4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography sx={{ color: '#64748B', fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>
          Loading map...
        </Typography>
      </Box>
    )
  }
);

// Amenity icons mapping
const amenityIcons = {
  'Pool': Waves, 'Swimming Pool': Waves, 'Infinity Pool': Waves, 'Kids Pool': Waves,
  'Gym': Dumbbell, 'Yoga Studio': Dumbbell, 'Parking': Car, 'Covered Parking': Car,
  'Garden': TreePine, 'Private Garden': TreePine, 'Landscaped Gardens': TreePine,
  'Security': Lock, 'CCTV Surveillance': Lock, 'Retail': ShoppingBag, 'Supermarket': ShoppingBag,
  'Schools': GraduationCap, 'Hospital': Stethoscope, 'Restaurants': Utensils,
  'WiFi': Wifi, 'Balcony': Sun, 'AC': Wind, 'Spa': Sparkles, 'Jacuzzi': Waves,
  'Concierge': BadgeCheck, 'Kids Area': TreePine, 'Beach Access': Waves,
  'Private Beach': Waves, 'Valet': Car, 'Marina View': Waves, 'Creek View': Waves,
  'Burj View': Building2, 'Golf View': TreePine, 'Park Access': TreePine,
  'Park': TreePine, 'Maid Room': Home, 'Driver Room': Car,
  'Reception & Lobby': Building2, 'Business Center': Building2,
  'Meeting Rooms': Building2, 'EV Charging': Car, 'Default': CheckCircle2,
};

// Location icons mapping
const locationIcons = {
  'metro': Train, 'train': Train, 'station': Train,
  'airport': Plane, 'mall': Store, 'shopping': Store,
  'school': School, 'university': School, 'college': School,
  'hospital': Hospital, 'clinic': Hospital, 'medical': Hospital,
  'restaurant': UtensilsCrossed, 'cafe': UtensilsCrossed,
  'beach': Waves, 'park': TreePine, 'garden': TreePine,
  'default': MapPin,
};

// Get icon for location
const getLocationIcon = (placeName) => {
  const name = placeName.toLowerCase();
  for (const [key, icon] of Object.entries(locationIcons)) {
    if (name.includes(key)) return icon;
  }
  return locationIcons.default;
};

// Lead Popup Component
const LeadPopup = ({ open, onClose, projectName }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2, m: 2 } }}>
    <Box sx={{ position: 'relative' }}>
      <IconButton onClick={onClose} sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(0,0,0,0.05)', zIndex: 10 }}>
        <X size={20} />
      </IconButton>
      <Grid container>
        <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box sx={{ height: '100%', minHeight: 400, backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,26,42,0.3) 0%, rgba(11,26,42,0.8) 100%)' }} />
            <Box sx={{ position: 'absolute', bottom: 24, left: 24, right: 24 }}>
              <Typography sx={{ color: '#C6A962', fontSize: '0.75rem', fontWeight: 600, mb: 0.5, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>LIMITED TIME OFFER</Typography>
              <Typography sx={{ color: '#FFFFFF', fontSize: '1.25rem', fontWeight: 700, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>Get Exclusive Pricing & Floor Plans</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Sparkles size={20} color="#C6A962" />
              <Typography sx={{ color: '#C6A962', fontSize: '0.75rem', fontWeight: 600, letterSpacing: 1, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>REGISTER YOUR INTEREST</Typography>
            </Box>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#0B1A2A', mb: 0.5, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>{projectName}</Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#64748B', mb: 3, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>Fill in your details and our consultant will contact you within 24 hours.</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField fullWidth placeholder="Your Name *" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: '#F8FAFC' } }} />
              <TextField fullWidth placeholder="Email Address *" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: '#F8FAFC' } }} />
              <TextField fullWidth placeholder="Phone Number *" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: '#F8FAFC' } }} />
              <Button fullWidth variant="contained" sx={{ bgcolor: '#C6A962', color: '#FFFFFF', py: 1.5, fontWeight: 700, borderRadius: 1.5, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic', '&:hover': { bgcolor: '#A68B4B' } }}>Get Exclusive Offer</Button>
              <Button fullWidth variant="outlined" startIcon={<MessageCircle size={18} />} sx={{ borderColor: '#25D366', color: '#25D366', py: 1.25, fontWeight: 600, borderRadius: 1.5, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>Chat on WhatsApp</Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  </Dialog>
);

// Mobile CTA Component
const MobileStickyCTA = ({ onInquiryClick, phone }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  if (!isMobile) return null;
  return (
    <Paper elevation={8} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, p: 2, borderRadius: '16px 16px 0 0', bgcolor: '#0B1A2A' }}>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button fullWidth variant="outlined" startIcon={<Phone size={18} />} href={`tel:${phone || '+971588529900'}`} sx={{ borderColor: '#FFFFFF', color: '#FFFFFF', py: 1.25, fontWeight: 600, borderRadius: 1.5, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>Call Now</Button>
        <Button fullWidth variant="contained" onClick={onInquiryClick} sx={{ bgcolor: '#C6A962', color: '#0B1A2A', py: 1.25, fontWeight: 600, borderRadius: 1.5, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>Get Price</Button>
      </Box>
    </Paper>
  );
};

// Loading Skeleton
const ProjectDetailsSkeleton = () => (
  <Box sx={{ bgcolor: '#0B1A2A', minHeight: '100vh', pt: 12, pb: 4 }}>
    <Container maxWidth="lg">
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Skeleton variant="rectangular" height={450} sx={{ borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Grid container spacing={1.5}>
            {[1, 2, 3, 4].map((i) => (<Grid size={{ xs: 6 }} key={i}><Skeleton variant="rectangular" height={218} sx={{ borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)' }} /></Grid>))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

// Payment Plan Bar Component
const PaymentPlanBar = ({ paymentPlan, bookingAmount }) => {
  const parts = paymentPlan.split('/').map(p => parseInt(p) || 0);
  const labels = ['Booking', 'During Construction', 'On Handover', 'Post Handover'];
  const colors = ['#C6A962', '#1E3A5F', '#0F2237', '#0B1A2A'];
  
  const validParts = parts.map((p, i) => ({ percentage: p, label: labels[i], color: colors[i] })).filter(p => p.percentage > 0);

  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h2" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, fontWeight: 700, color: '#0B1A2A', mb: 3, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>
        Payment Plan
      </Typography>
      
      <Box sx={{ display: 'flex', borderRadius: 2, overflow: 'hidden', height: { xs: 50, md: 60 }, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        {validParts.map((part, i) => (
          <Box key={i} sx={{ width: `${part.percentage}%`, bgcolor: part.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', transition: 'all 0.3s ease', cursor: 'pointer', '&:hover': { filter: 'brightness(1.1)', transform: 'scaleY(1.05)' } }}>
            <Typography sx={{ color: i === 0 ? '#0B1A2A' : '#FFFFFF', fontWeight: 700, fontSize: { xs: '1rem', md: '1.25rem' }, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic', lineHeight: 1 }}>{part.percentage}%</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', mt: 1.5 }}>
        {validParts.map((part, i) => (
          <Box key={i} sx={{ width: `${part.percentage}%`, textAlign: 'center', px: 0.5 }}>
            <Typography sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.8rem' }, color: '#64748B', fontWeight: 500, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{part.label}</Typography>
          </Box>
        ))}
      </Box>

      {bookingAmount && (
        <Box sx={{ mt: 2, p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px dashed #C6A962' }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748B', fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic', textAlign: 'center' }}>
            Booking Amount: <Box component="span" sx={{ color: '#C6A962', fontWeight: 700 }}>AED {formatPrice(bookingAmount)}</Box>
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// Amenities Section Component
const AmenitiesSection = ({ amenities }) => {
  const [showAll, setShowAll] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const visibleCount = isMobile ? 6 : 8;
  const hasMore = amenities.length > visibleCount;

  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h2" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, fontWeight: 700, color: '#0B1A2A', mb: 2, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>Amenities</Typography>

      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 2, mb: 2, '&::-webkit-scrollbar': { height: 4 }, '&::-webkit-scrollbar-track': { bgcolor: '#F1F5F9', borderRadius: 2 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#C6A962', borderRadius: 2 } }}>
        {amenities.slice(0, showAll ? amenities.length : visibleCount).map((amenity, i) => {
          const IconComponent = amenityIcons[amenity] || amenityIcons['Default'];
          return (
            <Chip key={i} icon={<IconComponent size={16} color="#C6A962" />} label={amenity} sx={{ bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 3, px: 1, py: 2.5, fontSize: { xs: '0.75rem', md: '0.85rem' }, fontWeight: 500, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic', color: '#334155', flexShrink: 0, transition: 'all 0.2s', '&:hover': { borderColor: '#C6A962', bgcolor: '#FFFDF8', transform: 'translateY(-2px)' }, '& .MuiChip-icon': { ml: 1 } }} />
          );
        })}
      </Box>

      {hasMore && (
        <Button onClick={() => setShowAll(!showAll)} endIcon={showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />} sx={{ color: '#C6A962', fontWeight: 600, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic', '&:hover': { bgcolor: 'rgba(198, 169, 98, 0.1)' } }}>
          {showAll ? 'Show Less' : `+${amenities.length - visibleCount} More Amenities`}
        </Button>
      )}

      <Collapse in={showAll}>
        <Grid container spacing={1.5} sx={{ mt: 1 }}>
          {amenities.slice(visibleCount).map((amenity, i) => {
            const IconComponent = amenityIcons[amenity] || amenityIcons['Default'];
            return (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={i}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, borderRadius: 2, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', transition: 'all 0.2s', '&:hover': { borderColor: '#C6A962', bgcolor: '#FFFDF8' } }}>
                  <IconComponent size={18} color="#C6A962" />
                  <Typography sx={{ fontSize: '0.8rem', color: '#334155', fontWeight: 500, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>{amenity}</Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Collapse>
    </Box>
  );
};

// ============ SIMPLIFIED LOCATION SECTION (Google Maps Iframe) ============
const LocationSection = ({ nearbyLocations, locationLink, location, projectName }) => {
  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h2" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, fontWeight: 700, color: '#0B1A2A', mb: 3, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>
        Location
      </Typography>

      <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
        <Grid container>
          {/* Left Side - Nearby Places List */}
          <Grid size={{ xs: 12, md: 5 }} sx={{ order: { xs: 2, md: 1 } }}>
            <Box sx={{ bgcolor: '#FFFFFF', height: '100%' }}>
              {nearbyLocations.length > 0 ? (
                <Box sx={{ maxHeight: { xs: 'auto', md: 400 }, overflowY: 'auto' }}>
                  {nearbyLocations.map((place, i) => {
                    const IconComponent = getLocationIcon(place.place_name);

                    return (
                      <Box
                        key={i}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          px: { xs: 2, md: 2.5 },
                          py: { xs: 2, md: 2.5 },
                          borderBottom: '1px solid #F1F5F9',
                          transition: 'all 0.2s ease',
                          '&:hover': { bgcolor: '#FFFDF8' }
                        }}
                      >
                        {/* Left: Number + Icon + Name */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 }, flex: 1, minWidth: 0 }}>
                          {/* Number Badge */}
                          <Box sx={{
                            minWidth: { xs: 28, md: 32 },
                            width: { xs: 28, md: 32 },
                            height: { xs: 28, md: 32 },
                            borderRadius: '50%',
                            bgcolor: '#0B1A2A',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: { xs: '0.8rem', md: '0.9rem' },
                            fontFamily: '"Quicksand", sans-serif',
                            flexShrink: 0,
                          }}>
                            {i + 1}
                          </Box>

                          {/* Icon */}
                          <Box sx={{
                            width: { xs: 36, md: 40 },
                            height: { xs: 36, md: 40 },
                            borderRadius: 2,
                            bgcolor: '#F8FAFC',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            border: '1px solid #E2E8F0'
                          }}>
                            <IconComponent size={18} color="#C6A962" />
                          </Box>

                          {/* Place Name */}
                          <Typography sx={{
                            fontSize: { xs: '0.9rem', md: '0.95rem' },
                            fontWeight: 600,
                            color: '#0B1A2A',
                            fontFamily: '"Quicksand", sans-serif',
                            fontStyle: 'italic',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {place.place_name}
                          </Typography>
                        </Box>

                        {/* Right: Distance + View Button */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, ml: 1 }}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: { xs: 1.5, md: 2 },
                            py: 0.75,
                            bgcolor: '#F8FAFC',
                            borderRadius: 5,
                            border: '1px solid #E2E8F0',
                          }}>
                            <Car size={14} color="#64748B" />
                            <Typography sx={{
                              fontSize: { xs: '0.75rem', md: '0.8rem' },
                              fontWeight: 600,
                              color: '#64748B',
                              fontFamily: '"Quicksand", sans-serif',
                              fontStyle: 'italic',
                              whiteSpace: 'nowrap'
                            }}>
                              {place.distance_value} {place.distance_unit}
                            </Typography>
                          </Box>
                          
                          {/* View Button - Only if place_link exists */}
                          {place.place_link && (
                            <IconButton
                              component="a"
                              href={place.place_link}
                              target="_blank"
                              size="small"
                              sx={{
                                bgcolor: '#C6A962',
                                color: '#0B1A2A',
                                width: 32,
                                height: 32,
                                '&:hover': { bgcolor: '#D4BC7D' }
                              }}
                            >
                              <Navigation size={16} />
                            </IconButton>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <MapPin size={40} color="#E2E8F0" />
                  <Typography sx={{ color: '#94A3B8', mt: 2, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>
                    Nearby locations coming soon
                  </Typography>
                </Box>
              )}

              {/* Get Directions Button - Mobile */}
              <Box sx={{ display: { xs: 'block', md: 'none' }, p: 2, borderTop: '1px solid #E2E8F0' }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Navigation size={18} />}
                  href={locationLink || `https://www.google.com/maps/search/${encodeURIComponent(location)}`}
                  target="_blank"
                  sx={{
                    bgcolor: '#0B1A2A',
                    color: '#FFFFFF',
                    py: 1.5,
                    fontWeight: 700,
                    borderRadius: 2,
                    fontFamily: '"Quicksand", sans-serif',
                    fontStyle: 'italic',
                    '&:hover': { bgcolor: '#1E3A5F' }
                  }}
                >
                  Get Directions
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Google Maps Iframe */}
          <Grid size={{ xs: 12, md: 7 }} sx={{ order: { xs: 1, md: 2 } }}>
            <Box 
              sx={{ 
                position: 'relative', 
                height: { xs: 250, md: '100%' },
                minHeight: { md: 400 },
                bgcolor: '#E8EEF4'
              }}
            >
              {/* LocationMap Component - Simple Google Maps iframe */}
              <LocationMap
                locationLink={locationLink}
                projectName={projectName}
                height="100%"
              />

              {/* View on Maps Overlay Button */}
              <Button
                variant="contained"
                startIcon={<MapPin size={16} />}
                href={locationLink || `https://www.google.com/maps/search/${encodeURIComponent(location)}`}
                target="_blank"
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  bgcolor: 'rgba(255,255,255,0.95)',
                  color: '#0B1A2A',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  fontSize: '0.8rem',
                  fontFamily: '"Quicksand", sans-serif',
                  fontStyle: 'italic',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  '&:hover': { bgcolor: '#FFFFFF' }
                }}
              >
                View Full Map
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Get Directions Button - Desktop */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, p: 2.5, bgcolor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Navigation size={18} />}
            href={locationLink || `https://www.google.com/maps/search/${encodeURIComponent(location)}`}
            target="_blank"
            sx={{
              bgcolor: '#0B1A2A',
              color: '#FFFFFF',
              py: 1.5,
              fontWeight: 700,
              borderRadius: 2,
              fontFamily: '"Quicksand", sans-serif',
              fontStyle: 'italic',
              '&:hover': { bgcolor: '#1E3A5F' }
            }}
          >
            Get Directions on Google Maps
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

// FAQs Section Component
const FAQSection = ({ faqs }) => {
  const [expanded, setExpanded] = useState(0);

  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h2" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, fontWeight: 700, color: '#0B1A2A', mb: 2, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>Frequently Asked Questions</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {faqs.map((faq, i) => (
          <Paper key={i} elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: expanded === i ? '#C6A962' : '#E2E8F0', overflow: 'hidden', transition: 'all 0.2s' }}>
            <Box onClick={() => setExpanded(expanded === i ? -1 : i)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: { xs: 2, md: 2.5 }, cursor: 'pointer', bgcolor: expanded === i ? '#FFFDF8' : '#FFFFFF', transition: 'all 0.2s', '&:hover': { bgcolor: '#FAFAFA' } }}>
              <Typography sx={{ fontWeight: 600, color: '#0B1A2A', fontSize: { xs: '0.9rem', md: '1rem' }, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic', pr: 2 }}>{faq.question}</Typography>
              <IconButton size="small" sx={{ flexShrink: 0 }}>
                {expanded === i ? <ChevronUp size={20} color="#C6A962" /> : <ChevronDown size={20} color="#64748B" />}
              </IconButton>
            </Box>
            <Collapse in={expanded === i}>
              <Box sx={{ px: { xs: 2, md: 2.5 }, pb: { xs: 2, md: 2.5 }, pt: 0 }}>
                <Divider sx={{ mb: 2 }} />
                <Typography sx={{ color: '#64748B', fontSize: { xs: '0.85rem', md: '0.9rem' }, lineHeight: 1.7, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>{faq.answer}</Typography>
              </Box>
            </Collapse>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

// ============ MAIN COMPONENT ============
const ProjectDetails = () => {
  const params = useParams();
  const { city, developer: developerSlug, project: projectSlug } = params;
  const projectId = extractIdFromSlug(projectSlug);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [isSaved, setIsSaved] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showLeadPopup, setShowLeadPopup] = useState(false);

  const { project, loading, error, fetchProject } = useProject(projectId);

  useEffect(() => {
    if (projectId) fetchProject(projectId);
  }, [projectId, fetchProject]);

  useEffect(() => {
    const timer = setTimeout(() => setShowLeadPopup(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('savedProperties');
    if (saved && projectId) {
      const savedList = JSON.parse(saved);
      setIsSaved(savedList.includes(projectId));
    }
  }, [projectId]);

  const handleSaveProperty = () => {
    const saved = localStorage.getItem('savedProperties');
    let savedList = saved ? JSON.parse(saved) : [];
    if (isSaved) savedList = savedList.filter(id => id !== projectId);
    else savedList.push(projectId);
    localStorage.setItem('savedProperties', JSON.stringify(savedList));
    setIsSaved(!isSaved);
  };

  if (loading) return <ProjectDetailsSkeleton />;

  if (error) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2, mt: 10, p: 3, bgcolor: '#0B1A2A' }}>
        <Typography variant="h5" sx={{ fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic', color: '#EF4444', textAlign: 'center' }}>{error}</Typography>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Button variant="contained" sx={{ bgcolor: '#C6A962', color: '#0B1A2A', fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic', mt: 2, '&:hover': { bgcolor: '#A68B4B' } }}>Back to Home</Button>
        </Link>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2, mt: 10, p: 3, bgcolor: '#0B1A2A' }}>
        <Typography variant="h4" sx={{ fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic', color: '#FFFFFF', textAlign: 'center' }}>Project Not Found</Typography>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Button variant="contained" sx={{ bgcolor: '#C6A962', color: '#0B1A2A', fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic', mt: 2, '&:hover': { bgcolor: '#A68B4B' } }}>Back to Home</Button>
        </Link>
      </Box>
    );
  }

  // Extract data
  const projectName = project.project_name;
  const developerName = project.developer_name;
  const developerLogo = project.developer_logo;
  const developerDesc = project.developer_desc;
  const locality = project.locality;
  const projectCity = project.city || 'Dubai';
  const location = locality ? `${locality}, ${projectCity}` : projectCity;
  const status = project.project_status || 'Available';
  const amenities = project.amenities || [];
  const highlights = project.highlights || [];
  const configurations = project.configurations || [];
  const about = project.about || `${projectName} is an exclusive residential development by ${developerName}, offering a premium lifestyle in ${location}.`;
  const roi = project.roi;
  const paymentPlan = project.payment_plan || '60/40';
  const handoverDate = project.handover_date;
  const videoUrl = project.video_url || project.youtube_link;
  const locationLink = project.location_link;
  const projectType = project.project_type || project.usage_type || 'Residential';
  const totalUnits = project.total_units;
  const furnishingStatus = project.furnishing_status;
  const bookingAmount = project.booking_amount;
  const phone1 = project.phone_1;

  // Get from configurations
  const bedsRange = getUnitTypes(configurations);
  const areaRange = getAreaRange(configurations);
  const lowestPrice = getLowestPrice(configurations);
  const price = lowestPrice ? formatPrice(lowestPrice) : 'Price on Request';

  // Gallery
  const galleryImages = project.files?.gallery?.map(f => f.file_path?.startsWith('/') ? f.file_path : `/${f.file_path}`) || [];
  const projectLogo = project.project_logo ? (project.project_logo.startsWith('/') ? project.project_logo : `/${project.project_logo}`) : null;
  const projectImages = galleryImages.length > 0 ? galleryImages : projectLogo ? [projectLogo] : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'];
  const videoThumbnail = projectLogo || '/images/placeholder-video.jpg';

  const brochure = project.files?.brochure;
  const faqs = project.faqs || [];
  const nearbyLocations = project.nearby_locations || [];

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBA';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const statusStyle = getStatusStyle(status);

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', pb: { xs: 10, md: 0 } }}>
      <LeadPopup open={showLeadPopup} onClose={() => setShowLeadPopup(false)} projectName={projectName} />
      <MobileStickyCTA onInquiryClick={() => setShowLeadPopup(true)} phone={phone1} />

      {/* DARK HERO SECTION */}
      <Box sx={{ bgcolor: '#0B1A2A', pt: { xs: 10, md: 12 }, pb: 4 }}>
        <Container maxWidth="lg">
          {/* Image Gallery */}
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Box onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }} sx={{ position: 'relative', height: { xs: 250, sm: 350, md: 450 }, borderRadius: 2, overflow: 'hidden', cursor: 'pointer', '&:hover img': { transform: 'scale(1.03)' } }}>
                <Box component="img" src={projectImages[0]} alt={projectName} sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,26,42,0.1) 0%, rgba(11,26,42,0.4) 100%)' }} />
                <Chip label={status.toUpperCase()} sx={{ position: 'absolute', top: 12, left: 12, bgcolor: statusStyle.bg, color: statusStyle.text, fontWeight: 700, fontSize: '0.65rem', height: 26, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }} />
                <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 1 }}>
                  <IconButton onClick={(e) => { e.stopPropagation(); handleSaveProperty(); }} sx={{ bgcolor: 'rgba(255,255,255,0.95)', width: 36, height: 36, '&:hover': { bgcolor: '#FFFFFF' } }}>
                    <Heart size={16} fill={isSaved ? '#EF4444' : 'none'} color={isSaved ? '#EF4444' : '#0B1A2A'} />
                  </IconButton>
                  <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.95)', width: 36, height: 36, '&:hover': { bgcolor: '#FFFFFF' } }}><Share2 size={16} color="#0B1A2A" /></IconButton>
                </Box>
                {projectImages.length > 1 && (
                  <Button startIcon={<Image size={14} />} sx={{ position: 'absolute', bottom: 12, right: 12, bgcolor: 'rgba(255,255,255,0.95)', color: '#0B1A2A', fontWeight: 600, fontSize: '0.75rem', borderRadius: 2, px: 1.5, py: 0.5, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>{projectImages.length} Photos</Button>
                )}
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Grid container spacing={1.5} sx={{ height: '100%' }}>
                {projectImages.slice(1, 4).map((img, i) => (
                  <Grid size={{ xs: 6 }} key={i}>
                    <Box onClick={() => { setLightboxIndex(i + 1); setLightboxOpen(true); }} sx={{ position: 'relative', height: 218, borderRadius: 2, overflow: 'hidden', cursor: 'pointer', '&:hover img': { transform: 'scale(1.05)' } }}>
                      <Box component="img" src={img} alt={`${projectName} ${i + 2}`} sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} />
                    </Box>
                  </Grid>
                ))}
                <Grid size={{ xs: 6 }}>
                  {videoUrl ? (
                    <Box component="a" href={videoUrl} target="_blank" sx={{ position: 'relative', height: 218, borderRadius: 2, overflow: 'hidden', cursor: 'pointer', display: 'block', textDecoration: 'none' }}>
                      <Box component="img" src={videoThumbnail} alt="Video" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(11,26,42,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#C6A962', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Play size={24} color="#0B1A2A" fill="#0B1A2A" /></Box>
                        <Typography sx={{ color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 600, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>Watch Video</Typography>
                      </Box>
                    </Box>
                  ) : projectImages[4] ? (
                    <Box onClick={() => { setLightboxIndex(4); setLightboxOpen(true); }} sx={{ position: 'relative', height: 218, borderRadius: 2, overflow: 'hidden', cursor: 'pointer', '&:hover img': { transform: 'scale(1.05)' } }}>
                      <Box component="img" src={projectImages[4]} alt={`${projectName} 5`} sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} />
                    </Box>
                  ) : (
                    <Box sx={{ height: 218, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Image size={32} color="#64748B" />
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Mobile Gallery Thumbnails */}
          {isMobile && projectImages.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1, mt: 1.5, overflowX: 'auto', pb: 1 }}>
              {projectImages.slice(1, 5).map((img, i) => (
                <Box key={i} onClick={() => { setLightboxIndex(i + 1); setLightboxOpen(true); }} sx={{ width: 70, height: 50, borderRadius: 1, overflow: 'hidden', cursor: 'pointer', flexShrink: 0 }}>
                  <Box component="img" src={img} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              ))}
              {videoUrl && (
                <Box component="a" href={videoUrl} target="_blank" sx={{ width: 70, height: 50, borderRadius: 1, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                  <Box component="img" src={videoThumbnail} alt="Video" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Play size={20} color="#C6A962" />
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {/* Project Header */}
          <Box sx={{ mt: { xs: 3, md: 4 } }}>
            <Grid container spacing={{ xs: 2, md: 3 }} alignItems="flex-start">
              <Grid size={{ xs: 12, md: 8 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Avatar src={developerLogo ? (developerLogo.startsWith('/') ? developerLogo : `/${developerLogo}`) : undefined} sx={{ width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 }, border: '2px solid rgba(198, 169, 98, 0.3)', bgcolor: '#0F2237', fontSize: '0.9rem' }}>
                    {developerName?.charAt(0) || '🏢'}
                  </Avatar>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ fontSize: { xs: '0.75rem', md: '0.85rem' }, color: '#94A3B8', fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>by {developerName}</Typography>
                    <BadgeCheck size={14} color="#C6A962" />
                  </Box>
                </Box>
                <Typography variant="h1" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' }, fontWeight: 700, color: '#FFFFFF', fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic', mb: 1, lineHeight: 1.2 }}>{projectName}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 3 }}>
                  <MapPin size={16} color="#C6A962" />
                  <Typography sx={{ color: '#CBD5E1', fontSize: { xs: '0.85rem', md: '0.95rem' }, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>{location}</Typography>
                </Box>
                
                {/* Stats */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 3 } }}>
                  {[
                    { icon: Bed, label: 'Bedrooms', value: bedsRange },
                    { icon: Maximize2, label: 'Size', value: areaRange !== '-' ? `${areaRange} sqft` : '-' },
                    { icon: Calendar, label: 'Handover', value: formatDate(handoverDate) },
                    { icon: Building2, label: 'Type', value: projectType }
                  ].map((stat, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 }, borderRadius: 1.5, bgcolor: 'rgba(198, 169, 98, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <stat.icon size={isMobile ? 14 : 18} color="#C6A962" />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: { xs: '0.6rem', md: '0.7rem' }, color: '#64748B', textTransform: 'uppercase', fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic', letterSpacing: 0.5 }}>{stat.label}</Typography>
                        <Typography sx={{ fontSize: { xs: '0.75rem', md: '0.9rem' }, fontWeight: 600, color: '#FFFFFF', fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>{stat.value}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Grid>
              
              {/* Price Card - Desktop */}
              <Grid size={{ xs: 12, md: 4 }} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '2px solid #C6A962', bgcolor: 'rgba(198, 169, 98, 0.08)' }}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', mb: 0.5, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>Starting Price</Typography>
                  <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#FFFFFF', fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic', mb: 0.5, lineHeight: 1 }}><Box component="span" sx={{ color: '#C6A962', fontSize: '1rem' }}>AED </Box>{price}</Typography>
                  {roi && <Chip icon={<TrendingUp size={14} />} label={`Expected ROI: ${roi}%`} size="small" sx={{ mb: 2, bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontWeight: 600, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic', '& .MuiChip-icon': { color: '#10B981' } }} />}
                  <Button fullWidth variant="contained" onClick={() => setShowLeadPopup(true)} sx={{ bgcolor: '#C6A962', color: '#0B1A2A', py: 1.5, fontWeight: 700, borderRadius: 1.5, mb: 1.5, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic', '&:hover': { bgcolor: '#D4BC7D' } }}>Request Price List</Button>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button fullWidth variant="outlined" startIcon={<Phone size={16} />} href={`tel:${phone1 || '+971588529900'}`} sx={{ borderColor: 'rgba(255,255,255,0.3)', color: '#FFFFFF', fontWeight: 600, borderRadius: 1.5, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: '#FFFFFF' } }}>Call</Button>
                    <Button fullWidth variant="outlined" startIcon={<MessageCircle size={16} />} href={`https://wa.me/${(phone1 || '+971588529900').replace(/[^0-9]/g, '')}`} target="_blank" sx={{ borderColor: '#25D366', color: '#25D366', fontWeight: 600, borderRadius: 1.5, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic', '&:hover': { bgcolor: 'rgba(37, 211, 102, 0.1)' } }}>WhatsApp</Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            {/* About */}
            <Box sx={{ mb: 5 }}>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, fontWeight: 700, color: '#0B1A2A', mb: 2, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>About {projectName}</Typography>
              <Typography sx={{ color: '#475569', lineHeight: 1.9, fontSize: { xs: '0.9rem', md: '1rem' }, mb: 3, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>{about}</Typography>
              
              {/* Highlights */}
              <Grid container spacing={1.5}>
                {(highlights.length > 0 ? highlights : [`${bedsRange}`, `${paymentPlan} Payment Plan`, roi ? `ROI: ${roi}%` : null, `Handover: ${formatDate(handoverDate)}`, totalUnits ? `${totalUnits} Units` : null, furnishingStatus].filter(Boolean)).map((h, i) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={i}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#F1F5F9', borderRadius: 2 }}>
                      <CheckCircle2 size={18} color="#C6A962" />
                      <Typography sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, color: '#334155', fontWeight: 500, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>{h}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Available Units */}
            {configurations.length > 0 && (
              <Box sx={{ mb: 5 }}>
                <Typography variant="h2" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, fontWeight: 700, color: '#0B1A2A', mb: 2, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>Available Units</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {configurations.map((config, i) => (
                    <Paper key={i} elevation={0} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: { xs: 2, md: 2.5 }, borderRadius: 2, border: '1px solid #E2E8F0', flexWrap: 'wrap', gap: 2, transition: 'all 0.2s', '&:hover': { borderColor: '#C6A962', bgcolor: '#FFFDF8' } }}>
                      <Box>
                        <Typography sx={{ fontWeight: 600, color: '#0B1A2A', fontSize: { xs: '0.9rem', md: '1rem' }, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>{config.type}</Typography>
                        <Typography sx={{ fontSize: { xs: '0.75rem', md: '0.85rem' }, color: '#64748B', fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>{formatConfigArea(config)}</Typography>
                      </Box>
                      <Box sx={{ textAlign: { xs: 'left', sm: 'center' } }}>
                        <Typography sx={{ fontWeight: 700, color: '#C6A962', fontSize: { xs: '1rem', md: '1.15rem' }, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>{formatConfigPrice(config)}</Typography>
                        {config.units_available && <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>{config.units_available} units left</Typography>}
                      </Box>
                      <Button variant="outlined" endIcon={<ArrowUpRight size={14} />} onClick={() => setShowLeadPopup(true)} sx={{ borderColor: '#C6A962', color: '#C6A962', borderRadius: 1.5, fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.85rem' }, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic', '&:hover': { bgcolor: '#C6A962', color: '#FFFFFF' } }}>View Plan</Button>
                    </Paper>
                  ))}
                </Box>
              </Box>
            )}

            {/* Payment Plan */}
            {paymentPlan && <PaymentPlanBar paymentPlan={paymentPlan} bookingAmount={bookingAmount} />}

            {/* Amenities */}
            {amenities.length > 0 && <AmenitiesSection amenities={amenities} />}

            {/* Location - Simplified Google Maps iframe */}
            <LocationSection 
              nearbyLocations={nearbyLocations} 
              locationLink={locationLink} 
              location={location} 
              projectName={projectName}
            />

            {/* FAQs */}
            {faqs.length > 0 && <FAQSection faqs={faqs} />}

            {/* Developer */}
            <Box sx={{ bgcolor: '#0B1A2A', borderRadius: 3, p: { xs: 2.5, md: 3 } }}>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, fontWeight: 700, color: '#FFFFFF', mb: 2, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>About Developer</Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                <Avatar src={developerLogo ? (developerLogo.startsWith('/') ? developerLogo : `/${developerLogo}`) : undefined} sx={{ width: { xs: 50, md: 70 }, height: { xs: 50, md: 70 }, border: '2px solid #C6A962', bgcolor: '#0F2237', fontSize: '1.25rem' }}>
                  {developerName?.charAt(0) || '🏢'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, color: '#FFFFFF', fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>{developerName}</Typography>
                    <BadgeCheck size={18} color="#C6A962" />
                  </Box>
                  <Typography sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, color: '#94A3B8', lineHeight: 1.7, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>
                    {developerDesc || `${developerName} is one of the leading real estate developers in Dubai.`}
                  </Typography>
                  <Link href={`/developers/${developerSlug}`} style={{ textDecoration: 'none' }}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: '#C6A962', fontWeight: 600, mt: 1, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                      View All Projects <ArrowRight size={16} />
                    </Box>
                  </Link>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Sidebar - Desktop Only */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#0B1A2A', position: 'sticky', top: 100 }}>
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', mb: 0.5, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>Interested?</Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8', mb: 3, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>Get exclusive pricing and floor plans</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField fullWidth placeholder="Your Name" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: '#0F2237', color: '#FFFFFF', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: '#C6A962' }, '&.Mui-focused fieldset': { borderColor: '#C6A962' } }, '& .MuiOutlinedInput-input::placeholder': { color: '#64748B', opacity: 1 } }} />
                <TextField fullWidth placeholder="Email" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: '#0F2237', color: '#FFFFFF', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: '#C6A962' }, '&.Mui-focused fieldset': { borderColor: '#C6A962' } }, '& .MuiOutlinedInput-input::placeholder': { color: '#64748B', opacity: 1 } }} />
                <TextField fullWidth placeholder="Phone" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: '#0F2237', color: '#FFFFFF', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: '#C6A962' }, '&.Mui-focused fieldset': { borderColor: '#C6A962' } }, '& .MuiOutlinedInput-input::placeholder': { color: '#64748B', opacity: 1 } }} />
                <Button fullWidth variant="contained" sx={{ bgcolor: '#C6A962', color: '#0B1A2A', py: 1.5, fontWeight: 700, borderRadius: 1.5, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic', '&:hover': { bgcolor: '#D4BC7D' } }}>Request Information</Button>
              </Box>
              <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button fullWidth variant="outlined" startIcon={<Phone size={18} />} href={`tel:${phone1 || '+971588529900'}`} sx={{ borderColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF', fontWeight: 600, borderRadius: 1.5, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', borderColor: '#FFFFFF' } }}>{phone1 || '+971 58 852 9900'}</Button>
                <Button fullWidth variant="outlined" startIcon={<MessageCircle size={18} />} href={`https://wa.me/${(phone1 || '+971588529900').replace(/[^0-9]/g, '')}`} target="_blank" sx={{ borderColor: '#25D366', color: '#25D366', fontWeight: 600, borderRadius: 1.5, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic', '&:hover': { bgcolor: 'rgba(37, 211, 102, 0.1)' } }}>WhatsApp</Button>
              </Box>
              {brochure && (
                <Button fullWidth variant="text" startIcon={<Download size={18} />} href={brochure.file_path?.startsWith('/') ? brochure.file_path : `/${brochure.file_path}`} target="_blank" sx={{ color: '#C6A962', fontWeight: 600, mt: 2, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>Download Brochure</Button>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2.5, mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {[{ icon: Shield, label: 'RERA' }, { icon: Award, label: 'Trusted' }, { icon: TrendingUp, label: 'Best ROI' }].map((badge, i) => (
                  <Box key={i} sx={{ textAlign: 'center' }}>
                    <badge.icon size={22} color="#C6A962" />
                    <Typography sx={{ fontSize: '0.6rem', color: '#64748B', mt: 0.5, fontFamily: '"Quicksand", sans-serif', fontStyle: 'italic' }}>{badge.label}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onClose={() => setLightboxOpen(false)} maxWidth="lg" fullWidth PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none', m: { xs: 1, md: 2 } } }}>
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton onClick={() => setLightboxOpen(false)} sx={{ position: 'absolute', top: 10, right: 10, bgcolor: '#0B1A2A', color: '#FFFFFF', zIndex: 10, '&:hover': { bgcolor: '#0F2237' } }}><X size={24} /></IconButton>
          <Box component="img" src={projectImages[lightboxIndex]} alt={`${projectName} ${lightboxIndex + 1}`} sx={{ width: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: 2 }} />
          <Box sx={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1 }}>
            <IconButton onClick={() => setLightboxIndex((prev) => prev === 0 ? projectImages.length - 1 : prev - 1)} sx={{ bgcolor: '#0B1A2A', color: '#FFFFFF', '&:hover': { bgcolor: '#0F2237' } }}><ChevronLeft /></IconButton>
            <IconButton onClick={() => setLightboxIndex((prev) => prev === projectImages.length - 1 ? 0 : prev + 1)} sx={{ bgcolor: '#0B1A2A', color: '#FFFFFF', '&:hover': { bgcolor: '#0F2237' } }}><ChevronRight /></IconButton>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProjectDetails;