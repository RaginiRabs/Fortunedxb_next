'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBackOutlined,
  SaveOutlined,
  StarOutlined,
} from '@mui/icons-material';
// import PageHeader from '@/components/admin/PageHeader';
import FileUpload from '@/components/admin/FileUpload';
import { useCreateTestimonial } from '@/hooks/testimonial/useTestimonialsHook';
import api from '@/lib/axios';

// Initial form state
const initialFormState = {
  client_name: '',
  client_designation: '',
  client_location: 'Dubai, UAE',
  client_image: null,
  client_image_preview: '',
  rating: 5,
  review_text: '',
  project_id: '',
  is_featured: false,
  is_active: true,
};

export default function AddTestimonialPage() {
  const router = useRouter();
  const { createTestimonial, loading } = useCreateTestimonial();

  // Local state
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [projects, setProjects] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/api/projects');
      if (res.data.success) {
        setProjects(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  // Update form field
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.client_name?.trim()) {
      newErrors.client_name = 'Client name is required';
    }

    if (!formData.review_text?.trim()) {
      newErrors.review_text = 'Review text is required';
    } else if (formData.review_text.trim().length < 20) {
      newErrors.review_text = 'Review must be at least 20 characters';
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append('client_name', formData.client_name.trim());
    formDataToSend.append('client_designation', formData.client_designation?.trim() || '');
    formDataToSend.append('client_location', formData.client_location?.trim() || 'Dubai, UAE');
    formDataToSend.append('rating', formData.rating);
    formDataToSend.append('review_text', formData.review_text.trim());
    formDataToSend.append('project_id', formData.project_id || '');
    formDataToSend.append('is_featured', formData.is_featured);
    formDataToSend.append('is_active', formData.is_active);

    if (formData.client_image) {
      formDataToSend.append('client_image', formData.client_image);
    }

    const result = await createTestimonial(formDataToSend);

    if (result.success) {
      setSnackbar({
        open: true,
        message: 'Testimonial created successfully!',
        severity: 'success',
      });
      setTimeout(() => {
        router.push('/admin/testimonials');
      }, 1000);
    } else {
      setSnackbar({
        open: true,
        message: result.error || 'Something went wrong',
        severity: 'error',
      });
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push('/admin/testimonials');
  };

  return (
    <Box>
      {/* Page Header */}
      {/* <PageHeader
        title="Add Testimonial"
        subtitle="Create a new client testimonial"
        backButton={
          <Button
            startIcon={<ArrowBackOutlined />}
            onClick={handleCancel}
            sx={{ color: 'text.secondary', mr: 2 }}
          >
            Back
          </Button>
        }
      /> */}

      {/* Form Card */}
      <Card
        elevation={0}
        sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Testimonial Details
        </Typography>

        <Grid container spacing={3}>
          {/* Client Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Client Name"
              value={formData.client_name}
              onChange={(e) => updateField('client_name', e.target.value)}
              error={Boolean(errors.client_name)}
              helperText={errors.client_name}
            />
          </Grid>

          {/* Client Designation */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Designation / Title"
              value={formData.client_designation}
              onChange={(e) => updateField('client_designation', e.target.value)}
              placeholder="e.g., Business Owner, Investor"
            />
          </Grid>

          {/* Client Location */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              value={formData.client_location}
              onChange={(e) => updateField('client_location', e.target.value)}
              placeholder="e.g., Dubai, UAE"
            />
          </Grid>

          {/* Rating */}
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Rating *
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Rating
                value={formData.rating}
                onChange={(e, newValue) => updateField('rating', newValue || 1)}
                size="large"
                icon={<StarOutlined sx={{ color: '#F59E0B' }} />}
                emptyIcon={<StarOutlined sx={{ color: '#E2E8F0' }} />}
              />
              <Typography variant="body2" color="text.secondary">
                ({formData.rating}/5)
              </Typography>
            </Box>
            {errors.rating && (
              <Typography variant="caption" color="error">
                {errors.rating}
              </Typography>
            )}
          </Grid>

          {/* Review Text */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              multiline
              rows={4}
              label="Review Text"
              value={formData.review_text}
              onChange={(e) => updateField('review_text', e.target.value)}
              error={Boolean(errors.review_text)}
              helperText={errors.review_text || 'Minimum 20 characters'}
              placeholder="Enter the client's testimonial..."
            />
          </Grid>

          {/* Project Selection */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Related Project (Optional)</InputLabel>
              <Select
                value={formData.project_id}
                onChange={(e) => updateField('project_id', e.target.value)}
                label="Related Project (Optional)"
              >
                <MenuItem value="">None</MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project.project_id} value={project.project_id}>
                    {project.project_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Client Image */}
          <Grid item xs={12} sm={6}>
            <FileUpload
              name="client_image"
              label="Client Photo"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              maxSize={2}
              helperText="Recommended: 150x150px (Square)"
              value={formData.client_image}
              onChange={(file) => {
                updateField('client_image', file);
                updateField('client_image_preview', URL.createObjectURL(file));
              }}
              onRemove={() => {
                updateField('client_image', null);
                updateField('client_image_preview', '');
              }}
            />
          </Grid>

          {/* Switches */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_featured}
                    onChange={(e) => updateField('is_featured', e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Featured on Homepage
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Display this testimonial on the homepage
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => updateField('is_active', e.target.checked)}
                    color="success"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Active
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Show this testimonial on the website
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
          sx={{
            borderColor: 'grey.300',
            color: 'text.secondary',
            px: 3,
            '&:hover': { borderColor: 'grey.400', bgcolor: 'grey.50' },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <SaveOutlined />}
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            bgcolor: 'primary.main',
            px: 4,
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          {loading ? 'Creating...' : 'Create Testimonial'}
        </Button>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}