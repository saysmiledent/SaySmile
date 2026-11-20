// Home page texts (ru / fa / en). Facts only from confirmed project notes: no invented statistics,
// rankings or reviews. Numbers on the page are counted from the site's own data (Feature.astro).
// The doctor reads the Farsi once before it is final.
import type { Locale } from '../../i18n';

export interface HomeCopy {
  loading: string;
  hero: { label: string; title: string; text: string; note: string; book: string; more: string; linksLabel: string };
  why: { label: string; title: string; text: string; a: string; b: string };
  services: { label: string; title: string; text: string; more: string; soon: string; from: string };
  photoAlt: string;
  about: {
    label: string; text: string; book: string; prices: string;
    stats: { library: string; cases: string; hours: string; diploma: string };
  };
  team: { label: string; title: string; text: string; all: string; portraitAlt: string; diploma: string; accreditation: string };
  ask: {
    label: string; title: string; text: string; form: string;
    name: string; namePh: string; phone: string; phonePh: string; question: string; questionPh: string;
    viaTelegram: string; viaWhatsapp: string; hint: string; message: string;
  };
}

const ru: HomeCopy = {
  loading: 'Загрузка',
  hero: {
    label: 'Стоматология SaySmile',
    title: 'Спокойное лечение зубов, где вам объясняют каждый шаг',
    text: 'Профгигиена, лечение кариеса и восстановление зубов в Санкт-Петербурге. Под местной анестезией, с паузами по вашей просьбе.',
    note: 'Приём ежедневно, 9:00–21:00',
    book: 'Записаться',
    more: 'Услуги и цены',
    linksLabel: 'Разделы сайта',
  },
  why: {
    label: 'Почему SaySmile',
    title: 'Один врач, один план и вся история лечения в одних руках',
    text: 'Осмотр, план и лечение провожу я сам. Вы всегда знаете, что будет на следующем приёме и сколько это стоит.',
    a: 'О враче',
    b: 'До и после',
  },
  services: {
    label: 'Услуги',
    title: 'Уход, лечение и восстановление зубов',
    text: 'Цены указаны «от». Точный план и стоимость после осмотра.',
    more: 'Подробнее',
    soon: 'Скоро',
    from: 'Цена',
  },
  photoAlt: 'Восстановленный жевательный зуб под коффердамом',
  about: {
    label: 'О враче',
    text: 'Я стоматолог-терапевт-ортопед. Лечу под местной анестезией и делаю паузы, когда вы просите. Перед каждым шагом объясняю, что я делаю и зачем.',
    book: 'Записаться',
    prices: 'Цены',
    stats: {
      library: 'обзоров исследований в библиотеке',
      cases: 'клинических случаев в галерее',
      hours: 'приём ежедневно',
      diploma: 'диплом врача-стоматолога',
    },
  },
  team: {
    label: 'Врач',
    title: 'Врач, которого вы видите на каждом приёме',
    text: 'Доктор Сейван Хагдуст, стоматолог-терапевт-ортопед.',
    all: 'Все дипломы',
    portraitAlt: 'Сейван Хагдуст, стоматолог-терапевт-ортопед',
    diploma: 'Диплом врача-стоматолога, 2025',
    accreditation: 'Аккредитация специалиста, 2025',
  },
  ask: {
    label: 'Связаться',
    title: 'Не знаете, с чего начать? Спросите меня.',
    text: 'Опишите, что беспокоит. Я отвечу в мессенджере и подскажу, какой приём нужен.',
    form: 'Написать врачу',
    name: 'Ваше имя', namePh: 'Имя',
    phone: 'Телефон', phonePh: '+7',
    question: 'Что беспокоит', questionPh: 'Например: болит зуб на холодное',
    viaTelegram: 'Отправить в Telegram',
    viaWhatsapp: 'Отправить в WhatsApp',
    hint: 'Сообщение откроется в мессенджере, вы сможете его проверить перед отправкой.',
    message: 'Здравствуйте! Меня зовут {name}. Телефон: {phone}. {question}',
  },
};

