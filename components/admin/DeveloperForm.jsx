'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Card,
  Button,
  Grid,
  TextField,
  Alert,
  CircularProgress,
  Typography,
  InputAdornment,
  FormControlLabel,
  Switch,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from '@mui/material';
import {
  SaveOutlined,
  ArrowBackOutlined,
  BusinessOutlined,
  EmailOutlined,
  LanguageOutlined,
  LocationOnOutlined,
  CalendarTodayOutlined,
  EmojiEventsOutlined,
  VerifiedOutlined,
  FacebookOutlined,
  Instagram,
  LinkedIn,
  YouTube,
  BadgeOutlined,
  AddOutlined,
  DeleteOutlined,
  ImageOutlined,
} from '@mui/icons-material';
import { MuiTelInput } from 'mui-tel-input';
import FileUpload from './FileUpload';
import useToast from '@/hooks/useToast';
import api, { apiFormData } from '@/lib/axios';

// Validation Schema
const validationSchema = Yup.object({
  name: Yup.string()
    .required('Developer name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must be less than 255 characters'),
  tagline: Yup.string()
    .max(255, 'Tagline must be less than 255 characters')
    .nullable(),
  description: Yup.string().nullable(),
  established_year: Yup.number()
    .min(1900, 'Invalid year')
    .max(new Date().getFullYear(), 'Year cannot be in future')
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  headquarters: Yup.string().max(150, 'Max 150 characters').nullable(),
  total_projects: Yup.number()
    .min(0, 'Cannot be negative')
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  completed_projects: Yup.number()
    .min(0, 'Cannot be negative')
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  ongoing_projects: Yup.number()
    .min(0, 'Cannot be negative')
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  awards_count: Yup.number()
    .min(0, 'Cannot be negative')
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  countries_present: Yup.number()
    .min(1, 'Minimum 1')
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  website_url: Yup.string().url('Must be a valid URL').nullable(),
  contact_email: Yup.string().email('Must be a valid email').nullable(),
  contact_phone: Yup.string().nullable(),
  facebook_url: Yup.string().url('Must be a valid URL').nullable(),
  instagram_url: Yup.string().url('Must be a valid URL').nullable(),
  linkedin_url: Yup.string().url('Must be a valid URL').nullable(),
  youtube_url: Yup.string().url('Must be a valid URL').nullable(),
});

// Initial Values
const initialValues = {
  name: '',
  logo: null,
  cover_image: null,
  tagline: '',
  description: '',
  established_year: '',
  headquarters: 'Dubai, UAE',
  total_projects: '',
  completed_projects: '',
  ongoing_projects: '',
  awards_count: '',
  countries_present: 1,
  is_verified: false,
  website_url: '',
  contact_email: '',
  contact_phone: '',
  contact_phone_ccode: '', // Country calling code
  facebook_url: '',
  instagram_url: '',
  linkedin_url: '',
  youtube_url: '',
  removeLogo: false,
  removeCover: false,
};

