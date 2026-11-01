import type { Locale } from '../i18n';

export type CatId = 'caries' | 'gums' | 'hygiene' | 'whitening' | 'restorations' | 'comfort' | 'children' | 'prosthetics' | 'health' | 'sensitivity' | 'surgery';
export type EvidenceType = 'cochrane' | 'systematic' | 'review';

export interface LibText { title: string; sum: string }
export interface LibEntry {
  id: string; cat: CatId; year: number; journal: string; type: EvidenceType;
  oa: boolean; pmc: string; doi: string; authors: string[]; org: string; team: string;
  titleEn: string; kw: string[];
  ru: LibText; fa: LibText; en: LibText;
}

type L3 = Record<Locale, string>;

// Category labels plus the words people type for it, in all three languages (used by the search).
export const categories: { id: CatId; label: L3; words: string }[] = [
  { id: 'caries', label: { ru: 'Кариес и фторид', fa: 'پوسیدگی و فلوراید', en: 'Decay and fluoride' }, words: 'кариес дырка фтор фторид герметик лак caries decay cavity fluoride sealant varnish پوسیدگی کرم‌خوردگی فلوراید سیلانت وارنیش' },
  { id: 'gums', label: { ru: 'Дёсны', fa: 'لثه', en: 'Gums' }, words: 'дёсны десна пародонтит гингивит камень gum gums periodontitis gingivitis calculus لثه پریودنتیت ژنژیویت جرم' },
  { id: 'hygiene', label: { ru: 'Гигиена и уход дома', fa: 'بهداشت و مراقبت خانگی', en: 'Hygiene and home care' }, words: 'гигиена щётка нить паста ополаскиватель запах hygiene brush toothbrush floss toothpaste mouthwash bad breath halitosis بهداشت مسواک نخ دندان خمیردندان دهان‌شویه بوی بد دهان' },
  { id: 'whitening', label: { ru: 'Отбеливание', fa: 'سفید کردن دندان', en: 'Whitening' }, words: 'отбеливание белые зубы whitening bleaching سفید کردن دندان بلیچینگ' },
  { id: 'restorations', label: { ru: 'Пломбы и восстановление', fa: 'ترمیم دندان', en: 'Fillings and restorations' }, words: 'пломба коффердам композит стеклоиономер filling restoration rubber dam composite glass ionomer ترمیم پرکردگی رابردم کامپوزیت' },
  { id: 'comfort', label: { ru: 'Страх и комфорт', fa: 'ترس و راحتی درمان', en: 'Fear and comfort' }, words: 'страх тревога седация боль фобия anxiety fear phobia sedation pain ترس اضطراب آرام‌بخشی درد' },
  { id: 'children', label: { ru: 'Дети и беременность', fa: 'کودکان و بارداری', en: 'Children and pregnancy' }, words: 'дети ребёнок молочные зубы беременность мама children child baby teeth pregnancy mother pediatric paediatric کودک کودکان دندان شیری بارداری مادر' },
  { id: 'prosthetics', label: { ru: 'Протезы и ортодонтия', fa: 'پروتز و ارتودنسی', en: 'Dentures and braces' }, words: 'протез брекеты элайнеры каппа прикус denture prosthesis braces aligners orthodontic crossbite پروتز بریس الاینر ارتودنسی' },
  { id: 'health', label: { ru: 'Рот и здоровье тела', fa: 'دهان و سلامت بدن', en: 'Mouth and body health' }, words: 'диабет сердце курение питание diabetes heart smoking e-cigarette nutrition diet دیابت قلب سیگار تغذیه' },
  { id: 'sensitivity', label: { ru: 'Чувствительность зубов', fa: 'حساسیت دندان', en: 'Tooth sensitivity' }, words: 'чувствительность гиперчувствительность sensitivity hypersensitivity حساسیت دندان' },
  { id: 'surgery', label: { ru: 'Удаление, каналы, челюсть', fa: 'کشیدن، عصب‌کشی و فک', en: 'Extractions, root canals, jaw' }, words: 'удаление зуба каналы эндодонтия абсцесс антибиотик ВНЧС челюсть extraction root canal endodontic abscess antibiotic TMD jaw leukoplakia کشیدن دندان عصب‌کشی آبسه آنتی‌بیوتیک فک' },
];

export const evidenceTypes: { id: EvidenceType; label: L3; hint: L3 }[] = [
  { id: 'cochrane', label: { ru: 'Cochrane', fa: 'کاکرین', en: 'Cochrane' }, hint: { ru: 'Систематический обзор Cochrane', fa: 'مرور سیستماتیک کاکرین', en: 'Cochrane systematic review' } },
  { id: 'systematic', label: { ru: 'Систематический обзор', fa: 'مرور سیستماتیک', en: 'Systematic review' }, hint: { ru: 'Сводка многих исследований по заранее заданным правилам', fa: 'جمع‌بندی مطالعات متعدد با قواعد از پیش تعیین‌شده', en: 'Many studies pooled under set rules' } },
  { id: 'review', label: { ru: 'Обзор', fa: 'مقاله مروری', en: 'Review' }, hint: { ru: 'Обзор литературы по теме', fa: 'مرور ادبیات علمی یک موضوع', en: 'An overview of the literature on a topic' } },
];

export interface LibraryUi {
  title: string; lead: string; searchLabel: string; placeholder: string;
  scopes: { all: string; title: string; author: string; team: string; keyword: string };
  scopeLabel: string; exact: string; exactHint: string;
  categoryLabel: string; allCategories: string; typeLabel: string; oaOnly: string;
  sortLabel: string; sortNew: string; sortOld: string;
  found: (n: string, total: string) => string; empty: string; emptyHint: string; reset: string;
  source: string; pubmed: string; doi: string; fullText: string; openAccess: string; team: string;
  authors: string; etAl: string; journal: string; original: string;
  note: string; attribution: string;
}

