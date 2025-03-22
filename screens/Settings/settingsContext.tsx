import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Settings {
  currency: string;
  faceIdEnabled: boolean;
  enableAISummaries: boolean;
  summaryFrequency: string;
  darkMode: boolean;
  currentPortfolioId: string;
}

interface SettingsContextType {
  currency: any;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  saveSettings: (newSettings: Settings) => Promise<void>;
}

const defaultSettings: Settings = {
  currency: 'USD',
  faceIdEnabled: false,
  enableAISummaries: false,
  summaryFrequency: 'weekly',
};

export const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  setSettings: () => {},
  saveSettings: async () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const STORAGE_KEY = '@myapp_settings';

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setSettings(JSON.parse(stored));
        }
      } catch (err) {
        console.warn('Error loading settings from AsyncStorage:', err);
      }
    })();
  }, []);

  const saveSettings = async (newSettings: Settings) => {
    try {
      setSettings(newSettings); 
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    } catch (err) {
      console.warn('Error saving settings to AsyncStorage:', err);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