export default function DeveloperForm({ developerId = null }) {
  const router = useRouter();
  const toast = useToast();
  const isEdit = Boolean(developerId);

  const [initialData, setInitialData] = useState(initialValues);
  const [existingLogo, setExistingLogo] = useState(null);
  const [existingCover, setExistingCover] = useState(null);
  const [fetching, setFetching] = useState(isEdit);
  const [fetchError, setFetchError] = useState('');

  // Awards State
  const [awards, setAwards] = useState([]);

  useEffect(() => {
    if (isEdit) {
      fetchDeveloper();
    }
  }, [developerId]);

  const fetchDeveloper = async () => {
    try {
      const res = await api.get(`/api/developers/${developerId}`);

      if (res.data.success) {
        const dev = res.data.data;
        setInitialData({
          name: dev.name || '',
          logo: null,
          cover_image: null,
          tagline: dev.tagline || '',
          description: dev.description || '',
          established_year: dev.established_year || '',
          headquarters: dev.headquarters || 'Dubai, UAE',
          total_projects: dev.total_projects || '',
          completed_projects: dev.completed_projects || '',
          ongoing_projects: dev.ongoing_projects || '',
          awards_count: dev.awards_count || '',
          countries_present: dev.countries_present || 1,
          is_verified: dev.is_verified || false,
          website_url: dev.website_url || '',
          contact_email: dev.contact_email || '',
          contact_phone: dev.contact_phone || '',
          contact_phone_ccode: dev.contact_phone_ccode || '',
          facebook_url: dev.facebook_url || '',
          instagram_url: dev.instagram_url || '',
          linkedin_url: dev.linkedin_url || '',
          youtube_url: dev.youtube_url || '',
          removeLogo: false,
          removeCover: false,
        });
        setExistingLogo(dev.logo_path || null);
        setExistingCover(dev.cover_image || null);

        // Set existing awards
        if (dev.awards && dev.awards.length > 0) {
          setAwards(
            dev.awards.map((a) => ({
              award_id: a.award_id,
              award_name: a.award_name || '',
              awarding_body: a.awarding_body || '',
              year: a.year || '',
              image: null,
              image_path: a.image_path || '',
              removeImage: false,
            }))
          );
        }
      } else {
        setFetchError('Developer not found');
      }
    } catch (err) {
      setFetchError('Failed to fetch developer');
    } finally {
      setFetching(false);
    }
  };

  // Awards Handlers
  const handleAddAward = () => {
    setAwards([
      ...awards,
      {
        award_name: '',
        awarding_body: '',
        year: '',
        image: null,
        image_path: '',
        removeImage: false,
      },
    ]);
  };

  const handleRemoveAward = (index) => {
    setAwards(awards.filter((_, i) => i !== index));
  };

  const handleAwardChange = (index, field, value) => {
    const updated = [...awards];
    updated[index][field] = value;
    setAwards(updated);
  };

  const handleAwardImageChange = (index, file) => {
    const updated = [...awards];
    updated[index].image = file;
    updated[index].removeImage = false;
    setAwards(updated);
  };

  const handleAwardImageRemove = (index) => {
    const updated = [...awards];
    updated[index].image = null;
    updated[index].image_path = '';
    updated[index].removeImage = true;
    setAwards(updated);
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const formData = new FormData();

      // Basic Info
      formData.append('name', values.name.trim());
      if (values.tagline) formData.append('tagline', values.tagline.trim());
      if (values.description) formData.append('description', values.description.trim());

      // Stats
      if (values.established_year) formData.append('established_year', values.established_year);
      if (values.headquarters) formData.append('headquarters', values.headquarters.trim());
      if (values.total_projects !== '') formData.append('total_projects', values.total_projects);
      if (values.completed_projects !== '')
        formData.append('completed_projects', values.completed_projects);
      if (values.ongoing_projects !== '')
        formData.append('ongoing_projects', values.ongoing_projects);
      if (values.awards_count !== '') formData.append('awards_count', values.awards_count);
      if (values.countries_present) formData.append('countries_present', values.countries_present);

      // Status
      formData.append('is_verified', values.is_verified);

      // Contact
      if (values.website_url) formData.append('website_url', values.website_url.trim());
      if (values.contact_email) formData.append('contact_email', values.contact_email.trim());
      if (values.contact_phone) formData.append('contact_phone', values.contact_phone.trim());
      if (values.contact_phone_ccode) formData.append('contact_phone_ccode', values.contact_phone_ccode);

      // Social
      if (values.facebook_url) formData.append('facebook_url', values.facebook_url.trim());
      if (values.instagram_url) formData.append('instagram_url', values.instagram_url.trim());
      if (values.linkedin_url) formData.append('linkedin_url', values.linkedin_url.trim());
      if (values.youtube_url) formData.append('youtube_url', values.youtube_url.trim());

      // Logo
      if (values.logo instanceof File) {
        formData.append('logo', values.logo);
      }
      if (values.removeLogo) {
        formData.append('remove_logo', 'true');
      }

      // Cover Image
      if (values.cover_image instanceof File) {
        formData.append('cover_image', values.cover_image);
      }
      if (values.removeCover) {
        formData.append('remove_cover', 'true');
      }

      // Awards - Only include if has at least award_name
      const validAwards = awards.filter((a) => a.award_name && a.award_name.trim());
      formData.append(
        'awards_data',
        JSON.stringify(
          validAwards.map((a) => ({
            award_id: a.award_id || null,
            award_name: a.award_name.trim(),
            awarding_body: a.awarding_body?.trim() || null,
            year: a.year || null,
            image_path: a.image_path || null,
            removeImage: a.removeImage || false,
          }))
        )
      );

      // Awards images
      formData.append('awards_count_upload', validAwards.length);
      validAwards.forEach((award, index) => {
        if (award.image instanceof File) {
          formData.append(`award_image_${index}`, award.image);
        }
      });

      const url = isEdit ? `/api/developers/${developerId}` : '/api/developers';
      const method = isEdit ? 'put' : 'post';

      const res = await apiFormData[method](url, formData);

      if (res.data.success) {
        toast.success(res.data.message || `Developer ${isEdit ? 'updated' : 'created'} successfully`);
        setTimeout(() => {
          router.push('/admin/developers');
        }, 1000);
      } else {
        if (res.data.error?.fields) {
          setErrors(res.data.error.fields);
        }
        toast.error(res.data.error?.message || res.data.message || 'Something went wrong');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to save developer. Please try again.';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (fetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {fetchError}
      </Alert>
    );
  }

  return (
    <Formik
      initialValues={initialData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, setFieldValue, values, errors, touched, handleChange, handleBlur }) => (
        <Form>
          {/* Section 1: Basic Info */}
          <Card
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Basic Information
            </Typography>

            <Grid container spacing={3}>
              {/* Logo Upload */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FileUpload
                  name="logo"
                  label="Developer Logo"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  maxSize={2}
                  existingFile={existingLogo}
                  value={values.logo}
                  onChange={(file) => setFieldValue('logo', file)}
                  onRemove={() => {
                    setFieldValue('logo', null);
                    setFieldValue('removeLogo', true);
                    setExistingLogo(null);
                  }}
                  error={errors.logo}
                  touched={touched.logo}
                />
              </Grid>

              {/* Cover Image Upload */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FileUpload
                  name="cover_image"
                  label="Cover Image (Background)"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  maxSize={5}
                  existingFile={existingCover}
                  value={values.cover_image}
                  onChange={(file) => setFieldValue('cover_image', file)}
                  onRemove={() => {
                    setFieldValue('cover_image', null);
                    setFieldValue('removeCover', true);
                    setExistingCover(null);
                  }}
                  error={errors.cover_image}
                  touched={touched.cover_image}
                />
              </Grid>

              {/* Developer Name */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  required
                  name="name"
                  label="Developer Name"
                  placeholder="e.g., Emaar Properties"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessOutlined sx={{ color: 'grey.500' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              {/* Tagline */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  name="tagline"
                  label="Tagline"
                  placeholder="e.g., Luxury Residential • Commercial"
                  value={values.tagline}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.tagline && Boolean(errors.tagline)}
                  helperText={touched.tagline && errors.tagline}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeOutlined sx={{ color: 'grey.500' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              {/* Description */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  name="description"
                  label="About Developer"
                  placeholder="Write about the developer..."
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
              </Grid>

              {/* Verified Switch & RERA */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.is_verified}
                      onChange={(e) => setFieldValue('is_verified', e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VerifiedOutlined
                        sx={{ color: values.is_verified ? 'primary.main' : 'grey.400' }}
                      />
                      <Typography>Verified Developer</Typography>
                    </Box>
                  }
                />
              </Grid>
            </Grid>
          </Card>

          {/* Section 2: Stats */}
          <Card
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Statistics & Details
            </Typography>

            <Grid container spacing={3}>
              {/* Established Year */}
              <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  name="established_year"
                  label="Established Year"
                  placeholder="e.g., 2010"
                  value={values.established_year}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.established_year && Boolean(errors.established_year)}
                  helperText={touched.established_year && errors.established_year}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarTodayOutlined sx={{ color: 'grey.500' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              {/* Headquarters */}
              <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                  fullWidth
                  name="headquarters"
                  label="Headquarters"
                  placeholder="e.g., Dubai, UAE"
                  value={values.headquarters}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.headquarters && Boolean(errors.headquarters)}
                  helperText={touched.headquarters && errors.headquarters}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnOutlined sx={{ color: 'grey.500' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              {/* Total Projects */}
              <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  name="total_projects"
                  label="Total Projects"
                  placeholder="0"
                  value={values.total_projects}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.total_projects && Boolean(errors.total_projects)}
                  helperText={touched.total_projects && errors.total_projects}
                />
              </Grid>

              {/* Completed Projects */}
              <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  name="completed_projects"
                  label="Completed Projects"
                  placeholder="0"
                  value={values.completed_projects}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.completed_projects && Boolean(errors.completed_projects)}
                  helperText={touched.completed_projects && errors.completed_projects}
                />
              </Grid>

              {/* Ongoing Projects */}
              <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  name="ongoing_projects"
                  label="Ongoing Projects"
                  placeholder="0"
                  value={values.ongoing_projects}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.ongoing_projects && Boolean(errors.ongoing_projects)}
                  helperText={touched.ongoing_projects && errors.ongoing_projects}
                />
              </Grid>

              {/* Awards Count */}
              <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  name="awards_count"
                  label="Awards Count"
                  placeholder="0"
                  value={values.awards_count}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.awards_count && Boolean(errors.awards_count)}
                  helperText={touched.awards_count && errors.awards_count}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmojiEventsOutlined sx={{ color: 'grey.500' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              {/* Countries Present */}
              <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  name="countries_present"
                  label="Countries Present"
                  placeholder="1"
                  value={values.countries_present}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.countries_present && Boolean(errors.countries_present)}
                  helperText={touched.countries_present && errors.countries_present}
                />
              </Grid>
            </Grid>
          </Card>

          {/* Section 3: Contact Info */}
          <Card
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Contact Information
            </Typography>

            <Grid container spacing={3}>
              {/* Website URL */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  name="website_url"
                  label="Website URL"
                  placeholder="https://example.com"
                  value={values.website_url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.website_url && Boolean(errors.website_url)}
                  helperText={touched.website_url && errors.website_url}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LanguageOutlined sx={{ color: 'grey.500' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              {/* Contact Email */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  name="contact_email"
                  label="Contact Email"
                  type="email"
                  placeholder="contact@example.com"
                  value={values.contact_email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.contact_email && Boolean(errors.contact_email)}
                  helperText={touched.contact_email && errors.contact_email}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined sx={{ color: 'grey.500' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              {/* Contact Phone with MuiTelInput */}
              <Grid size={{ xs: 12, md: 6 }}>
                <MuiTelInput
                  fullWidth
                  name="contact_phone"
                  label="Contact Phone"
                  value={values.contact_phone || ''}
                  onChange={(value, info) => {
                    setFieldValue('contact_phone', value);
                    if (info && info.countryCallingCode) {
                      setFieldValue('contact_phone_ccode', info.countryCallingCode);
                    }
                  }}
                  onBlur={handleBlur}
                  defaultCountry="AE"
                  preferredCountries={['AE', 'SA', 'IN', 'PK', 'GB', 'US']}
                  forceCallingCode
                  focusOnSelectCountry
                  placeholder="50 123 4567"
                  error={touched.contact_phone && Boolean(errors.contact_phone)}
                  helperText={touched.contact_phone && errors.contact_phone}
                />
              </Grid>
            </Grid>
          </Card>

          {/* Section 4: Social Links */}
          <Card
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Social Media Links
            </Typography>

            <Grid container spacing={3}>
              {/* Facebook */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  name="facebook_url"
                  label="Facebook URL"
                  placeholder="https://facebook.com/developer"
                  value={values.facebook_url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.facebook_url && Boolean(errors.facebook_url)}
                  helperText={touched.facebook_url && errors.facebook_url}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <FacebookOutlined sx={{ color: '#1877F2' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              {/* Instagram */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  name="instagram_url"
                  label="Instagram URL"
                  placeholder="https://instagram.com/developer"
                  value={values.instagram_url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.instagram_url && Boolean(errors.instagram_url)}
                  helperText={touched.instagram_url && errors.instagram_url}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Instagram sx={{ color: '#E4405F' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              {/* LinkedIn */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  name="linkedin_url"
                  label="LinkedIn URL"
                  placeholder="https://linkedin.com/company/developer"
                  value={values.linkedin_url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.linkedin_url && Boolean(errors.linkedin_url)}
                  helperText={touched.linkedin_url && errors.linkedin_url}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkedIn sx={{ color: '#0A66C2' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              {/* YouTube */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  name="youtube_url"
                  label="YouTube URL"
                  placeholder="https://youtube.com/@developer"
                  value={values.youtube_url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.youtube_url && Boolean(errors.youtube_url)}
                  helperText={touched.youtube_url && errors.youtube_url}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <YouTube sx={{ color: '#FF0000' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Card>

          {/* Section 5: Awards */}
          <Card
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Awards & Recognition
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddOutlined />}
                onClick={handleAddAward}
                sx={{ borderColor: 'primary.main', color: 'primary.main' }}
              >
                Add Award
              </Button>
            </Box>

            {awards.length === 0 ? (
              <Box
                sx={{
                  py: 4,
                  textAlign: 'center',
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                }}
              >
                <EmojiEventsOutlined sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                <Typography color="text.secondary">No awards added yet</Typography>
                <Typography variant="body2" color="text.secondary">
                  Click "Add Award" to add developer awards
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Award Name *</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Awarding Body</TableCell>
                      <TableCell sx={{ fontWeight: 600, width: 100 }}>Year</TableCell>
                      <TableCell sx={{ fontWeight: 600, width: 120 }}>Image</TableCell>
                      <TableCell sx={{ fontWeight: 600, width: 60 }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {awards.map((award, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Best Developer 2023"
                            value={award.award_name}
                            onChange={(e) => handleAwardChange(index, 'award_name', e.target.value)}
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Dubai Property Awards"
                            value={award.awarding_body}
                            onChange={(e) => handleAwardChange(index, 'awarding_body', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            type="number"
                            placeholder="2023"
                            value={award.year}
                            onChange={(e) => handleAwardChange(index, 'year', e.target.value)}
                            slotProps={{
                              htmlInput: { min: 1900, max: new Date().getFullYear() },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {award.image_path && !award.removeImage ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar
                                src={`/${award.image_path}`}
                                variant="rounded"
                                sx={{ width: 40, height: 40 }}
                              />
                              <IconButton
                                size="small"
                                onClick={() => handleAwardImageRemove(index)}
                                sx={{ color: 'error.main' }}
                              >
                                <DeleteOutlined fontSize="small" />
                              </IconButton>
                            </Box>
                          ) : award.image ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar
                                src={URL.createObjectURL(award.image)}
                                variant="rounded"
                                sx={{ width: 40, height: 40 }}
                              />
                              <IconButton
                                size="small"
                                onClick={() => handleAwardImageChange(index, null)}
                                sx={{ color: 'error.main' }}
                              >
                                <DeleteOutlined fontSize="small" />
                              </IconButton>
                            </Box>
                          ) : (
                            <Button
                              component="label"
                              size="small"
                              variant="outlined"
                              startIcon={<ImageOutlined />}
                              sx={{ textTransform: 'none' }}
                            >
                              Upload
                              <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    handleAwardImageChange(index, e.target.files[0]);
                                  }
                                }}
                              />
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveAward(index)}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackOutlined />}
              onClick={() => router.push('/admin/developers')}
              disabled={isSubmitting}
              sx={{
                borderColor: 'grey.300',
                color: 'text.secondary',
                order: { xs: 2, sm: 1 },
                '&:hover': {
                  borderColor: 'grey.400',
                  bgcolor: 'grey.50',
                },
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              startIcon={!isSubmitting && <SaveOutlined />}
              disabled={isSubmitting}
              sx={{
                bgcolor: 'primary.main',
                color: '#fff',
                px: 4,
                order: { xs: 1, sm: 2 },
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : isEdit ? (
                'Update Developer'
              ) : (
                'Add Developer'
              )}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
}