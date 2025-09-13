
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'English' | 'Malayalam' | 'Hindi';

const translations: Record<string, Record<Language, string>> = {
    // App Layout
    'Admin Dashboard': { English: 'Admin Dashboard', Malayalam: 'അഡ്മിൻ ഡാഷ്ബോർഡ്', Hindi: 'एडमिन डैशबोर्ड' },
    'admin': { English: 'Admin Dashboard', Malayalam: 'അഡ്മിൻ ഡാഷ്ബോർഡ്', Hindi: 'एडमिन डैशबोर्ड' },
    'Statistics': { English: 'Statistics', Malayalam: 'സ്ഥിതിവിവരക്കണക്കുകൾ', Hindi: 'आंकड़े' },
    'stats': { English: 'Statistics', Malayalam: 'സ്ഥിതിവിവരക്കണക്കുകൾ', Hindi: 'आंकड़े' },
    'Dashboard': { English: 'Dashboard', Malayalam: 'ഡാഷ്ബോർഡ്', Hindi: 'डैशबोर्ड' },
    'dashboard': { English: 'Dashboard', Malayalam: 'ഡാഷ്ബോർഡ്', Hindi: 'डैशबोर्ड' },
    'Trip History': { English: 'Trip History', Malayalam: 'യാത്രയുടെ ചരിത്രം', Hindi: 'यात्रा इतिहास' },
    'history': { English: 'Trip History', Malayalam: 'യാത്രയുടെ ചരിത്രം', Hindi: 'यात्रा इतिहास' },
    'Logout': { English: 'Logout', Malayalam: 'ലോഗൗട്ട്', Hindi: 'लॉग आउट' },

    // Dashboard Page
    'Trip in Progress': { English: 'Trip in Progress', Malayalam: 'യാത്ര പുരോഗമിക്കുന്നു', Hindi: 'यात्रा प्रगति पर है' },
    'Start a New Trip': { English: 'Start a New Trip', Malayalam: 'ഒരു പുതിയ യാത്ര ആരംഭിക്കുക', Hindi: 'एक नई यात्रा शुरू करें' },
    'Location': { English: 'Location', Malayalam: 'ലൊക്കേഷൻ', Hindi: 'स्थान' },
    'From': { English: 'From', Malayalam: 'നിന്ന്', Hindi: 'से' },
    'Started at': { English: 'Started at', Malayalam: 'ആരംഭിച്ചത്', Hindi: 'यहां शुरू हुआ' },
    'End Trip': { English: 'End Trip', Malayalam: 'യാത്ര അവസാനിപ്പിക്കുക', Hindi: 'यात्रा समाप्त करें' },
    'Click "Start Trip" to begin recording your journey.': { English: 'Click "Start Trip" to begin recording your journey.', Malayalam: 'നിങ്ങളുടെ യാത്ര റെക്കോർഡ് ചെയ്യാൻ "യാത്ര ആരംഭിക്കുക" ക്ലിക്ക് ചെയ്യുക.', Hindi: 'अपनी यात्रा रिकॉर्ड करना शुरू करने के लिए "यात्रा शुरू करें" पर क्लिक करें।' },
    'Enable location to start a new trip.': { English: 'Enable location to start a new trip.', Malayalam: 'ഒരു പുതിയ യാത്ര ആരംഭിക്കാൻ ലൊക്കേഷൻ പ്രവർത്തനക്ഷമമാക്കുക.', Hindi: 'एक नई यात्रा शुरू करने के लिए स्थान सक्षम करें।' },
    'Start Trip': { English: 'Start Trip', Malayalam: 'യാത്ര ആരംഭിക്കുക', Hindi: 'यात्रा शुरू करें' },
    "Today's Trips": { English: "Today's Trips", Malayalam: 'ഇന്നത്തെ യാത്രകൾ', Hindi: 'आज की यात्राएं' },
    'No trips recorded today.': { English: 'No trips recorded today.', Malayalam: 'ഇന്ന് യാത്രകളൊന്നും രേഖപ്പെടുത്തിയിട്ടില്ല.', Hindi: 'आज कोई यात्रा रिकॉर्ड नहीं की गई।' },
    
    // Toasts
    'Location is Disabled': { English: 'Location is Disabled', Malayalam: 'ലൊക്കേഷൻ പ്രവർത്തനരഹിതമാക്കി', Hindi: 'स्थान अक्षम है' },
    'Please enable the location toggle to start a new trip.': { English: 'Please enable the location toggle to start a new trip.', Malayalam: 'ഒരു പുതിയ യാത്ര ആരംഭിക്കാൻ ദയവായി ലൊക്കേഷൻ ടോഗിൾ പ്രവർത്തനക്ഷമമാക്കുക.', Hindi: 'एक नई यात्रा शुरू करने के लिए कृपया स्थान टॉगल सक्षम करें।' },
};


interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('English');

  const t = (key: string) => {
    const lowerKey = key.toLowerCase();
    const entry = Object.keys(translations).find(k => k.toLowerCase() === lowerKey);
    return entry ? translations[entry]?.[language] || key : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
