'use client';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Slider,
  Paper,
  Grid,
  IconButton,
} from '@mui/material';
import { Calculator, X } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const ROICalculatorDialog = ({
  open,
  onClose,
  investmentAmount,
  setInvestmentAmount,
  expectedRoi,
  setExpectedRoi,
}) => {
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.5,
              background: 'linear-gradient(135deg, #C6A962 0%, #A68B4B 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Calculator size={20} color="#FFFFFF" />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Quicksand", sans-serif',
              fontStyle: 'italic',
              fontWeight: 600,
              color: '#0B1A2A',
            }}
          >
            ROI Calculator
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 3,
              fontFamily: '"Quicksand", sans-serif',
              fontStyle: 'italic',
            }}
          >
            Estimate your potential returns on Dubai off-plan property investment.
          </Typography>

          {/* Investment Amount Slider */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
                color: '#0B1A2A',
              }}
            >
              Investment Amount:{' '}
              <Box component="span" sx={{ fontWeight: 700, color: '#C6A962' }}>
                {formatPrice(investmentAmount)}
              </Box>
            </Typography>
            <Slider
              value={investmentAmount}
              onChange={(e, v) => setInvestmentAmount(v)}
              min={500000}
              max={20000000}
              step={100000}
              sx={{
                color: '#C6A962',
                '& .MuiSlider-thumb': {
                  bgcolor: '#C6A962',
                  '&:hover': {
                    boxShadow: '0 0 0 8px rgba(198, 169, 98, 0.16)',
                  },
                },
                '& .MuiSlider-track': {
                  bgcolor: '#C6A962',
                },
                '& .MuiSlider-rail': {
                  bgcolor: '#E2E8F0',
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography
                variant="caption"
                sx={{
                  color: '#94A3B8',
                  fontFamily: '"Quicksand", sans-serif',
                  fontStyle: 'italic',
                }}
              >
                AED 500K
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#94A3B8',
                  fontFamily: '"Quicksand", sans-serif',
                  fontStyle: 'italic',
                }}
              >
                AED 20M
              </Typography>
            </Box>
          </Box>

          {/* Expected ROI Slider */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
                color: '#0B1A2A',
              }}
            >
              Expected Annual ROI:{' '}
              <Box component="span" sx={{ fontWeight: 700, color: '#C6A962' }}>
                {expectedRoi}%
              </Box>
            </Typography>
            <Slider
              value={expectedRoi}
              onChange={(e, v) => setExpectedRoi(v)}
              min={4}
              max={15}
              step={0.5}
              sx={{
                color: '#C6A962',
                '& .MuiSlider-thumb': {
                  bgcolor: '#C6A962',
                  '&:hover': {
                    boxShadow: '0 0 0 8px rgba(198, 169, 98, 0.16)',
                  },
                },
                '& .MuiSlider-track': {
                  bgcolor: '#C6A962',
                },
                '& .MuiSlider-rail': {
                  bgcolor: '#E2E8F0',
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography
                variant="caption"
                sx={{
                  color: '#94A3B8',
                  fontFamily: '"Quicksand", sans-serif',
                  fontStyle: 'italic',
                }}
              >
                4%
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#94A3B8',
                  fontFamily: '"Quicksand", sans-serif',
                  fontStyle: 'italic',
                }}
              >
                15%
              </Typography>
            </Box>
          </Box>

          {/* Results */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: 'rgba(198, 169, 98, 0.08)',
              borderRadius: 2,
              border: '1px solid rgba(198, 169, 98, 0.2)',
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#64748B',
                    fontFamily: '"Quicksand", sans-serif',
                    fontStyle: 'italic',
                    display: 'block',
                    mb: 0.5,
                  }}
                >
                  Annual Return
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: '#10B981',
                    fontFamily: '"Quicksand", sans-serif',
                    fontStyle: 'italic',
                  }}
                >
                  {formatPrice((investmentAmount * expectedRoi) / 100)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#64748B',
                    fontFamily: '"Quicksand", sans-serif',
                    fontStyle: 'italic',
                    display: 'block',
                    mb: 0.5,
                  }}
                >
                  5-Year Return
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: '#10B981',
                    fontFamily: '"Quicksand", sans-serif',
                    fontStyle: 'italic',
                  }}
                >
                  {formatPrice(((investmentAmount * expectedRoi) / 100) * 5)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
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
          Close
        </Button>
        <Button
          variant="contained"
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
          Get Detailed Analysis
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ROICalculatorDialog;