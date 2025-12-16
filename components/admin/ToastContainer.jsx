'use client';
import { Box, Alert, Slide, IconButton } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import useToast from '@/hooks/useToast';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        maxWidth: { xs: 'calc(100% - 32px)', sm: 400 },
        width: '100%',
      }}
    >
      {toasts.map((toast) => (
        <Slide key={toast.id} direction="left" in={true} mountOnEnter unmountOnExit>
          <Alert
            severity={toast.type}
            variant="filled"
            sx={{
              borderRadius: 2,
              boxShadow: 3,
              alignItems: 'center',
            }}
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={() => removeToast(toast.id)}
              >
                <CloseOutlined fontSize="small" />
              </IconButton>
            }
          >
            {toast.message}
          </Alert>
        </Slide>
      ))}
    </Box>
  );
}