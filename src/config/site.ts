// Single place for contact details. Priority on the site:
// Telegram -> WhatsApp -> email -> phone call.
// TODO: fill in the empty values (Telegram, email) before launch.
export const site = {
  name: 'SaySmile',
  clinic: 'GAM Clinic',
  city: 'St. Petersburg',
  contacts: {
    telegram: '', // e.g. 'https://t.me/username'
    whatsapp: '79522222459', // +7 952 222-24-59
    email: '', // e.g. 'name@example.com'
    phone: '+79522222459',
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
