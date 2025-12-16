'use client';
import { Box } from '@mui/material';
import Header from '@/components/admin/Header';
import OfferForm from '@/components/admin/OfferForm';

export default function AddOfferPage() {
  return (
    <Box>
      <Header title="Add Offer" subtitle="Create a new offer" />
      <Box sx={{ p: 3 }}>
        <OfferForm />
      </Box>
    </Box>
  );
}