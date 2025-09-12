'use client';

import useLocalStorage from '@/hooks/use-local-storage';
import type { Trip, TransportMode } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Footprints, Bike, Car, HelpCircle } from 'lucide-react';

const TransportIcon = ({ mode }: { mode: TransportMode }) => {
    const props = { className: 'h-5 w-5 text-muted-foreground' };
    switch (mode) {
      case 'walking': return <Footprints {...props} />;
      case 'cycling': return <Bike {...props} />;
      case 'vehicle': return <Car {...props} />;
      default: return <HelpCircle {...props} />;
    }
};

export default function AdminDashboardClient() {
  const [trips] = useLocalStorage<Trip[]>('trips', []);

  return (
    <main className="flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>All User Trips</CardTitle>
          <CardDescription>A comprehensive log of all trips recorded by users.</CardDescription>
        </CardHeader>
        <CardContent>
          {trips.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Co-Travellers</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell>{new Date(trip.startTime).toLocaleDateString()}</TableCell>
                    <TableCell>{trip.startLocation} to {trip.endLocation}</TableCell>
                    <TableCell className="capitalize">{trip.purpose}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TransportIcon mode={trip.mode} />
                        <span className="capitalize">{trip.mode}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {`${Math.round((trip.endTime - trip.startTime) / 60000)} mins`}
                    </TableCell>
                    <TableCell>
                        {`${trip.distance.toFixed(1)} miles`}
                    </TableCell>
                    <TableCell>{trip.coTravellers}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No trip data available from any user.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
