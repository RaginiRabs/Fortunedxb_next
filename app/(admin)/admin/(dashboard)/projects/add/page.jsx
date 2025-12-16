'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddProjectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/projects/add/basic');
  }, [router]);

  return null;
}