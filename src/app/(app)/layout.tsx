
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/app/app-layout';
import useLocalStorage from '@/hooks/use-local-storage';
import { Loader2 } from 'lucide-react';
import ConsentModal from '@/components/app/consent-modal';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [auth] = useLocalStorage('auth', { isAuthenticated: false, role: 'user' });
  const [hasConsented, setHasConsented] = useLocalStorage('user-consent', false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    return (
      <div className="h-screen w-full bg-background">
        <ConsentModal onConsent={() => setHasConsented(true)} />
      </div>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}
