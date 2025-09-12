
'use client';

import useLocalStorage from '@/hooks/use-local-storage';
import type { Trip, TransportMode } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Footprints, Bike, Car, Users, Clock, HelpCircle, MapPin, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import TripMap from './trip-map';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


const TransportIcon = ({ mode, className }: { mode: TransportMode; className?: string }) => {
  const props = { className: className || 'h-6 w-6 text-primary' };
  switch (mode) {
    case 'walking':
      return <Footprints {...props} />;
    case 'cycling':
      return <Bike {...props} />;
    case 'vehicle':
      return <Car {...props} />;
    default:
      return <HelpCircle {...props} />;
  }
};

export default function HistoryPageClient() {
  const [trips] = useLocalStorage<Trip[]>('trips', []);

  const sortedTrips = [...trips].sort((a, b) => b.startTime - a.startTime);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {sortedTrips.length > 0 ? (
         <Accordion type="single" collapsible className="w-full space-y-4">
          {sortedTrips.map(trip => (
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
                                    {trip.distance.toFixed(2)} miles
                                </div>
                            </div>
                        </CardContent>
                        <div className="px-6 pb-6">
                            <TripMap trip={trip} />
                        </div>
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
