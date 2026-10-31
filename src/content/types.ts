export interface ServiceItem { title: string; text: string; detail: string; time: string; price: string }
export interface SoonItem { title: string; text: string }
export interface TimelineItem { when: string; title: string; text: string }

export interface PagesContent {
  about: { lead: string; facts: { title: string; text: string }[] };
  services: { lead: string; items: ServiceItem[]; soonTitle: string; soon: SoonItem[]; note: string; book: string; includes: string };
  gallery: { lead: string; soon: string };
  diplomas: { lead: string; soon: string };
  education: { lead: string; timeline: TimelineItem[]; extra: string };
  tutorials: { lead: string; soon: string };
  contact: { lead: string; hoursTitle: string; hours: string; addressTitle: string; address: string; route: string };
}
