
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/app/app-layout';
import useLocalStorage from '@/hooks/use-local-storage';
import { Loader2 } from 'lucide-react';
import useConsent from '@/hooks/use-consent';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [auth] = useLocalStorage('auth', { isAuthenticated: false, role: 'user' });
  const { hasConsented } = useConsent();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!hasConsented) {
      // The root layout will show the consent modal.
      // We can just show a loader here until consent is given.
      return;
    }
    if (!auth.isAuthenticated || auth.role !== 'user') {
      router.replace('/login');
    } else {
      setIsLoading(false);
    }
  }, [auth, router, hasConsented]);

  if (isLoading || !hasConsented) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}
