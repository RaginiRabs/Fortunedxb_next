'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Send, X } from 'lucide-react';

const InquiryDialog = ({ open, onClose, selectedProject }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    interest: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log('Inquiry submitted:', formData);
    // Handle form submission
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          m: { xs: 2, sm: 3 },
          maxHeight: { xs: 'calc(100% - 32px)', sm: 'calc(100% - 64px)' },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Quicksand", sans-serif',
            fontStyle: 'italic',
            fontWeight: 600,
            color: '#0B1A2A',
          }}
        >
          Inquire About {selectedProject?.name || 'Property'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ py: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            fullWidth
            required
            InputProps={{
              sx: {
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
                borderRadius: 1,
              },
            }}
            InputLabelProps={{
              sx: {
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
              },
            }}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            InputProps={{
              sx: {
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
                borderRadius: 1,
              },
            }}
            InputLabelProps={{
              sx: {
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
              },
            }}
          />

          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            required
            InputProps={{
              sx: {
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
                borderRadius: 1,
              },
            }}
            InputLabelProps={{
              sx: {
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
              },
            }}
          />

          <FormControl fullWidth>
            <InputLabel
              sx={{
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
              }}
            >
              I'm interested in
            </InputLabel>
            <Select
              name="interest"
              value={formData.interest}
              label="I'm interested in"
              onChange={handleChange}
              sx={{
                borderRadius: 1,
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
              }}
            >
              <MenuItem value="buying">Buying for Self</MenuItem>
              <MenuItem value="investment">Investment</MenuItem>
              <MenuItem value="both">Both</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            placeholder={`I'm interested in ${selectedProject?.name || 'this property'}. Please share more details.`}
            InputProps={{
              sx: {
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
                borderRadius: 1,
              },
            }}
            InputLabelProps={{
              sx: {
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          sx={{
            fontFamily: '"Quicksand", sans-serif',
            fontStyle: 'italic',
            color: '#64748B',
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          startIcon={<Send size={18} color="#FFFFFF" />}
          sx={{
            background: 'linear-gradient(135deg, #C6A962 0%, #A68B4B 100%)',
            color: '#FFFFFF',
            borderRadius: 1,
            px: 3,
            fontFamily: '"Quicksand", sans-serif',
            fontStyle: 'italic',
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(135deg, #D4BC7D 0%, #C6A962 100%)',
            },
          }}
        >
          Submit Inquiry
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InquiryDialog;