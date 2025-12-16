'use client';
import { createTheme } from '@mui/material/styles';

const luxuryTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#C6A962',
      light: '#D4BC7D',
      dark: '#A68B4B',
    },
    secondary: {
      main: '#1A1A2E',
      light: '#2D2D44',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A2E',
      secondary: '#6B7280',
    },
  },
  typography: {
    fontFamily: '"Quicksand", sans-serif',
    h1: {
      fontFamily: '"Quicksand", sans-serif',
      fontWeight: 700,
      fontStyle: 'italic',
    },
    h2: {
      fontFamily: '"Quicksand", sans-serif',
      fontWeight: 600,
      fontStyle: 'italic',
    },
    h3: {
      fontFamily: '"Quicksand", sans-serif',
      fontWeight: 600,
      fontStyle: 'italic',
    },
    h4: {
      fontFamily: '"Quicksand", sans-serif',
      fontWeight: 600,
      fontStyle: 'italic',
    },
    h5: {
      fontFamily: '"Quicksand", sans-serif',
      fontWeight: 600,
      fontStyle: 'italic',
    },
    h6: {
      fontFamily: '"Quicksand", sans-serif',
      fontWeight: 600,
      fontStyle: 'italic',
    },
    body1: {
      fontFamily: '"Quicksand", sans-serif',
      fontStyle: 'italic',
    },
    body2: {
      fontFamily: '"Quicksand", sans-serif',
      fontStyle: 'italic',
    },
    caption: {
      fontFamily: '"Quicksand", sans-serif',
      fontStyle: 'italic',
    },
    button: {
      fontFamily: '"Quicksand", sans-serif',
      fontStyle: 'italic',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default luxuryTheme;