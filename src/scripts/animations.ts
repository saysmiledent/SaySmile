// Animation system (GSAP). One entry point, used by the Base layout.
// - full effects on desktop, lighter on mobile
// - nothing animates when the visitor prefers reduced motion
// Mark elements in markup:
//   data-reveal               fade + rise when scrolled into view
//   data-reveal="left|right"  slide in from a side (flipped automatically in RTL)
//   data-reveal-group         children with data-reveal animate one after another
//   data-parallax="0.2"       gentle vertical parallax (desktop only)
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 768px)').matches;
  const rtl = document.documentElement.dir === 'rtl';

  if (reduced) {
    gsap.set('[data-reveal]', { opacity: 1 });
    return;
  }

  const distance = mobile ? 16 : 40;
  const duration = mobile ? 0.5 : 0.9;

  const fromVars = (kind: string | null) => {
    const sign = rtl ? -1 : 1;
    if (kind === 'left') return { x: -distance * sign, y: 0 };
    if (kind === 'right') return { x: distance * sign, y: 0 };
    return { x: 0, y: distance };
  };

  // Groups: stagger children
  gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>('[data-reveal]');
    items.forEach((el) => el.setAttribute('data-reveal-done', 'group'));
    gsap.fromTo(
      items,
      { opacity: 0, ...fromVars(null) },
      {
        opacity: 1, x: 0, y: 0, duration, ease: 'power3.out',
        stagger: mobile ? 0.06 : 0.12,
        scrollTrigger: { trigger: group, start: 'top 85%', once: true },
      },
    );
  });

  // Single elements
  gsap.utils
    .toArray<HTMLElement>('[data-reveal]:not([data-reveal-done])')
    .forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, ...fromVars(el.getAttribute('data-reveal') || null) },
        {
          opacity: 1, x: 0, y: 0, duration, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        },
      );
    });

  // Parallax: desktop only
  if (!mobile) {
    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.dataset.parallax || '0.2');
      gsap.to(el, {
        yPercent: -speed * 100,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }
}
