'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Chip,
  IconButton,
} from '@mui/material';
import {
  SaveOutlined,
  ArrowBackOutlined,
  AddOutlined,
  DeleteOutlined,
} from '@mui/icons-material';
import { AMENITIES } from '@/data/amenities';
import { LOCATION_TYPES, DISTANCE_UNITS } from '@/data/locationTypes';

export default function ProjectForm({ projectId = null }) {
  const router = useRouter();
  const isEdit = Boolean(projectId);

  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    developer_id: '',
    project_name: '',
    project_code: '',
    locality: '',
    city: 'Dubai',
    usage_type: '',
    project_type: '',
    beds_range: '',
    area_range: '',
    total_towers: '',
    total_units: '',
    project_status: '',
    price_min: '',
    price_max: '',
    booking_amount: '',
    payment_plan: '',
    roi: '',
    handover_date: '',
    furnishing_status: '',
    highlights: [],
    amenities: [],
    featured: false,
    about: '',
  });

  const [nearbyLocations, setNearbyLocations] = useState([]);
  const [newHighlight, setNewHighlight] = useState('');

  // Fetch developers
  useEffect(() => {
    fetchDevelopers();
    if (isEdit) {
      fetchProject();
    } else {
      setFetching(false);
    }
  }, [projectId]);

  const fetchDevelopers = async () => {
    try {
      const res = await fetch('/api/developers');
      const data = await res.json();
      if (data.success) {
        setDevelopers(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch developers:', err);
    }
  };

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      const data = await res.json();

      if (data.success) {
        const project = data.data;
        setFormData({
          developer_id: project.developer_id || '',
          project_name: project.project_name || '',
          project_code: project.project_code || '',
          locality: project.locality || '',
          city: project.city || 'Dubai',
          usage_type: project.usage_type || '',
          project_type: project.project_type || '',
          beds_range: project.beds_range || '',
          area_range: project.area_range || '',
          total_towers: project.total_towers || '',
          total_units: project.total_units || '',
          project_status: project.project_status || '',
          price_min: project.price_min || '',
          price_max: project.price_max || '',
          booking_amount: project.booking_amount || '',
          payment_plan: project.payment_plan || '',
          roi: project.roi || '',
          handover_date: project.handover_date ? project.handover_date.split('T')[0] : '',
          furnishing_status: project.furnishing_status || '',
          highlights: project.highlights || [],
          amenities: project.amenities || [],
          featured: project.featured || false,
          about: project.about || '',
        });
        setNearbyLocations(project.nearby_locations || []);
      } else {
        setError('Project not found');
      }
    } catch (err) {
      setError('Failed to fetch project');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
    setSuccess('');
  };

  const handleAmenityToggle = (amenity) => {
    const updated = formData.amenities.includes(amenity)
      ? formData.amenities.filter((a) => a !== amenity)
      : [...formData.amenities, amenity];
    setFormData({ ...formData, amenities: updated });
  };

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setFormData({
        ...formData,
        highlights: [...formData.highlights, newHighlight.trim()],
      });
      setNewHighlight('');
    }
  };

  const handleRemoveHighlight = (index) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((_, i) => i !== index),
    });
  };

  const handleAddNearby = () => {
    setNearbyLocations([
      ...nearbyLocations,
      { place_name: '', distance_value: '', distance_unit: 'km', category: '' },
    ]);
  };

  const handleNearbyChange = (index, field, value) => {
    const updated = [...nearbyLocations];
    updated[index][field] = value;
    setNearbyLocations(updated);
  };

  const handleRemoveNearby = (index) => {
    setNearbyLocations(nearbyLocations.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const url = isEdit ? `/api/projects/${projectId}` : '/api/projects';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        nearby_locations: nearbyLocations.filter((n) => n.place_name),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(data.message);
        setTimeout(() => {
          router.push('/admin/projects');
        }, 1000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {success}
        </Alert>
      )}

      {/* Section 1: Basic Details */}
      <Card
        elevation={0}
        sx={{ p: 4, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontStyle: 'normal' }}>
          Basic Details
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6}}>
            <FormControl fullWidth required>
              <InputLabel>Developer</InputLabel>
              <Select
                name="developer_id"
                value={formData.developer_id}
                onChange={handleChange}
                label="Developer"
              >
                {developers.map((dev) => (
                  <MenuItem key={dev.developer_id} value={dev.developer_id}>
                    {dev.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6}}>
            <TextField
              fullWidth
              required
              label="Project Name"
              name="project_name"
              value={formData.project_name}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4}}>
            <TextField
              fullWidth
              label="Project Code"
              name="project_code"
              value={formData.project_code}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4}}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4}}>
            <TextField
              fullWidth
              label="Locality"
              name="locality"
              value={formData.locality}
              onChange={handleChange}
              placeholder="e.g., Downtown Dubai"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4}}>
            <FormControl fullWidth required>
              <InputLabel>Usage Type</InputLabel>
              <Select
                name="usage_type"
                value={formData.usage_type}
                onChange={handleChange}
                label="Usage Type"
              >
                <MenuItem value="Residential">Residential</MenuItem>
                <MenuItem value="Commercial">Commercial</MenuItem>
                <MenuItem value="Both">Both</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4}}>
            <TextField
              fullWidth
              label="Project Type"
              name="project_type"
              value={formData.project_type}
              onChange={handleChange}
              placeholder="e.g., Apartment, Villa, Townhouse"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4}}>
            <FormControl fullWidth required>
              <InputLabel>Project Status</InputLabel>
              <Select
                name="project_status"
                value={formData.project_status}
                onChange={handleChange}
                label="Project Status"
              >
                <MenuItem value="New Launch">New Launch</MenuItem>
                <MenuItem value="Under Construction">Under Construction</MenuItem>
                <MenuItem value="Ready">Ready</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Section 2: Project Info */}
      <Card
        elevation={0}
        sx={{ p: 4, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontStyle: 'normal' }}>
          Project Information
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3}}>
            <TextField
              fullWidth
              label="Beds Range"
              name="beds_range"
              value={formData.beds_range}
              onChange={handleChange}
              placeholder="e.g., 1-4 BR"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3}}>
            <TextField
              fullWidth
              label="Area Range"
              name="area_range"
              value={formData.area_range}
              onChange={handleChange}
              placeholder="e.g., 500-2000 sqft"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3}}>
            <TextField
              fullWidth
              type="number"
              label="Total Towers"
              name="total_towers"
              value={formData.total_towers}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3}}>
            <TextField
              fullWidth
              type="number"
              label="Total Units"
              name="total_units"
              value={formData.total_units}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4}}>
            <FormControl fullWidth>
              <InputLabel>Furnishing Status</InputLabel>
              <Select
                name="furnishing_status"
                value={formData.furnishing_status}
                onChange={handleChange}
                label="Furnishing Status"
              >
                <MenuItem value="">Not Specified</MenuItem>
                <MenuItem value="Unfurnished">Unfurnished</MenuItem>
                <MenuItem value="Semi-Furnished">Semi-Furnished</MenuItem>
                <MenuItem value="Furnished">Furnished</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4}}>
            <TextField
              fullWidth
              type="date"
              label="Handover Date"
              name="handover_date"
              value={formData.handover_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4}}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.featured}
                  onChange={handleChange}
                  name="featured"
                  sx={{
                    color: 'primary.main',
                    '&.Mui-checked': { color: 'primary.main' },
                  }}
                />
              }
              label="Featured Project"
            />
          </Grid>
        </Grid>
      </Card>

      {/* Section 3: Pricing */}
      <Card
        elevation={0}
        sx={{ p: 4, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontStyle: 'normal' }}>
          Pricing Details
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4}}>
            <TextField
              fullWidth
              label="Min Price"
              name="price_min"
              value={formData.price_min}
              onChange={handleChange}
              placeholder="e.g., AED 1,200,000"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4}}>
            <TextField
              fullWidth
              label="Max Price"
              name="price_max"
              value={formData.price_max}
              onChange={handleChange}
              placeholder="e.g., AED 5,500,000"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4}}>
            <TextField
              fullWidth
              label="Booking Amount"
              name="booking_amount"
              value={formData.booking_amount}
              onChange={handleChange}
              placeholder="e.g., AED 50,000"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6}}>
            <TextField
              fullWidth
              label="Payment Plan"
              name="payment_plan"
              value={formData.payment_plan}
              onChange={handleChange}
              placeholder="e.g., 60/40, 70/30"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6}}>
            <TextField
              fullWidth
              label="Expected ROI"
              name="roi"
              value={formData.roi}
              onChange={handleChange}
              placeholder="e.g., 8%"
            />
          </Grid>
        </Grid>
      </Card>

      {/* Section 4: Description */}
      <Card
        elevation={0}
        sx={{ p: 4, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontStyle: 'normal' }}>
          Description
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12}}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="About Project"
              name="about"
              value={formData.about}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12}}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Highlights
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Add a highlight point"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHighlight())}
              />
              <Button
                variant="outlined"
                onClick={handleAddHighlight}
                sx={{ borderColor: 'primary.main', color: 'primary.main' }}
              >
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.highlights.map((h, i) => (
                <Chip
                  key={i}
                  label={h}
                  onDelete={() => handleRemoveHighlight(i)}
                  sx={{ bgcolor: 'grey.100' }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Section 5: Amenities */}
      <Card
        elevation={0}
        sx={{ p: 4, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontStyle: 'normal' }}>
          Amenities
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {AMENITIES.map((amenity) => (
            <Chip
              key={amenity}
              label={amenity}
              onClick={() => handleAmenityToggle(amenity)}
              sx={{
                cursor: 'pointer',
                bgcolor: formData.amenities.includes(amenity) ? 'primary.main' : 'grey.100',
                color: formData.amenities.includes(amenity) ? '#fff' : 'text.primary',
                '&:hover': {
                  bgcolor: formData.amenities.includes(amenity) ? 'primary.dark' : 'grey.200',
                },
              }}
            />
          ))}
        </Box>

        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
          {formData.amenities.length} amenities selected
        </Typography>
      </Card>

      {/* Section 6: Nearby Locations */}
      <Card
        elevation={0}
        sx={{ p: 4, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontStyle: 'normal' }}>
            Nearby Locations
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddOutlined />}
            onClick={handleAddNearby}
            sx={{ borderColor: 'primary.main', color: 'primary.main' }}
          >
            Add Location
          </Button>
        </Box>

        {nearbyLocations.map((location, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              mb: 2,
              bgcolor: 'grey.50',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 3}}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={location.category}
                    onChange={(e) => handleNearbyChange(index, 'category', e.target.value)}
                    label="Category"
                  >
                    {LOCATION_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 4}}>
                <TextField
                  fullWidth
                  size="small"
                  label="Place Name"
                  value={location.place_name}
                  onChange={(e) => handleNearbyChange(index, 'place_name', e.target.value)}
                  placeholder="e.g., Dubai Mall"
                />
              </Grid>

              <Grid size={{ xs: 6, md: 2}}>
                <TextField
                  fullWidth
                  size="small"
                  label="Distance"
                  value={location.distance_value}
                  onChange={(e) => handleNearbyChange(index, 'distance_value', e.target.value)}
                  placeholder="e.g., 5"
                />
              </Grid>

              <Grid size={{ xs: 6, md: 2}}>
                <FormControl fullWidth size="small">
                  <InputLabel>Unit</InputLabel>
                  <Select
                    value={location.distance_unit}
                    onChange={(e) => handleNearbyChange(index, 'distance_unit', e.target.value)}
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

              <Grid size={{ xs: 12}} md={1}>
                <IconButton
                  onClick={() => handleRemoveNearby(index)}
                  sx={{ color: 'error.main' }}
                >
                  <DeleteOutlined />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}

        {nearbyLocations.length === 0 && (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            No nearby locations added yet
          </Typography>
        )}
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackOutlined />}
          onClick={() => router.push('/admin/projects')}
          sx={{
            borderColor: 'grey.300',
            color: 'text.secondary',
            '&:hover': { borderColor: 'grey.400', bgcolor: 'grey.50' },
          }}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="contained"
          startIcon={loading ? null : <SaveOutlined />}
          disabled={loading}
          sx={{
            bgcolor: 'primary.main',
            color: '#fff',
            px: 4,
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: '#fff' }} />
          ) : isEdit ? (
            'Update Project'
          ) : (
            'Add Project'
          )}
        </Button>
      </Box>
    </form>
  );
}