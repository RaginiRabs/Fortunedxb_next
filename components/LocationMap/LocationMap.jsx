'use client';

import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { MapPin } from 'lucide-react';

/**
 * Extract src URL from iframe tag or return URL directly
 */
const extractMapUrl = (input) => {
  if (!input) return null;
  
  // Trim whitespace
  const trimmed = input.trim();
  
  // Check if it's a full iframe tag - extract src
  if (trimmed.includes('<iframe') || trimmed.includes('&lt;iframe')) {
    // Handle both encoded and non-encoded iframe tags
    const decoded = trimmed
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"');
    
    const srcMatch = decoded.match(/src=["']([^"']+)["']/);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }
  
  // If it starts with http, it's likely a direct URL
  if (trimmed.startsWith('http')) {
    return trimmed;
  }
  
  // If it starts with //, add https:
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }
  
  return null;
};

/**
 * Simple Google Maps Embed Component
 * Takes a Google Maps URL (or full iframe tag) and displays it as an iframe
 */
const LocationMap = ({
  locationLink,
  projectName = 'Project Location',
  height = '100%',
}) => {
  
  // Extract the actual URL from input (handles both iframe tags and direct URLs)
  const mapUrl = useMemo(() => {
    return extractMapUrl(locationLink);
  }, [locationLink]);

  // If no valid URL, show placeholder
  if (!mapUrl) {
    return (
      <Box 
        sx={{ 
          height, 
          width: '100%',
          bgcolor: '#F1F5F9',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'inherit',
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: '#E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MapPin size={28} color="#94A3B8" />
        </Box>
        <Typography 
          sx={{ 
            color: '#64748B', 
            fontFamily: '"Quicksand", sans-serif',
            fontStyle: 'italic',
            fontSize: '0.9rem',
            textAlign: 'center',
            px: 2,
          }}
        >
          {locationLink ? 'Invalid map URL format' : 'Location map not available'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height, width: '100%', position: 'relative' }}>
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ 
          border: 0, 
          borderRadius: 'inherit',
        }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map - ${projectName}`}
      />
    </Box>
  );
};

export default LocationMap;