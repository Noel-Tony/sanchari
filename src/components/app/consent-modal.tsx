
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
import { ShieldCheck, MapPin, Database, Users } from 'lucide-react';
import useConsent from '@/hooks/use-consent';
import { useToast } from '@/hooks/use-toast';

export default function ConsentModal() {
  const { giveConsent } = useConsent();
  const { toast } = useToast();

  const handleAccept = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Location Not Supported',
        description: 'Your browser does not support geolocation.',
        variant: 'destructive',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        giveConsent();
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          toast({
            title: 'Location Access Required',
            description: 'To use TripMapper, please enable location access in your browser settings and click "Accept" again.',
            variant: 'destructive',
            duration: 5000,
          });
        } else {
          toast({
            title: 'Location Error',
            description: 'Could not get your location. Please try again.',
            variant: 'destructive',
          });
        }
      }
    );
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[520px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-headline">
            <ShieldCheck className="h-8 w-8 text-primary" />
            Welcome to TripMapper
          </DialogTitle>
          <DialogDescription className="pt-2 text-base">
            To help improve transportation planning, TripMapper collects anonymous trip data. Please review our data practices and grant location access to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 text-sm">
            <h3 className="font-semibold text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Location & Trip Data
            </h3>
            <p className="text-muted-foreground">
                We use your device's location to automatically track your trips, including start/end points, routes, and duration. We also ask you to provide the trip's purpose, transport mode, and number of co-travellers.
            </p>
             <h3 className="font-semibold text-lg flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Secure & Anonymous Storage
            </h3>
            <p className="text-muted-foreground">
                Your trip data is tagged with an anonymized user ID and stored securely. Your personal information is never shared.
            </p>
            <h3 className="font-semibold text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Contribution to Research
            </h3>
            <p className="text-muted-foreground">
                Anonymous, aggregated data is accessed by planners and researchers to analyze travel patterns, model transportation needs, and inform policy decisions for better infrastructure.
            </p>
        </div>
        <DialogFooter>
          <Button onClick={handleAccept} size="lg" className="w-full bg-accent hover:bg-accent/90">
            I Accept and Consent to Share Trip Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
