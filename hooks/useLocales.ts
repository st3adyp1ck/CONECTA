import { useState, useCallback } from 'react';
import * as Localization from 'expo-localization';

export function useLocales() {
  const [locale, setLocale] = useState(Localization.locale.split('-')[0]);

  const toggleLocale = useCallback(() => {
    setLocale((current) => (current === 'en' ? 'es' : 'en'));
  }, []);

  return {
    locale,
    toggleLocale,
  };
}