
'use client';

import { useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import type { Trip } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';

const mapStyles: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];


const locationCoordinates: { [key: string]: google.maps.LatLngLiteral } = {
    'Home': { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    'Office': { lat: 40.7128, lng: -74.0060 }, // New York
    'Downtown': { lat: 41.8781, lng: -87.6298 }, // Chicago
    'Supermarket': { lat: 29.7604, lng: -95.3698 }, // Houston
    'Gym': { lat: 39.9526, lng: -75.1652 }, // Philadelphia
    'Park': { lat: 33.4484, lng: -112.0740 }, // Phoenix
    'Friend\'s House': { lat: 29.4241, lng: -98.4936 } // San Antonio
};

interface TripMapProps {
  trip: Trip;
}

export default function TripMap({ trip }: TripMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const { resolvedTheme } = useTheme();

  const startCoords = locationCoordinates[trip.startLocation];
  const endCoords = locationCoordinates[trip.endLocation];

  const center = useMemo(() => {
    if (startCoords && endCoords) {
      return {
        lat: (startCoords.lat + endCoords.lat) / 2,
        lng: (startCoords.lng + endCoords.lng) / 2,
      };
    }
    return startCoords || endCoords || { lat: 37.7749, lng: -122.4194 };
  }, [startCoords, endCoords]);

  if (!isLoaded) {
    return (
        <div className="flex h-64 w-full items-center justify-center rounded-lg bg-muted">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      return (
        <div className="flex h-64 w-full items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <p>Google Maps API key is not configured.</p>
        </div>
      );
  }
  
  if (!startCoords || !endCoords) {
    return (
        <div className="flex h-64 w-full items-center justify-center rounded-lg bg-muted">
            <p>Could not find coordinates for this trip.</p>
        </div>
    );
  }


  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '250px', borderRadius: '0.5rem' }}
      center={center}
      zoom={4}
      options={{
        disableDefaultUI: true,
        styles: resolvedTheme === 'dark' ? mapStyles : undefined,
      }}
    >
      <MarkerF position={startCoords} label="A" />
      <MarkerF position={endCoords} label="B" />
    </GoogleMap>
  );
}
