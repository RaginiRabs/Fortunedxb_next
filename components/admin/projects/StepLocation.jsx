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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  createFilterOptions,
} from '@mui/material';
import {
  ArrowForwardOutlined,
  ArrowBackOutlined,
  AddOutlined,
  DeleteOutlined,
  EmailOutlined,
  LinkOutlined,
} from '@mui/icons-material';
import { MuiTelInput } from 'mui-tel-input';
import { useProjectForm } from '@/contexts/ProjectFormContext';
import { AMENITIES } from '@/data/amenities';
import { LOCATION_TYPES, DISTANCE_UNITS } from '@/data/locationTypes';

const filter = createFilterOptions();

export default function StepLocation() {
  const router = useRouter();
  const { formData, updateField, nextStep, prevStep, editMode, projectId } = useProjectForm();
  
  // Amenity input state
  const [amenityInputValue, setAmenityInputValue] = useState('');
  
  // Custom location types state
  const [customLocationTypes, setCustomLocationTypes] = useState({});

  // Available amenities (not yet selected)
  const availableAmenities = useMemo(() => {
    return AMENITIES.filter(a => !formData.amenities.includes(a));
  }, [formData.amenities]);

  // Handle amenity selection
  const handleAmenityChange = (event, newValue) => {
    if (newValue) {
      let amenityToAdd = newValue;
      
      // Check if it's a custom "Add" option
      if (typeof newValue === 'object' && newValue.inputValue) {
        amenityToAdd = newValue.inputValue;
      }
      
      if (amenityToAdd && !formData.amenities.includes(amenityToAdd)) {
        updateField('amenities', [...formData.amenities, amenityToAdd]);
      }
    }
    setAmenityInputValue('');
  };

  // Remove amenity
  const handleRemoveAmenity = (amenity) => {
    updateField('amenities', formData.amenities.filter(a => a !== amenity));
  };

  // Nearby locations handlers
  const handleAddNearby = () => {
    const newLocation = { category: '', place_name: '', distance_value: '', distance_unit: 'km', place_link: '' };
    updateField('nearby_locations', [...formData.nearby_locations, newLocation]);
  };

  const handleRemoveNearby = (index) => {
    const updated = formData.nearby_locations.filter((_, i) => i !== index);
    updateField('nearby_locations', updated);
    const newCustoms = { ...customLocationTypes };
    delete newCustoms[index];
    setCustomLocationTypes(newCustoms);
  };

  const handleNearbyChange = (index, field, value) => {
    const updated = [...formData.nearby_locations];
    updated[index] = { ...updated[index], [field]: value };
    updateField('nearby_locations', updated);
  };

  // Location type helpers
  const getLocationTypeSelectValue = (location, index) => {
    if (!location.category) return '';
    if (LOCATION_TYPES.slice(0, -1).includes(location.category)) {
      return location.category;
    }
    return 'Other';
  };

  const isCustomLocationType = (location, index) => {
    return location.category === 'Other' || customLocationTypes[index] !== undefined ||
      (location.category && !LOCATION_TYPES.slice(0, -1).includes(location.category));
  };

  const handleLocationTypeChange = (index, value) => {
    if (value === 'Other') {
      handleNearbyChange(index, 'category', 'Other');
      setCustomLocationTypes({ ...customLocationTypes, [index]: '' });
    } else {
      handleNearbyChange(index, 'category', value);
      const newCustoms = { ...customLocationTypes };
      delete newCustoms[index];
      setCustomLocationTypes(newCustoms);
    }
  };

  const handleCustomLocationTypeChange = (index, value) => {
    setCustomLocationTypes({ ...customLocationTypes, [index]: value });
    if (value.trim()) {
      handleNearbyChange(index, 'category', value.trim());
    }
  };

  // Phone handlers using MuiTelInput - Extract country code separately
  const handlePhone1Change = (value, info) => {
    updateField('phone_1', value);
    // info.countryCallingCode contains the calling code (e.g., "971")
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
      {/* Amenities Section */}
      <Card
        elevation={0}
        sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Amenities
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formData.amenities.length} selected
          </Typography>
        </Box>

        {/* Autocomplete for Amenities */}
        <Autocomplete
          freeSolo
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          size="small"
          options={availableAmenities}
          value={null}
          inputValue={amenityInputValue}
          onInputChange={(event, newInputValue) => {
            setAmenityInputValue(newInputValue);
          }}
          onChange={handleAmenityChange}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            const { inputValue } = params;
            
            // Check if input doesn't match any option
            const isExisting = options.some((option) => inputValue.toLowerCase() === option.toLowerCase());
            
            // Add "Add custom" option if input is not empty and not existing
            if (inputValue !== '' && !isExisting) {
              filtered.push({
                inputValue,
                title: `Add "${inputValue}"`,
              });
            }
            
            return filtered;
          }}
          getOptionLabel={(option) => {
            if (typeof option === 'string') {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option.title || '';
          }}
          renderOption={(props, option) => {
            const { key, ...otherProps } = props;
            if (typeof option === 'object' && option.title) {
              return (
                <li key={key} {...otherProps} style={{ color: '#B8860B', fontWeight: 500 }}>
                  {option.title}
                </li>
              );
            }
            return <li key={key} {...otherProps}>{option}</li>;
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search or type to add amenity..."
            />
          )}
          sx={{ mb: 2 }}
        />

        {/* Selected Amenities as Chips */}
        {formData.amenities.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {formData.amenities.map((amenity) => (
              <Chip
                key={amenity}
                label={amenity}
                size="small"
                onDelete={() => handleRemoveAmenity(amenity)}
                sx={{
                  bgcolor: AMENITIES.includes(amenity) ? 'primary.main' : 'secondary.main',
                  color: '#fff',
                  '& .MuiChip-deleteIcon': { color: 'rgba(255,255,255,0.7)' },
                  '& .MuiChip-deleteIcon:hover': { color: '#fff' },
                }}
              />
            ))}
          </Box>
        )}
      </Card>

      {/* Nearby Locations Section */}
      <Card
        elevation={0}
        sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Nearby Locations
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddOutlined />}
            onClick={handleAddNearby}
            sx={{ borderColor: 'primary.main', color: 'primary.main' }}
          >
            Add
          </Button>
        </Box>

        {formData.nearby_locations.length > 0 ? (
          <Box>
            {formData.nearby_locations.map((location, index) => (
              <Box
                key={index}
                sx={{
                  p: 1.5,
                  mb: 1.5,
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <Grid container spacing={1.5} alignItems="center">
                  {/* Category Dropdown */}
                  <Grid size={{ xs: 6, md: 2 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={getLocationTypeSelectValue(location, index)}
                        onChange={(e) => handleLocationTypeChange(index, e.target.value)}
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

                  {/* Custom Category Field */}
                  {isCustomLocationType(location, index) && (
                    <Grid size={{ xs: 6, md: 1.5 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Specify"
                        value={customLocationTypes[index] || ''}
                        onChange={(e) => handleCustomLocationTypeChange(index, e.target.value)}
                        placeholder="e.g., Marina"
                      />
                    </Grid>
                  )}

                  {/* Place Name */}
                  <Grid size={{ xs: 12, md: isCustomLocationType(location, index) ? 2.5 : 3 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Place Name"
                      value={location.place_name}
                      onChange={(e) => handleNearbyChange(index, 'place_name', e.target.value)}
                      placeholder="e.g., Dubai Mall"
                    />
                  </Grid>

                  {/* Distance */}
                  <Grid size={{ xs: 3, md: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Distance"
                      value={location.distance_value}
                      onChange={(e) => handleNearbyChange(index, 'distance_value', e.target.value)}
                      placeholder="5"
                    />
                  </Grid>

                  {/* Unit */}
                  <Grid size={{ xs: 3, md: 1 }}>
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

                  {/* Place Link - NEW */}
                  <Grid size={{ xs: 12, md: isCustomLocationType(location, index) ? 3 : 4 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Google Maps Link"
                      value={location.place_link || ''}
                      onChange={(e) => handleNearbyChange(index, 'place_link', e.target.value)}
                      placeholder="https://maps.google.com/..."
                      InputProps={{
                        startAdornment: <LinkOutlined sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />,
                      }}
                    />
                  </Grid>

                  {/* Delete Button */}
                  <Grid size={{ xs: 6, md: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveNearby(index)}
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteOutlined fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              p: 3,
              textAlign: 'center',
              bgcolor: 'grey.50',
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'grey.300',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No nearby locations added yet
            </Typography>
          </Box>
        )}
      </Card>

      {/* Contact Section */}
      <Card
        elevation={0}
        sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Contact Information
        </Typography>

        <Grid container spacing={2}>
          {/* Email Fields */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Email 1"
              value={formData.email_1}
              onChange={(e) => updateField('email_1', e.target.value)}
              placeholder="sales@fortunedxb.com"
              InputProps={{
                startAdornment: <EmailOutlined sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />,
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Email 2"
              value={formData.email_2}
              onChange={(e) => updateField('email_2', e.target.value)}
              placeholder="info@fortunedxb.com"
              InputProps={{
                startAdornment: <EmailOutlined sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />,
              }}
            />
          </Grid>

          {/* Phone Fields with MuiTelInput */}
          <Grid size={{ xs: 12, md: 6 }}>
            <MuiTelInput
              fullWidth
              size="small"
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

          <Grid size={{ xs: 12, md: 6 }}>
            <MuiTelInput
              fullWidth
              size="small"
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