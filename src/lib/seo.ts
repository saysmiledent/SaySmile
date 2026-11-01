// Structured data (schema.org JSON-LD) shared by all pages.
// Entities have stable @ids so pages can reference them: #clinic (Dentist), #doctor (Person), #website.
import { site } from '../config/site';
import { docs } from '../content/docs';
import { library } from '../content/library-data';
import { getDictionary, localeUrl, type Locale } from '../i18n';

type Json = Record<string, unknown>;
const abs = (path: string, origin: URL) => new URL(path, origin).href;

const address: Record<Locale, { street: string; city: string }> = {
  ru: { street: 'Лиговский пр., 232', city: 'Санкт-Петербург' },
  fa: { street: 'خیابان لیگوفسکی ۲۳۲', city: 'سن‌پترزبورگ' },
  en: { street: 'Ligovsky Ave., 232', city: 'Saint Petersburg' },
};

const offers = (lang: Locale): Json[] => {
  const names: Record<Locale, string[]> = {
    ru: ['Профессиональная гигиена полости рта', 'Лечение кариеса', 'Отбеливание зубов'],
    fa: ['جرم‌گیری و بهداشت حرفه‌ای دهان', 'درمان پوسیدگی', 'سفید کردن دندان'],
    en: ['Professional dental hygiene', 'Cavity treatment', 'Teeth whitening'],
  };
  const price = [4500, 7000, 20000];
  return names[lang].map((name, i) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'MedicalProcedure', name },
    priceSpecification: i < 2
      ? { '@type': 'PriceSpecification', minPrice: price[i], priceCurrency: 'RUB' }
      : { '@type': 'PriceSpecification', price: price[i], priceCurrency: 'RUB' },
  }));
};

/** Dentist + Person + WebSite for the given language. */
export function entityGraph(lang: Locale, origin: URL): Json[] {
  const t = getDictionary(lang);
  const home = abs(localeUrl(lang), origin);
  const a = address[lang];
  const c = site.contacts;
  const sameAs = [c.telegram, site.instagram, 'https://gamclinic.pro/'];
  const image = abs(`${import.meta.env.BASE_URL}og-image.jpg`, origin);

  const clinic: Json = {
    '@type': ['Dentist', 'LocalBusiness'],
    '@id': `${abs(localeUrl('ru'), origin)}#clinic`,
    name: lang === 'ru' ? 'SaySmile: стоматолог Сейван (GAM Clinic)' : lang === 'fa' ? 'SaySmile: دندانپزشک دکتر سیوان (کلینیک GAM)' : 'SaySmile: Dr. Seivan, dentist (GAM Clinic)',
    url: home,
    image,
    telephone: c.phone,
    email: c.email,
    priceRange: '₽₽',
    medicalSpecialty: 'Dentistry',
    availableLanguage: ['Russian', 'Persian'],
    address: { '@type': 'PostalAddress', streetAddress: a.street, addressLocality: a.city, addressCountry: 'RU' },
    geo: { '@type': 'GeoCoordinates', latitude: 59.906359, longitude: 30.345066 },
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00', closes: '21:00',
    }],
    makesOffer: offers(lang),
    employee: { '@id': `${abs(localeUrl('ru'), origin)}#doctor` },
    sameAs,
  };

  const credentials = docs
    .filter((d) => d.kind === 'diploma' || d.kind === 'accreditation')
    .map((d) => ({
      '@type': 'EducationalOccupationalCredential',
      name: d.text[lang].title,
      credentialCategory: d.kind === 'diploma' ? 'degree' : 'certification',
      dateCreated: d.iso,
      ...(d.kind === 'accreditation' ? { validUntil: '2030-07-17' } : {}),
    }));

  const doctor: Json = {
    '@type': 'Person',
    '@id': `${abs(localeUrl('ru'), origin)}#doctor`,
    name: t.hero.doctor,
    alternateName: ['Хаг Дуст Сейван', 'Dr. Seivan'],
    jobTitle: t.hero.subtitle,
    url: home,
    image,
    worksFor: { '@id': `${abs(localeUrl('ru'), origin)}#clinic` },
    knowsLanguage: ['ru', 'fa'],
    knowsAbout: ['Restorative dentistry', 'Prosthodontics', 'Professional dental hygiene', 'Caries treatment'],
    hasCredential: credentials,
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Saint Petersburg State Pediatric Medical University (SPbGPMU)' },
    sameAs,
  };

  const website: Json = {
    '@type': 'WebSite',
    '@id': `${abs(localeUrl('ru'), origin)}#website`,
    name: 'SaySmile',
    url: abs(localeUrl('ru'), origin),
    inLanguage: ['ru', 'fa', 'en'],
    publisher: { '@id': `${abs(localeUrl('ru'), origin)}#clinic` },
  };
  return [clinic, doctor, website];
}

export function breadcrumb(items: { name: string; path: string }[], origin: URL): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path, origin) })),
  };
}

export function faqPage(items: { q: string; a: string }[]): Json {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } })),
  };
}

// The research library as an ItemList of the real papers it summarises (each points at the original DOI).
export function libraryList(lang: Locale, name: string, path: string, origin: URL): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url: abs(path, origin),
    inLanguage: lang,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: library.length,
      itemListElement: library.map((e, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: abs(localeUrl(lang, `articles/${e.slug}/`), origin),
        item: {
          '@type': 'ScholarlyArticle',
          '@id': `${abs(path, origin)}#pmid-${e.id}`,
          name: e.titleEn,
          headline: e[lang].title,
          description: e[lang].sum,
          url: `https://doi.org/${e.doi}`,
          sameAs: [`https://pubmed.ncbi.nlm.nih.gov/${e.id}/`],
          datePublished: String(e.year),
          isPartOf: { '@type': 'Periodical', name: e.journal },
          author: e.authors.slice(0, 6).map((a) => ({ '@type': 'Person', name: a })),
          ...(e.pmc ? { isAccessibleForFree: true } : {}),
        },
      })),
    },
  };
}
