'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Button } from '@mui/material';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#0B1A2A',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: `
            linear-gradient(90deg, #C6A962 1px, transparent 1px),
            linear-gradient(0deg, #C6A962 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <Container maxWidth="sm" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* 404 Text */}
        <Typography
          sx={{
            fontSize: { xs: '6rem', md: '10rem' },
            fontWeight: 700,
            fontFamily: '"Quicksand", sans-serif',
            background: 'linear-gradient(135deg, #C6A962 0%, #E8D5A3 50%, #C6A962 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
            mb: 2,
          }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          sx={{
            color: 'white',
            fontFamily: '"Quicksand", sans-serif',
            fontStyle: 'italic',
            fontWeight: 600,
            mb: 2,
          }}
        >
          Page Not Found
        </Typography>

        <Typography
          sx={{
            color: 'rgba(255,255,255,0.6)',
            fontFamily: '"Quicksand", sans-serif',
            fontStyle: 'italic',
            mb: 4,
            maxWidth: 400,
            mx: 'auto',
          }}
        >
          The property you're looking for seems to have moved. Let's get you back on track.
        </Typography>

        {/* CTA Buttons - FIXED: No component={Link} */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          {/* ✅ FIXED: Wrap Button with Link */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              startIcon={<Home size={18} />}
              sx={{
                background: 'linear-gradient(135deg, #C6A962 0%, #A68B4B 100%)',
                color: '#FFFFFF',
                px: 3,
                py: 1.25,
                borderRadius: 1,
                fontWeight: 600,
                fontFamily: '"Quicksand", sans-serif',
                fontStyle: 'italic',
                '&:hover': {
                  background: 'linear-gradient(135deg, #D4BC7D 0%, #C6A962 100%)',
                },
              }}
            >
              Go Home
            </Button>
          </Link>

          {/* ✅ FIXED: Use onClick instead of component={Link} */}
          <Button
            variant="outlined"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => router.back()}
            sx={{
              borderColor: 'rgba(198, 169, 98, 0.5)',
              color: '#C6A962',
              px: 3,
              py: 1.25,
              borderRadius: 1,
              fontWeight: 600,
              fontFamily: '"Quicksand", sans-serif',
              fontStyle: 'italic',
              '&:hover': {
                borderColor: '#C6A962',
                bgcolor: 'rgba(198, 169, 98, 0.1)',
              },
            }}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    </Box>
  );
}