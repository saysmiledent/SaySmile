import type { PagesContent } from './types';

const en: PagesContent = {
  about: {
    lead: 'Dental therapist and prosthodontist at GAM Clinic in St. Petersburg. Calm treatment, never rushed.',
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
  gallery: {
    "lead": "Photos before and after treatment. Drag the slider to compare.",
    "all": "All",
    "filters": {
      "hygiene": "Hygiene",
      "caries": "Cavities",
      "restoration": "Restoration"
    },
    "before": "Before",
    "after": "After",
    "drag": "Compare before and after",
    "caseWord": "Case",
    "note": "Photos are published without faces or patients' personal data. Results depend on the clinical situation and are individual.",
    "texts": {
      "hygieneLower": {
        "title": "Professional hygiene: lower teeth",
        "text": "Plaque and calculus before, a clean surface after."
      },
      "hygieneFront": {
        "title": "Professional hygiene: front teeth",
        "text": "Plaque and stains before, a lighter, cleaner result after."
      },
      "hygieneJaw": {
        "title": "Professional hygiene: lower jaw",
        "text": "Lower jaw cleaning: before and after."
      },
      "calculus": {
        "title": "Tartar removal",
        "text": "Tartar and plaque before and after removal."
      },
      "plaque": {
        "title": "Plaque removal",
        "text": "Plaque on the lower teeth, before and after."
      },
      "cariesDam": {
        "title": "Cavity treatment under a rubber dam",
        "text": "The decayed tooth, the prepared cavity and the finished restoration."
      },
      "oldCaries": {
        "title": "Cavity treatment: back teeth",
        "text": "The cavity before treatment and the restored tooth shape."
      },
      "restoreSteps": {
        "title": "Tooth restoration: stages",
        "text": "Photos of one case, stage by stage."
      }
    },
    "steps": {
      "cariesDam": [
        "Decay",
        "Cavity prepared",
        "Restoration"
      ],
      "restoreSteps": [
        "Stage 1",
        "Stage 2",
        "Stage 3",
        "Stage 4"
      ]
    }
  },
  diplomas: {
    "lead": "Diploma, accreditation, admissions and seminar certificates. Click a document to open it in full.",
    "open": "Open document",
    "close": "Close",
    "note": "Seminar certificates confirm attendance and are not education or qualification documents. The SNILS number on the extract is covered.",
    "kinds": {
      "admission": "Admission",
      "seminar": "Seminar",
      "diploma": "Diploma",
      "accreditation": "Accreditation"
    }
  },
  education: {
    "lead": "The path from admission to medical work to an accredited dentist.",
    "timeline": [
      {
        "when": "December 2023",
        "title": "Nursing staff admission",
        "text": "Admission exam to work as nursing staff, 3rd year of university."
      },
      {
        "when": "March 2024",
        "title": "Dental hygienist admission",
        "text": "Admission to work as a dental hygienist."
      },
      {
        "when": "June 2025",
        "title": "Dentist diploma",
        "text": "Graduated from university, specialist degree in Dentistry."
      },
      {
        "when": "July 2025",
        "title": "Specialist accreditation",
        "text": "\"General practice dentistry\", valid until 2030."
      }
    ],
    "extra": "Alongside the main path: hands-on courses and seminars.",
    "seminarsTitle": "Courses and seminars",
    "allDocs": "View documents"
  },
  articles: {
    "lead": "Short articles on hygiene, cavities, the rubber dam and whitening, with links to scientific reviews.",
    "read": "Read",
    "minutes": "min read",
    "keyTitle": "In short",
    "refsTitle": "Sources",
    "published": "Published",
    "author": "Author",
    "back": "All articles",
    "disclaimer": "This material is informational and does not replace an examination. Contraindications exist. A specialist consultation is required."
  },
  faq: {
    "title": "Frequently asked questions",
    "items": [
      {
        "q": "How often should I have professional hygiene?",
        "a": "Usually every 6–12 months. With braces, smoking, heavy plaque or gum disease the dentist may recommend it more often. This is decided at the examination."
      },
      {
        "q": "Does cavity treatment hurt?",
        "a": "Treatment is done under local anesthesia. If anything is uncomfortable, say so: we pause and add anesthesia if needed."
      },
      {
        "q": "What is a rubber dam and why is it used?",
        "a": "It is a thin rubber sheet that isolates the tooth from saliva and moisture. It makes it easier to work neatly and cleanly, and keeps materials off the gums and out of the mouth."
      },
      {
        "q": "Is whitening suitable for everyone?",
        "a": "No, the method has contraindications. An examination comes first: if needed we treat cavities and do hygiene first, then the dentist decides whether whitening is possible."
      },
      {
        "q": "How much does treatment cost?",
        "a": "Prices are \"from\": professional hygiene from 4,500 RUB, cavity treatment from 7,000 RUB, whitening 20,000 RUB. The exact cost and treatment plan are given after the examination, before treatment starts."
      },
      {
        "q": "How do I book a visit?",
        "a": "Message on Telegram or WhatsApp, or call. We will find a convenient day and time."
      },
      {
        "q": "Where and when do you see patients?",
        "a": "GAM Clinic, Ligovsky Ave. 232, St. Petersburg. The clinic is open daily 9:00–21:00; confirm the doctor’s reception time when booking."
      }
    ]
  },
  seo: {
    "about": {
      "title": "Dr. Seivan — dentist in St. Petersburg",
      "description": "About the doctor: education, treatment approach and accreditation in general practice dentistry. Appointments at GAM Clinic, Ligovsky Ave. 232."
    },
    "services": {
      "title": "Services and prices: hygiene, caries, whitening",
      "description": "Professional hygiene from 4,500 RUB, cavity treatment from 7,000 RUB, whitening 20,000 RUB. Answers to common questions. GAM Clinic, St. Petersburg."
    },
    "gallery": {
      "title": "Before and after: hygiene and caries work",
      "description": "Photos before and after professional hygiene and cavity treatment under a rubber dam. Dentist in St. Petersburg."
    },
    "diplomas": {
      "title": "Dentist diplomas and certificates",
      "description": "Dentist diploma, primary accreditation valid to 2030, dental hygienist admission and seminar certificates: document scans."
    },
    "education": {
      "title": "Education and qualification",
      "description": "From nursing-staff admission to accreditation in general practice dentistry: dates, documents and seminars."
    },
    "articles": {
      "title": "Articles on dental health",
      "description": "Professional hygiene, cavity treatment, the rubber dam and whitening: plain-language articles by a dentist with Cochrane and PubMed references."
    },
    "tutorials": {
      "title": "Dental health video tutorials",
      "description": "Short educational videos about dental health and oral care from the SaySmile dentist."
    },
    "contact": {
      "title": "Book a dentist in St. Petersburg",
      "description": "GAM Clinic, Ligovsky Ave. 232, St. Petersburg. Open daily 9:00–21:00. Book via Telegram, WhatsApp, phone +7 993 981-31-83 or email."
    }
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
