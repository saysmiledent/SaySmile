/**
 * Tutorial videos of the Russian Instagram page @dr.say1 (Farsi uses the topic pages in topics.ts;
 * the English page stays out of the menu until it has videos).
 * To add a video: put the file in public/videos/<id>.mp4, a cover in public/videos/<id>.jpg,
 * and add an entry here. `instagram` (optional) adds a "watch on Instagram" link.
 */
export interface TutorialVideo {
  id: string;
  title: string;
  text: string;
  /** length for display, e.g. '0:45' */
  duration?: string;
  instagram?: string;
}

export const tutorialVideos: Record<'ru' | 'fa' | 'en', TutorialVideo[]> = {
  fa: [],
  // newest first; texts follow the published captions
  ru: [
    {
      id: 'ru-scaling',
      title: 'Профгигиена портит эмаль? Нет',
      text: 'Ультразвук снимает камень, а не эмаль: эмаль самая твёрдая ткань в организме. Камень — это затвердевший налёт, щёткой его не убрать. Вредна не чистка, а камень, который остаётся на зубах.',
      duration: '0:32',
      instagram: 'https://www.instagram.com/reel/Df2d3gYksfj/',
    },
    {
      id: 'ru-intro',
      title: 'Боитесь лечить зубы? Вы не одни',
      text: 'Знакомство с доктором Сейваном: лечение под местной анестезией, пауза по вашей просьбе, план и стоимость до начала лечения, после осмотра.',
      duration: '0:35',
      instagram: 'https://www.instagram.com/reel/Df2VdU1jXrK/',
    },
  ],
  en: [],
};

export const tutorialUi = {
  fa: { watchIg: 'دیدن در اینستاگرام', play: 'پخش ویدیو', intro: '', page: '' },
  ru: { watchIg: 'Смотреть в Instagram', play: 'Смотреть видео', intro: 'Эти ролики выходят на моей странице в Instagram', page: '@dr.say1' },
  en: { watchIg: 'Watch on Instagram', play: 'Play video', intro: '', page: '' },
};
