'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  PersonOutlined,
  PhoneOutlined,
  EmailOutlined,
  ApartmentOutlined,
  SourceOutlined,
  CalendarTodayOutlined,
  ArrowBackOutlined,
  SaveOutlined,
} from '@mui/icons-material';

export default function LeadDetails({ leadId }) {
  const router = useRouter();
  const [lead, setLead] = useState(null);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchLead();
  }, [leadId]);

  const fetchLead = async () => {
    try {
      const res = await fetch(`/api/leads/${leadId}`);
      const data = await res.json();

      if (data.success) {
        setLead(data.data);
        setComments(data.data.comments || '');
      } else {
        setError('Lead not found');
      }
    } catch (err) {
      setError('Failed to fetch lead');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess('Comments saved successfully');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  if (!lead) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        Lead not found
      </Alert>
    );
  }

  const InfoItem = ({ icon: Icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
      <Icon sx={{ color: 'primary.main', mt: 0.3 }} />
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography sx={{ fontWeight: 500 }}>{value || '-'}</Typography>
      </Box>
    </Box>
  );

  return (
    <Box>
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

      <Grid container spacing={3}>
        {/* Lead Info Card */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'grey.200', height: '100%' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontStyle: 'normal' }}>
              Lead Information
            </Typography>

            <InfoItem icon={PersonOutlined} label="Name" value={lead.lead_name} />
            <InfoItem icon={PhoneOutlined} label="Phone" value={lead.lead_phone} />
            <InfoItem icon={EmailOutlined} label="Email" value={lead.lead_email} />
            <InfoItem icon={ApartmentOutlined} label="Project" value={lead.project_name} />
            <InfoItem icon={SourceOutlined} label="Source" value={lead.lead_source} />
            <InfoItem
              icon={CalendarTodayOutlined}
              label="Date"
              value={new Date(lead.lead_date).toLocaleString()}
            />
          </Card>
        </Grid>

        {/* Comments Card */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'grey.200', height: '100%' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontStyle: 'normal' }}>
              Notes & Comments
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={8}
              placeholder="Add notes about this lead..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              startIcon={saving ? null : <SaveOutlined />}
              onClick={handleSave}
              disabled={saving}
              sx={{
                bgcolor: 'primary.main',
                color: '#fff',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              {saving ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Save Notes'}
            </Button>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackOutlined />}
          onClick={() => router.push('/admin/leads')}
          sx={{
            borderColor: 'grey.300',
            color: 'text.secondary',
            '&:hover': { borderColor: 'grey.400', bgcolor: 'grey.50' },
          }}
        >
          Back to Leads
        </Button>
      </Box>
    </Box>
  );
}