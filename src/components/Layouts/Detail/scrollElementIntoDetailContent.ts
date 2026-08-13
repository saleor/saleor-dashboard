/**
 * Nearest overflow-y ancestor — on entity detail this is DetailPageLayout.Content.
 */
export const getDetailContentScrollParent = (element: HTMLElement | null): HTMLElement | null => {
  if (!element) {
    return null;
  }

  const marked = element.closest<HTMLElement>("[data-detail-content-scroll]");

  if (marked) {
    return marked;
  }

  let parent = element.parentElement;

  while (parent) {
    const { overflowY } = getComputedStyle(parent);

    if (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") {
      return parent;
    }

    parent = parent.parentElement;
  }

  return null;
};

export type DetailContentScrollAlign = "start" | "end";

const END_SCROLL_SETTLE_MS = 500;

let stopActiveEndScroll: (() => void) | null = null;

const pinScrollParentToEnd = (root: HTMLElement): void => {
  // `auto` cancels an in-progress smooth scroll from another checklist row.
  root.scrollTo({ top: root.scrollHeight, behavior: "auto" });
  root.scrollTop = root.scrollHeight;
};

const cancelActiveEndScroll = (): void => {
  stopActiveEndScroll?.();
  stopActiveEndScroll = null;
};

/**
 * Keep the content pane pinned to the bottom while `element` is still growing
 * (e.g. SEO accordion opening). A single scrollTo(scrollHeight) undershoots.
 */
const pinDetailContentToEndUntilSettled = (root: HTMLElement, element: HTMLElement): void => {
  cancelActiveEndScroll();
  pinScrollParentToEnd(root);

  if (typeof ResizeObserver === "undefined") {
    return;
  }

  let settleTimer = 0;
  const observer = new ResizeObserver(() => {
    pinScrollParentToEnd(root);
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => observer.disconnect(), 100);
  });

  observer.observe(element);

  const hardStopTimer = window.setTimeout(() => {
    cancelActiveEndScroll();
    pinScrollParentToEnd(root);
  }, END_SCROLL_SETTLE_MS);

  stopActiveEndScroll = () => {
    observer.disconnect();
    window.clearTimeout(settleTimer);
    window.clearTimeout(hardStopTimer);
  };
};

/**
 * Native `#hash` scrolling and `scrollIntoView` walk every ancestor, including
 * overflow:hidden shells, and shift TopNav out of the viewport.
 */
const resetScrollOutsideContentRoot = (contentRoot: HTMLElement): void => {
  let parent = contentRoot.parentElement;

  while (parent) {
    if (parent.scrollTop !== 0) {
      parent.scrollTop = 0;
    }

    parent = parent.parentElement;
  }

  window.scrollTo(0, 0);
};

/**
 * Scroll a node into view inside DetailPageLayout.Content only.
 * Avoid `scrollIntoView` — it also scrolls outer ancestors and shifts TopNav.
 *
 * `end` pins to the bottom of the scrollport (last sections like SEO).
 */
export const scrollElementIntoDetailContent = (
  element: HTMLElement,
  { align = "start" }: { align?: DetailContentScrollAlign } = {},
): void => {
  const root = getDetailContentScrollParent(element);

  if (!root) {
    return;
  }

  resetScrollOutsideContentRoot(root);

  if (align === "end") {
    pinDetailContentToEndUntilSettled(root, element);

    return;
  }

  cancelActiveEndScroll();

  const scrollMarginTop = Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
  const rootRect = root.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const nextTop = root.scrollTop + (elementRect.top - rootRect.top) - scrollMarginTop;

  root.scrollTo({ top: Math.max(0, nextTop), behavior: "smooth" });
};

/**
 * Scroll a node with this id into DetailPageLayout.Content only.
 * Returns false when the node is not mounted yet (settings hash deep-links retry).
 */
export const scrollToDetailSection = (sectionId: string): boolean => {
  const element = document.getElementById(sectionId);

  if (!element) {
    return false;
  }

  scrollElementIntoDetailContent(element);

  return true;
};
