'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Chip,
  Typography,
  Alert,
} from '@mui/material';
import { AddOutlined } from '@mui/icons-material';
import DataTable from '@/components/admin/DataTable';
import LoadingScreen from '@/components/admin/LoadingScreen';
import useToast from '@/hooks/useToast';

const statusColors = {
  'New Launch': { bg: '#E3F2FD', color: '#1565C0' },
  'Under Construction': { bg: '#FFF3E0', color: '#E65100' },
  'Ready': { bg: '#E8F5E9', color: '#2E7D32' },
};

export default function ProjectsPage() {
  const router = useRouter();
  const toast = useToast();
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();

      if (data.success) {
        setProjects(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch projects');
      }
    } catch (err) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    router.push(`/admin/projects/edit/${project.project_id}/basic`);
  };

  const handleView = (project) => {
    router.push(`/admin/projects/view/${project.project_id}`);
  };

  const columns = [
    {
      field: 'project_name',
      headerName: 'Project Name',
      renderCell: (value, row) => (
        <Box>
          <Typography sx={{ fontWeight: 500 }}>{value}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {row.locality ? `${row.locality}, ` : ''}{row.city || 'Dubai'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'developer_name',
      headerName: 'Developer',
      renderCell: (value) => value || '-',
    },
    {
      field: 'project_status',
      headerName: 'Status',
      renderCell: (value) => {
        const style = statusColors[value] || { bg: 'grey.100', color: 'text.primary' };
        return value ? (
          <Chip
            label={value}
            size="small"
            sx={{
              bgcolor: style.bg,
              color: style.color,
              fontWeight: 500,
            }}
          />
        ) : '-';
      },
    },
    {
      field: 'price_min',
      headerName: 'Starting Price',
      renderCell: (value) => value || '-',
    },
    {
      field: 'usage_type',
      headerName: 'Type',
      renderCell: (value) => value || '-',
    },
    {
      field: 'featured',
      headerName: 'Featured',
      renderCell: (value) => (
        <Chip
          label={value ? 'Yes' : 'No'}
          size="small"
          sx={{
            bgcolor: value ? 'primary.main' : 'grey.200',
            color: value ? '#fff' : 'text.secondary',
          }}
        />
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
          onClick={() => router.push('/admin/projects/add')}
          sx={{
            bgcolor: 'primary.main',
            px: 3,
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          Add Project
        </Button>
      </Box>

      {/* Content */}
      {loading ? (
        <LoadingScreen message="Loading projects..." />
      ) : (
        <DataTable
          columns={columns}
          data={projects.map((p) => ({ ...p, id: p.project_id }))}
          onView={handleView}
          onEdit={handleEdit}
          emptyTitle="No projects found"
          emptyDescription="Get started by adding your first project."
          emptyActionLabel="Add Project"
          onEmptyAction={() => router.push('/admin/projects/add')}
        />
      )}
    </>
  );
}