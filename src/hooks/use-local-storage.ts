
'use client';

import { useState, useEffect, useMemo } from 'react';
import { dummyTrips } from '@/lib/dummy-data';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Memoize initialValue to prevent re-renders if it's an object/array
  const stableInitialValue = useMemo(() => {
    if (key === 'trips' && Array.isArray(initialValue) && initialValue.length === 0) {
        return dummyTrips as T;
    }
    return initialValue;
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return stableInitialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      // If item exists, parse it. If not, use the stableInitialValue which might contain dummy data.
      return item ? JSON.parse(item) : stableInitialValue;
    } catch (error) {
      console.error(error);
      return stableInitialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // This effect will only run if the key changes, not the initialValue object.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        // On mount, if there's an item in localStorage, use it. Otherwise, use the initial value (with dummy data).
        const currentValue = item ? JSON.parse(item) : stableInitialValue;
         setStoredValue(currentValue);
      } catch (error) {
        console.error(error);
        setStoredValue(stableInitialValue);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, stableInitialValue]);


  return [storedValue, setValue];
}

export default useLocalStorage;
