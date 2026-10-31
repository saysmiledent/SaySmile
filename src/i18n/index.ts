import ru from './ru';
import fa from './fa';
import en from './en';

export const locales = ['ru', 'fa', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ru';

const dictionaries = { ru, fa, en };

export type Dictionary = typeof ru;

export const getDictionary = (lang: Locale): Dictionary => dictionaries[lang] as Dictionary;

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** URL of a page in the given language. path: '' (home) or 'privacy/' etc. */
export const localeUrl = (lang: Locale, path = ''): string =>
  `${base}/${lang === defaultLocale ? '' : `${lang}/`}${path}`;

/** Section anchor ids, in menu order. Each id matches a folder in src/sections. */
export const sectionIds = [
  'about',
  'services',
  'gallery',
  'diplomas',
  'education',
  'tutorials',
  'contact',
] as const;
export type SectionId = (typeof sectionIds)[number];
