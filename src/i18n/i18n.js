import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import hi from './hi.json';
import pa from './pa.json';
import bn from './bn.json';

const resources = {
    en: { translation: en },
    hi: { translation: hi },
    pa: { translation: pa },
    bn: { translation: bn },
};

const fallback = 'en';
const initialLang = fallback;

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: initialLang,
        fallbackLng: fallback,
        compatibilityJSON: 'v3',
        interpolation: {
            escapeValue: false,
        },
    });

export const LANGUAGES = [
    { code: 'en', label: 'English', nativeLabel: 'English' },
    { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
    { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ' },
    { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
];

export default i18n;
