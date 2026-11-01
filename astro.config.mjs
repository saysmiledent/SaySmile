import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages: https://saysmiledent.github.io/SaySmile/
export default defineConfig({
  site: 'https://saysmiledent.github.io',
  base: '/SaySmile',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !/\/SaySmile\/(en\/)?tutorials\/$/.test(page),
      i18n: { defaultLocale: 'ru', locales: { ru: 'ru-RU', fa: 'fa-IR', en: 'en-US' } },
    }),
  ],
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'fa', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
