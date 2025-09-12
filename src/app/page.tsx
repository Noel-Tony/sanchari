'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, UserCheck, FileText } from 'lucide-react';
import { Logo } from '@/components/icons/logo';

const CONSENT_KEY = 'tripmapper-consent-given';

export default function WelcomePage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const consentGiven = localStorage.getItem(CONSENT_KEY);
    if (consentGiven === 'true') {
      router.replace('/dashboard');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  const handleConsent = () => {
    localStorage.setItem(CONSENT_KEY, 'true');
    router.push('/dashboard');
  };

  const handleDisagree = () => {
    alert('You must consent to data collection to use this application.');
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-secondary">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="items-center text-center">
          <Logo className="mb-4 h-12 w-12 text-primary" />
          <CardTitle className="text-3xl font-headline">Welcome to TripMapper</CardTitle>
          <CardDescription className="text-md">
            Help us improve transportation research.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            This app collects trip data to support research initiatives. Your privacy is important to us.
          </p>
          <div className="space-y-2 rounded-lg border p-4">
            <div className="flex items-start gap-4">
              <UserCheck className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
              <div>
                <h4 className="font-semibold">What We Collect</h4>
                <p className="text-sm text-muted-foreground">
                  Trip start/end times, locations, and transport modes to understand travel patterns.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FileText className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
              <div>
                <h4 className="font-semibold">Your Consent</h4>
                <p className="text-sm text-muted-foreground">
                  By agreeing, you allow us to collect and use this data for research purposes.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={handleConsent} className="w-full" variant="default">
            I Agree
          </Button>
          <Button onClick={handleDisagree} className="w-full" variant="outline">
            I Disagree
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
