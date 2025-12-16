'use client';
import { use } from 'react';
import DeveloperForm from '@/components/admin/DeveloperForm';

export default function EditDeveloperPage({ params }) {
  const { id } = use(params);

  return <DeveloperForm developerId={id} />;
}