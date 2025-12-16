'use client';
import { Box, Typography, IconButton, Avatar, InputBase } from '@mui/material';
import { SearchOutlined, NotificationsOutlined } from '@mui/icons-material';

export default function Header({ title, subtitle }) {
  return (
    <Box
      sx={{
        height: 70,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'grey.200',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
      }}
    >
      {/* Left - Page Title */}
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: 'secondary.main',
            fontStyle: 'normal',
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontStyle: 'normal' }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Right - Search & Profile */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Search */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'grey.100',
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            width: 220,
          }}
        >
          <SearchOutlined sx={{ color: 'text.secondary', fontSize: 20, mr: 1 }} />
          <InputBase
            placeholder="Search..."
            sx={{
              fontSize: '0.875rem',
              '& input': {
                p: 0,
              },
            }}
          />
        </Box>

        {/* Notifications */}
        <IconButton size="small">
          <NotificationsOutlined sx={{ color: 'text.secondary' }} />
        </IconButton>

        {/* Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.main',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            A
          </Avatar>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: 'secondary.main', lineHeight: 1.2 }}
            >
              Admin
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Super Admin
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}