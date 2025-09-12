
'use client';

import useLocalStorage from '@/hooks/use-local-storage';
import type { Trip, TransportMode, TripPurpose } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Footprints, Bike, Car, HelpCircle, Download, Users, Route, Sigma } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TimePeriod = 'past-week' | 'past-month' | 'all-time';


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
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all-time');

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


  const handleExport = () => {
    if (filteredTrips.length === 0) return;

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
    
    const rows = filteredTrips.map(trip => [
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
    link.setAttribute('download', `trip-data-${timePeriod}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const { stats, modeData, purposeData } = useMemo(() => {
    const stats = {
      totalTrips: filteredTrips.length,
      totalDistance: filteredTrips.reduce((sum, trip) => sum + trip.distance, 0),
      totalParticipants: filteredTrips.reduce((sum, trip) => sum + trip.coTravellers + 1, 0),
    };

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
      fill: `var(--color-${mode})`
    }));

    const purposeData = Object.entries(purposeCounts).map(([purpose, count]) => ({
        purpose,
        trips: count,
        fill: `var(--color-${purpose})`
    }));

    return { stats, modeData, purposeData };
  }, [filteredTrips]);

  const modeChartConfig = {
    trips: { label: 'Trips' },
    walking: { label: 'Walking', color: 'hsl(var(--chart-1))' },
    cycling: { label: 'Cycling', color: 'hsl(var(--chart-2))' },
    vehicle: { label: 'Vehicle', color: 'hsl(var(--chart-3))' },
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
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-headline">Admin Dashboard</h1>
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
        <>
            <section className="mb-8">
                <h2 className="text-xl font-bold font-headline mb-4">Statistics Overview</h2>
                 <div className="grid gap-4 md:grid-cols-3">
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
                        <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
                        <Route className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                        <div className="text-2xl font-bold">{stats.totalDistance.toFixed(1)} mi</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                        <div className="text-2xl font-bold">{stats.totalParticipants}</div>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle>Trips by Transport Mode</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ChartContainer config={modeChartConfig} className="min-h-[200px] w-full">
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
                            <CardTitle>Trips by Purpose</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={purposeChartConfig} className="min-h-[200px] w-full">
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
            </section>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>All User Trips</CardTitle>
                    <CardDescription>A comprehensive log of all trips recorded by users for the selected period.</CardDescription>
                </div>
                <Button onClick={handleExport} disabled={filteredTrips.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Export to CSV
                </Button>
                </CardHeader>
                <CardContent>
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
                        {filteredTrips.map((trip) => (
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
                </CardContent>
            </Card>
        </>
        ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-lg">
                <h3 className="text-2xl font-bold tracking-tight">No Trip Data Available</h3>
                <p className="text-muted-foreground">There is no trip data from any user for the selected time period.</p>
            </div>
        )}
    </main>
  );
}
