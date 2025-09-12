
'use client';

import useLocalStorage from '@/hooks/use-local-storage';
import type { Trip, TransportMode } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Footprints, Bike, Car, HelpCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const handleExport = () => {
    if (trips.length === 0) return;

    const headers = [
        'ID', 
        'Start Time', 
        'End Time', 
        'Start Location', 
        'End Location',
        'Purpose', 
        'Mode', 
        'Duration (mins)', 
        'Distance (miles)', 
        'Co-Travellers'
    ];
    
    const rows = trips.map(trip => [
      trip.id,
      new Date(trip.startTime).toISOString(),
      new Date(trip.endTime).toISOString(),
      `"${trip.startLocation}"`,
      `"${trip.endLocation}"`,
      trip.purpose,
      trip.mode,
      Math.round((trip.endTime - trip.startTime) / 60000),
      (trip.distance || 0).toFixed(2),
      trip.coTravellers
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `trip-data-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All User Trips</CardTitle>
            <CardDescription>A comprehensive log of all trips recorded by users.</CardDescription>
          </div>
           <Button onClick={handleExport} disabled={trips.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
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
                        {`${(trip.distance || 0).toFixed(1)} miles`}
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
