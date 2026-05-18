/**
 * Shared scrollytelling engine.
 *
 * Wires up any container marked with `data-scrolly`:
 *   <section data-scrolly>
 *     <div class="scrolly__viz" data-scrolly-viz></div>
 *     <div class="scrolly__rail">
 *       <div class="scrolly__stage" data-stage="s1">...</div>
 *       <div class="scrolly__stage" data-stage="s2">...</div>
 *     </div>
 *   </section>
 *
 * On each stage entering the viewport's centre band, the engine sets a
 * `data-active-stage` attribute on the container and dispatches a
 * `scrolly:enter` CustomEvent with `{ stage }`. The viz reads either signal.
 *
 * A `data-scrolly-progress` element inside the container (if present) gets
 * its inline width set to the current 0-100% completion.
 *
 * Reduced motion: stages all set active in order on load; no observer.
 */

type ScrollyDetail = { stage: string; index: number; total: number };

function initScrolly(container: HTMLElement) {
  const stages = Array.from(container.querySelectorAll<HTMLElement>('.scrolly__stage'));
  if (stages.length === 0) return;

  const progressEl = container.querySelector<HTMLElement>('[data-scrolly-progress]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced) {
    const last = stages[stages.length - 1];
    container.setAttribute('data-active-stage', last.dataset.stage ?? '');
    stages.forEach((s) => s.classList.add('scrolly__stage--active'));
    if (progressEl) progressEl.style.width = '100%';
    return;
  }

  const set = (stage: HTMLElement, index: number) => {
    const id = stage.dataset.stage ?? String(index);
    if (container.getAttribute('data-active-stage') === id) return;
    container.setAttribute('data-active-stage', id);
    stages.forEach((s) => s.classList.toggle('scrolly__stage--active', s === stage));
    const detail: ScrollyDetail = { stage: id, index, total: stages.length };
    container.dispatchEvent(new CustomEvent('scrolly:enter', { detail, bubbles: true }));
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const stage = entry.target as HTMLElement;
        const index = stages.indexOf(stage);
        if (index >= 0) set(stage, index);
      });
    },
    {
      // Stage is "active" when it crosses the viewport's vertical centre.
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0,
    }
  );

  stages.forEach((s) => observer.observe(s));

  if (progressEl) {
    const update = () => {
      const rect = container.getBoundingClientRect();
      const visible = Math.max(0, Math.min(window.innerHeight, window.innerHeight - rect.top));
      const total = rect.height + window.innerHeight;
      const pct = Math.max(0, Math.min(100, (visible / total) * 100 * (total / rect.height)));
      progressEl.style.width = pct.toFixed(1) + '%';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }
}

function bootScrolly() {
  document.querySelectorAll<HTMLElement>('[data-scrolly]').forEach(initScrolly);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootScrolly);
} else {
  bootScrolly();
}

export {};
