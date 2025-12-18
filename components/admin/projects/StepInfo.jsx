'use client';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  ArrowForwardOutlined,
  ArrowBackOutlined,
  EmailOutlined,
} from '@mui/icons-material';
import { MuiTelInput } from 'mui-tel-input';
import { useProjectForm } from '@/contexts/ProjectFormContext';
import { FURNISHING_STATUS } from '@/data/projectTypes';

export default function StepInfo() {
  const router = useRouter();
  const { formData, updateField, nextStep, prevStep, editMode, projectId } = useProjectForm();

  // Phone handlers
  const handlePhone1Change = (value, info) => {
    updateField('phone_1', value);
    if (info && info.countryCallingCode) {
      updateField('phone_1_ccode', info.countryCallingCode);
    }
  };

  const handlePhone2Change = (value, info) => {
    updateField('phone_2', value);
    if (info && info.countryCallingCode) {
      updateField('phone_2_ccode', info.countryCallingCode);
    }
  };

  const handleNext = () => {
    if (nextStep()) {
      const basePath = editMode ? `/admin/projects/edit/${projectId}` : '/admin/projects/add';
      router.push(`${basePath}/pricing`);
    }
  };

  const handleBack = () => {
    prevStep();
    const basePath = editMode ? `/admin/projects/edit/${projectId}` : '/admin/projects/add';
    router.push(`${basePath}/basic`);
  };

  return (
    <Box>
      {/* Project Information */}
      <Card
        elevation={0}
        sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Project Information
        </Typography>

        <Grid container spacing={3}>
          {/* Total Towers */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type="number"
              label="Total Towers"
              value={formData.total_towers}
              onChange={(e) => updateField('total_towers', e.target.value)}
              inputProps={{ min: 0 }}
            />
          </Grid>

          {/* Total Units */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type="number"
              label="Total Units"
              value={formData.total_units}
              onChange={(e) => updateField('total_units', e.target.value)}
              inputProps={{ min: 0 }}
            />
          </Grid>

          {/* Furnishing Status */}
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Furnishing Status</InputLabel>
              <Select
                value={formData.furnishing_status}
                onChange={(e) => updateField('furnishing_status', e.target.value)}
                label="Furnishing Status"
              >
                {FURNISHING_STATUS.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Handover Date */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type="date"
              label="Handover Date"
              value={formData.handover_date}
              onChange={(e) => updateField('handover_date', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Featured Switch */}
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.featured}
                  onChange={(e) => updateField('featured', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'primary.main',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      bgcolor: 'primary.main',
                    },
                  }}
                />
              }
              label="Featured Project"
              sx={{ mt: 1 }}
            />
          </Grid>
        </Grid>
      </Card>

      {/* Contact Information - MOVED FROM StepLocation */}
      <Card
        elevation={0}
        sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Contact Information
        </Typography>

        <Grid container spacing={3}>
          {/* Email 1 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Email 1"
              value={formData.email_1 || ''}
              onChange={(e) => updateField('email_1', e.target.value)}
              placeholder="sales@fortunedxb.com"
              InputProps={{
                startAdornment: <EmailOutlined sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />,
              }}
            />
          </Grid>

          {/* Email 2 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Email 2"
              value={formData.email_2 || ''}
              onChange={(e) => updateField('email_2', e.target.value)}
              placeholder="info@fortunedxb.com"
              InputProps={{
                startAdornment: <EmailOutlined sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />,
              }}
            />
          </Grid>

          {/* Phone 1 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <MuiTelInput
              fullWidth
              label="Phone 1"
              value={formData.phone_1 || ''}
              onChange={handlePhone1Change}
              defaultCountry="AE"
              preferredCountries={['AE', 'SA', 'IN', 'PK', 'GB', 'US']}
              forceCallingCode
              focusOnSelectCountry
              placeholder="50 123 4567"
            />
          </Grid>

          {/* Phone 2 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <MuiTelInput
              fullWidth
              label="Phone 2"
              value={formData.phone_2 || ''}
              onChange={handlePhone2Change}
              defaultCountry="AE"
              preferredCountries={['AE', 'SA', 'IN', 'PK', 'GB', 'US']}
              forceCallingCode
              focusOnSelectCountry
              placeholder="4 123 4567"
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