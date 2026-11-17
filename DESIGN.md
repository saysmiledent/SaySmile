# DESIGN.md: SaySmile v2

Direction file for the SaySmile site (dentist Dr. Seivan, GAM Clinic, St. Petersburg).
Read this first for any UI, copy or motion work, then apply the antislop filter on top.

Dial: ENERGY 3 on the home page, ENERGY 2 on inner pages / RHYTHM 3 / MOTION 3 home, 2 inner pages, 1 on mobile

## Identity

- Page kind: personal site of a practising dentist. It introduces him, shows his work and path, and makes it easy to write to him.
- Audience: Russian-speaking patients in St. Petersburg (main). Persian speakers, migrants and people in Iran (secondary).
- Languages: Russian (default), Farsi, English. Same structure in all three.
- Feeling: calm, warm, trustworthy, with a modern and alive look. A patient should relax on the first screen and feel that something is moving gently, not shouting.
- Identity motif: the anatomical molar drawn in particles (crown, two roots, pulp and canals) with ink drifting off it, as on the home page; a soft arch for the portrait window on the About page. Pistachio and green for enamel, cappuccino for roots. Realistic only: no cartoon teeth or icons in the motif.
- One accent: cappuccino for actions. Pistachio is the supporting colour for tags and calm surfaces.

## Palette (60-30-10)

Light:
- Main background (60): Crisp White `#FFFFFF`
- Secondary background and boxes (30): Pistachio Mist `#F2F7F0`
- Lines and frames: Brushed Silver `#E5E7EB`
- Main colour and buttons (10): Cappuccino `#9A7B66`, text on it `#FFFFFF`, hover Deep Mocha `#846652`
- Supporting colour and tags (10): Soft Pistachio `#B2C9AB`, dark green text on tags `#5C7A54`
- Text and headings: Graphite Charcoal `#27272A`
- Secondary text: Cool Slate Grey `#64748B`

Dark mode (boutique, lets the particle molar glow):
- Background `#141815`, cards `#1E2420`, lines `#2E3630`
- Lighter cappuccino `#B5927B`, pistachio `#B2C9AB`, text `#F8FAFC`

Rules: both themes must work everywhere. Text must pass WCAG AA contrast (4.5:1 normal, 3:1 large), including text over photos and over the hero background.

## Typography

- Latin and Cyrillic: Onest Variable. Farsi: Vazirmatn Variable (line height about 1.9, no letter spacing, no letter splitting in animations).
- Moderate sizes. Page titles about 2.2 to 4.6rem, section titles about 1.7 to 2.6rem. No giant display type except the one big brand word in the hero and footer.
- Body text near 65 characters wide.

## Layout

- Header: floating rounded bar. Logo at the inline start, menu and tools at the inline end. This mirrors by language:
  - Farsi (RTL): logo on the right, menu, language buttons and theme toggle on the left.
  - Russian and English (LTR): logo on the left, menu and buttons on the right.
- Menu items are only real pages: About, Services, Before/after, Diplomas, Education, Articles, Tutorials (marked as coming soon until filled), Contact.
- Home page (reference: Dantora on GetLayers, chosen by the doctor on 2026-11-18; the whole site moves to this style, home page first): loader with a progress ring once per session; hero with a light large headline, short text, booking + services buttons and site links, and the particle molar overflowing the opposite side; a centred statement that slides over the hero, with result photos trailing the pointer; services as tall numbered cards on a rail that travels sideways while scrolling (swipe row on phones); a large photo that opens to full width, the doctor in figures (counted from site data) and a paragraph that darkens word by word; the doctor row (deep green card, portrait, diploma, accreditation); a message form that opens Telegram or WhatsApp, with the molar behind. Code: `src/sections/home/`.
- Inner pages: a short animated page header, then colour sheets that change from section to section. Never plain brown top, white middle, brown bottom.
- Sections must differ from each other (RHYTHM 3), and each exists because the content needs it.
- Mobile: light. Short fades only, no parallax, no tilt, no custom cursor, native scroll. Home: fewer particles, the tooth under the buttons, services as a swipe row, no photo trail.

## Motion

- Home: high energy. The molar sways around its cheek-side view and sheds ink from moving vents; the pointer parts tooth and ink; headings rise word by word; sections slide over each other. Small uppercase labels, light (350) large headings and pill buttons follow the reference.
- Inner pages: medium. Reveals on scroll, sticky stacked cards, timeline that draws itself, counters, tilt on cards for fine pointers.
- Mobile: light. Short fades only, no parallax, no tilt, no custom cursor, native scroll. On the home page the beads gather once and then rest; they move only when touched.
- Every motion has a purpose (guide the eye, show order, give feedback). `prefers-reduced-motion` turns it off.

## Copy rules (ru, fa, en)

- Only claims the doctor has confirmed. No invented statistics, rankings, awards, years of experience, patient counts or reviews. No testimonials unless they are real and approved.
- Confirmed facts that may appear: treatment under local anaesthesia with pauses on request; drinks for patients at the clinic; clinic open daily 9:00 to 21:00; role dental therapist-prosthodontist (ru: Стоматолог-терапевт-ортопед); GAM Clinic, Ligovsky pr. 232; diploma, accreditation and certificates shown on the diplomas and education pages; prices marked "from" as listed on the services page.
- Removed on purpose: the phrase about the clinic having a CT machine. It must not appear anywhere on the site, in any language, including SEO text and llms files.
- Plain, warm, specific sentences. No em dashes. No marketing buzzwords. Calls to action name the real action (Записаться, Написать в Telegram).
- Farsi text is read once by the doctor before it is final.

## Contact priority

Telegram first (t.me/saySmaile), WhatsApp second (+79522222459), email third (dr.seivan@mail.ru), phone fourth (+79939813183).

## Not now

The rigged 3D character waits for logo-free images from the doctor. Until then the About page uses the photo-frame portrait (`src/sections/about/Portrait.astro`). Tutorials: Farsi only. The hub groups topics by library category; each topic page holds the reel, the carousel slides (with their text), a FAQ and the related research articles, and those article pages link back. A language without topics falls back to the "coming soon" stage.
