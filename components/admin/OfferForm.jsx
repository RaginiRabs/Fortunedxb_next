'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { SaveOutlined, ArrowBackOutlined } from '@mui/icons-material';

export default function OfferForm({ offerId = null }) {
  const router = useRouter();
  const isEdit = Boolean(offerId);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    project_id: '',
    title: '',
    description: '',
    expiry_date: '',
  });

  useEffect(() => {
    fetchProjects();
    if (isEdit) {
      fetchOffer();
    } else {
      setFetching(false);
    }
  }, [offerId]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const fetchOffer = async () => {
    try {
      const res = await fetch(`/api/offers/${offerId}`);
      const data = await res.json();

      if (data.success) {
        setFormData({
          project_id: data.data.project_id || '',
          title: data.data.title || '',
          description: data.data.description || '',
          expiry_date: data.data.expiry_date ? data.data.expiry_date.split('T')[0] : '',
        });
      } else {
        setError('Offer not found');
      }
    } catch (err) {
      setError('Failed to fetch offer');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const url = isEdit ? `/api/offers/${offerId}` : '/api/offers';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(data.message);
        setTimeout(() => {
          router.push('/admin/offers');
        }, 1000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6}}>
            <FormControl fullWidth required>
              <InputLabel>Project</InputLabel>
              <Select
                name="project_id"
                value={formData.project_id}
                onChange={handleChange}
                label="Project"
              >
                {projects.map((project) => (
                  <MenuItem key={project.project_id} value={project.project_id}>
                    {project.project_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6}}>
            <TextField
              fullWidth
              required
              label="Offer Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., 10% DLD Waiver"
            />
          </Grid>

          <Grid size={{ xs: 12}}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6}}>
            <TextField
              fullWidth
              type="date"
              label="Expiry Date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackOutlined />}
            onClick={() => router.push('/admin/offers')}
            sx={{
              borderColor: 'grey.300',
              color: 'text.secondary',
              '&:hover': { borderColor: 'grey.400', bgcolor: 'grey.50' },
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            startIcon={loading ? null : <SaveOutlined />}
            disabled={loading}
            sx={{
              bgcolor: 'primary.main',
              color: '#fff',
              px: 4,
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: '#fff' }} />
            ) : isEdit ? (
              'Update Offer'
            ) : (
              'Add Offer'
            )}
          </Button>
        </Box>
      </form>
    </Card>
  );
}