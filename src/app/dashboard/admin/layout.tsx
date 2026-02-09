'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user && user.role !== 'ADMIN') {
      router.push('/');
    }
  }, [user, mounted, router]);

  if (!mounted) return null;

  return (
    <>
      {children}
    </>
  );
}
