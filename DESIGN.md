# DESIGN.md: SaySmile v2

Direction file for the SaySmile site (dentist Dr. Seivan, GAM Clinic, St. Petersburg).
Read this first for any UI, copy or motion work, then apply the antislop filter on top.

Dial: ENERGY 3 on the home page, ENERGY 2 on inner pages / RHYTHM 3 / MOTION 3 home, 2 inner pages, 1 on mobile

## Identity

- Page kind: personal site of a practising dentist. It introduces him, shows his work and path, and makes it easy to write to him.
- Audience: Russian-speaking patients in St. Petersburg (main). Persian speakers, migrants and people in Iran (secondary).
- Languages: Russian (default), Farsi, English. Same structure in all three.
- Feeling: calm, warm, trustworthy, with a modern and alive look. A patient should relax on the first screen and feel that something is moving gently, not shouting.
- Identity motif: a soft arch (the sculpture's niche on the home page, the portrait window on the About page) and the tooth shape, in cappuccino and pistachio. Rounded colour "sheets" that stack over each other as you scroll.
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

Dark mode (boutique, lets the bead sculpture glow):
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
- Home page: only the interactive hero and the footer. The hero is the brand word read as a sentence, "Say [sculpture] Smile": between the two words stands an arch with a tooth built from small beads (canvas, `src/sections/hero/field.ts`). Under it: the Tooth / Smile switch, the doctor's name and role, the booking button and two messenger chips. No photo of the doctor on the home page: his live portrait (head follows the cursor) is on the About page. Do NOT repeat the menu as a list or cards below the hero. Each section lives on its own page.
- Inner pages: a short animated page header, then colour sheets that change from section to section. Never plain brown top, white middle, brown bottom.
- Sections must differ from each other (RHYTHM 3), and each exists because the content needs it.
- Mobile: full-screen menu, single column, tap targets at least 44px, no horizontal scroll.

## Motion

- Home: high energy, spent on one thing, the bead sculpture. On load the word opens and the beads gather into a tooth. The pointer pushes beads aside and they spring back; a press on the sculpture or the Tooth / Smile switch rebuilds them into a smile; left alone on desktop the shape changes every few seconds (pause button stops it); on scroll the beads spread and fade. The brand letters lift slightly under the pointer. No other decoration in the hero.
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
