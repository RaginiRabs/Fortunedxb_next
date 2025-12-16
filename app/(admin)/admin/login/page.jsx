'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  LockOutlined,
} from '@mui/icons-material';

// Validation Schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    // .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function AdminLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError('');

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (data.success) {
          router.push('/admin/dashboard');
        } else {
          setServerError(data.message || 'Invalid email or password');
        }
      } catch (err) {
        setServerError('Something went wrong. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 3 },
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: 420 },
          p: { xs: 3, sm: 4, md: 5 },
          borderRadius: { xs: 2, sm: 3 },
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* Logo & Title */}
        <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
          <Box
            sx={{
              width: { xs: 56, sm: 70 },
              height: { xs: 56, sm: 70 },
              bgcolor: '#0B1A2F',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <Typography
              sx={{
                color: '#C6A962',
                fontSize: { xs: 24, sm: 28 },
                fontWeight: 700,
              }}
            >
              F
            </Typography>
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'secondary.main',
              mb: 0.5,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            }}
          >
            Fortune DXB
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
            }}
          >
            Admin Panel
          </Typography>
        </Box>

        {/* Server Error Alert */}
        {serverError && (
          <Alert
            severity="error"
            sx={{
              mb: { xs: 2, sm: 3 },
              borderRadius: 2,
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
            }}
          >
            {serverError}
          </Alert>
        )}

        {/* Login Form */}
        <form onSubmit={formik.handleSubmit} noValidate>
          <TextField
            fullWidth
            id="email"
            name="email"
            type="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{
              mb: { xs: 2, sm: 2.5 },
              '& .MuiInputBase-input': {
                fontSize: { xs: '0.9rem', sm: '1rem' },
                py: { xs: 1.5, sm: 2 },
              },
              '& .MuiInputLabel-root': {
                fontSize: { xs: '0.9rem', sm: '1rem' },
              },
              '& .MuiFormHelperText-root': {
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                mt: 0.5,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined
                    sx={{
                      color: formik.touched.email && formik.errors.email 
                        ? 'error.main' 
                        : 'text.secondary',
                      fontSize: { xs: 18, sm: 20 },
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={{
              mb: { xs: 3, sm: 3.5 },
              '& .MuiInputBase-input': {
                fontSize: { xs: '0.9rem', sm: '1rem' },
                py: { xs: 1.5, sm: 2 },
              },
              '& .MuiInputLabel-root': {
                fontSize: { xs: '0.9rem', sm: '1rem' },
              },
              '& .MuiFormHelperText-root': {
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                mt: 0.5,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined
                    sx={{
                      color: formik.touched.password && formik.errors.password 
                        ? 'error.main' 
                        : 'text.secondary',
                      fontSize: { xs: 18, sm: 20 },
                    }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? (
                      <VisibilityOff sx={{ fontSize: { xs: 18, sm: 20 } }} />
                    ) : (
                      <Visibility sx={{ fontSize: { xs: 18, sm: 20 } }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={formik.isSubmitting || !formik.isValid}
            sx={{
              py: { xs: 1.25, sm: 1.5 },
              bgcolor: 'primary.main',
              color: '#fff',
              fontWeight: 600,
              fontSize: { xs: '0.9rem', sm: '1rem' },
              boxShadow: '0 4px 14px rgba(198, 169, 98, 0.4)',
              '&:hover': {
                bgcolor: 'primary.dark',
                boxShadow: '0 6px 20px rgba(198, 169, 98, 0.5)',
              },
              '&:disabled': {
                bgcolor: 'grey.300',
              },
            }}
          >
            {formik.isSubmitting ? (
              <CircularProgress size={22} sx={{ color: '#fff' }} />
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Footer */}
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            mt: { xs: 3, sm: 4 },
            color: 'text.secondary',
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
          }}
        >
          © 2025 Fortune DXB. All rights reserved.
        </Typography>
      </Card>
    </Box>
  );
}