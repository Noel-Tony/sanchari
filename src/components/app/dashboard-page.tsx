
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle, StopCircle, Car, Bike, Clock, MapPin, Users, HelpCircle, Loader2, Bus } from 'lucide-react';
import TripFormModal from './trip-form-modal';
import type { Trip, TransportMode } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, onSnapshot, getDocs, limit } from 'firebase/firestore';
import { useLanguage } from '@/context/language-context';

interface CurrentTripState {
  isActive: boolean;
  startTime: number | null;
  startLocation: string | null;
}

const TransportIcon = ({ mode, className }: { mode: TransportMode, className?: string }) => {
  const props = { className: className || 'h-5 w-5' };
  switch (mode) {
    case 'bike': return <Bike {...props} />;
    case 'car': return <Car {...props} />;
    case 'public transport': return <Bus {...props} />;
    default: return <HelpCircle {...props} />;
  }
};

let locationCounter = 1;

export default function DashboardPageClient() {
  const [trips, setTrips] = useState<Trip[]>([]);
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
  const { t } = useLanguage();

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const q = query(collection(db, "trips"), where("startTime", ">=", today.getTime()));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todaysTrips: Trip[] = [];
      querySnapshot.forEach((doc) => {
        todaysTrips.push({ id: doc.id, ...doc.data() } as Trip);
      });
      setTrips(todaysTrips.sort((a,b) => b.startTime - a.startTime));
    });

    return () => unsubscribe();
  }, []);


  const startTrip = () => {
    if (!locationEnabled) {
        toast({
            title: t('Location is Disabled'),
            description: t('Please enable the location toggle to start a new trip.'),
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
  
  const handleSaveTrip = async (newTrip: Omit<Trip, 'id'>) => {
    try {
        await addDoc(collection(db, "trips"), { ...newTrip, userId: 'user001' /* Mock user */ });
        toast({ title: "Trip Saved!", description: "Your trip has been successfully saved to Firestore."});
    } catch (e) {
        console.error("Error adding document: ", e);
        toast({ title: "Save Error", description: "There was a problem saving your trip.", variant: "destructive" });
    }
    setIsModalOpen(false);
  };

  const todaysTrips = trips;

  const isTripControlsDisabled = !locationEnabled || isProcessing;

  return (
    <main className="flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
             <div className="flex flex-row items-start justify-between">
                <CardTitle className="text-2xl font-medium font-headline">
                {currentTrip.isActive ? t('Trip in Progress') : t('Start a New Trip')}
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
                        {t('Location')}
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
                                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> <strong>{t('From')}:</strong> {currentTrip.startLocation}</p>
                                <p className="flex items-center gap-2 mt-2"><Clock className="h-4 w-4 text-primary" /> <strong>{t('Started at')}:</strong> {new Date(currentTrip.startTime).toLocaleTimeString()}</p>
                                <div className="pt-4 w-full flex justify-center md:justify-start">
                                <Button onClick={endTrip} size="lg" variant='destructive' disabled={isTripControlsDisabled}>
                                    {isProcessing ? <Loader2 className="animate-spin" /> : <StopCircle />}
                                    <span className="ml-2">{t('End Trip')}</span>
                                </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-md text-muted-foreground">
                            {locationEnabled ? t('Click "Start Trip" to begin recording your journey.') : t('Enable location to start a new trip.')}
                        </p>
                        <Button onClick={startTrip} size="lg" disabled={isTripControlsDisabled} variant={locationEnabled ? 'default' : 'secondary'}>
                            {isProcessing ? <Loader2 className="animate-spin" /> : <PlayCircle />}
                            <span className="ml-2">{t('Start Trip')}</span>
                        </Button>
                    </>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">{t("Today's Trips")}</h2>
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
            <p className="text-muted-foreground">{t('No trips recorded today.')}</p>
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
