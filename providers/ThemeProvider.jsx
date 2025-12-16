'use client';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import luxuryTheme from '@/lib/theme';

export default function ThemeProvider({ children }) {
  return (
    <AppRouterCacheProvider>
      <MUIThemeProvider theme={luxuryTheme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </AppRouterCacheProvider>
  );
}