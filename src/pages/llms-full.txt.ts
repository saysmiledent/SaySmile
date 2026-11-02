// llms-full.txt: full text of every article in every language, for AI assistants.
import type { APIRoute } from 'astro';
import { articles } from '../content/articles';
import { libraryArticles } from '../content/library-articles';
import { localeUrl, locales } from '../i18n';
import { topics, topicLibrary } from '../content/topics';

export const GET: APIRoute = ({ site: origin }) => {
  const u = (p: string) => new URL(p, origin).href;
  const out: string[] = ['# SaySmile: articles (full text)', '', '> Author: Dr. Seivan (доктор Сейван), dentist, GAM Clinic, St. Petersburg. Informational only; contraindications exist; consult a specialist.', ''];
  for (const lang of locales) {
    out.push(`# Language: ${lang}`, '');
    for (const a of [...articles, ...libraryArticles]) {
      const t = a.text[lang];
      out.push(`## ${t.title}`, `URL: ${u(localeUrl(lang, `articles/${a.slug}/`))}`, `Published: ${a.iso}`, '', t.lead, '');
      out.push(...t.key.map((k) => `- ${k}`), '');
      for (const s of t.sections) out.push(`### ${s.h}`, ...s.p, '');
      out.push(a.lib ? 'Plain-language retelling of a published paper. Original:' : 'Sources:', ...a.refs.map((r) => `- ${r.text} https://doi.org/${r.doi} https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`), '');
    }
  }
  out.push('# Language: fa (video lessons: reel + slides)', '');
  for (const t of topics) {
    out.push(`## ${t.title}`, `URL: ${u(localeUrl('fa', `tutorials/${t.id}/`))}`, `Published: ${t.iso}`, `Instagram reel: ${t.reel.instagram}`, '', t.lead, '', t.reel.summary, ...t.reel.stages.map((x) => `- ${x.when}: ${x.what}`), '');
    t.slides.forEach((x, i) => out.push(`### ${i + 1}. ${x.title}`, x.text, ''));
    out.push('### FAQ', ...t.faq.flatMap((f) => [`Q: ${f.q}`, `A: ${f.a}`, '']));
    out.push('Related research:', ...topicLibrary(t).map((e) => `- ${e.fa.title}: ${u(localeUrl('fa', `articles/${e.slug}/`))} https://doi.org/${e.doi}`), '');
  }
  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
