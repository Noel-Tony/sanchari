
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import useConsent from '@/hooks/use-consent';
import ConsentModal from '@/components/app/consent-modal';
import { useEffect, useState } from 'react';

// This is a client component, so metadata is not used here.
// We can define it in a parent layout if needed, or keep it for reference.
// export const metadata: Metadata = {
//   title: 'TripMapper',
//   description: 'Intelligently track and categorize your travel.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { hasConsented } = useConsent();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased min-h-screen bg-background')}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          {isClient && !hasConsented ? <ConsentModal /> : children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
