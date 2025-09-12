'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle, StopCircle, Car, Bike, Footprints, Clock, MapPin, Users, HelpCircle } from 'lucide-react';
import TripFormModal from './trip-form-modal';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Trip, TransportMode } from '@/lib/types';

interface CurrentTripState {
  isActive: boolean;
  startTime: number | null;
  startLocation: string | null;
}

const simulatedLocations = ['Home', 'Office', 'Downtown', 'Supermarket', 'Gym', 'Park', 'Friend\'s House'];

const getRandomLocation = (exclude?: string | null): string => {
  const availableLocations = simulatedLocations.filter(loc => loc !== exclude);
  return availableLocations[Math.floor(Math.random() * availableLocations.length)];
};

const TransportIcon = ({ mode, className }: { mode: TransportMode, className?: string }) => {
  const props = { className: className || 'h-5 w-5' };
  switch (mode) {
    case 'walking': return <Footprints {...props} />;
    case 'cycling': return <Bike {...props} />;
    case 'vehicle': return <Car {...props} />;
    default: return <HelpCircle {...props} />;
  }
};

export default function DashboardPageClient() {
  const [trips, setTrips] = useLocalStorage<Trip[]>('trips', []);
  const [currentTrip, setCurrentTrip] = useState<CurrentTripState>({
    isActive: false,
    startTime: null,
    startLocation: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tripDataForModal, setTripDataForModal] = useState<Omit<Trip, 'purpose' | 'coTravellers' | 'id' | 'mode'> | null>(null);

  const startTrip = () => {
    const startTime = Date.now();
    const startLocation = getRandomLocation();
    setCurrentTrip({ isActive: true, startTime, startLocation });
  };

  const endTrip = () => {
    if (!currentTrip.startTime || !currentTrip.startLocation) return;
    
    const endTime = Date.now();
    const endLocation = getRandomLocation(currentTrip.startLocation);
    
    setTripDataForModal({
      startTime: currentTrip.startTime,
      endTime,
      startLocation: currentTrip.startLocation,
      endLocation,
    });
    
    setIsModalOpen(true);
    setCurrentTrip({ isActive: false, startTime: null, startLocation: null });
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

  return (
    <main className="flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-medium font-headline">
              {currentTrip.isActive ? 'Trip in Progress' : 'Start a New Trip'}
            </CardTitle>
            <Button onClick={currentTrip.isActive ? endTrip : startTrip} size="lg" variant={currentTrip.isActive ? 'destructive' : 'default'} className="bg-accent hover:bg-accent/90">
              {currentTrip.isActive ? <StopCircle /> : <PlayCircle />}
              <span className="ml-2">{currentTrip.isActive ? 'End Trip' : 'Start Trip'}</span>
            </Button>
          </CardHeader>
          <CardContent>
            {currentTrip.isActive && currentTrip.startTime && (
              <div className="text-md text-muted-foreground space-y-2">
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> <strong>From:</strong> {currentTrip.startLocation}</p>
                <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> <strong>Started at:</strong> {new Date(currentTrip.startTime).toLocaleTimeString()}</p>
              </div>
            )}
            {!currentTrip.isActive && <p className="text-md text-muted-foreground">Click "Start Trip" to begin recording your journey.</p>}
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
                    <span>{trip.startLocation} to {trip.endLocation}</span>
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
