import type { SectionId } from '../i18n';

export interface ServiceItem { title: string; text: string; detail: string; time: string; price: string }
export interface SoonItem { title: string; text: string }
export interface TimelineItem { when: string; title: string; text: string }
export interface FaqItem { q: string; a: string }
export interface CaseText { title: string; text: string }
export interface SeoText { title: string; description: string }

export interface PagesContent {
  about: { lead: string; facts: { title: string; text: string }[] };
  services: { lead: string; items: ServiceItem[]; soonTitle: string; soon: SoonItem[]; note: string; book: string; includes: string };
  gallery: {
    lead: string;
    all: string; filters: { hygiene: string; caries: string; restoration: string };
    before: string; after: string; drag: string; caseWord: string; note: string;
    texts: Record<string, CaseText>;
    steps: Record<string, string[]>;
  };
  diplomas: { lead: string; open: string; close: string; note: string; kinds: Record<'admission' | 'seminar' | 'diploma' | 'accreditation', string> };
  education: { lead: string; timeline: TimelineItem[]; extra: string; seminarsTitle: string; allDocs: string };
  articles: { lead: string; read: string; minutes: string; keyTitle: string; refsTitle: string; published: string; author: string; back: string; disclaimer: string };
  tutorials: { lead: string; soon: string };
  contact: { lead: string; hoursTitle: string; hours: string; addressTitle: string; address: string; route: string };
  faq: { title: string; items: FaqItem[] };
  seo: Record<SectionId, SeoText>;
}
