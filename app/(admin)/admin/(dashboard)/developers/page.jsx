'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Avatar,
  Typography,
  Chip,
} from '@mui/material';
import {
  AddOutlined,
  BusinessOutlined,
  VerifiedOutlined,
  EmojiEventsOutlined,
  PublicOutlined,
} from '@mui/icons-material';
import DataTable from '@/components/admin/DataTable';
import LoadingScreen from '@/components/admin/LoadingScreen';
import useToast from '@/hooks/useToast';

export default function DevelopersPage() {
  const router = useRouter();
  const toast = useToast();

  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const fetchDevelopers = async () => {
    try {
      const res = await fetch('/api/developers');
      const data = await res.json();

      if (data.success) {
        setDevelopers(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch developers');
      }
    } catch (err) {
      toast.error('Failed to fetch developers');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (developer) => {
    router.push(`/admin/developers/${developer.developer_id}`);
  };

  const columns = [
    {
      field: 'logo_path',
      headerName: 'Logo',
      renderCell: (value, row) => (
        <Avatar
          src={value ? `/${value}` : undefined}
          alt={row.name}
          variant="rounded"
          sx={{
            width: 44,
            height: 44,
            bgcolor: 'primary.50',
            color: 'primary.main',
          }}
        >
          <BusinessOutlined />
        </Avatar>
      ),
    },
    {
      field: 'name',
      headerName: 'Developer Name',
      renderCell: (value, row) => (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontWeight: 500 }}>{value}</Typography>
            {row.is_verified && (
              <VerifiedOutlined sx={{ fontSize: 16, color: 'primary.main' }} />
            )}
          </Box>
          {row.tagline && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: 'block',
                maxWidth: 180,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {row.tagline}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: 'established_year',
      headerName: 'Established',
      renderCell: (value) => (
        <Typography variant="body2" color="text.secondary">
          {value || '-'}
        </Typography>
      ),
    },
    {
      field: 'total_projects',
      headerName: 'Projects',
      renderCell: (value, row) => (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {value || 0}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total
          </Typography>
        </Box>
      ),
    },
    {
      field: 'awards_added',
      headerName: 'Awards',
      renderCell: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <EmojiEventsOutlined sx={{ fontSize: 18, color: value > 0 ? 'warning.main' : 'grey.400' }} />
          <Typography variant="body2" sx={{ fontWeight: value > 0 ? 600 : 400 }}>
            {value || 0}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'countries_present',
      headerName: 'Countries',
      renderCell: (value) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <PublicOutlined sx={{ fontSize: 18, color: 'grey.500' }} />
          <Typography variant="body2">{value || 1}</Typography>
        </Box>
      ),
    },
    {
      field: 'is_verified',
      headerName: 'Status',
      renderCell: (value) =>
        value ? (
          <Chip
            icon={<VerifiedOutlined sx={{ fontSize: 14 }} />}
            label="Verified"
            size="small"
            sx={{
              bgcolor: 'primary.50',
              color: 'primary.main',
              fontWeight: 500,
              '& .MuiChip-icon': { color: 'primary.main' },
            }}
          />
        ) : (
          <Chip
            label="Unverified"
            size="small"
            sx={{ bgcolor: 'grey.100', color: 'text.secondary' }}
          />
        ),
    },
    {
      field: 'contact_email',
      headerName: 'Email',
      renderCell: (value) => (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            maxWidth: 150,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {value || '-'}
        </Typography>
      ),
    },
    {
      field: 'website_url',
      headerName: 'Website',
      renderCell: (value) =>
        value ? (
          <Chip
            label="Visit"
            size="small"
            component="a"
            href={value}
            target="_blank"
            clickable
            sx={{ fontSize: '0.75rem' }}
          />
        ) : (
          '-'
        ),
    },
  ];

  return (
    <>
      {/* Action Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={() => router.push('/admin/developers/add')}
          sx={{
            bgcolor: 'primary.main',
            px: 3,
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          Add Developer
        </Button>
      </Box>

      {/* Content */}
      {loading ? (
        <LoadingScreen message="Loading developers..." />
      ) : (
        <DataTable
          columns={columns}
          data={developers.map((d) => ({ ...d, id: d.developer_id }))}
          onEdit={handleEdit}
          emptyTitle="No developers found"
          emptyDescription="Get started by adding your first developer."
          emptyActionLabel="Add Developer"
          onEmptyAction={() => router.push('/admin/developers/add')}
        />
      )}
    </>
  );
}