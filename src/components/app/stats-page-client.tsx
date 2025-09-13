
'use client';

import { useMemo, useState, useEffect } from 'react';
import type { Trip, TransportMode, TripPurpose } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Sigma, Route, Clock } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useLanguage } from '@/context/language-context';

type TimePeriod = 'past-week' | 'past-month' | 'all-time';

export default function StatsPageClient() {
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('past-month');
  const { t } = useLanguage();

  useEffect(() => {
    const q = query(collection(db, 'trips'), orderBy('startTime', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tripsData: Trip[] = [];
      querySnapshot.forEach((doc) => {
        tripsData.push({ id: doc.id, ...doc.data() } as Trip);
      });
      setAllTrips(tripsData);
    });
    return () => unsubscribe();
  }, []);

  const filteredTrips = useMemo(() => {
    const now = new Date();
    if (timePeriod === 'all-time') {
      return allTrips;
    }
    const startTime = new Date(now);
    if (timePeriod === 'past-week') {
      startTime.setDate(now.getDate() - 7);
    } else { // past-month
      startTime.setMonth(now.getMonth() - 1);
    }
    return allTrips.filter(trip => trip.startTime >= startTime.getTime());
  }, [allTrips, timePeriod]);

  const { stats, modeData, purposeData } = useMemo(() => {
    const totalTrips = filteredTrips.length;
    const totalDistance = filteredTrips.reduce((sum, trip) => sum + (trip.distance || 0), 0);
    const totalTime = filteredTrips.reduce((sum, trip) => sum + (trip.endTime - trip.startTime), 0);
    const totalMinutes = Math.round(totalTime / 60000);

    const modeCounts = filteredTrips.reduce((acc, trip) => {
      acc[trip.mode] = (acc[trip.mode] || 0) + 1;
      return acc;
    }, {} as Record<TransportMode, number>);

    const purposeCounts = filteredTrips.reduce((acc, trip) => {
        acc[trip.purpose] = (acc[trip.purpose] || 0) + 1;
        return acc;
      }, {} as Record<TripPurpose, number>);

    const modeData = Object.entries(modeCounts).map(([mode, count]) => ({
      mode,
      trips: count,
      fill: `var(--color-${mode.replace(' ', '-')})`
    }));

    const purposeData = Object.entries(purposeCounts).map(([purpose, count]) => ({
        purpose,
        trips: count,
        fill: `var(--color-${purpose})`
    }));

    return { stats: { totalTrips, totalDistance, totalMinutes }, modeData, purposeData };
  }, [filteredTrips]);

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

  return (
    <main className="flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold font-headline">{t('Your Statistics')}</h1>
        <Select value={timePeriod} onValueChange={(value: TimePeriod) => setTimePeriod(value)}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('Select period')} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="past-week">{t('Past Week')}</SelectItem>
                <SelectItem value="past-month">{t('Past Month')}</SelectItem>
                <SelectItem value="all-time">{t('All Time')}</SelectItem>
            </SelectContent>
        </Select>
      </div>
      
      {filteredTrips.length > 0 ? (
        <>
            <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('Total Trips')}</CardTitle>
                    <Sigma className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.totalTrips}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('Total Distance')}</CardTitle>
                    <Route className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalDistance.toFixed(1)} <span className="text-base font-medium text-muted-foreground">{t('miles')}</span></div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('Total Time')}</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalMinutes} <span className="text-base font-medium text-muted-foreground">{t('min')}</span></div>
                </CardContent>
            </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>{t('Trips by Transport Mode')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                            <ChartContainer config={modeChartConfig} className="min-h-[300px] w-full">
                            <BarChart accessibilityLayer data={modeData}>
                                <XAxis dataKey="mode" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)} />
                                <YAxis />
                                <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Bar dataKey="trips" radius={8} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                        <CardHeader>
                        <CardTitle>{t('Trips by Purpose')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={purposeChartConfig} className="min-h-[300px] w-full">
                            <PieChart>
                                <Tooltip content={<ChartTooltipContent hideLabel nameKey="purpose" />} />
                                <Pie data={purposeData} dataKey="trips" nameKey="purpose" innerRadius={60}>
                                        {purposeData.map((entry) => (
                                        <Cell key={`cell-${entry.purpose}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <h3 className="text-2xl font-bold tracking-tight">{t('No Trip Data Available')}</h3>
          <p className="text-muted-foreground">{t('Start recording trips to see your statistics here.')}</p>
        </div>
      )}
    </main>
  );
}
