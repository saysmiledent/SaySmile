# Sections

One folder per section (hero, about, services, gallery, diplomas, education, tutorials, contact).
Each folder holds everything for that section:

- `<Name>.astro` – the section component
- `content/` – texts (ru / fa / en)
- `assets/` – photos, vectors, videos

Add a new section: create the folder, then add it to `sectionIds` in `src/i18n/index.ts`,
to `nav` in the three `src/i18n/*.ts` files, and to `src/components/HomePage.astro`.
