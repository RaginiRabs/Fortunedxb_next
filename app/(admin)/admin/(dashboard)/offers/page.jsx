'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { AddOutlined } from '@mui/icons-material';
import DataTable from '@/components/admin/DataTable';

export default function OffersPage() {
  const router = useRouter();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, offer: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await fetch('/api/offers');
      const data = await res.json();

      if (data.success) {
        setOffers(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (offer) => {
    router.push(`/admin/offers/${offer.offer_id}`);
  };

  const handleDelete = (offer) => {
    setDeleteDialog({ open: true, offer });
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/offers/${deleteDialog.offer.offer_id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        setOffers(offers.filter((o) => o.offer_id !== deleteDialog.offer.offer_id));
        setDeleteDialog({ open: false, offer: null });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to delete offer');
    } finally {
      setDeleting(false);
    }
  };

  const isExpired = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const columns = [
    {
      field: 'title',
      headerName: 'Offer Title',
      renderCell: (value) => (
        <Typography sx={{ fontWeight: 500 }}>{value}</Typography>
      ),
    },
    {
      field: 'project_name',
      headerName: 'Project',
    },
    {
      field: 'description',
      headerName: 'Description',
      renderCell: (value) => value || '-',
    },
    {
      field: 'expiry_date',
      headerName: 'Expiry',
      renderCell: (value, row) => {
        if (!value) return '-';
        const expired = isExpired(value);
        return (
          <Chip
            label={new Date(value).toLocaleDateString()}
            size="small"
            sx={{
              bgcolor: expired ? 'error.light' : 'success.light',
              color: expired ? 'error.dark' : 'success.dark',
            }}
          />
        );
      },
    },
    {
      field: 'created_at',
      headerName: 'Created',
      renderCell: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <Box>

      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={() => router.push('/admin/offers/add')}
            sx={{
              bgcolor: 'primary.main',
              color: '#fff',
              px: 3,
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            Add Offer
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: 'primary.main' }} />
          </Box>
        ) : (
          <DataTable
            columns={columns}
            data={offers.map((o) => ({ ...o, id: o.offer_id }))}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No offers found. Add your first offer!"
          />
        )}
      </Box>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, offer: null })}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Offer</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deleteDialog.offer?.title}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialog({ open: false, offer: null })}>
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            disabled={deleting}
            sx={{ bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' } }}
          >
            {deleting ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}