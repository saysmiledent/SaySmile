/**
 * Tutorial topics (Farsi only for now). One topic = one subject shown in three formats that point at each other:
 * an Instagram reel (self-hosted copy), a carousel of slides, and the research-library articles behind it.
 *
 * To add a topic:
 *  1. put public/videos/<id>.mp4 + <id>.jpg and public/videos/<id>/sNN.webp (or .mp4 for motion slides), public/og/<id>.jpg
 *  2. add an entry below; `cat` is a library category, so the topic is grouped with its articles
 *  3. list library slugs in `articles`; each of those article pages then links back to the topic automatically
 */
import type { CatId } from './library-ui';
import { library } from './library-data';

export interface TopicSlide {
  /** short heading, plain text */
  title: string;
  /** what the slide says, plain text (this is also the page text that search engines read) */
  text: string;
  /** 'video' slides have a short motion clip public/videos/<id>/sNN.mp4 next to the still */
  motion?: boolean;
  /** part of the how-to sequence (listed as HowTo steps in the page data) */
  step?: boolean;
  /** what the picture shows, for screen readers */
  alt: string;
}

export interface TopicStage { when: string; what: string }

export interface Topic {
  id: string;
  cat: CatId;
  tags: string[];
  /** ISO date the topic went live */
  iso: string;
  title: string;
  /** card title on the hub */
  short: string;
  description: string;
  /** one or two sentences for the hub card */
  blurb: string;
  lead: string;
  reel: { seconds: number; instagram: string; summary: string; stages: TopicStage[]; alt: string };
  /** set once the carousel is published; the button stays hidden until then */
  carouselInstagram?: string;
  slides: TopicSlide[];
  checks: string[];
  faq: { q: string; a: string }[];
  /** library slugs, most relevant first */
  articles: string[];
}

