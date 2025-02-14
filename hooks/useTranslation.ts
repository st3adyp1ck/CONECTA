import { I18n } from 'i18n-js';
import { useCallback } from 'react';
import { useLocales } from '@/hooks/useLocales';
import en from '@/locales/en';
import es from '@/locales/es';

const i18n = new I18n({
  en,
  es,
});

i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export function useTranslation() {
  const { locale } = useLocales();
  
  i18n.locale = locale;

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      return i18n.t(key, params);
    },
    [locale]
  );

  return { t };
}