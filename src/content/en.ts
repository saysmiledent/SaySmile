import type { PagesContent } from './types';

const en: PagesContent = {
  about: {
    lead: 'Dental therapist at GAM Clinic in St. Petersburg. Calm treatment, never rushed.',
    facts: [
      { title: 'Comfort', text: 'Treatment under local anesthesia, with pauses whenever you ask.' },
      { title: 'Diagnostics', text: 'GAM Clinic has CT diagnostics.' },
      { title: 'Atmosphere', text: 'Drinks are offered to patients at the clinic.' },
      { title: 'Opening hours', text: 'The clinic is open every day, 9:00 to 21:00.' },
    ],
  },
  services: {
    lead: 'Prices and a short description of what each procedure includes.',
    includes: 'What is included',
    book: 'Book a visit',
    items: [
      { title: 'Professional hygiene', text: 'Complete cleaning: ultrasound, AIRFLOW and polishing to remove plaque, tartar and stains.', detail: 'Examination, cleaning, polishing, home-care advice.', time: '45–60 minutes', price: 'from 4 500 ₽' },
      { title: 'Cavity treatment', text: 'Minimally invasive treatment under a rubber dam, focused on the natural shape and colour of the filling.', detail: 'Evidence-based protocols, isolated field, modern materials.', time: '1 visit', price: 'from 7 000 ₽' },
      { title: 'Whitening', text: 'A gentle protocol with preparation first and a clear explanation of any limits.', detail: 'We often recommend professional hygiene 1–2 weeks before.', time: 'as indicated', price: '20 000 ₽' },
    ],
    soonTitle: 'Coming to the price list',
    soon: [
      { title: 'Root canal treatment', text: 'By protocol, with modern cleaning and quality control.' },
      { title: 'Crowns', text: 'Prosthetic solutions when indicated and planned with the restoration.' },
      { title: 'Aesthetic work', text: 'Precise shape, light and colour in the smile zone.' },
    ],
    note: 'There are contraindications. A specialist consultation is required.',
  },
  gallery: { lead: 'Before and after treatment.', soon: 'Photos of finished work will appear here soon.' },
  diplomas: { lead: 'Diploma, accreditation and seminar certificates.', soon: 'Scans of the documents will appear here soon.' },
  education: {
    lead: 'The path from university to specialist accreditation.',
    timeline: [
      { when: 'December 2023', title: 'Nursing staff admission', text: 'Admission exam to work as nursing staff, 3rd year of university.' },
      { when: 'March 2024', title: 'Dental hygienist admission', text: 'Admission to work as a dental hygienist.' },
      { when: 'June 2025', title: 'Dentist diploma', text: 'Graduated from university.' },
      { when: 'July 2025', title: 'Specialist accreditation', text: 'General practice dentistry.' },
    ],
    extra: 'In parallel: many courses and seminars.',
  },
  tutorials: { lead: 'Short educational videos about dental health.', soon: 'Videos will appear here soon.' },
  contact: {
    lead: 'Message on a messenger, call, or open the map, whichever suits you.',
    hoursTitle: 'Opening hours', hours: 'Every day, 9:00–21:00. Book in advance.',
    addressTitle: 'Address', address: 'GAM Clinic, Ligovsky Ave. 232, St. Petersburg',
    route: 'Open in Yandex Maps',
  },
};
export default en;
