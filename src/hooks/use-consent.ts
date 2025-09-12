
'use client';

import useLocalStorage from './use-local-storage';

export default function useConsent() {
  const [hasConsented, setHasConsented] = useLocalStorage('user-consent', false);

  const giveConsent = () => {
    setHasConsented(true);
  };

  return { hasConsented, giveConsent };
}