export const topics: Topic[] = [
  {
    id: 'floss',
    cat: 'hygiene',
    tags: ['نخ دندان', 'بهداشت دهان', 'لثه', 'پلاک', 'پوسیدگی بین دندانی'],
    iso: '2026-11-03',
    title: 'نخ دندان: راهنمای کامل و قدم‌به‌قدم',
    short: 'نخ دندان',
    description: 'ویدیوی کوتاه و ۱۰ اسلاید دربارهٔ استفادهٔ درست از نخ دندان: طول نخ، حرکت اره‌ای، شکل C، خونریزی لثه و اشتباه‌های رایج، همراه با مقاله‌های پژوهشی مرتبط.',
    blurb: 'اگر نخ دندان نکشید، بین دندان‌ها چه اتفاقی می‌افتد؟ و اگر می‌کشید، چطور درستش کنید؟',
    lead: 'اگر نخ دندان نکشید، بین دندان‌ها با گذشت زمان چه اتفاقی می‌افتد؟ و اگر می‌کشید، چطور درستش کنید؟ ویدیوی کوتاه، اسلایدهای قدم‌به‌قدم و مقاله‌های پژوهشی مرتبط، همه یک‌جا.',
    reel: {
      seconds: 26,
      instagram: 'https://www.instagram.com/reel/DfOuahHDYf4/',
      alt: 'ویدیوی کوتاه: فاصلهٔ بین دو دندان که با گذشت زمان پلاک، جرم، التهاب لثه و پوسیدگی در آن شکل می‌گیرد',
      summary: 'ویدیو نشان می‌دهد اگر پلاک بین دو دندان هر شب برداشته نشود، چه مسیری ممکن است طی شود. سرعت این روند در هر فرد فرق دارد و ویدیو فقط تصویرسازی است.',
      stages: [
        { when: 'چند ساعت بعد', what: 'پلاک' },
        { when: '۲ روز بعد', what: 'جرم' },
        { when: '۲ هفته بعد', what: 'التهاب و خونریزی لثه' },
        { when: 'چند ماه بعد', what: 'پوسیدگی بین دندانی' },
      ],
    },
    slides: [
      { title: 'راهنمای کامل نخ دندان', text: 'ده اسلاید قدم‌به‌قدم: از طول نخ تا شکل C و کاری که اگر لثه خون آمد باید کرد.', alt: 'نخ دندان کشیده‌شده بین دو دندان آسیاب' },
      { title: 'مسواک به بین دندان‌ها نمی‌رسد', text: 'مسواک سطح جلو و پشت دندان را تمیز می‌کند. جای تماس دو دندانِ کنار هم، کار نخ دندان است.', alt: 'فاصلهٔ بین دو دندان که پلاک و پسماند غذا در آن جمع شده و مسواک به آن نمی‌رسد' },
      { title: 'حدود ۴۵ سانت نخ ببُرید', step: true, text: 'نخ بلند برمی‌دارید تا برای هر فاصله بین دندان‌ها یک قسمت تمیز داشته باشید.', alt: 'یک قطعهٔ بلند نخ دندان کنار خط‌کش' },
      { title: 'دور انگشت‌های وسط بپیچید', step: true, text: 'بیشترِ نخ را دور یک انگشت بپیچید و بقیه را دور انگشت دست دیگر. بین دو دست ۲ تا ۵ سانت نخ بماند.', motion: true, alt: 'دو دست که نخ را دور انگشت‌های وسط پیچیده‌اند و بین آن‌ها چند سانت نخ کشیده است' },
      { title: 'آرام و اره‌ای وارد کنید', step: true, text: 'نخ را با حرکت نرم رفت‌وبرگشتی بین دو دندان پایین ببرید. به لثه نکوبید و فشار نیاورید.', motion: true, alt: 'نخ که با حرکت اره‌ای آرام از فاصلهٔ بین دو دندان پایین می‌رود' },
      { title: 'دور هر دندان شکل C بسازید', step: true, text: 'نخ را دور یک دندان خم کنید و به سطحش تکیه دهید. چند بار آرام بالا و پایین ببرید، بعد همین کار را برای دندانِ کناری.', motion: true, alt: 'نخ که به شکل حرف C دور یک دندان خم شده است' },
      { title: 'برای هر فاصله یک قسمت تمیز', step: true, text: 'نخ را کم‌کم از یک دست باز کنید و به دست دیگر ببندید. پشت آخرین دندانِ هر طرف را هم فراموش نکنید.', motion: true, alt: 'نخی که نیمی از آن استفاده‌شده و نیمی تمیز است' },
      { title: 'اگر لثه خون آمد؟', text: 'چند روز اول ممکن است لثه کمی خون بیاید. با تمیزکاری منظم، معمولاً طی چند روز تا حدود ۲ هفته کمتر می‌شود. کم نشد؟ بهتر است دندانپزشک معاینه کند.', alt: 'لثهٔ کمی قرمز و متورم بین دو دندان' },
      { title: 'چهار اشتباه رایج', text: 'نکوبیدن نخ در لثه؛ استفاده از یک قسمت نخ برای همهٔ فاصله‌ها؛ نخ کشیدن فقط وقتی غذا گیر کرده؛ رد شدن از دندان‌های عقب. اگر نخ کشیدن برایتان سخت است، نخ‌کش دسته‌دار یا مسواک بین‌دندانی هم هست؛ از دندانپزشکتان بپرسید کدام به دهان شما می‌خورد.', alt: 'فهرست چهار اشتباه رایج هنگام نخ کشیدن' },
      { title: 'خلاصه: هر شب، ۲ دقیقه', text: 'چهل‌وپنج سانت نخ، دور انگشت‌های وسط، حرکت آرام اره‌ای، شکل C دور دندان، برای هر فاصله یک قسمت تمیز.', alt: 'فهرست پنج مرحلهٔ خلاصه' },
    ],
    checks: ['حدود ۴۵ سانت نخ', 'دور انگشت‌های وسط', 'حرکت آرام اره‌ای', 'شکل C دور دندان', 'برای هر فاصله یک قسمت تمیز'],
    faq: [
      { q: 'چه مقدار نخ دندان لازم است؟', a: 'معمولاً حدود ۴۵ سانت. بیشترش را دور یک انگشت می‌پیچید و بین دو دست ۲ تا ۵ سانت نخ می‌ماند تا برای هر فاصله قسمت تمیزی داشته باشید.' },
      { q: 'اگر هنگام نخ کشیدن لثه خون آمد چه کنم؟', a: 'در روزهای اول ممکن است لثهٔ ملتهب کمی خون بیاید. با تمیزکاری منظم معمولاً طی چند روز تا حدود دو هفته کمتر می‌شود. اگر کم نشد یا شدید بود، دندانپزشک باید لثه را معاینه کند.' },
      { q: 'نخ دندان بهتر است یا مسواک بین‌دندانی؟', a: 'مرور کاکرین نشان می‌دهد هر دو در کنار مسواک ممکن است التهاب لثه را کم کنند و مسواک بین‌دندانی احتمالاً بهتر عمل می‌کند، اما اطمینان به این شواهد کم است. وسیلهٔ مناسب را دندانپزشک بر اساس فاصلهٔ بین دندان‌های شما تعیین می‌کند.' },
    ],
    articles: [
      'floss-and-interdental-brushes',
      'keeping-gum-inflammation-from-turning-into-gum-disease',
      'routine-scale-and-polish-for-adults',
      'building-better-brushing-habits',
      'mouth-bacteria-and-decay',
    ],
  },
];

export const topicPath = (t: Topic | string) => `tutorials/${typeof t === 'string' ? t : t.id}/`;
export const topicBySlug = (id: string) => topics.find((t) => t.id === id);
/** Topics whose "related articles" include this library slug (used for the link back from article pages). */
export const topicsForArticle = (slug: string) => topics.filter((t) => t.articles.includes(slug));
/** Library entries of a topic, in the listed order; unknown slugs fail the build instead of silently vanishing. */
export const topicLibrary = (t: Topic) => t.articles.map((slug) => {
  const e = library.find((x) => x.slug === slug);
  if (!e) throw new Error(`Topic "${t.id}" lists unknown library slug "${slug}"`);
  return e;
});
/** Topics grouped by library category, in the order the categories appear. */
export const topicsByCat = (list: Topic[] = topics) => {
  const out = new Map<CatId, Topic[]>();
  for (const t of list) out.set(t.cat, [...(out.get(t.cat) ?? []), t]);
  return [...out.entries()];
};
