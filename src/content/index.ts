import ru from './ru';
import fa from './fa';
import en from './en';
import type { Locale } from '../i18n';
import type { PagesContent } from './types';

const all: Record<Locale, PagesContent> = { ru, fa, en };
export const getPages = (lang: Locale): PagesContent => all[lang];
