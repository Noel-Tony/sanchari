
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle, StopCircle, Car, Bike, Footprints, Clock, MapPin, Users, HelpCircle, Loader2 } from 'lucide-react';
import TripFormModal from './trip-form-modal';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Trip, TransportMode } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface CurrentTripState {
  isActive: boolean;
  startTime: number | null;
  startLocation: string | null;
}

const TransportIcon = ({ mode, className }: { mode: TransportMode, className?: string }) => {
  const props = { className: className || 'h-5 w-5' };
  switch (mode) {
    case 'walking': return <Footprints {...props} />;
    case 'cycling': return <Bike {...props} />;
    case 'vehicle': return <Car {...props} />;
    default: return <HelpCircle {...props} />;
  }
};

let locationCounter = 1;

export default function DashboardPageClient() {
  const [trips, setTrips] = useLocalStorage<Trip[]>('trips', []);
  const [currentTrip, setCurrentTrip] = useState<CurrentTripState>({
    isActive: false,
    startTime: null,
    startLocation: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tripDataForModal, setTripDataForModal] = useState<Omit<Trip, 'purpose' | 'coTravellers' | 'id' | 'mode'> | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const startTrip = () => {
    if (!locationEnabled) {
        toast({
            title: 'Location is Disabled',
            description: 'Please enable the location toggle to start a new trip.',
            variant: 'destructive',
        });
        return;
    }
    
    setIsProcessing(true);
    // Simulate getting location
    setTimeout(() => {
        setCurrentTrip({
            isActive: true,
            startTime: Date.now(),
            startLocation: `Location ${locationCounter}`,
        });
        setIsProcessing(false);
    }, 500);
  };

  const endTrip = () => {
    if (!currentTrip.startTime || !currentTrip.startLocation) return;
    
    setIsProcessing(true);
    // Simulate getting location
    setTimeout(() => {
        const endLocation = `Location ${locationCounter + 1}`;
        locationCounter += 2;

        setTripDataForModal({
            startTime: currentTrip.startTime!,
            endTime: Date.now(),
            startLocation: currentTrip.startLocation!,
            endLocation: endLocation,
            distance: Math.random() * 10, // Mock distance
        });

        setIsModalOpen(true);
        setCurrentTrip({ isActive: false, startTime: null, startLocation: null });
        setIsProcessing(false);
    }, 500);
  };
  
  const handleSaveTrip = (newTrip: Omit<Trip, 'id'>) => {
    setTrips(prevTrips => [...prevTrips, { ...newTrip, id: crypto.randomUUID() }]);
    setIsModalOpen(false);
  };

  const todaysTrips = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return trips.filter(trip => trip.startTime >= today.getTime());
  }, [trips]);

  const isTripControlsDisabled = !locationEnabled || isProcessing;

  return (
    <main className="flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
             <div className="flex flex-row items-start justify-between">
                <CardTitle className="text-2xl font-medium font-headline">
                {currentTrip.isActive ? 'Trip in Progress' : 'Start a New Trip'}
                </CardTitle>
                <div className="flex items-center space-x-2">
                    <Switch 
                        id="location-toggle"
                        checked={locationEnabled}
                        onCheckedChange={setLocationEnabled}
                        aria-label="Toggle location tracking"
                        disabled={isProcessing || currentTrip.isActive}
                    />
                    <Label htmlFor="location-toggle" className="text-sm font-medium">
                        Location
                    </Label>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4 text-center">
                 {currentTrip.isActive && currentTrip.startTime ? (
                    <div className="text-md text-muted-foreground space-y-2 text-left w-full">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> <strong>From:</strong> {currentTrip.startLocation}</p>
                                <p className="flex items-center gap-2 mt-2"><Clock className="h-4 w-4 text-primary" /> <strong>Started at:</strong> {new Date(currentTrip.startTime).toLocaleTimeString()}</p>
                                <div className="pt-4 w-full flex justify-center md:justify-start">
                                <Button onClick={endTrip} size="lg" variant='destructive' disabled={isTripControlsDisabled}>
                                    {isProcessing ? <Loader2 className="animate-spin" /> : <StopCircle />}
                                    <span className="ml-2">End Trip</span>
                                </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-md text-muted-foreground">
                            {locationEnabled ? 'Click "Start Trip" to begin recording your journey.' : 'Enable location to start a new trip.'}
                        </p>
                        <Button onClick={startTrip} size="lg" disabled={isTripControlsDisabled} variant={locationEnabled ? 'default' : 'secondary'}>
                            {isProcessing ? <Loader2 className="animate-spin" /> : <PlayCircle />}
                            <span className="ml-2">Start Trip</span>
                        </Button>
                    </>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">Today's Trips</h2>
        {todaysTrips.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todaysTrips.map(trip => (
              <Card key={trip.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-base">{trip.startLocation} to {trip.endLocation}</span>
                    <TransportIcon mode={trip.mode} className="h-6 w-6 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                   <p className="font-semibold capitalize text-foreground">{trip.purpose}</p>
                   <div className="flex items-center gap-4">
                        <p className="flex items-center gap-2"><Clock className="h-4 w-4" /> {new Date(trip.startTime).toLocaleTimeString()} - {new Date(trip.endTime).toLocaleTimeString()}</p>
                        <p className="flex items-center gap-2"><Users className="h-4 w-4" /> {trip.coTravellers}</p>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No trips recorded today.</p>
          </div>
        )}
      </div>

      {tripDataForModal && (
        <TripFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTrip}
          tripData={tripDataForModal}
          allTrips={trips}
        />
      )}
    </main>
  );
}
