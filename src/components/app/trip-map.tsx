
'use client';

import { useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, PolylineF } from '@react-google-maps/api';
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

interface TripMapProps {
  trip: Trip;
}

export default function TripMap({ trip }: TripMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ['geocoding']
  });

  const { resolvedTheme } = useTheme();
  
  const bounds = useMemo(() => {
    if (!trip.startCoords || !trip.endCoords) return undefined;
    const newBounds = new window.google.maps.LatLngBounds();
    newBounds.extend(trip.startCoords);
    if(trip.endLocation) { // Only extend to end if it's a completed trip
      newBounds.extend(trip.endCoords);
    }
    return newBounds;
  }, [trip]);


  if (loadError) {
      return (
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-destructive/10 text-destructive p-4 text-center">
            <p>Error loading Google Maps. Please check your API key and network connection.</p>
        </div>
      );
  }

  if (!isLoaded) {
    return (
        <div className="flex h-full w-full min-h-[250px] items-center justify-center rounded-lg bg-muted">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      return (
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-destructive/10 text-destructive p-4 text-center">
            <p>Google Maps API key is not configured.</p>
        </div>
      );
  }
  
  if (!trip.startCoords) {
    return (
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-muted p-4 text-center">
            <p>Could not find coordinates for this trip.</p>
        </div>
    );
  }


  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%', minHeight: '250px', borderRadius: '0.5rem' }}
      center={trip.startCoords}
      zoom={15}
      bounds={bounds}
      onLoad={(map) => {
        if (bounds) {
          map.fitBounds(bounds, 50);
        }
      }}
      options={{
        disableDefaultUI: true,
        styles: resolvedTheme === 'dark' ? mapStyles : undefined,
      }}
    >
      <MarkerF position={trip.startCoords} label="A" />
      {trip.endLocation && <MarkerF position={trip.endCoords} label="B" />}
      {trip.endLocation && (
        <PolylineF
            path={[trip.startCoords, trip.endCoords]}
            options={{
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
            }}
        />
      )}
    </GoogleMap>
  );
}
