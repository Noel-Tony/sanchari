
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/app/app-layout';
import useLocalStorage from '@/hooks/use-local-storage';
import { Loader2 } from 'lucide-react';
import useConsent from '@/hooks/use-consent';
import ConsentModal from '@/components/app/consent-modal';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [auth] = useLocalStorage('auth', { isAuthenticated: false, role: 'user' });
  const { hasConsented, giveConsent } = useConsent();
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
        <ConsentModal onConsent={giveConsent} />
      </div>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}
