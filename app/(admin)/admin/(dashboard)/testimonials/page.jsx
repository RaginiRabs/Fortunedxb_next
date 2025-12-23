'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Card,
    Button,
    Typography,
    Avatar,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar,
    CircularProgress,
    IconButton,
} from '@mui/material';
import {
    AddOutlined,
    CloseOutlined,
    FormatQuoteOutlined,
} from '@mui/icons-material';
import { Star } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
// import PageHeader from '@/components/admin/PageHeader';
import useTestimonialsHook from '@/hooks/testimonial/useTestimonialsHook';

export default function TestimonialsPage() {
    const router = useRouter();

    const {
        testimonials,
        fetchTestimonials,
        testimonialsLoading,
        testimonialsError,
        deleteTestimonial,
        deleteLoading,
    } = useTestimonialsHook();

    // Local state
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [testimonialToDelete, setTestimonialToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Fetch testimonials on mount
    useEffect(() => {
        fetchTestimonials({ active: 'all' });
    }, [fetchTestimonials]);

    // Get image path
    const getImagePath = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return path.startsWith('/') ? path : `/${path}`;
    };

    // Handle add
    const handleAdd = () => {
        router.push('/admin/testimonials/add');
    };

    // Handle edit
    const handleEdit = (testimonial) => {
        router.push(`/admin/testimonials/edit/${testimonial.testimonial_id}`);
    };

    // Handle view
    const handleView = (testimonial) => {
        setSelectedTestimonial(testimonial);
        setViewModalOpen(true);
    };

    // Handle delete click
    const handleDeleteClick = (testimonial) => {
        setTestimonialToDelete(testimonial);
        setDeleteDialogOpen(true);
    };

    // Handle delete confirm
    const handleDeleteConfirm = async () => {
        if (!testimonialToDelete) return;

        const result = await deleteTestimonial(testimonialToDelete.testimonial_id);

        if (result.success) {
            setSnackbar({
                open: true,
                message: 'Testimonial deleted successfully!',
                severity: 'success',
            });
            fetchTestimonials({ active: 'all' });
        } else {
            setSnackbar({
                open: true,
                message: result.error || 'Failed to delete testimonial',
                severity: 'error',
            });
        }

        setDeleteDialogOpen(false);
        setTestimonialToDelete(null);
    };

    // Table columns
    const columns = [
        {
            field: 'client_image',
            headerName: 'Image',
            renderCell: (value, row) => (
                <Avatar
                    src={getImagePath(value)}
                    sx={{ width: 40, height: 40, bgcolor: '#C6A962' }}
                >
                    {row.client_name?.charAt(0)}
                </Avatar>
            ),
        },
        {
            field: 'client_name',
            headerName: 'Client Name',
            renderCell: (value, row) => (
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {value}
                    </Typography>
                    {row.client_designation && (
                        <Typography variant="caption" color="text.secondary">
                            {row.client_designation}
                        </Typography>
                    )}
                </Box>
            ),
        },
        {
            field: 'client_location',
            headerName: 'Location',
        },
        {
            field: 'rating',
            headerName: 'Rating',
            renderCell: (value) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            fill={i < value ? '#F59E0B' : 'transparent'}
                            color="#F59E0B"
                        />
                    ))}
                </Box>
            ),
        },
        {
            field: 'is_featured',
            headerName: 'Featured',
            renderCell: (value) => (
                <Chip
                    label={value === 1 ? 'Yes' : 'No'}
                    size="small"
                    color={value === 1 ? 'primary' : 'default'}
                    sx={{ fontSize: '0.7rem' }}
                />
            ),
        },
        {
            field: 'is_active',
            headerName: 'Status',
            renderCell: (value) => (
                <Chip
                    label={value === 1 ? 'Active' : 'Inactive'}
                    size="small"
                    color={value === 1 ? 'success' : 'default'}
                    sx={{ fontSize: '0.7rem' }}
                />
            ),
        },
    ];

    return (
        <Box>
            {/* Page Header */}
            {/* <PageHeader
        title="Testimonials"
        subtitle="Manage client reviews and testimonials"
        action={
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={handleAdd}
            sx={{
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            Add Testimonial
          </Button>
        }
      /> */}

            {/* Add Button - YEH ADD KAR */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<AddOutlined />}
                    onClick={() => router.push('/admin/testimonials/add')}
                    sx={{
                        bgcolor: 'primary.main',
                        color: '#fff',
                        px: 3,
                        '&:hover': { bgcolor: 'primary.dark' },
                    }}
                >
                    Add Testimonial
                </Button>
            </Box>

            {/* Error Alert */}
            {testimonialsError && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {testimonialsError}
                </Alert>
            )}

            {/* Data Table */}
            <Card
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'grey.200',
                    overflow: 'hidden',
                }}
            >
                {testimonialsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress sx={{ color: 'primary.main' }} />
                    </Box>
                ) : (
                    <DataTable
                        columns={columns}
                        data={testimonials.map((t) => ({ ...t, id: t.testimonial_id }))}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                        emptyTitle="No testimonials yet"
                        emptyDescription="Add your first client testimonial to showcase on your website."
                        emptyActionLabel="Add Testimonial"
                        onEmptyAction={handleAdd}
                    />
                )}
            </Card>

            {/* View Modal */}
            <Dialog
                open={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3 },
                }}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid',
                        borderColor: 'grey.200',
                        pb: 2,
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        View Testimonial
                    </Typography>
                    <IconButton onClick={() => setViewModalOpen(false)} size="small">
                        <CloseOutlined />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ mt: 2 }}>
                    {selectedTestimonial && (
                        <Box sx={{ p: 1 }}>
                            {/* Client Info */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Avatar
                                    src={getImagePath(selectedTestimonial.client_image)}
                                    sx={{ width: 70, height: 70, bgcolor: '#C6A962', fontSize: '1.5rem' }}
                                >
                                    {selectedTestimonial.client_name?.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {selectedTestimonial.client_name}
                                    </Typography>
                                    {selectedTestimonial.client_designation && (
                                        <Typography variant="body2" color="text.secondary">
                                            {selectedTestimonial.client_designation}
                                        </Typography>
                                    )}
                                    <Typography variant="caption" color="text.secondary">
                                        {selectedTestimonial.client_location}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Rating */}
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                    Rating
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={20}
                                            fill={i < selectedTestimonial.rating ? '#F59E0B' : 'transparent'}
                                            color="#F59E0B"
                                        />
                                    ))}
                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                        ({selectedTestimonial.rating}/5)
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Review Text */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                    Review
                                </Typography>
                                <Box
                                    sx={{
                                        p: 2,
                                        bgcolor: 'grey.50',
                                        borderRadius: 2,
                                        borderLeft: '4px solid #C6A962',
                                    }}
                                >
                                    <FormatQuoteOutlined sx={{ color: '#C6A962', mb: 1 }} />
                                    <Typography variant="body1" sx={{ fontStyle: 'italic', lineHeight: 1.8 }}>
                                        {selectedTestimonial.review_text}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Status Chips */}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip
                                    label={selectedTestimonial.is_featured === 1 ? 'Featured' : 'Not Featured'}
                                    size="small"
                                    color={selectedTestimonial.is_featured === 1 ? 'primary' : 'default'}
                                />
                                <Chip
                                    label={selectedTestimonial.is_active === 1 ? 'Active' : 'Inactive'}
                                    size="small"
                                    color={selectedTestimonial.is_active === 1 ? 'success' : 'default'}
                                />
                            </Box>

                            {/* Project Link */}
                            {selectedTestimonial.project_name && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Related Project: <strong>{selectedTestimonial.project_name}</strong>
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3 },
                }}
            >
                <DialogTitle sx={{ fontWeight: 600 }}>Delete Testimonial</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the testimonial from{' '}
                        <strong>{testimonialToDelete?.client_name}</strong>? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: 'text.secondary' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteConfirm}
                        disabled={deleteLoading}
                    >
                        {deleteLoading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ borderRadius: 2 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}