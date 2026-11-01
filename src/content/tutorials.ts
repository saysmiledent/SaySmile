/**
 * Tutorial videos. Farsi only for now (ru/en pages stay out of the menu until they have videos).
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
  ru: [],
  en: [],
};

export const tutorialUi = {
  fa: { watchIg: 'دیدن در اینستاگرام', play: 'پخش ویدیو' },
  ru: { watchIg: 'Смотреть в Instagram', play: 'Смотреть видео' },
  en: { watchIg: 'Watch on Instagram', play: 'Play video' },
};
