'use client';
import { Box, Typography, Button } from '@mui/material';
import { InboxOutlined, AddOutlined } from '@mui/icons-material';

export default function EmptyState({
  icon: Icon = InboxOutlined,
  title = 'No data found',
  description = 'Get started by creating a new item.',
  actionLabel = 'Add New',
  onAction = null,
  showAction = true,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 6, md: 10 },
        px: 3,
        textAlign: 'center',
        bgcolor: 'background.paper',
        borderRadius: 3,
        border: '1px dashed',
        borderColor: 'grey.300',
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <Icon sx={{ fontSize: 40, color: 'grey.400' }} />
      </Box>

      <Typography
        variant="h6"
        fontWeight={600}
        color="text.primary"
        gutterBottom
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, maxWidth: 300 }}
      >
        {description}
      </Typography>

      {showAction && onAction && (
        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={onAction}
          sx={{
            bgcolor: 'primary.main',
            px: 3,
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}