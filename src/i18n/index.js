/**
 * i18n/index.js — i18next initialization
 *
 * Single namespace ('translation') for now.
 * To add a new language later:
 *   1. Create src/locales/<lang>/index.json
 *   2. Import it here and add to `resources`
 *   3. Update `lng` or add a language switcher
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en/index.json';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: {
        translation: en,
      },
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
