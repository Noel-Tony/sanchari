
'use client';

import { useState, useEffect } from 'react';
import type { Trip, TransportMode } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, Bike, Car, Users, Clock, HelpCircle, MapPin, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';


const TransportIcon = ({ mode, className }: { mode: TransportMode; className?: string }) => {
  const props = { className: className || 'h-6 w-6 text-primary' };
  switch (mode) {
    case 'bike':
      return <Bike {...props} />;
    case 'car':
      return <Car {...props} />;
    case 'public transport':
        return <Bus {...props} />;
    default:
      return <HelpCircle {...props} />;
  }
};

export default function HistoryPageClient() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'trips'), orderBy('startTime', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tripsData: Trip[] = [];
      querySnapshot.forEach((doc) => {
        tripsData.push({ id: doc.id, ...doc.data() } as Trip);
      });
      setTrips(tripsData);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex h-[50vh] flex-col items-center justify-center rounded-lg border-2 border-dashed">
                <h3 className="text-2xl font-bold tracking-tight">Loading Trip History...</h3>
                <p className="text-muted-foreground">Fetching data from Firestore.</p>
            </div>
        </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {trips.length > 0 ? (
         <Accordion type="single" collapsible className="w-full space-y-4">
          {trips.map(trip => (
            <AccordionItem value={trip.id} key={trip.id} className="border-none">
                <Card className="w-full">
                    <AccordionTrigger className="w-full text-left hover:no-underline p-0 [&>svg]:mx-6">
                        <CardHeader className="w-full">
                            <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-xl font-headline flex items-center flex-wrap gap-2">
                                    <MapPin className="h-5 w-5 text-muted-foreground"/> 
                                    <span className="truncate max-w-xs">{trip.startLocation}</span>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground"/> 
                                    <span className="truncate max-w-xs">{trip.endLocation}</span>
                                </CardTitle>
                                <CardDescription>
                                {new Date(trip.startTime).toLocaleDateString()}
                                </CardDescription>
                            </div>
                            <TransportIcon mode={trip.mode} />
                            </div>
                        </CardHeader>
                    </AccordionTrigger>
                    <AccordionContent>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">
                                <div className="flex items-center gap-4">
                                    <div className="text-center">
                                        <p className="font-semibold capitalize text-lg text-primary">{trip.purpose}</p>
                                        <p className="text-xs text-muted-foreground">Purpose</p>
                                    </div>
                                    <Separator orientation="vertical" className="h-10" />
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>
                                            {new Date(trip.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                                            {new Date(trip.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <Separator orientation="vertical" className="h-10 hidden md:block" />
                                     <div className="flex items-center gap-2 text-muted-foreground hidden md:flex">
                                        <Users className="h-4 w-4" />
                                        <span>{trip.coTravellers} co-traveller{trip.coTravellers !== 1 ? 's' : ''}</span>
                                    </div>
                                </div>

                                <div className="font-bold text-right">
                                    {(trip.distance || 0).toFixed(2)} miles
                                </div>
                            </div>
                        </CardContent>
                    </AccordionContent>
                </Card>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="flex h-[50vh] flex-col items-center justify-center rounded-lg border-2 border-dashed">
          <h3 className="text-2xl font-bold tracking-tight">No Trip History</h3>
          <p className="text-muted-foreground">Start a trip on the dashboard to see your history here.</p>
        </div>
      )}
    </main>
  );
}
