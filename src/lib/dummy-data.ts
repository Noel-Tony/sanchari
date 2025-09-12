
import type { Trip } from './types';

const modeMapping: { [key: string]: 'vehicle' | 'cycling' | 'walking' } = {
    Bus: 'vehicle',
    Car: 'vehicle',
    Auto: 'vehicle',
    Train: 'vehicle',
    Cycle: 'cycling',
    Walk: 'walking',
};

const purposeMapping: { [key: string]: 'work' | 'school' | 'shopping' | 'leisure' } = {
    Work: 'work',
    Education: 'school',
    Shopping: 'shopping',
    Health: 'leisure', 
    Leisure: 'leisure',
};

const dummyCSVData = [
    "t001,u001,2025-09-12T07:30,2025-09-12T07:55,9.9312,76.2673,9.9399,76.2566,Bus,Work,0,3.0",
    "t002,u002,2025-09-12T08:10,2025-09-12T08:25,9.9700,76.3000,9.9500,76.2700,Car,Education,1,4.0",
    "t003,u003,2025-09-12T09:00,2025-09-12T09:20,9.9100,76.2500,9.9200,76.2800,Auto,Shopping,2,2.5",
    "t004,u004,2025-09-12T10:15,2025-09-12T10:45,9.9050,76.2700,9.9300,76.3000,Cycle,Health,0,5.0",
    "t005,u005,2025-09-12T11:00,2025-09-12T11:20,9.9500,76.2800,9.9600,76.2900,Train,Work,0,8.0",
    "t006,u006,2025-09-12T07:45,2025-09-12T08:10,9.9400,76.2600,9.9450,76.2800,Bus,Education,1,6.0",
    "t007,u007,2025-09-12T18:00,2025-09-12T18:20,9.9150,76.2450,9.9250,76.2600,Car,Shopping,2,3.5",
    "t008,u008,2025-09-12T19:10,2025-09-12T19:35,9.9700,76.2500,9.9800,76.2700,Auto,Leisure,0,4.2",
    "t009,u009,2025-09-12T20:00,2025-09-12T20:30,9.9000,76.2300,9.9200,76.2600,Bus,Work,0,7.0",
    "t010,u010,2025-09-12T06:40,2025-09-12T07:00,9.9350,76.2800,9.9500,76.2900,Walk,Health,0,1.2"
];

export const dummyTrips: Trip[] = dummyCSVData.map((row) => {
  const [tripId, , startTime, endTime, originLat, originLon, destLat, destLon, mode, purpose, companions, distanceKm] = row.split(',');
  
  const distanceMiles = parseFloat(distanceKm) * 0.621371;

  return {
    id: tripId,
    startTime: new Date(startTime).getTime(),
    endTime: new Date(endTime).getTime(),
    startLocation: `Lat: ${originLat}, Lon: ${originLon}`,
    endLocation: `Lat: ${destLat}, Lon: ${destLon}`,
    mode: modeMapping[mode],
    purpose: purposeMapping[purpose],
    coTravellers: parseInt(companions, 10),
    distance: distanceMiles,
  };
});
