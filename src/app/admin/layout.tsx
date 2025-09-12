'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/app/app-layout';
import useLocalStorage from '@/hooks/use-local-storage';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [auth] = useLocalStorage('auth', { isAuthenticated: false, role: 'user' });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth.isAuthenticated || auth.role !== 'admin') {
      router.replace('/login');
    } else {
        setIsLoading(false);
    }
  }, [auth, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}
