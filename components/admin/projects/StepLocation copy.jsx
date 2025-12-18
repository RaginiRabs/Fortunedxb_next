'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  ArrowForwardOutlined,
  ArrowBackOutlined,
  AddOutlined,
  DeleteOutlined,
  MapOutlined,
  OpenInNewOutlined,
} from '@mui/icons-material';
import { useProjectForm } from '@/contexts/ProjectFormContext';

const DISTANCE_UNITS = [
  { value: 'min', label: 'Minutes' },
  { value: 'km', label: 'Kilometers' },
  { value: 'm', label: 'Meters' },
];

const PLACE_CATEGORIES = [
  { value: 'transport', label: 'Transport' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'education', label: 'Education' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'leisure', label: 'Leisure' },
  { value: 'dining', label: 'Dining' },
  { value: 'landmark', label: 'Landmark' },
  { value: 'other', label: 'Other' },
];

/**
 * Extract src URL from iframe tag or return URL directly
 */
const extractMapUrl = (input) => {
  if (!input) return null;
  
  const trimmed = input.trim();
  
  // Check if it's a full iframe tag - extract src
  if (trimmed.includes('<iframe') || trimmed.includes('&lt;iframe')) {
    const decoded = trimmed
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"');
    
    const srcMatch = decoded.match(/src=["']([^"']+)["']/);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }
  
  // If it starts with http, it's likely a direct URL
  if (trimmed.startsWith('http')) {
    return trimmed;
  }
  
  // If it starts with //, add https:
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }
  
  return null;
};

