// Education documents. Scans live in public/img/docs/<img>.webp and <img>-thumb.webp.
// Source: the previous site (v1). The SNILS number on the accreditation extract is already covered.
import type { Locale } from '../i18n';

export type DocKind = 'admission' | 'seminar' | 'diploma' | 'accreditation';
interface DocText { date: string; title: string; issuer: string; note: string }
export interface DocDef { id: string; img: string; iso: string; kind: DocKind; text: Record<Locale, DocText> }

export const docs: DocDef[] = [
  {
    id: 'nurse-2023', img: 'nurse-2023', iso: '2023-12-22', kind: 'admission',
    text: {
      ru: { date: '22 декабря 2023', title: 'Допуск к медицинской деятельности: средний медицинский персонал', issuer: 'СПбГПМУ · выписка из протокола аттестационного экзамена № 37/34', note: 'Получен на 3-м курсе университета.' },
      fa: { date: '۲۲ دسامبر ۲۰۲۳', title: 'مجوز فعالیت پزشکی: پرسنل پرستاری', issuer: 'دانشگاه پزشکی کودکان سن‌پترزبورگ · خلاصه‌ی صورت‌جلسه‌ی آزمون صلاحیت', note: 'در سال سوم دانشگاه دریافت شد.' },
      en: { date: '22 December 2023', title: 'Admission to medical work: nursing staff', issuer: 'SPbGPMU · extract from attestation exam protocol No. 37/34', note: 'Obtained in the 3rd year of university.' },
    },
  },
  {
    id: 'west-2024', img: 'west-2024-estelite', iso: '2024-01-19', kind: 'seminar',
    text: {
      ru: { date: '19 января 2024', title: 'Прямые реставрации передней и боковой группы зубов Estelite Asteria', issuer: 'Учебный стоматологический центр WEST', note: 'Практическое применение.' },
      fa: { date: '۱۹ ژانویه ۲۰۲۴', title: 'ترمیم‌های مستقیم دندان‌های جلو و عقب با Estelite Asteria', issuer: 'مرکز آموزش دندانپزشکی WEST', note: 'کارگاه عملی.' },
      en: { date: '19 January 2024', title: 'Direct restorations of anterior and posterior teeth with Estelite Asteria', issuer: 'WEST Dental Training Center', note: 'Hands-on practice.' },
    },
  },
  {
    id: 'hygienist-2024', img: 'hygienist-2024', iso: '2024-03-05', kind: 'admission',
    text: {
      ru: { date: '5 марта 2024', title: 'Допуск: гигиенист стоматологический', issuer: 'ПСПбГМУ им. И.П. Павлова · выписка из протокола № 02/ГС/2023-2024', note: 'Допуск к медицинской деятельности на 5 лет.' },
      fa: { date: '۵ مارس ۲۰۲۴', title: 'مجوز کار: بهداشت‌کار دندان', issuer: 'دانشگاه پزشکی پاولوف سن‌پترزبورگ · خلاصه‌ی صورت‌جلسه', note: 'مجوز فعالیت پزشکی برای ۵ سال.' },
      en: { date: '5 March 2024', title: 'Admission: dental hygienist', issuer: 'Pavlov First St. Petersburg State Medical University · extract from protocol No. 02/GS/2023-2024', note: 'Admission to medical practice for 5 years.' },
    },
  },
  {
    id: 'ivoclar-day-2025', img: 'ivoclar-day-2025', iso: '2025-03-17', kind: 'seminar',
    text: {
      ru: { date: '17 марта 2025', title: 'День Ivoclar', issuer: 'УЦ ГК «Северная Каролина»', note: 'Практический семинар, 2 часа.' },
      fa: { date: '۱۷ مارس ۲۰۲۵', title: 'روز Ivoclar', issuer: 'مرکز آموزشی گروه دندانپزشکی «کارولینای شمالی»', note: 'سمینار عملی، ۲ ساعت.' },
      en: { date: '17 March 2025', title: 'Ivoclar Day', issuer: 'North Carolina dental group training center', note: 'Hands-on seminar, 2 hours.' },
    },
  },
  {
    id: 'ivoclar-veneers-2025', img: 'ivoclar-veneers-2025', iso: '2025-04-16', kind: 'seminar',
    text: {
      ru: { date: '16–17 апреля 2025', title: 'Доступно о винирах для стоматологов-терапевтов', issuer: 'УЦ ГК «Северная Каролина»', note: 'Практический семинар, 16 часов.' },
      fa: { date: '۱۶ و ۱۷ آوریل ۲۰۲۵', title: 'ونیر به زبان ساده برای دندانپزشکان ترمیمی', issuer: 'مرکز آموزشی گروه دندانپزشکی «کارولینای شمالی»', note: 'سمینار عملی، ۱۶ ساعت.' },
      en: { date: '16–17 April 2025', title: 'Veneers made simple for restorative dentists', issuer: 'North Carolina dental group training center', note: 'Hands-on seminar, 16 hours.' },
    },
  },
  {
    id: 'diploma-2025', img: 'diploma-2025', iso: '2025-06-30', kind: 'diploma',
    text: {
      ru: { date: '30 июня 2025', title: 'Диплом: врач-стоматолог (специалитет 31.05.03 «Стоматология»)', issuer: 'СПбГПМУ · решение Государственной экзаменационной комиссии, протокол № 5', note: 'Присвоена квалификация «Врач-стоматолог».' },
      fa: { date: '۳۰ ژوئن ۲۰۲۵', title: 'دیپلم: دندانپزشک (رشته‌ی «دندانپزشکی»، کد ۳۱.۰۵.۰۳)', issuer: 'دانشگاه پزشکی کودکان سن‌پترزبورگ · تصمیم کمیسیون آزمون دولتی', note: 'عنوان «دندانپزشک» اعطا شد.' },
      en: { date: '30 June 2025', title: 'Diploma: Doctor of Dentistry (specialist degree 31.05.03 "Dentistry")', issuer: 'SPbGPMU · State Examination Board decision, protocol No. 5', note: 'Qualification "Dentist" awarded.' },
    },
  },
  {
    id: 'west-2025', img: 'west-2025-anesthesia', iso: '2025-07-17', kind: 'seminar',
    text: {
      ru: { date: '17 июля 2025', title: 'Профилактика и лечение экстренных и неотложных состояний при проведении местного обезболивания в стоматологии', issuer: 'Учебный стоматологический центр WEST', note: 'Семинар по безопасности местной анестезии.' },
      fa: { date: '۱۷ ژوئیه ۲۰۲۵', title: 'پیشگیری و درمان وضعیت‌های اورژانسی هنگام بی‌حسی موضعی در دندانپزشکی', issuer: 'مرکز آموزش دندانپزشکی WEST', note: 'سمینار ایمنی بی‌حسی موضعی.' },
      en: { date: '17 July 2025', title: 'Prevention and management of emergencies during local anesthesia in dentistry', issuer: 'WEST Dental Training Center', note: 'Seminar on local anesthesia safety.' },
    },
  },
  {
    id: 'accreditation-2025', img: 'accreditation-2025', iso: '2025-07-17', kind: 'accreditation',
    text: {
      ru: { date: '17 июля 2025', title: 'Первичная аккредитация специалиста — «Стоматология общей практики»', issuer: 'Выписка из ЕГИСЗ от 25.07.2025', note: 'Действительна до 17.07.2030.' },
      fa: { date: '۱۷ ژوئیه ۲۰۲۵', title: 'اکردیتاسیون اولیه‌ی متخصص — «دندانپزشکی عمومی»', issuer: 'گزارش از سامانه‌ی یکپارچه‌ی اطلاعات سلامت روسیه، ۲۵ ژوئیه ۲۰۲۵', note: 'معتبر تا ۱۷ ژوئیه ۲۰۳۰.' },
      en: { date: '17 July 2025', title: 'Primary specialist accreditation — "General practice dentistry"', issuer: 'Extract from the national health information system (EGISZ), 25 July 2025', note: 'Valid until 17 July 2030.' },
    },
  },
  {
    id: 'crowns-2026', img: 'crowns-2026', iso: '2026-09-25', kind: 'seminar',
    text: {
      ru: { date: '25 сентября 2026', title: 'Безметалловые коронки', issuer: 'УЦ ГК «Северная Каролина»', note: 'Практический курс, 7 часов.' },
      fa: { date: '۲۵ سپتامبر ۲۰۲۶', title: 'روکش‌های بدون فلز', issuer: 'مرکز آموزشی گروه دندانپزشکی «کارولینای شمالی»', note: 'دوره‌ی عملی، ۷ ساعت.' },
      en: { date: '25 September 2026', title: 'Metal-free crowns', issuer: 'North Carolina dental group training center', note: 'Hands-on course, 7 hours.' },
    },
  },
];
