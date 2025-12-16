'use client';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        gap: 2,
      }}
    >
      <CircularProgress
        size={48}
        thickness={4}
        sx={{ color: 'primary.main' }}
      />
      <Typography color="text.secondary" variant="body2">
        {message}
      </Typography>
    </Box>
  );
}