export const libraryUi: Record<Locale, LibraryUi> = {
  ru: {
    title: 'Библиотека научных обзоров', lead: 'Научные обзоры о зубах и дёснах простыми словами, с прямыми ссылками на первоисточники.',
    searchLabel: 'Поиск по библиотеке', placeholder: 'Например: кариес, фтор, Cochrane, имя автора',
    scopes: { all: 'Везде', title: 'Название', author: 'Автор', team: 'Команда', keyword: 'Ключевые слова' }, scopeLabel: 'Где искать',
    exact: 'Точная фраза', exactHint: 'Иначе ищутся все слова из запроса в любом порядке. Фразу можно взять в кавычки.',
    categoryLabel: 'Тема', allCategories: 'Все темы', typeLabel: 'Вид обзора', oaOnly: 'Только с бесплатным полным текстом',
    sortLabel: 'Порядок', sortNew: 'Сначала новые', sortOld: 'Сначала старые',
    found: (n, t) => `Найдено ${n} из ${t}`, empty: 'Ничего не найдено', emptyHint: 'Попробуйте одно слово, другой язык запроса или сбросьте фильтры.', reset: 'Сбросить поиск и фильтры',
    source: 'Первоисточник', pubmed: 'PubMed', doi: 'DOI', fullText: 'Полный текст', openAccess: 'Полный текст бесплатно', team: 'Команда',
    authors: 'Авторы', etAl: 'и др.', journal: 'Журнал', original: 'Оригинальное название',
    note: 'Пересказы написаны простыми словами по аннотациям статей и не заменяют осмотр врача. Решение о лечении принимается на приёме.',
    attribution: 'Данные об изданиях: PubMed (Национальная медицинская библиотека США). Права на статьи принадлежат авторам и журналам.',
  },
  fa: {
    title: 'کتابخانهٔ مقالات علمی', lead: 'مقاله‌های علمی دربارهٔ دندان و لثه به زبان ساده، با پیوند مستقیم به منبع اصلی.',
    searchLabel: 'جستجو در کتابخانه', placeholder: 'مثلاً: پوسیدگی، فلوراید، کاکرین، نام نویسنده',
    scopes: { all: 'همه‌جا', title: 'عنوان', author: 'نویسنده', team: 'تیم', keyword: 'کلیدواژه' }, scopeLabel: 'جستجو در',
    exact: 'عبارت دقیق', exactHint: 'در حالت عادی همهٔ کلمه‌ها به هر ترتیب جستجو می‌شوند. می‌توانید عبارت را داخل گیومه بگذارید.',
    categoryLabel: 'موضوع', allCategories: 'همهٔ موضوع‌ها', typeLabel: 'نوع مقاله', oaOnly: 'فقط متن کامل رایگان',
    sortLabel: 'ترتیب', sortNew: 'جدیدترین', sortOld: 'قدیمی‌ترین',
    found: (n, t) => `${n} مورد از ${t}`, empty: 'چیزی پیدا نشد', emptyHint: 'یک کلمه را امتحان کنید، به زبان دیگر بنویسید یا فیلترها را بردارید.', reset: 'پاک کردن جستجو و فیلترها',
    source: 'منبع اصلی', pubmed: 'پاب‌مد', doi: 'DOI', fullText: 'متن کامل', openAccess: 'متن کامل رایگان', team: 'تیم',
    authors: 'نویسندگان', etAl: 'و همکاران', journal: 'مجله', original: 'عنوان اصلی',
    note: 'این خلاصه‌ها بر اساس چکیدهٔ مقاله‌ها به زبان ساده نوشته شده‌اند و جای معاینهٔ دندان‌پزشک را نمی‌گیرند. تصمیم درمانی در ویزیت گرفته می‌شود.',
    attribution: 'اطلاعات نشریه‌ها: PubMed (کتابخانهٔ ملی پزشکی آمریکا). حقوق مقاله‌ها متعلق به نویسندگان و مجله‌هاست.',
  },
  en: {
    title: 'Research library', lead: 'Scientific reviews on teeth and gums in plain language, with direct links to the original papers.',
    searchLabel: 'Search the library', placeholder: 'For example: caries, fluoride, Cochrane, an author name',
    scopes: { all: 'Everywhere', title: 'Title', author: 'Author', team: 'Team', keyword: 'Keywords' }, scopeLabel: 'Search in',
    exact: 'Exact phrase', exactHint: 'Otherwise every word must appear, in any order. You can also put a phrase in quotes.',
    categoryLabel: 'Topic', allCategories: 'All topics', typeLabel: 'Type of review', oaOnly: 'Free full text only',
    sortLabel: 'Order', sortNew: 'Newest first', sortOld: 'Oldest first',
    found: (n, t) => `${n} of ${t} shown`, empty: 'Nothing found', emptyHint: 'Try a single word, another language, or clear the filters.', reset: 'Clear search and filters',
    source: 'Original paper', pubmed: 'PubMed', doi: 'DOI', fullText: 'Full text', openAccess: 'Free full text', team: 'Team',
    authors: 'Authors', etAl: 'et al.', journal: 'Journal', original: 'Original title',
    note: "Summaries are written in plain words from each paper's abstract and do not replace a dental exam. Treatment decisions are made at the appointment.",
    attribution: 'Publication data: PubMed (US National Library of Medicine). Rights to the papers belong to their authors and journals.',
  },
};
