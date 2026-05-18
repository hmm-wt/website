/**
 * Figure reveal observer.
 *
 * Marks .imfig and .ds (DataSection) elements as revealed once they enter the
 * viewport. CSS in each component fades + lifts the inner body on that flag.
 * Chrome (eyebrow, title, source row) paints from first paint to avoid layout
 * shift.
 *
 * Reduced motion: bail in the observer and mark everything revealed at boot
 * so the no-op CSS state applies uniformly.
 */

const SELECTOR = '.imfig:not([data-imfig-revealed]), .ds:not([data-imfig-revealed]), .sb__item:not([data-imfig-revealed]), .cwt:not([data-imfig-revealed])';

function markRevealed(el: Element) {
  el.setAttribute('data-imfig-revealed', 'true');
}

function initReveal() {
  const figures = document.querySelectorAll<HTMLElement>(SELECTOR);
  if (!figures.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || typeof IntersectionObserver === 'undefined') {
    figures.forEach(markRevealed);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          markRevealed(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );

  figures.forEach((fig) => io.observe(fig));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReveal);
} else {
  initReveal();
}
document.addEventListener('astro:page-load', initReveal);

export {};
