'use client';
import {
  Box,
  Container,
  Typography,
  Chip,
  Grid,
  Paper,
} from '@mui/material';
import { Award, Star } from 'lucide-react';

const TopDevelopers = ({ developers }) => {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 10 },
        bgcolor: '#FAFAFA',
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip
            icon={<Award size={16} color="#FFFFFF" />}
            label="Trusted Partners"
            sx={{
              bgcolor: '#C6A962',
              color: '#FFFFFF',
              fontWeight: 600,
              mb: 2,
              borderRadius: 1,
              fontFamily: '"Quicksand", sans-serif',
              fontStyle: 'italic',
              '& .MuiChip-icon': {
                color: '#FFFFFF',
              },
            }}
          />
          <Typography
            variant="h2"
            sx={{
              color: '#0B1A2A',
              mb: 2,
              fontFamily: '"Quicksand", sans-serif',
              fontStyle: 'italic',
              fontWeight: 600,
              fontSize: { xs: '1.5rem', md: '1.8rem' },
            }}
          >
            Premier Developers
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#64748B',
              maxWidth: 600,
              mx: 'auto',
              fontFamily: '"Quicksand", sans-serif',
              fontStyle: 'italic',
            }}
          >
            We partner with Dubai's most reputable developers to bring you exclusive off-plan opportunities.
          </Typography>
        </Box>

        {/* Developers Grid */}
        <Grid container spacing={3} justifyContent="center">
          {developers?.map((developer, index) => (
            <Grid item xs={6} sm={4} md={2} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: 'white',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1.5,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#C6A962',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Typography variant="h2" sx={{ mb: 1 }}>
                  {developer.logo}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    mb: 0.5,
                    fontFamily: '"Quicksand", sans-serif',
                    fontStyle: 'italic',
                    color: '#0B1A2A',
                  }}
                >
                  {developer.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#64748B',
                    fontFamily: '"Quicksand", sans-serif',
                    fontStyle: 'italic',
                    display: 'block',
                  }}
                >
                  {developer.projects} Projects
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5,
                    mt: 1,
                  }}
                >
                  <Star size={14} fill="#F59E0B" color="#F59E0B" />
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      fontFamily: '"Quicksand", sans-serif',
                      fontStyle: 'italic',
                      color: '#0B1A2A',
                    }}
                  >
                    {developer.rating}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TopDevelopers;