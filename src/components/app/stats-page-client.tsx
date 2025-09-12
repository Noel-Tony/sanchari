'use client';

import { useMemo, useState } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Trip } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TimePeriod = 'past-week' | 'past-month' | 'all-time';

export default function StatsPageClient() {
  const [trips] = useLocalStorage<Trip[]>('trips', []);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('past-month');

  const filteredTrips = useMemo(() => {
    const now = new Date();
    if (timePeriod === 'all-time') {
      return trips;
    }
    const startTime = new Date(now);
    if (timePeriod === 'past-week') {
      startTime.setDate(now.getDate() - 7);
    } else { // past-month
      startTime.setMonth(now.getMonth() - 1);
    }
    return trips.filter(trip => trip.startTime >= startTime.getTime());
  }, [trips, timePeriod]);

  const stats = useMemo(() => {
    const totalTrips = filteredTrips.length;
    const totalDistance = filteredTrips.reduce((sum, trip) => sum + trip.distance, 0);
    const totalTime = filteredTrips.reduce((sum, trip) => sum + (trip.endTime - trip.startTime), 0);
    
    const totalMinutes = Math.round(totalTime / 60000);

    return { totalTrips, totalDistance, totalMinutes };
  }, [filteredTrips]);

  return (
    <main className="flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold font-headline">Statistics</h1>
        <Select value={timePeriod} onValueChange={(value: TimePeriod) => setTimePeriod(value)}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="past-week">Past Week</SelectItem>
                <SelectItem value="past-month">Past Month</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
        </Select>
      </div>
      
      {filteredTrips.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalTrips}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Distance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalDistance.toFixed(1)} <span className="text-lg font-medium text-muted-foreground">miles</span></p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalMinutes} <span className="text-lg font-medium text-muted-foreground">min</span></p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No completed trips in this period</p>
          <p className="text-sm text-muted-foreground">Start recording trips to see statistics here</p>
        </div>
      )}
    </main>
  );
}
