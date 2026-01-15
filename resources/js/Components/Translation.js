// Simple translation helper for Svelte components
// Import language files dynamically

const STORAGE_KEY = 'app_language';
const DEFAULT_LANG = 'en';

/**
 * Set current language and save to localStorage
 * @param {string} lang - Language code (e.g., 'en', 'id', 'ar')
 */
export function setLanguage(lang) {
  localStorage.setItem(STORAGE_KEY, lang);
  currentLang = lang;
  loadTranslations(lang);
}

/**
 * Get current language from localStorage or use default
 * @returns {string} Current language code
 */
export function getLanguage() {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
}

let currentLang = getLanguage();
let translations = {};

/**
 * Load translations for a language
 * @param {string} lang - Language code
 */
export async function loadTranslations(lang) {
  if (translations[lang]) return; // Already loaded
  
  try {
    const module = await import(`./languages/${lang}.json`);
    translations[lang] = module.default;
  } catch (error) {
    console.error(`Failed to load translations for ${lang}:`, error);
    translations[lang] = {};
  }
}

/**
 * Translate a key
 * @param {string} key - Translation key (supports dot notation for nested keys)
 * @param {Object} params - Parameters for interpolation
 * @returns {string} Translated text or key if not found
 */
export async function t(key, params = {}) {
  const lang = currentLang;
  
  // Auto-load language if not loaded yet
  if (!translations[lang]) {
    await loadTranslations(lang);
  }
  
  const langTranslations = translations[lang] || {};
  
  // Handle nested keys (e.g., 'errors.required')
  const keys = key.split('.');
  let value = langTranslations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if not found
    }
  }
  
  // Handle interpolation
  if (typeof value === 'string') {
    return value.replace(/\{(\w+)\}/g, (match, param) => params[param] || match);
  }
  
  return key;
}
