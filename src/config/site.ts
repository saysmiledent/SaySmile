// Single place for contact details (taken from the v1 site and project notes).
// Priority on the site: Telegram -> WhatsApp -> email -> phone call.
export const site = {
  name: 'SaySmile',
  clinic: 'GAM Clinic',
  city: 'St. Petersburg',
  contacts: {
    telegram: 'https://t.me/saySmaile',
    whatsapp: '79522222459', // +7 952 222-24-59
    email: 'dr.seivan@mail.ru',
    phone: '+79939813183',
  },
  instagram: 'https://www.instagram.com/saywan_h/',
} as const;

export const contactLinks = () => {
  const c = site.contacts;
  return [
    c.telegram && { id: 'telegram', href: c.telegram },
    c.whatsapp && { id: 'whatsapp', href: `https://wa.me/${c.whatsapp}` },
    c.email && { id: 'email', href: `mailto:${c.email}` },
    c.phone && { id: 'phone', href: `tel:${c.phone}` },
  ].filter(Boolean) as { id: 'telegram' | 'whatsapp' | 'email' | 'phone'; href: string }[];
};
