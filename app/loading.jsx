import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loading() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#0B1A2A',
        gap: 3,
      }}
    >
      <CircularProgress
        size={50}
        thickness={4}
        sx={{
          color: '#C6A962',
        }}
      />
      <Typography
        sx={{
          color: '#C6A962',
          fontFamily: '"Quicksand", sans-serif',
          fontStyle: 'italic',
          fontWeight: 600,
          fontSize: '1rem',
        }}
      >
        Loading Fortune DXB...
      </Typography>
    </Box>
  );
}