const en: HomeCopy = {
  loading: 'Loading',
  hero: {
    label: 'SaySmile dentistry',
    title: 'Calm dental care, with every step explained',
    text: 'Professional cleaning, caries treatment and tooth restoration in St. Petersburg. Under local anaesthesia, with pauses whenever you ask.',
    note: 'Open daily, 9:00–21:00',
    book: 'Book a visit',
    more: 'Services and prices',
    linksLabel: 'Site sections',
  },
  why: {
    label: 'Why SaySmile',
    title: 'One doctor, one plan, your whole treatment in one pair of hands',
    text: 'I examine you, explain the plan and treat you myself. You always know what the next visit is for and what it costs.',
    a: 'About the doctor',
    b: 'Before and after',
  },
  services: {
    label: 'Services',
    title: 'Care, treatment and restoration of teeth',
    text: 'Prices are starting prices. The exact plan and cost follow the check-up.',
    more: 'Details',
    soon: 'Soon',
    from: 'Price',
  },
  photoAlt: 'Restored back tooth under a rubber dam',
  about: {
    label: 'About the doctor',
    text: 'I am a restorative dentist and prosthodontist. I treat under local anaesthesia and pause whenever you ask. Before each step I explain what I am doing and why.',
    book: 'Book a visit',
    prices: 'Prices',
    stats: {
      library: 'research reviews in the library',
      cases: 'clinical cases in the gallery',
      hours: 'open every day',
      diploma: 'dental degree',
    },
  },
  team: {
    label: 'Doctor',
    title: 'The doctor you see at every visit',
    text: 'Dr. Seivan, restorative dentist and prosthodontist.',
    all: 'All diplomas',
    portraitAlt: 'Dr. Seivan',
    diploma: 'Dental degree, 2025',
    accreditation: 'Specialist accreditation, 2025',
  },
  ask: {
    label: 'Contact',
    title: 'Not sure where to start? Ask me.',
    text: 'Describe what bothers you. I reply in the messenger and tell you which visit you need.',
    form: 'Write to the doctor',
    name: 'Your name', namePh: 'Name',
    phone: 'Phone', phonePh: '+7',
    question: 'What bothers you', questionPh: 'For example: a tooth hurts with cold drinks',
    viaTelegram: 'Send via Telegram',
    viaWhatsapp: 'Send via WhatsApp',
    hint: 'The message opens in the messenger, so you can check it before sending.',
    message: 'Hello! My name is {name}. Phone: {phone}. {question}',
  },
};

const fa: HomeCopy = {
  loading: 'در حال بارگذاری',
  hero: {
    label: 'دندانپزشکی SaySmile',
    title: 'درمان آرام دندان، با توضیح هر مرحله',
    text: 'جرم‌گیری حرفه‌ای، درمان پوسیدگی و ترمیم دندان در سن‌پترزبورگ. با بی‌حسی موضعی و مکث هر وقت که بخواهید.',
    note: 'پذیرش هر روز، ۹ تا ۲۱',
    book: 'رزرو نوبت',
    more: 'خدمات و قیمت‌ها',
    linksLabel: 'بخش‌های سایت',
  },
  why: {
    label: 'چرا SaySmile',
    title: 'یک پزشک، یک برنامه و کل درمان در دست یک نفر',
    text: 'معاینه، برنامه‌ی درمان و خود درمان را خودم انجام می‌دهم. همیشه می‌دانید جلسه‌ی بعد چه کاری انجام می‌شود و هزینه‌اش چقدر است.',
    a: 'درباره‌ی پزشک',
    b: 'قبل و بعد',
  },
  services: {
    label: 'خدمات',
    title: 'مراقبت، درمان و ترمیم دندان',
    text: 'قیمت‌ها از حداقل هزینه شروع می‌شوند. برنامه و هزینه‌ی دقیق بعد از معاینه مشخص می‌شود.',
    more: 'جزئیات',
    soon: 'به‌زودی',
    from: 'قیمت',
  },
  photoAlt: 'دندان آسیای ترمیم‌شده زیر رابردم',
  about: {
    label: 'درباره‌ی پزشک',
    text: 'من دندانپزشک ترمیمی و پروتز هستم. با بی‌حسی موضعی درمان می‌کنم و هر وقت بخواهید مکث می‌کنم. پیش از هر مرحله توضیح می‌دهم چه کاری انجام می‌دهم و چرا.',
    book: 'رزرو نوبت',
    prices: 'قیمت‌ها',
    stats: {
      library: 'مرور پژوهشی در کتابخانه',
      cases: 'نمونه‌ی درمان در گالری',
      hours: 'پذیرش هر روز',
      diploma: 'مدرک دندانپزشکی',
    },
  },
  team: {
    label: 'پزشک',
    title: 'پزشکی که در هر جلسه می‌بینید',
    text: 'دکتر سیوان، دندانپزشک ترمیمی و پروتز.',
    all: 'همه‌ی مدارک',
    portraitAlt: 'دکتر سیوان',
    diploma: 'مدرک دندانپزشکی، ۲۰۲۵',
    accreditation: 'اعتبارنامه‌ی تخصصی، ۲۰۲۵',
  },
  ask: {
    label: 'تماس',
    title: 'نمی‌دانید از کجا شروع کنید؟ از من بپرسید.',
    text: 'مشکلتان را بنویسید. در پیام‌رسان جواب می‌دهم و می‌گویم چه نوبتی لازم دارید.',
    form: 'پیام به پزشک',
    name: 'نام شما', namePh: 'نام',
    phone: 'تلفن', phonePh: '+7',
    question: 'مشکل شما', questionPh: 'مثلاً: دندانم با آب سرد درد می‌گیرد',
    viaTelegram: 'ارسال در تلگرام',
    viaWhatsapp: 'ارسال در واتساپ',
    hint: 'پیام در پیام‌رسان باز می‌شود و پیش از ارسال می‌توانید آن را ببینید.',
    message: 'سلام! من {name} هستم. تلفن: {phone}. {question}',
  },
};

export const homeCopy: Record<Locale, HomeCopy> = { ru, fa, en };
