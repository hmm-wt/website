/**
 * Shared chart-zoom modal.
 *
 * Mobile users tap a chart's "Tap to expand" button and the chart clones
 * into a fullscreen <dialog> at native size, with horizontal scroll for
 * inspection. Used by IMFigure and by the ChartZoom wrapper for V-tier
 * components that don't sit inside an IMFigure.
 *
 * Markup contract:
 *   <button data-chart-zoom data-zoom-title="optional title">⤢</button>
 *   <div data-chart-zoom-content>... chart SVG / DOM ...</div>
 *
 * The button and the content must share a common ancestor; the script
 * looks up the nearest [data-chart-zoom-root] (preferred) or falls back
 * to the button's parent element. The content is cloned, not moved, so
 * the inline chart stays intact for non-JS / reduced-motion users.
 */

function ensureModal(): HTMLDialogElement {
  let modal = document.getElementById('chart-zoom-modal') as HTMLDialogElement | null;
  if (modal) return modal;
  modal = document.createElement('dialog');
  modal.id = 'chart-zoom-modal';
  modal.className = 'chart-zoom-modal';
  modal.innerHTML = `
    <header class="chart-zoom-modal__head">
      <p class="chart-zoom-modal__title" data-zoom-title></p>
      <button type="button" class="chart-zoom-modal__close" data-zoom-close aria-label="Close">×</button>
    </header>
    <div class="chart-zoom-modal__body" data-zoom-body></div>
    <p class="chart-zoom-modal__hint">Scroll to inspect · tap outside or press Esc to close</p>
  `;
  document.body.appendChild(modal);
  modal.querySelector('[data-zoom-close]')?.addEventListener('click', () => modal!.close());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal!.close();
  });
  return modal;
}

function openZoom(content: Element, titleText?: string) {
  const modal = ensureModal();
  const body = modal.querySelector<HTMLElement>('[data-zoom-body]');
  const titleEl = modal.querySelector<HTMLElement>('[data-zoom-title]');
  if (!body) return;
  body.innerHTML = '';
  const clone = content.cloneNode(true) as HTMLElement;
  // Strip min-width hacks from cloned SVGs so they adopt the modal sizing.
  clone.querySelectorAll('svg').forEach((svg) => {
    (svg as SVGSVGElement).style.minWidth = '';
  });
  body.appendChild(clone);
  if (titleEl) titleEl.textContent = titleText ?? '';
  if (typeof modal.showModal === 'function') modal.showModal();
  else modal.setAttribute('open', '');
}

function findContent(btn: HTMLElement): Element | null {
  // 1. Explicit root attribute: nearest [data-chart-zoom-root]
  const root = btn.closest('[data-chart-zoom-root]');
  if (root) {
    const c = root.querySelector('[data-chart-zoom-content]');
    if (c) return c;
  }
  // 2. Legacy IMFigure fallback: the .imfig__plot-inner inside the parent figure
  const figure = btn.closest('figure');
  if (figure) {
    const c = figure.querySelector('[data-chart-zoom-content]') ?? figure.querySelector('.imfig__plot-inner');
    if (c) return c;
  }
  // 3. Sibling: the next [data-chart-zoom-content] in the same parent
  const parent = btn.parentElement;
  if (parent) {
    const c = parent.querySelector('[data-chart-zoom-content]');
    if (c) return c;
  }
  return null;
}

function deriveTitle(btn: HTMLElement): string {
  const explicit = btn.dataset.zoomTitle;
  if (explicit) return explicit;
  // IMFigure legacy: pull the eyebrow label.
  const figure = btn.closest('figure.imfig');
  if (figure) {
    const label = figure.querySelector('.imfig__label');
    if (label?.textContent) return label.textContent;
  }
  // ChartZoom wrapper: pull from the nearest [data-chart-zoom-root]'s aria-label.
  const root = btn.closest('[data-chart-zoom-root]') as HTMLElement | null;
  if (root?.dataset.zoomTitle) return root.dataset.zoomTitle;
  return '';
}

function initChartZoom() {
  document.querySelectorAll<HTMLButtonElement>('[data-chart-zoom]').forEach((btn) => {
    if (btn.dataset.bound === 'true') return;
    btn.dataset.bound = 'true';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const content = findContent(btn);
      if (!content) return;
      openZoom(content, deriveTitle(btn));
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChartZoom);
} else {
  initChartZoom();
}
document.addEventListener('astro:page-load', initChartZoom);

export {};