export default function StepLocation() {
  const router = useRouter();
  const { formData, updateField, nextStep, prevStep, editMode, projectId } = useProjectForm();

  // Nearby locations state
  const [nearbyLocations, setNearbyLocations] = useState(
    formData.nearby_locations || []
  );

  // Extract valid map URL for preview
  const previewUrl = useMemo(() => {
    return extractMapUrl(formData.location_link);
  }, [formData.location_link]);

  // Check if user pasted full iframe tag (to show helpful message)
  const isFullIframeTag = useMemo(() => {
    if (!formData.location_link) return false;
    const trimmed = formData.location_link.trim();
    return trimmed.includes('<iframe') || trimmed.includes('&lt;iframe');
  }, [formData.location_link]);

  // Add new nearby location
  const handleAddLocation = () => {
    const newLocation = {
      place_name: '',
      distance_value: '',
      distance_unit: 'min',
      category: 'landmark',
      place_link: '',
    };
    const updated = [...nearbyLocations, newLocation];
    setNearbyLocations(updated);
    updateField('nearby_locations', updated);
  };

  // Remove nearby location
  const handleRemoveLocation = (index) => {
    const updated = nearbyLocations.filter((_, i) => i !== index);
    setNearbyLocations(updated);
    updateField('nearby_locations', updated);
  };

  // Update nearby location field
  const handleLocationChange = (index, field, value) => {
    const updated = nearbyLocations.map((loc, i) => {
      if (i === index) {
        return { ...loc, [field]: value };
      }
      return loc;
    });
    setNearbyLocations(updated);
    updateField('nearby_locations', updated);
  };

  const handleNext = () => {
    if (nextStep()) {
      const basePath = editMode ? `/admin/projects/edit/${projectId}` : '/admin/projects/add';
      router.push(`${basePath}/media`);
    }
  };

  const handleBack = () => {
    prevStep();
    const basePath = editMode ? `/admin/projects/edit/${projectId}` : '/admin/projects/add';
    router.push(`${basePath}/content`);
  };
  
  return (
    <Box>
      {/* Project Location Map Section */}
      <Card
        elevation={0}
        sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200', mb: 3 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <MapOutlined color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Project Location
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>How to get Google Maps link:</strong><br />
            1. Go to <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">Google Maps</a><br />
            2. Search your project location<br />
            3. Click "Share" → "Embed a map"<br />
            4. Copy the <strong>entire iframe code</strong> OR just the src URL and paste below
          </Typography>
        </Alert>

        <Grid container spacing={3}>
          {/* Location Map Link */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Google Maps Embed URL"
              value={formData.location_link || ''}
              onChange={(e) => updateField('location_link', e.target.value)}
              placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." ...></iframe>'
              helperText={
                isFullIframeTag 
                  ? "✓ Full iframe tag detected - URL will be extracted automatically"
                  : "Paste the Google Maps embed iframe code or just the src URL"
              }
              multiline
              rows={2}
              InputProps={{
                endAdornment: previewUrl && (
                  <IconButton
                    size="small"
                    onClick={() => window.open(previewUrl, '_blank')}
                    title="Open in new tab"
                  >
                    <OpenInNewOutlined fontSize="small" />
                  </IconButton>
                ),
              }}
            />
          </Grid>

          {/* Preview - Show iframe if valid URL exists */}
          {previewUrl ? (
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                Map Preview
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: 300,
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <iframe
                  src={previewUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Preview"
                />
              </Box>
            </Grid>
          ) : formData.location_link ? (
            <Grid size={{ xs: 12 }}>
              <Alert severity="warning">
                Could not extract a valid URL from the input. Please paste the full iframe code from Google Maps.
              </Alert>
            </Grid>
          ) : null}
        </Grid>
      </Card>

      {/* Nearby Locations Section */}
      <Card
        elevation={0}
        sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Nearby Locations
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddOutlined />}
            onClick={handleAddLocation}
            size="small"
          >
            Add Location
          </Button>
        </Box>

        {nearbyLocations.length === 0 ? (
          <Box
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: 'grey.50',
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'grey.300',
            }}
          >
            <MapOutlined sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
            <Typography color="text.secondary">
              No nearby locations added yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Click "Add Location" to add nearby places like Metro stations, Malls, Schools, etc.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {nearbyLocations.map((location, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  bgcolor: 'grey.50',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" color="primary">
                    Location #{index + 1}
                  </Typography>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveLocation(index)}
                  >
                    <DeleteOutlined fontSize="small" />
                  </IconButton>
                </Box>

                <Grid container spacing={2}>
                  {/* Place Name */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Place Name *"
                      value={location.place_name}
                      onChange={(e) => handleLocationChange(index, 'place_name', e.target.value)}
                      placeholder="e.g., Dubai Mall, Metro Station"
                    />
                  </Grid>

                  {/* Category */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={location.category || 'landmark'}
                        onChange={(e) => handleLocationChange(index, 'category', e.target.value)}
                        label="Category"
                      >
                        {PLACE_CATEGORIES.map((cat) => (
                          <MenuItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Distance Value */}
                  <Grid size={{ xs: 6, md: 3 }}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Distance"
                      value={location.distance_value}
                      onChange={(e) => handleLocationChange(index, 'distance_value', e.target.value)}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>

                  {/* Distance Unit */}
                  <Grid size={{ xs: 6, md: 3 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Unit</InputLabel>
                      <Select
                        value={location.distance_unit || 'min'}
                        onChange={(e) => handleLocationChange(index, 'distance_unit', e.target.value)}
                        label="Unit"
                      >
                        {DISTANCE_UNITS.map((unit) => (
                          <MenuItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Google Maps Link for this place */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Google Maps Link (Optional)"
                      value={location.place_link || ''}
                      onChange={(e) => handleLocationChange(index, 'place_link', e.target.value)}
                      placeholder="https://maps.google.com/..."
                      InputProps={{
                        endAdornment: location.place_link && (
                          <IconButton
                            size="small"
                            onClick={() => window.open(location.place_link, '_blank')}
                            title="Open in new tab"
                          >
                            <OpenInNewOutlined fontSize="small" />
                          </IconButton>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        )}
      </Card>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackOutlined />}
          onClick={handleBack}
          sx={{
            borderColor: 'grey.300',
            color: 'text.secondary',
            '&:hover': { borderColor: 'grey.400', bgcolor: 'grey.50' },
          }}
        >
          Back
        </Button>

        <Button
          variant="contained"
          endIcon={<ArrowForwardOutlined />}
          onClick={handleNext}
          sx={{
            bgcolor: 'primary.main',
            px: 4,
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}