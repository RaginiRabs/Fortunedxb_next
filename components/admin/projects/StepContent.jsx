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
  Autocomplete,
  createFilterOptions,
} from '@mui/material';
import {
  ArrowForwardOutlined,
  ArrowBackOutlined,
  AddOutlined,
  DeleteOutlined,
  ExpandMore,
} from '@mui/icons-material';
import { useProjectForm } from '@/contexts/ProjectFormContext';
import { AMENITIES } from '@/data/amenities';

const filter = createFilterOptions();

export default function StepContent() {
  const router = useRouter();
  const { formData, updateField, nextStep, prevStep, editMode, projectId } = useProjectForm();
  
  // Amenity input state
  const [amenityInputValue, setAmenityInputValue] = useState('');
  
  // Highlight input state
  const [newHighlight, setNewHighlight] = useState('');
  
  // FAQ state
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Available amenities (not yet selected)
  const availableAmenities = useMemo(() => {
    return AMENITIES.filter(a => !formData.amenities.includes(a));
  }, [formData.amenities]);

  // Handle amenity selection
  const handleAmenityChange = (event, newValue) => {
    if (newValue) {
      let amenityToAdd = newValue;
      
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

  // Highlights handlers
  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      updateField('highlights', [...formData.highlights, newHighlight.trim()]);
      setNewHighlight('');
    }
  };

  const handleRemoveHighlight = (index) => {
    const updated = formData.highlights.filter((_, i) => i !== index);
    updateField('highlights', updated);
  };

  // FAQ handlers
  const handleAddFaq = () => {
    const newFaq = { question: '', answer: '' };
    updateField('faqs', [...formData.faqs, newFaq]);
    // Auto-expand new FAQ
    setExpandedFaq(formData.faqs.length);
  };

  const handleRemoveFaq = (index) => {
    const updated = formData.faqs.filter((_, i) => i !== index);
    updateField('faqs', updated);
    if (expandedFaq === index) {
      setExpandedFaq(null);
    }
  };

  const handleFaqChange = (index, field, value) => {
    const updated = [...formData.faqs];
    updated[index] = { ...updated[index], [field]: value };
    updateField('faqs', updated);
  };

  const handleNext = () => {
    if (nextStep()) {
      const basePath = editMode ? `/admin/projects/edit/${projectId}` : '/admin/projects/add';
      router.push(`${basePath}/location`);
    }
  };

  const handleBack = () => {
    prevStep();
    const basePath = editMode ? `/admin/projects/edit/${projectId}` : '/admin/projects/add';
    router.push(`${basePath}/pricing`);
  };

  return (
    <Box>
      {/* About Section */}
      <Card
        elevation={0}
        sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          About Project
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={6}
          label="Project Description"
          value={formData.about}
          onChange={(e) => updateField('about', e.target.value)}
          placeholder="Write a detailed description about the project..."
        />
      </Card>

      {/* Amenities Section - Moved from StepLocation */}
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
            const isExisting = options.some((option) => inputValue.toLowerCase() === option.toLowerCase());
            if (inputValue !== '' && !isExisting) {
              filtered.push({
                inputValue,
                title: `Add "${inputValue}"`,
              });
            }
            return filtered;
          }}
          getOptionLabel={(option) => {
            if (typeof option === 'string') return option;
            if (option.inputValue) return option.inputValue;
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
            <TextField {...params} placeholder="Search or type to add amenity..." />
          )}
          sx={{ mb: 2 }}
        />

        {formData.amenities.length > 0 ? (
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
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No amenities selected yet
          </Typography>
        )}
      </Card>

      {/* Highlights Section */}
      <Card
        elevation={0}
        sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Highlights
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            label="Add Highlight"
            value={newHighlight}
            onChange={(e) => setNewHighlight(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddHighlight();
              }
            }}
            placeholder="e.g., Premium waterfront location"
          />
          <Button
            variant="outlined"
            onClick={handleAddHighlight}
            sx={{ borderColor: 'primary.main', color: 'primary.main', minWidth: 100 }}
          >
            Add
          </Button>
        </Box>

        {formData.highlights.length > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.highlights.map((highlight, index) => (
              <Chip
                key={index}
                label={highlight}
                onDelete={() => handleRemoveHighlight(index)}
                sx={{ bgcolor: 'grey.100' }}
              />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No highlights added yet
          </Typography>
        )}
      </Card>

      {/* FAQ Section */}
      <Card
        elevation={0}
        sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Frequently Asked Questions
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddOutlined />}
            onClick={handleAddFaq}
            sx={{ borderColor: 'primary.main', color: 'primary.main' }}
          >
            Add FAQ
          </Button>
        </Box>

        {formData.faqs.length > 0 ? (
          <Box>
            {formData.faqs.map((faq, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                {/* FAQ Header with Delete Button OUTSIDE Accordion */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'grey.50',
                    px: 2,
                    py: 1,
                  }}
                >
                  <Typography sx={{ fontWeight: 500, flexGrow: 1 }}>
                    FAQ {index + 1}: {faq.question || '(No question yet)'}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFaq(index)}
                    sx={{ color: 'error.main', mr: 1 }}
                  >
                    <DeleteOutlined fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <ExpandMore
                      sx={{
                        transform: expandedFaq === index ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    />
                  </IconButton>
                </Box>

                {/* FAQ Content - Collapsible */}
                {expandedFaq === index && (
                  <Box sx={{ p: 2, bgcolor: '#fff' }}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Question"
                          value={faq.question}
                          onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                          placeholder="e.g., What is the handover date?"
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Answer"
                          value={faq.answer}
                          onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                          placeholder="Enter the answer..."
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
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
              No FAQs added yet. Click "Add FAQ" to add.
            </Typography>
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