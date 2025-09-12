'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';

export default function WelcomePage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [auth] = useLocalStorage('auth', { isAuthenticated: false, role: null });

  useEffect(() => {
    if (auth.isAuthenticated) {
      if (auth.role === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/dashboard');
      }
    } else {
       router.replace('/login');
    }
  }, [router, auth]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-secondary">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}
