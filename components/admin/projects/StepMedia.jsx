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
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBackOutlined,
  SaveOutlined,
  VideoLibraryOutlined,
  InfoOutlined,
} from '@mui/icons-material';
import { useProjectForm } from '@/contexts/ProjectFormContext';
import FileUpload from '@/components/admin/FileUpload';
import MultiFileUpload from '@/components/admin/MultiFileUpload';
import useToast from '@/hooks/useToast';
import api, { apiFormData } from '@/lib/axios';

export default function StepMedia() {
  const router = useRouter();
  const toast = useToast();
  const {
    formData,
    updateField,
    updateFields,
    addDeletedGalleryId,
    addDeletedFloorplanId,
    addDeletedTaxsheetId,
    addDeletedPaymentplanId,
    prevStep,
    editMode,
    projectId,
    setIsSaving,
    isSaving,
    getSubmitData,
    getFiles,
    clearForm,
    errors,
    setErrors,
  } = useProjectForm();

  const [developers, setDevelopers] = useState([]);
  const [submitError, setSubmitError] = useState('');

  // Existing files state
  const [existingGallery, setExistingGallery] = useState([]);
  const [existingFloorPlans, setExistingFloorPlans] = useState([]);
  const [existingBrochure, setExistingBrochure] = useState(null);
  const [existingTaxSheets, setExistingTaxSheets] = useState([]);
  const [existingPaymentPlans, setExistingPaymentPlans] = useState([]);

  useEffect(() => {
    fetchDevelopers();

    if (editMode) {
      if (formData.existing_gallery) setExistingGallery(formData.existing_gallery);
      if (formData.existing_floor_plans) setExistingFloorPlans(formData.existing_floor_plans);
      if (formData.existing_brochure) setExistingBrochure(formData.existing_brochure);
      if (formData.existing_tax_sheets) setExistingTaxSheets(formData.existing_tax_sheets);
      if (formData.existing_payment_plans) setExistingPaymentPlans(formData.existing_payment_plans);
    }
  }, [editMode, formData.existing_gallery, formData.existing_floor_plans, formData.existing_brochure, formData.existing_tax_sheets, formData.existing_payment_plans]);

  const fetchDevelopers = async () => {
    try {
      const res = await api.get('/api/developers');
      if (res.data.success) {
        setDevelopers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch developers:', err);
    }
  };

  const getDeveloperName = () => {
    const dev = developers.find((d) => d.developer_id === formData.developer_id);
    return dev?.name || '';
  };

  // Remove handlers for existing files
  const handleRemoveExistingGallery = (file) => {
    if (file.file_id) addDeletedGalleryId(file.file_id);
    setExistingGallery((prev) => prev.filter((f) => f.file_id !== file.file_id));
  };

  const handleRemoveExistingFloorPlan = (file) => {
    if (file.file_id) addDeletedFloorplanId(file.file_id);
    setExistingFloorPlans((prev) => prev.filter((f) => f.file_id !== file.file_id));
  };

  const handleRemoveExistingTaxSheet = (file) => {
    if (file.file_id) addDeletedTaxsheetId(file.file_id);
    setExistingTaxSheets((prev) => prev.filter((f) => f.file_id !== file.file_id));
  };

  const handleRemoveExistingPaymentPlan = (file) => {
    if (file.file_id) addDeletedPaymentplanId(file.file_id);
    setExistingPaymentPlans((prev) => prev.filter((f) => f.file_id !== file.file_id));
  };

  const handleBack = () => {
    prevStep();
    const basePath = editMode ? `/admin/projects/edit/${projectId}` : '/admin/projects/add';
    router.push(`${basePath}/location`);
  };

  const handleSubmit = async () => {
    setSubmitError('');
    setIsSaving(true);

    try {
      // SEO Validation
      if (formData.seo_city && formData.seo_city !== formData.city) {
        setErrors({ seo_city: 'City must match project city' });
        setSubmitError('SEO city does not match project city');
        setIsSaving(false);
        return;
      }

      const developerName = getDeveloperName();
      if (formData.seo_developer_name && formData.seo_developer_name !== developerName) {
        setErrors({ seo_developer_name: 'Developer name must match selected developer' });
        setSubmitError('SEO developer name does not match selected developer');
        setIsSaving(false);
        return;
      }

      const submitFormData = new FormData();
      const data = getSubmitData();
      const files = getFiles();

      submitFormData.append('data', JSON.stringify(data));

      // Project Logo
      if (files.project_logo) {
        submitFormData.append('project_logo', files.project_logo);
      }

      // Gallery Images
      files.gallery_images.forEach((file, index) => {
        submitFormData.append(`gallery_${index}`, file);
      });
      submitFormData.append('gallery_count', files.gallery_images.length);

      // Floor Plans
      files.floor_plans.forEach((file, index) => {
        submitFormData.append(`floorplan_${index}`, file);
      });
      submitFormData.append('floorplan_count', files.floor_plans.length);

      // Brochure
      if (files.brochure) {
        submitFormData.append('brochure', files.brochure);
      }

      // Tax Sheets
      files.tax_sheets.forEach((file, index) => {
        submitFormData.append(`taxsheet_${index}`, file);
      });
      submitFormData.append('taxsheet_count', files.tax_sheets.length);

      // Payment Plans
      files.payment_plans.forEach((file, index) => {
        submitFormData.append(`paymentplan_${index}`, file);
      });
      submitFormData.append('paymentplan_count', files.payment_plans.length);

      // Config-wise Unit Plans
      const configUnitPlanMeta = [];
      files.config_unit_plans.forEach(({ configIndex, fileIndex, file }) => {
        submitFormData.append(`config_unitplan_${configIndex}_${fileIndex}`, file);
        configUnitPlanMeta.push({ configIndex, fileIndex });
      });
      submitFormData.append('config_unitplan_meta', JSON.stringify(configUnitPlanMeta));
      submitFormData.append('config_unitplan_count', files.config_unit_plans.length);

      const url = editMode ? `/api/projects/${projectId}` : '/api/projects';
      const method = editMode ? 'put' : 'post';

      const res = await apiFormData[method](url, submitFormData);

      if (res.data.success) {
        toast.success(res.data.message || (editMode ? 'Project updated successfully' : 'Project created successfully'));
        clearForm();
        router.push('/admin/projects');
      } else {
        setSubmitError(res.data.message || 'Failed to save project');
        toast.error(res.data.message || 'Failed to save project');
      }
    } catch (err) {
      console.error('Submit error:', err);
      const errorMsg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setSubmitError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box>
      {submitError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {submitError}
        </Alert>
      )}

      {/* Video URL Section */}
      <Card
        elevation={0}
        sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Project Video
        </Typography>

        <TextField
          fullWidth
          label="Video URL"
          value={formData.video_url || ''}
          onChange={(e) => updateField('video_url', e.target.value)}
          placeholder="https://www.youtube.com/embed/... or https://vimeo.com/..."
          helperText="YouTube or Vimeo embed URL"
          InputProps={{
            startAdornment: <VideoLibraryOutlined sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Card>

      {/* Brochure Section */}
      <Card
        elevation={0}
        sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          E-Brochure
        </Typography>

        <FileUpload
          name="brochure"
          label="Upload Brochure (PDF)"
          accept="application/pdf,.pdf"
          maxSize={10}
          helperText="Max 10MB, PDF only"
          existingFile={existingBrochure}
          value={formData.brochure}
          compact={true}
          onChange={(file) => {
            updateFields({
              brochure: file,
              brochure_name: file?.name || '',
            });
          }}
          onRemove={() => {
            updateFields({
              brochure: null,
              brochure_name: '',
            });
            setExistingBrochure(null);
          }}
        />
      </Card>

      {/* Gallery & Floor Plans */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Gallery Images
            </Typography>

            <MultiFileUpload
              name="gallery_images"
              label="Gallery Images"
              accept="image/jpeg,image/png,image/webp"
              maxSize={5}
              maxFiles={20}
              helperText="Recommended: 1366x768px"
              existingFiles={existingGallery}
              value={formData.gallery_images}
              onChange={(files) => updateField('gallery_images', files)}
              onRemoveExisting={handleRemoveExistingGallery}
            />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Floor Plans
            </Typography>

            <MultiFileUpload
              name="floor_plans"
              label="Floor Plans"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              maxSize={5}
              maxFiles={20}
              helperText="Recommended: 1366x768px"
              existingFiles={existingFloorPlans}
              value={formData.floor_plans}
              onChange={(files) => updateField('floor_plans', files)}
              onRemoveExisting={handleRemoveExistingFloorPlan}
            />
          </Card>
        </Grid>
      </Grid>

      {/* Tax Sheet & Payment Plan */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Tax Sheet
            </Typography>

            <MultiFileUpload
              name="tax_sheets"
              label="Tax Sheet Documents"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              maxSize={5}
              maxFiles={10}
              helperText="Images or PDF"
              existingFiles={existingTaxSheets}
              value={formData.tax_sheets}
              onChange={(files) => updateField('tax_sheets', files)}
              onRemoveExisting={handleRemoveExistingTaxSheet}
            />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Payment Plan Documents
            </Typography>

            <MultiFileUpload
              name="payment_plans"
              label="Payment Plan Documents"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              maxSize={5}
              maxFiles={10}
              helperText="Images or PDF"
              existingFiles={existingPaymentPlans}
              value={formData.payment_plans}
              onChange={(files) => updateField('payment_plans', files)}
              onRemoveExisting={handleRemoveExistingPaymentPlan}
            />
          </Card>
        </Grid>
      </Grid>

      {/* SEO Section */}
      <Card
        elevation={0}
        sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          SEO Details
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          These fields are used for search engine optimization. Once saved, they cannot be edited.
        </Typography>

        {editMode && (
          <Alert severity="info" sx={{ mb: 3 }}>
            SEO fields cannot be edited after project creation.
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Developer Name (for SEO)"
              value={formData.seo_developer_name}
              onChange={(e) => updateField('seo_developer_name', e.target.value)}
              placeholder={getDeveloperName()}
              error={Boolean(errors.seo_developer_name)}
              helperText={errors.seo_developer_name || `Must match: ${getDeveloperName()}`}
              disabled={editMode}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="City (for SEO)"
              value={formData.seo_city}
              onChange={(e) => updateField('seo_city', e.target.value)}
              placeholder={formData.city}
              error={Boolean(errors.seo_city)}
              helperText={errors.seo_city || `Must match: ${formData.city}`}
              disabled={editMode}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Meta Title"
              value={formData.meta_title}
              onChange={(e) => updateField('meta_title', e.target.value)}
              placeholder="e.g., Binghatti Ivory - Luxury Apartments in Dubai"
              helperText={`${formData.meta_title?.length || 0}/60 characters recommended`}
              disabled={editMode}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Meta Keywords"
              value={formData.meta_keywords}
              onChange={(e) => updateField('meta_keywords', e.target.value)}
              placeholder="e.g., dubai apartments, binghatti, downtown dubai, luxury living"
              disabled={editMode}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Meta Description"
              value={formData.meta_description}
              onChange={(e) => updateField('meta_description', e.target.value)}
              placeholder="e.g., Discover luxury living at Binghatti Ivory..."
              helperText={`${formData.meta_description?.length || 0}/160 characters recommended`}
              disabled={editMode}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Rich Snippets (JSON-LD)"
              value={formData.rich_snippets}
              onChange={(e) => updateField('rich_snippets', e.target.value)}
              placeholder='{"@context": "https://schema.org", "@type": "RealEstateAgent", ...}'
              disabled={editMode}
            />
          </Grid>
        </Grid>
      </Card>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackOutlined />}
          onClick={handleBack}
          disabled={isSaving}
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
          startIcon={isSaving ? null : <SaveOutlined />}
          onClick={handleSubmit}
          disabled={isSaving}
          sx={{
            bgcolor: 'primary.main',
            px: 4,
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          {isSaving ? (
            <CircularProgress size={24} sx={{ color: '#fff' }} />
          ) : editMode ? (
            'Update Project'
          ) : (
            'Save Project'
          )}
        </Button>
      </Box>
    </Box>
  );
}