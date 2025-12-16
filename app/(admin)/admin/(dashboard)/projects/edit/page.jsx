'use client';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    router.replace(`/admin/projects/edit/${params.id}/basic`);
  }, [router, params.id]);

  return null;
}