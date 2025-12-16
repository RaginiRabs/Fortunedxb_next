'use client';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
} from '@mui/material';
import { X, RotateCcw } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const amenitiesList = [
  'Pool',
  'Gym',
  'Spa',
  'Concierge',
  'Beach Access',
  'Golf Course',
  'Kids Play Area',
  'BBQ Area',
  'Yoga Studio',
  'Cinema Room',
  'Co-working Space',
  'Rooftop Lounge',
];

const FilterDrawer = ({
  open,
  onClose,
  priceRange,
  setPriceRange,
  selectedDeveloper,
  setSelectedDeveloper,
  completionYear,
  setCompletionYear,
  paymentPlan,
  setPaymentPlan,
  selectedAmenities,
  setSelectedAmenities,
  developers,
}) => {
  const handleAmenityToggle = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleReset = () => {
    setPriceRange([500000, 10000000]);
    setSelectedDeveloper('');
    setCompletionYear('');
    setPaymentPlan('');
    setSelectedAmenities([]);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          p: 3,
          borderRadius: { xs: 0, sm: '16px 0 0 16px' },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontFamily: '"Quicksand", sans-serif',
            fontStyle: 'italic',
            color: '#0B1A2A',
          }}
        >
          Advanced Filters
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            bgcolor: 'rgba(0,0,0,0.05)',
            borderRadius: 1,
            '&:hover': {
              bgcolor: 'rgba(198, 169, 98, 0.1)',
            },
          }}
        >
          <X size={22} />
        </IconButton>
      </Box>

      {/* Price Range */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            mb: 2,
            fontFamily: '"Quicksand", sans-serif',
            fontStyle: 'italic',
            color: '#0B1A2A',
          }}
        >
          Price Range
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={priceRange}
            onChange={(e, v) => setPriceRange(v)}
            min={500000}
            max={50000000}
            step={500000}
            valueLabelDisplay="auto"
            valueLabelFormat={formatPrice}
            sx={{
              color: '#C6A962',
              '& .MuiSlider-thumb': {
                bgcolor: '#C6A962',
              },
              '& .MuiSlider-track': {
                bgcolor: '#C6A962',
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography
              variant="caption"
              sx={{
                color: '#94A3B8',
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
              }}
            >
              {formatPrice(priceRange[0])}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#94A3B8',
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
              }}
            >
              {formatPrice(priceRange[1])}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Developer */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth size="small">
          <InputLabel
            sx={{
              fontFamily: '"Quicksand", sans-serif',
              fontStyle: 'italic',
            }}
          >
            Developer
          </InputLabel>
          <Select
            value={selectedDeveloper}
            label="Developer"
            onChange={(e) => setSelectedDeveloper(e.target.value)}
            sx={{
              borderRadius: 1,
              fontFamily: '"Quicksand", sans-serif',
              fontStyle: 'italic',
            }}
          >
            <MenuItem value="">All Developers</MenuItem>
            {developers?.map((dev) => (
              <MenuItem key={dev.name} value={dev.name}>
                {dev.logo} {dev.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Completion Year */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth size="small">
          <InputLabel
            sx={{
              fontFamily: '"Quicksand", sans-serif',
              fontStyle: 'italic',
            }}
          >
            Completion Year
          </InputLabel>
          <Select
            value={completionYear}
            label="Completion Year"
            onChange={(e) => setCompletionYear(e.target.value)}
            sx={{
              borderRadius: 1,
              fontFamily: '"Quicksand", sans-serif',
              fontStyle: 'italic',
            }}
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="2024">2024</MenuItem>
            <MenuItem value="2025">2025</MenuItem>
            <MenuItem value="2026">2026</MenuItem>
            <MenuItem value="2027">2027</MenuItem>
            <MenuItem value="2028">2028+</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Payment Plan */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth size="small">
          <InputLabel
            sx={{
              fontFamily: '"Quicksand", sans-serif',
              fontStyle: 'italic',
            }}
          >
            Payment Plan
          </InputLabel>
          <Select
            value={paymentPlan}
            label="Payment Plan"
            onChange={(e) => setPaymentPlan(e.target.value)}
            sx={{
              borderRadius: 1,
              fontFamily: '"Quicksand", sans-serif',
              fontStyle: 'italic',
            }}
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="80/20">80/20</MenuItem>
            <MenuItem value="70/30">70/30</MenuItem>
            <MenuItem value="60/40">60/40</MenuItem>
            <MenuItem value="50/50">50/50</MenuItem>
            <MenuItem value="post-handover">Post-Handover</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Amenities */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            mb: 2,
            fontFamily: '"Quicksand", sans-serif',
            fontStyle: 'italic',
            color: '#0B1A2A',
          }}
        >
          Amenities
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {amenitiesList.map((amenity) => (
            <Chip
              key={amenity}
              label={amenity}
              clickable
              onClick={() => handleAmenityToggle(amenity)}
              sx={{
                bgcolor: selectedAmenities.includes(amenity)
                  ? '#C6A962'
                  : 'rgba(0,0,0,0.04)',
                color: selectedAmenities.includes(amenity) ? 'white' : '#0B1A2A',
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
                fontSize: '0.75rem',
                borderRadius: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: selectedAmenities.includes(amenity)
                    ? '#A68B4B'
                    : 'rgba(0,0,0,0.08)',
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mt: 'auto', display: 'flex', gap: 2, pt: 3 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<RotateCcw size={18} />}
          onClick={handleReset}
          sx={{
            borderColor: '#E2E8F0',
            color: '#64748B',
            borderRadius: 1,
            fontFamily: '"Quicksand", sans-serif',
            fontStyle: 'italic',
            fontWeight: 600,
            '&:hover': {
              borderColor: '#C6A962',
              bgcolor: 'rgba(198, 169, 98, 0.05)',
            },
          }}
        >
          Reset
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={onClose}
          sx={{
            background: 'linear-gradient(135deg, #C6A962 0%, #A68B4B 100%)',
            color: '#FFFFFF',
            borderRadius: 1,
            fontFamily: '"Quicksand", sans-serif',
            fontStyle: 'italic',
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(135deg, #D4BC7D 0%, #C6A962 100%)',
            },
          }}
        >
          Apply Filters
        </Button>
      </Box>
    </Drawer>
  );
};

export default FilterDrawer;