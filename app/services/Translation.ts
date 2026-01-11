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

const lang_data = {
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
} as any;

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
        let value: any = lang_data[lang];
        
        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) break;
        }
        
        text = typeof value === 'string' ? value : key;
    } else {
        text = lang_data[lang]?.[key] || key;
    }
    
    // Apply interpolation if params provided
    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            text = text.replace(new RegExp(`{${k}}`, 'g'), String(v));
        });
    }
    
    return text;
}