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
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  ArrowForwardOutlined,
  ArrowBackOutlined,
  AddOutlined,
  DeleteOutlined,
} from '@mui/icons-material';
import {
  useProjectForm,
  emptyConfiguration,
  AREA_UNITS,
  CURRENCY_OPTIONS
} from '@/contexts/ProjectFormContext';
import { UNIT_TYPES } from '@/data/projectTypes';
import MultiFileUpload from '@/components/admin/MultiFileUpload';

export default function StepPricing() {
  const router = useRouter();
  const {
    formData,
    updateField,
    markUnitPlanForDeletion,
    nextStep,
    prevStep,
    editMode,
    projectId
  } = useProjectForm();

  const [customUnitTypes, setCustomUnitTypes] = useState({});

  // Initialize custom unit types for existing configs
  useEffect(() => {
    const customs = {};
    formData.configurations.forEach((config, index) => {
      if (config.type && !UNIT_TYPES.slice(0, -1).includes(config.type) && config.type !== 'Other') {
        customs[index] = config.type;
      }
    });
    setCustomUnitTypes(customs);
  }, []);

  const handleAddConfiguration = () => {
    const newConfig = { ...emptyConfiguration };
    updateField('configurations', [...formData.configurations, newConfig]);
  };

  const handleRemoveConfiguration = (index) => {
    const updated = formData.configurations.filter((_, i) => i !== index);
    updateField('configurations', updated);
    const newCustoms = { ...customUnitTypes };
    delete newCustoms[index];
    setCustomUnitTypes(newCustoms);
  };

  const handleConfigChange = (index, field, value) => {
    const updated = [...formData.configurations];
    updated[index] = { ...updated[index], [field]: value };

    if (field === 'is_range' && !value) {
      updated[index].area_max = updated[index].area_min;
      updated[index].price_max = updated[index].price_min;
    }

    if (!updated[index].is_range) {
      if (field === 'area_min') {
        updated[index].area_max = value;
      }
      if (field === 'price_min') {
        updated[index].price_max = value;
      }
    }

    updateField('configurations', updated);
  };

  const getUnitTypeSelectValue = (config, index) => {
    if (!config.type) return '';
    if (UNIT_TYPES.slice(0, -1).includes(config.type)) {
      return config.type;
    }
    return 'Other';
  };

  const isCustomUnitType = (config, index) => {
    return config.type === 'Other' || customUnitTypes[index] !== undefined ||
      (config.type && !UNIT_TYPES.slice(0, -1).includes(config.type));
  };

  const handleUnitTypeChange = (index, value) => {
    if (value === 'Other') {
      handleConfigChange(index, 'type', 'Other');
      setCustomUnitTypes({ ...customUnitTypes, [index]: '' });
    } else {
      handleConfigChange(index, 'type', value);
      const newCustoms = { ...customUnitTypes };
      delete newCustoms[index];
      setCustomUnitTypes(newCustoms);
    }
  };

  const handleCustomUnitTypeChange = (index, value) => {
    setCustomUnitTypes({ ...customUnitTypes, [index]: value });
    if (value.trim()) {
      handleConfigChange(index, 'type', value.trim());
    }
  };

  // Unit Plan handlers for MultiFileUpload
  const handleUnitPlanFilesChange = (configIndex, files) => {
    const updated = [...formData.configurations];
    updated[configIndex] = {
      ...updated[configIndex],
      unit_plan_files: files
    };
    updateField('configurations', updated);
  };

  const handleRemoveExistingUnitPlan = (configIndex, file) => {
    markUnitPlanForDeletion(configIndex, file.file_id);
  };

  const handleNext = () => {
    if (nextStep()) {
      const basePath = editMode ? `/admin/projects/edit/${projectId}` : '/admin/projects/add';
      router.push(`${basePath}/content`);
    }
  };

  const handleBack = () => {
    prevStep();
    const basePath = editMode ? `/admin/projects/edit/${projectId}` : '/admin/projects/add';
    router.push(`${basePath}/info`);
  };

  return (
    <Box>
      {/* Configuration Section */}
      <Card
        elevation={0}
        sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Unit Configurations
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddOutlined />}
            onClick={handleAddConfiguration}
            sx={{ borderColor: 'primary.main', color: 'primary.main' }}
          >
            Add Unit Type
          </Button>
        </Box>

        {formData.configurations.length > 0 ? (
          <Box>
            {formData.configurations.map((config, index) => (
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
                {/* Row 1: Unit Type + Range Toggle + Delete */}
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Grid size={{ xs: 12, md: isCustomUnitType(config, index) ? 3 : 4 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Unit Type</InputLabel>
                      <Select
                        value={getUnitTypeSelectValue(config, index)}
                        onChange={(e) => handleUnitTypeChange(index, e.target.value)}
                        label="Unit Type"
                      >
                        <MenuItem value="">Select Type</MenuItem>
                        {UNIT_TYPES.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {isCustomUnitType(config, index) && (
                    <Grid size={{ xs: 12, md: 3 }}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Specify Type"
                        value={customUnitTypes[index] || ''}
                        onChange={(e) => handleCustomUnitTypeChange(index, e.target.value)}
                        placeholder="e.g., Loft"
                      />
                    </Grid>
                  )}

                  <Grid size={{ xs: 6, md: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={config.is_range || false}
                          onChange={(e) => handleConfigChange(index, 'is_range', e.target.checked)}
                        />
                      }
                      label={
                        <Typography variant="body2">
                          {config.is_range ? 'Range' : 'Exact Value'}
                        </Typography>
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 4, md: 2 }}>
                    <TextField
                      size="small"
                      fullWidth
                      type="number"
                      label="Units"
                      value={config.units_available || ''}
                      onChange={(e) => handleConfigChange(index, 'units_available', e.target.value)}
                      placeholder="e.g., 50"
                      inputProps={{ min: 0 }}
                    />
                  </Grid>

                  <Grid size={{ xs: 2, md: 1 }}>
                    <IconButton
                      onClick={() => handleRemoveConfiguration(index)}
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  </Grid>
                </Grid>

                {/* Row 2: Area Fields */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      Area
                    </Typography>
                  </Grid>

                  {config.is_range ? (
                    <>
                      <Grid size={{ xs: 5, md: 4 }}>
                        <TextField
                          size="small"
                          fullWidth
                          label="Min Area"
                          value={config.area_min || ''}
                          onChange={(e) => handleConfigChange(index, 'area_min', e.target.value)}
                          placeholder="e.g., 450"
                        />
                      </Grid>
                      <Grid size={{ xs: 5, md: 4 }}>
                        <TextField
                          size="small"
                          fullWidth
                          label="Max Area"
                          value={config.area_max || ''}
                          onChange={(e) => handleConfigChange(index, 'area_max', e.target.value)}
                          placeholder="e.g., 650"
                        />
                      </Grid>
                    </>
                  ) : (
                    <Grid size={{ xs: 10, md: 8 }}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Area"
                        value={config.area_min || ''}
                        onChange={(e) => handleConfigChange(index, 'area_min', e.target.value)}
                        placeholder="e.g., 450"
                      />
                    </Grid>
                  )}

                  <Grid size={{ xs: 2, md: 2 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Unit</InputLabel>
                      <Select
                        value={config.area_unit || 'sqft'}
                        onChange={(e) => handleConfigChange(index, 'area_unit', e.target.value)}
                        label="Unit"
                      >
                        {AREA_UNITS.map((unit) => (
                          <MenuItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Row 3: Price Fields */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      Price
                    </Typography>
                  </Grid>

                  {config.is_range ? (
                    <>
                      <Grid size={{ xs: 5, md: 4 }}>
                        <TextField
                          size="small"
                          fullWidth
                          label="Min Price"
                          value={config.price_min || ''}
                          onChange={(e) => handleConfigChange(index, 'price_min', e.target.value)}
                          placeholder="e.g., 800000"
                        />
                      </Grid>
                      <Grid size={{ xs: 5, md: 4 }}>
                        <TextField
                          size="small"
                          fullWidth
                          label="Max Price"
                          value={config.price_max || ''}
                          onChange={(e) => handleConfigChange(index, 'price_max', e.target.value)}
                          placeholder="e.g., 1200000"
                        />
                      </Grid>
                    </>
                  ) : (
                    <Grid size={{ xs: 10, md: 8 }}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Price"
                        value={config.price_min || ''}
                        onChange={(e) => handleConfigChange(index, 'price_min', e.target.value)}
                        placeholder="e.g., 850000"
                      />
                    </Grid>
                  )}

                  <Grid size={{ xs: 2, md: 2 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Currency</InputLabel>
                      <Select
                        value={config.currency || 'AED'}
                        onChange={(e) => handleConfigChange(index, 'currency', e.target.value)}
                        label="Currency"
                      >
                        {CURRENCY_OPTIONS.map((curr) => (
                          <MenuItem key={curr.value} value={curr.value}>
                            {curr.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Row 4: Unit Plans Upload using MultiFileUpload */}
                <Box sx={{ pt: 2, borderTop: '1px dashed', borderColor: 'grey.300' }}>
                  <MultiFileUpload
                    name={`unit_plans_config_${index}`}
                    label={`Unit Plans ${config.type ? `for ${config.type}` : ''}`}
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    maxSize={5}
                    maxFiles={10}
                    helperText="Images or PDF • Max 5MB each"
                    existingFiles={config.existing_unit_plans || []}
                    value={config.unit_plan_files || []}
                    onChange={(files) => handleUnitPlanFilesChange(index, files)}
                    onRemoveExisting={(file) => handleRemoveExistingUnitPlan(index, file)}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
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
            <Typography color="text.secondary">
              No configurations added yet. Click "Add Unit Type" to add.
            </Typography>
          </Box>
        )}
      </Card>

      {/* Pricing Details Section */}
      <Card
        elevation={0}
        sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Pricing Details
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Booking Amount"
              value={formData.booking_amount}
              onChange={(e) => updateField('booking_amount', e.target.value)}
              placeholder="e.g., 50,000"
              InputProps={{
                startAdornment: <InputAdornment position="start">AED</InputAdornment>,
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Payment Plan"
              value={formData.payment_plan}
              onChange={(e) => updateField('payment_plan', e.target.value)}
              placeholder="e.g., 60/40, 70/30"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Expected ROI"
              value={formData.roi}
              onChange={(e) => updateField('roi', e.target.value)}
              placeholder="e.g., 8"
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
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