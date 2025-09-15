
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
    
    // Stats Page (User)
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

    // Admin
    'Waiting for data from Firestore...': { English: 'Waiting for data from Firestore...', Malayalam: 'ഫയർസ്റ്റോറിൽ നിന്ന് ഡാറ്റയ്ക്കായി കാത്തിരിക്കുന്നു...', Hindi: 'फायरस्टोर से डेटा की प्रतीक्षा है...' },
    'There is no trip data from any user yet.': { English: 'There is no trip data from any user yet.', Malayalam: 'ഒരു ഉപയോക്താവിൽ നിന്നും ഇതുവരെ യാത്രാ ഡാറ്റയൊന്നും ലഭ്യമല്ല.', Hindi: 'अभी तक किसी भी उपयोगकर्ता से कोई यात्रा डेटा नहीं है।' },
    'All User Trips': { English: 'All User Trips', Malayalam: 'എല്ലാ ഉപയോക്താക്കളുടെയും യാത്രകൾ', Hindi: 'सभी उपयोगकर्ता यात्राएं' },
    'A comprehensive log of all trips recorded by users.': { English: 'A comprehensive log of all trips recorded by users.', Malayalam: 'ഉപയോക്താക്കൾ രേഖപ്പെടുത്തിയ എല്ലാ യാത്രകളുടെയും ഒരു സമഗ്രമായ ലോഗ്.', Hindi: 'उपयोगकर्ताओं द्वारा रिकॉर्ड की गई सभी यात्राओं का एक व्यापक लॉग।' },
    'Export to CSV': { English: 'Export to CSV', Malayalam: 'CSV-യിലേക്ക് എക്സ്പോർട്ട് ചെയ്യുക', Hindi: 'सीएसवी में निर्यात करें' },
    'Date': { English: 'Date', Malayalam: 'തീയതി', Hindi: 'तारीख' },
    'Route': { English: 'Route', Malayalam: 'റൂട്ട്', Hindi: 'मार्ग' },
    'Mode': { English: 'Mode', Malayalam: 'രീതി', Hindi: 'मोड' },
    'Duration': { English: 'Duration', Malayalam: 'ദൈർഘ്യം', Hindi: 'अवधि' },
    'Distance': { English: 'Distance', Malayalam: 'ദൂരം', Hindi: 'दूरी' },
    'Co-Travellers': { English: 'Co-Travellers', Malayalam: 'സഹയാത്രികർ', Hindi: 'सह-यात्री' },
    'mins': { English: 'mins', Malayalam: 'മിനിറ്റ്', Hindi: 'मिनट' },
    'Active Users': { English: 'Active Users', Malayalam: 'സജീവ ഉപയോക്താക്കൾ', Hindi: 'सक्रिय उपयोगकर्ता' },
    'in last 30 days': { English: 'in last 30 days', Malayalam: 'കഴിഞ്ഞ 30 ദിവസത്തിനുള്ളിൽ', Hindi: 'पिछले 30 दिनों में' },
    'Avg Trip Duration': { English: 'Avg Trip Duration', Malayalam: 'ശരാശരി യാത്രാ ദൈർഘ്യം', Hindi: 'औसत यात्रा अवधि' },
    'Top Transport': { English: 'Top Transport', Malayalam: 'പ്രധാന ഗതാഗതം', Hindi: 'शीर्ष परिवहन' },
    'Transport Mode Distribution': { English: 'Transport Mode Distribution', Malayalam: 'ഗതാഗത രീതി വിതരണം', Hindi: 'परिवहन मोड वितरण' },
    'Recent Activity': { English: 'Recent Activity', Malayalam: 'സമീപകാല പ്രവർത്തനം', Hindi: 'हाल की गतिविधि' },
    
    // Feature Tour
    'Welcome to TripMapper!': { English: 'Welcome to TripMapper!', Malayalam: 'ട്രിപ്പ്മാപ്പറിലേക്ക് സ്വാഗതം!', Hindi: 'ट्रिपमैपर में आपका स्वागत है!' },
    'This is the main dashboard where you can start and manage your trips.': { English: 'This is the main dashboard where you can start and manage your trips.', Malayalam: 'ഇതാണ് പ്രധാന ഡാഷ്‌ബോർഡ്, ഇവിടെ നിങ്ങൾക്ക് യാത്രകൾ ആരംഭിക്കാനും നിയന്ത്രിക്കാനും കഴിയും.', Hindi: 'यह मुख्य डैशबोर्ड है जहाँ आप अपनी यात्राएँ शुरू और प्रबंधित कर सकते हैं।' },
    'Start a Trip': { English: 'Start a Trip', Malayalam: 'ഒരു യാത്ര ആരംഭിക്കുക', Hindi: 'एक यात्रा शुरू करें' },
    'Click here to begin recording a new trip. Make sure your location is enabled.': { English: 'Click here to begin recording a new trip. Make sure your location is enabled.', Malayalam: 'ഒരു പുതിയ യാത്ര രേഖപ്പെടുത്താൻ ഇവിടെ ക്ലിക്ക് ചെയ്യുക. നിങ്ങളുടെ ലൊക്കേഷൻ പ്രവർത്തനക്ഷമമാക്കിയിട്ടുണ്ടെന്ന് ഉറപ്പാക്കുക.', Hindi: 'एक नई यात्रा रिकॉर्ड करना शुरू करने के लिए यहां क्लिक करें। सुनिश्चित करें कि आपका स्थान सक्षम है।' },
    'Enable Location': { English: 'Enable Location', Malayalam: 'ലൊക്കേഷൻ പ്രവർത്തനക്ഷమമാക്കുക', Hindi: 'स्थान सक्षम करें' },
    'You can enable or disable location tracking at any time using this switch.': { English: 'You can enable or disable location tracking at any time using this switch.', Malayalam: 'ഈ സ്വിച്ച് ഉപയോഗിച്ച് നിങ്ങൾക്ക് എപ്പോൾ വേണമെങ്കിലും ലൊケーション ട്രാക്കിംഗ് പ്രവർത്തനക്ഷമമാക്കാനോ പ്രവർത്തനരഹിതമാക്കാനോ കഴിയും.', Hindi: 'आप इस स्विच का उपयोग करके किसी भी समय स्थान ट्रैकिंग को सक्षम या अक्षम कर सकते हैं।' },
    'View all your past trips and their details on this page.': { English: 'View all your past trips and their details on this page.', Malayalam: 'നിങ്ങളുടെ മുൻകാല യാത്രകളും അവയുടെ വിശദാംശങ്ങളും ഈ പേജിൽ കാണുക.', Hindi: 'इस पृष्ठ पर अपनी सभी पिछली यात्राएँ और उनके विवरण देखें।' },
    'Check out visualizations and stats about your travel habits here.': { English: 'Check out visualizations and stats about your travel habits here.', Malayalam: 'നിങ്ങളുടെ യാത്രാ ശീലങ്ങളെക്കുറിച്ചുള്ള വിഷ്വലൈസേഷനുകളും സ്ഥിതിവിവരക്കണക്കുകളും ഇവിടെ പരിശോധിക്കുക.', Hindi: 'अपनी यात्रा की आदतों के बारे में विज़ुअलाइज़ेशन और आँकड़े यहाँ देखें।' },
    'Get Help': { English: 'Get Help', Malayalam: 'സഹായം നേടുക', Hindi: 'सहायता प्राप्त करें' },
    'If you ever need a reminder, click here for help and FAQs.': { English: 'If you ever need a reminder, click here for help and FAQs.', Malayalam: 'നിങ്ങൾക്ക് ఎప్పుడైనా ഒരു ഓർമ്മപ്പെടുത്തൽ ആവശ്യമുണ്ടെങ്കിൽ, സഹായത്തിനും പതിവ് ചോദ്യങ്ങൾക്കുമായി ഇവിടെ ക്ലിക്ക് ചെയ്യുക.', Hindi: 'यदि आपको कभी अनुस्मारक की आवश्यकता हो, तो सहायता और अक्सर पूछे जाने वाले प्रश्नों के लिए यहां क्लिक करें।' },
    'Step': { English: 'Step', Malayalam: 'ഘട്ടം', Hindi: 'कदम' },
    'of': { English: 'of', Malayalam: 'ൽ', Hindi: 'का' },
    'Previous': { English: 'Previous', Malayalam: 'മുമ്പത്തെ', Hindi: 'पिछला' },
    'Next': { English: 'Next', Malayalam: 'അടുത്തത്', Hindi: 'अगला' },
    'Finish': { English: 'Finish', Malayalam: 'പൂർത്തിയാക്കുക', Hindi: 'समाप्त' },
    'Skip': { English: 'Skip', Malayalam: 'ഒഴിവാക്കുക', Hindi: 'छोड़ें' },

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
