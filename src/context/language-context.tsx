
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
    
    // Stats Page
    'Your Statistics': { English: 'Your Statistics', Malayalam: 'നിങ്ങളുടെ സ്ഥിതിവിവരക്കണക്കുകൾ', Hindi: 'आपके आँकड़े' },
    'Past Week': { English: 'Past Week', Malayalam: 'കഴിഞ്ഞ ആഴ്ച', Hindi: 'पिछला सप्ताह' },
    'Past Month': { English: 'Past Month', Malayalam: 'കഴിഞ്ഞ മാസം', Hindi: 'पिछला महीना' },
    'All Time': { English: 'All Time', Malayalam: 'എല്ലാ സമയത്തും', Hindi: 'हर समय' },
    'Total Trips': { English: 'Total Trips', Malayalam: 'ആകെ യാത്രകൾ', Hindi: 'कुल यात्राएं' },
    'Total Distance': { English: 'Total Distance', Malayalam: 'ആകെ ദൂരം', Hindi: 'कुल दूरी' },
    'miles': { English: 'miles', Malayalam: 'മൈൽ', Hindi: 'मील' },
    'Total Time': { English: 'Total Time', Malayalam: 'ആകെ സമയം', Hindi: 'कुल समय' },
    'min': { English: 'min', Malayalam: 'മിനിറ്റ്', Hindi: 'मिनट' },
    'Trips by Transport Mode': { English: 'Trips by Transport Mode', Malayalam: 'ഗതാഗത രീതി അനുസരിച്ചുള്ള യാത്രകൾ', Hindi: 'परिवहन मोड द्वारा यात्राएं' },
    'Trips by Purpose': { English: 'Trips by Purpose', Malayalam: 'ഉദ്ദേശ്യമനുസരിച്ചുള്ള യാത്രകൾ', Hindi: 'उद्देश्य के अनुसार यात्राएं' },
    'No Trip Data Available': { English: 'No Trip Data Available', Malayalam: 'യാത്രാ ഡാറ്റ ലഭ്യമല്ല', Hindi: 'कोई यात्रा डेटा उपलब्ध नहीं है' },
    'Start recording trips to see your statistics here.': { English: 'Start recording trips to see your statistics here.', Malayalam: 'നിങ്ങളുടെ സ്ഥിതിവിവരക്കണക്കുകൾ ഇവിടെ കാണാൻ യാത്രകൾ റെക്കോർഡ് ചെയ്യാൻ ആരംഭിക്കുക.', Hindi: 'अपने आँकड़े यहाँ देखने के लिए यात्राएँ रिकॉर्ड करना प्रारंभ करें।' },

    // History Page
    'Loading Trip History...': { English: 'Loading Trip History...', Malayalam: 'യാത്രാ ചരിത്രം ലോഡ് ചെയ്യുന്നു...', Hindi: 'यात्रा इतिहास लोड हो रहा है...' },
    'Fetching data from Firestore.': { English: 'Fetching data from Firestore.', Malayalam: 'ഫയർസ്റ്റോറിൽ നിന്ന് ഡാറ്റ എടുക്കുന്നു.', Hindi: 'फायरस्टोर से डेटा प्राप्त किया जा रहा है।' },
    'Purpose': { English: 'Purpose', Malayalam: 'ഉദ്ദേശ്യം', Hindi: 'उद्देश्य' },
    'co-traveller': { English: 'co-traveller', Malayalam: 'സഹയാത്രികൻ', Hindi: 'सह-यात्री' },
    'co-travellers': { English: 'co-travellers', Malayalam: 'സഹയാത്രികർ', Hindi: 'सह-यात्री' },
    'No Trip History': { English: 'No Trip History', Malayalam: 'യാത്രാ ചരിത്രം ഇല്ല', Hindi: 'कोई यात्रा इतिहास नहीं' },
    'Start a trip on the dashboard to see your history here.': { English: 'Start a trip on the dashboard to see your history here.', Malayalam: 'നിങ്ങളുടെ ചരിത്രം ഇവിടെ കാണാൻ ഡാഷ്ബോർഡിൽ ഒരു യാത്ര ആരംഭിക്കുക.', Hindi: 'अपना इतिहास यहाँ देखने के लिए डैशबोर्ड पर एक यात्रा शुरू करें।' },

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
