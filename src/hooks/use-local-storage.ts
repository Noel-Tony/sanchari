'use client';

import { useState, useEffect, useMemo } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Memoize initialValue to prevent re-renders if it's an object/array
  const stableInitialValue = useMemo(() => initialValue, [key]);

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return stableInitialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
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
        const currentValue = item ? JSON.parse(item) : stableInitialValue;
         setStoredValue(currentValue);
      } catch (error) {
        console.error(error);
        setStoredValue(stableInitialValue);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);


  return [storedValue, setValue];
}

export default useLocalStorage;
