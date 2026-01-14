import ar from './languages/ar.json';
import id from './languages/id.json';
import en from './languages/en.json';
import fr from './languages/fr.json';
import tr from './languages/tr.json';
import ur from './languages/ur.json';
import de from './languages/de.json';
import ps from './languages/ps.json';
import fa from './languages/fa.json';
import sw from './languages/sw.json';

interface TranslationObject {
    [key: string]: string | TranslationObject;
}

interface LangData {
    ar: TranslationObject;
    id: TranslationObject;
    en: TranslationObject;
    fr: TranslationObject;
    tr: TranslationObject;
    ur: TranslationObject;
    de: TranslationObject;
    ps: TranslationObject;
    fa: TranslationObject;
    sw: TranslationObject;
    [key: string]: TranslationObject;
}

const lang_data: LangData = {
    "ar" : { ...ar },
    "id" : { ...id },
    "en" : { ...en },
    "fr" : { ...fr },
    "tr" : { ...tr },
    "ur" : { ...ur },
    "de" : { ...de },
    "ps" : { ...ps },
    "fa" : { ...fa },
    "sw" : { ...sw }
};

/**
 * Translate a key with optional interpolation and nested key support
 * @param key - Translation key (supports dot notation: 'errors.required')
 * @param lang - Language code (default: 'en')
 * @param params - Optional parameters for interpolation
 * @returns Translated string or key if not found
 * 
 * @example
 * t('welcome', 'id')                          // "Selamat datang"
 * t('greeting', 'id', { name: 'Budi' })       // "Halo, Budi!"
 * t('errors.required', 'id', { field: 'Email' }) // "Email wajib diisi"
 */
export function t(key: string, lang: string = "en", params?: Record<string, string | number>): string { 
    // Get translation - support nested keys with dot notation
    let text: string;
    
    if (key.includes('.')) {
        const keys = key.split('.');
        let value: string | TranslationObject = lang_data[lang];

        for (const k of keys) {
            if (typeof value !== 'object' || value === null) break;
            value = value[k];
            if (value === undefined) break;
        }
        
        text = typeof value === 'string' ? value : key;
    } else {
        const value = lang_data[lang]?.[key];
        text = typeof value === 'string' ? value : key;
    }
    
    // Apply interpolation if params provided
    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            text = text.replace(new RegExp(`{${k}}`, 'g'), String(v));
        });
    }
    
    return text;
}