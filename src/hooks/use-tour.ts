
'use client';

import { useState, useEffect } from 'react';
import useLocalStorage from './use-local-storage';

const TOUR_STORAGE_KEY = 'tripmapper-tour-completed';

export function useTour() {
  const [hasSeenTour, setHasSeenTour] = useLocalStorage(TOUR_STORAGE_KEY, false);
  const [tourActive, setTourActiveState] = useState(!hasSeenTour);

  const setTourActive = (isActive: boolean) => {
    if (!isActive) {
      setHasSeenTour(true);
    }
    setTourActiveState(isActive);
  };
  
  // Effect to handle the initial state for client-side rendering
  useEffect(() => {
    const storedValue = localStorage.getItem(TOUR_STORAGE_KEY);
    const seen = storedValue ? JSON.parse(storedValue) : false;
    if (seen) {
        setTourActiveState(false);
    }
  }, []);

  return {
    hasSeenTour,
    tourActive,
    setTourActive,
  };
}
