
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

const ActivityIcon = ({ type }: { type: Activity['type'] }) => {
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

  const { stats, modeData, purposeData, activeUsers } = useMemo(() => {
    const totalTrips = trips.length;
    const totalDistance = trips.reduce((sum, trip) => sum + (trip.distance || 0), 0);
    const totalDuration = trips.reduce((sum, trip) => sum + (trip.endTime - trip.startTime), 0);
    const avgDuration = totalTrips > 0 ? (totalDuration / totalTrips / 60000) : 0; // in minutes

    const modeCounts = trips.reduce((acc, trip) => {
      acc[trip.mode] = (acc[trip.mode] || 0) + 1;
      return acc;
    }, {} as Record<TransportMode, number>);

    const purposeCounts = trips.reduce((acc, trip) => {
        acc[trip.purpose] = (acc[trip.purpose] || 0) + 1;
        return acc;
      }, {} as Record<TripPurpose, number>);

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

     const purposeData = Object.entries(purposeCounts).map(([purpose, count]) => ({
        purpose,
        trips: count,
        fill: `var(--color-${purpose})`
    }));

    return {
      stats: {
        totalTrips,
        totalDistance,
        avgDuration,
        topTransport,
      },
      modeData,
      purposeData,
      activeUsers: activeUserIds.size,
    };
  }, [trips]);

  const modeChartConfig = {
    trips: { label: 'Trips' },
    car: { label: 'Car', color: 'hsl(var(--chart-1))' },
    bike: { label: 'Bike', color: 'hsl(var(--chart-2))' },
    'public-transport': { label: 'Public Transport', color: 'hsl(var(--chart-3))' },
  } satisfies ChartConfig;
  
  const purposeChartConfig = {
    trips: { label: 'Trips' },
    work: { label: 'Work', color: 'hsl(var(--chart-1))' },
    school: { label: 'School', color: 'hsl(var(--chart-2))' },
    shopping: { label: 'Shopping', color: 'hsl(var(--chart-3))' },
    leisure: { label: 'Leisure', color: 'hsl(var(--chart-4))' },
  } satisfies ChartConfig;


  const TransportIcon = ({ mode }: { mode: string }) => {
    const lowerCaseMode = mode.toLowerCase();
    if (lowerCaseMode.includes('car')) return <Car className="h-6 w-6 text-red-500" />;
    if (lowerCaseMode.includes('public transport')) return <Bus className="h-6 w-6 text-blue-500" />;
    if (lowerCaseMode.includes('bike')) return <Bike className="h-6 w-6 text-green-500" />;
    if (lowerCaseMode.includes('walk')) return <Footprints className="h-6 w-6 text-yellow-500" />;
    return <Car className="h-6 w-6 text-gray-500" />;
  };


  return (
    <main className="flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-headline">Admin Dashboard</h1>
      </div>

        {trips.length > 0 ? (
        <div className='space-y-6'>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
                        <Sigma className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalTrips}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeUsers}</div>
                        <p className="text-xs text-muted-foreground">in last 30 days</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Trip Duration</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Transport Mode Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <ChartContainer config={modeChartConfig} className="min-h-[250px] w-full">
                                <BarChart accessibilityLayer data={modeData}>
                                    <XAxis 
                                        dataKey="mode" 
                                        tickLine={false} 
                                        tickMargin={10} 
                                        axisLine={false} 
                                        tickFormatter={(value) => value.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} 
                                    />
                                    <YAxis />
                                    <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                    <Bar dataKey="trips" radius={8}>
                                        {modeData.map((entry) => (
                                            <Cell key={`cell-${entry.mode}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Trips by Purpose</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={purposeChartConfig} className="min-h-[250px] w-full">
                                <PieChart>
                                    <Tooltip content={<ChartTooltipContent hideLabel nameKey="purpose" />} />
                                    <Pie data={purposeData} dataKey="trips" nameKey="purpose" innerRadius={50}>
                                            {purposeData.map((entry) => (
                                            <Cell key={`cell-${entry.purpose}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[400px]">
                            <div className="space-y-4">
                                {activities.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-4">
                                    <div className="mt-1">
                                    <ActivityIcon type={activity.type} />
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
