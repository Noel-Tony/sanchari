export const transportModes = ['walking', 'cycling', 'vehicle'] as const;
export type TransportMode = (typeof transportModes)[number];

export const tripPurposes = ['work', 'school', 'shopping', 'leisure'] as const;
export type TripPurpose = (typeof tripPurposes)[number];

export type Coordinates = {
  lat: number;
  lng: number;
};

export type Trip = {
  id: string;
  startTime: number;
  endTime: number;
  startLocation: string;
  endLocation: string;
  mode: TransportMode;
  purpose: TripPurpose;
  coTravellers: number;
  distance: number; // in miles
};
