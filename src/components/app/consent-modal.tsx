'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldCheck, MapPin } from 'lucide-react';
import useConsent from '@/hooks/use-consent';

export default function ConsentModal() {
  const { giveConsent } = useConsent();

  const handleAccept = () => {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'granted' || result.state === 'prompt') {
        giveConsent();
      } else if (result.state === 'denied') {
        alert('Location access is denied. Please enable it in your browser settings to use this app.');
      }
    });
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[480px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-headline">
            <ShieldCheck className="h-8 w-8 text-primary" />
            Your Privacy Matters
          </DialogTitle>
          <DialogDescription className="pt-2 text-base">
            To provide you with the best experience, TripMapper needs your consent to collect some data and access your location.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Location Access
            </h3>
            <p className="text-muted-foreground">
                We use your device's location to automatically track your trips, including start and end points. Your location data is stored locally on your device and is not shared with us or any third parties.
            </p>
             <h3 className="font-semibold text-lg flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Data Collection
            </h3>
            <p className="text-muted-foreground">
                We collect anonymous trip data (such as purpose, mode of transport, and duration) to improve our services and for analytical purposes. All data is anonymized and stored securely.
            </p>
        </div>
        <DialogFooter>
          <Button onClick={handleAccept} size="lg" className="w-full bg-accent hover:bg-accent/90">
            Accept and Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
