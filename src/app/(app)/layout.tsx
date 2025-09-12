'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/app/app-layout';
import useLocalStorage from '@/hooks/use-local-storage';
import { Loader2 } from 'lucide-react';
import ConsentModal from '@/components/app/consent-modal';
import useConsent from '@/hooks/use-consent';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [auth] = useLocalStorage('auth', { isAuthenticated: false, role: 'user' });
  const { hasConsented } = useConsent();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Since useLocalStorage initializes from the client,
    // we can check the auth status in an effect.
    if (!auth.isAuthenticated || auth.role !== 'user') {
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

  if (!hasConsented) {
    return <ConsentModal />;
  }

  return <AppLayout>{children}</AppLayout>;
}
