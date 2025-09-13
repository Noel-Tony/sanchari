
'use client';

import useLocalStorage from '@/hooks/use-local-storage';
import type { Trip, TransportMode, TripPurpose } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Route, Sigma, Clock, Car, Bus, Bike, Footprints, AlertCircle, FileText, UserPlus } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

type Activity = {
  id: string;
  type: 'new_trip' | 'new_user' | 'export';
  timestamp: number;
  details: string;
};

constกิจกรรมIcon = ({ type }: { type: Activity['type'] }) => {
  switch (type) {
    case 'new_trip':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'new_user':
      return <UserPlus className="h-5 w-5 text-green-500" />;
    case 'export':
      return <FileText className="h-5 w-5 text-purple-500" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-500" />;
  }
};

export default function AdminStatsPageClient() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'trips'), orderBy('startTime', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tripsData: Trip[] = [];
      const newActivities: Activity[] = [];
      querySnapshot.forEach((doc) => {
        const trip = { id: doc.id, ...doc.data() } as Trip;
        tripsData.push(trip);
        // Assuming every new trip is a new activity for this feed
        if (Date.now() - trip.startTime < 60000 * 5) { // within last 5 mins
          newActivities.push({
            id: doc.id,
            type: 'new_trip',
            timestamp: trip.startTime,
            details: `New trip from ${trip.startLocation} to ${trip.endLocation}`,
          });
        }
      });
      setTrips(tripsData);
      setActivities(prev => [...newActivities, ...prev.filter(act => act.type !== 'new_trip')].sort((a,b) => b.timestamp - a.timestamp));
    });
    return () => unsubscribe();
  }, []);

  const { stats, modeData, activeUsers } = useMemo(() => {
    const totalTrips = trips.length;
    const totalDistance = trips.reduce((sum, trip) => sum + (trip.distance || 0), 0);
    const totalDuration = trips.reduce((sum, trip) => sum + (trip.endTime - trip.startTime), 0);
    const avgDuration = totalTrips > 0 ? (totalDuration / totalTrips / 60000) : 0; // in minutes

    const modeCounts = trips.reduce((acc, trip) => {
      acc[trip.mode] = (acc[trip.mode] || 0) + 1;
      return acc;
    }, {} as Record<TransportMode, number>);

    const topTransport = Object.entries(modeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const activeUserIds = new Set(
        // @ts-ignore
        trips.filter(t => t.startTime > thirtyDaysAgo).map(t => t.userId)
    );

    const modeData = Object.entries(modeCounts).map(([mode, count]) => ({
      mode,
      trips: count,
      fill: `var(--color-${mode.replace(/[\s_]/g, '-')})`
    }));

    return {
      stats: {
        totalTrips,
        totalDistance,
        avgDuration,
        topTransport,
      },
      modeData,
      activeUsers: activeUserIds.size,
    };
  }, [trips]);

  const modeChartConfig = {
    trips: { label: 'Trips' },
    car: { label: 'Car', color: 'hsl(var(--chart-1))' },
    bike: { label: 'Bike', color: 'hsl(var(--chart-2))' },
    'public-transport': { label: 'Public Transport', color: 'hsl(var(--chart-3))' },
    walk: { label: 'Walk', color: 'hsl(var(--chart-4))' },
    bus: { label: 'Bus', color: 'hsl(var(--chart-5))' },
  } satisfies ChartConfig;


  const TransportIcon = ({ mode }: { mode: string }) => {
    const props = { className: 'h-6 w-6 text-muted-foreground' };
    const lowerCaseMode = mode.toLowerCase();
    if (lowerCaseMode.includes('car')) return <Car {...props} />;
    if (lowerCaseMode.includes('bus')) return <Bus {...props} />;
    if (lowerCaseMode.includes('bike')) return <Bike {...props} />;
    if (lowerCaseMode.includes('walk')) return <Footprints {...props} />;
    return <Car {...props} />;
  };


  return (
    <main className="flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-headline">Admin Dashboard</h1>
      </div>

        {trips.length > 0 ? (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className="lg:col-span-2 space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
                            <Sigma className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalTrips}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeUsers}</div>
                            <p className="text-xs text-muted-foreground">in last 30 days</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Trip Duration</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.avgDuration.toFixed(0)} min</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Top Transport</CardTitle>
                            <TransportIcon mode={stats.topTransport} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold capitalize">{stats.topTransport}</div>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Transport Mode Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {modeData.map(d => (
                                <div key={d.mode}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium capitalize">{d.mode}</span>
                                        <span className="text-sm text-muted-foreground">{d.trips} trips</span>
                                    </div>
                                    <div className="w-full bg-secondary rounded-full h-2.5">
                                        <div className="h-2.5 rounded-full" style={{ width: `${(d.trips / stats.totalTrips) * 100}%`, backgroundColor: d.fill }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
             <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[450px]">
                        <div className="space-y-4">
                            {activities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-4">
                                <div className="mt-1">
                                <กิจกรรมIcon type={activity.type} />
                                </div>
                                <div className="flex-1">
                                <p className="text-sm font-medium">{activity.details}</p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(activity.timestamp).toLocaleString()}
                                </p>
                                </div>
                            </div>
                            ))}
                        </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
             </div>
        </div>
        ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-lg">
                <h3 className="text-2xl font-bold tracking-tight">No Trip Data Available</h3>
                <p className="text-muted-foreground">Waiting for data from Firestore...</p>
            </div>
        )}
    </main>
  );
}
