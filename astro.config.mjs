import { defineConfig } from 'astro/config';

// GitHub Pages: https://saysmiledent.github.io/SaySmile/
export default defineConfig({
  site: 'https://saysmiledent.github.io',
  base: '/SaySmile',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'fa', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
