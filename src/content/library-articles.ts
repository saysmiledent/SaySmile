// Every paper in the research library also has its own short article page, written in plain words
// from the paper's abstract. These objects reuse the Article shape so one page template serves both.
import type { Article, ArticleText } from './articles';
import { library } from './library-data';
import { libraryArticleUi } from './library-ui';
import type { LibEntry } from './library-ui';
import type { Locale } from '../i18n';

const locales: Locale[] = ['ru', 'fa', 'en'];
export const LIBRARY_PUBLISHED = '2026-11-01';

export function firstAuthor(e: LibEntry): string {
  const a = e.authors[0] ?? '';
  return a ? (e.authors.length > 1 ? `${a} et al.` : a) : (e.team || e.org || e.journal);
}

// "Lamont T, Worthington HV, ... Routine scale and polish. Cochrane Database Syst Rev. 2018."
export function citationOf(e: LibEntry): string {
  const names = e.authors.length > 6 ? `${e.authors.slice(0, 6).join(', ')}, et al.` : e.authors.join(', ');
  return `${names ? names + '. ' : ''}${e.titleEn}. ${e.journal}. ${e.year}.`;
}

function textFor(e: LibEntry, lang: Locale): ArticleText {
  const t = e[lang];
  const h = libraryArticleUi[lang].headings;
  return {
    title: t.title,
    description: t.sum.length > 200 ? `${t.sum.slice(0, 197).replace(/\s+\S*$/, '')}...` : t.sum,
    lead: t.sum,
    key: t.key,
    sections: t.p.map((p, i) => ({ h: h[i] ?? h[h.length - 1], p: [p] })),
    keywords: [...new Set([t.title, e.titleEn, ...e.kw.slice(0, 6)])],
  };
}

export const libraryArticles: Article[] = library.map((e) => ({
  slug: e.slug,
  iso: LIBRARY_PUBLISHED,
  minutes: e.minutes,
  refs: [{ text: citationOf(e), doi: e.doi, pmid: e.id }],
  text: Object.fromEntries(locales.map((l) => [l, textFor(e, l)])) as Article['text'],
  lib: e,
}));
