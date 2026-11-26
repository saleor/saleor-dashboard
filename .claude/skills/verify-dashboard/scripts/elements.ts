import type { Page } from "@playwright/test";

export interface ElementBox {
  x: number;
  y: number;
  w: number;
  h: number;
  tag: string;
  testId?: string;
  role?: string;
  name?: string;
  text?: string;
}

export interface ElementHitMap {
  docWidth: number;
  docHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  elements: ElementBox[];
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const ELEMENT_SELECTOR = [
  "[data-test-id]",
  "button",
  "a[href]",
  "input",
  "select",
  "textarea",
  "[role]",
  "h1",
  "h2",
  "h3",
  "h4",
  "label",
  "th",
  "td",
  "nav",
  "header",
  "main",
  "section",
  "dialog",
].join(",");

/**
 * Captures bounding boxes of visible labeled/interactive DOM elements in full-page CSS
 * coordinates so the HTML review board can map a click on a static PNG back to its
 * `data-test-id`, ARIA role, and text.
 */
export const collectElementHitMap = async (
  page: Page,
  redact: (text: string) => string,
): Promise<ElementHitMap> => {
  const raw = await page.evaluate(selector => {
    const docEl = document.documentElement;
    const body = document.body;
    const docWidth = Math.max(docEl?.scrollWidth ?? 0, body?.scrollWidth ?? 0, window.innerWidth);
    const docHeight = Math.max(
      docEl?.scrollHeight ?? 0,
      body?.scrollHeight ?? 0,
      window.innerHeight,
    );
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    const clean = (value: string | null | undefined): string | undefined => {
      if (!value) {
        return undefined;
      }

      const normalized = value.replace(/\s+/g, " ").trim();

      return normalized ? normalized.slice(0, 80) : undefined;
    };

    const nodes = Array.from(document.querySelectorAll(selector));
    const elements: ElementBox[] = [];
    const seen = new Set<string>();

    for (const node of nodes) {
      if (!(node instanceof HTMLElement)) {
        continue;
      }

      const style = window.getComputedStyle(node);

      if (
        style.display === "none" ||
        style.visibility === "hidden" ||
        Number(style.opacity) === 0
      ) {
        continue;
      }

      const rect = node.getBoundingClientRect();

      if (rect.width < 4 || rect.height < 4) {
        continue;
      }

      const x = Math.round(rect.left + scrollX);
      const y = Math.round(rect.top + scrollY);
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);

      if (x + w < 0 || y + h < 0) {
        continue;
      }

      const testId = clean(node.getAttribute("data-test-id"));
      const role = clean(node.getAttribute("role"));
      const ariaLabel = clean(node.getAttribute("aria-label"));
      const placeholder =
        node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement
          ? clean(node.placeholder)
          : undefined;
      const name = ariaLabel ?? placeholder;
      const text = clean(node.innerText);

      // Skip anonymous container elements that carry no helpful identifier.
      const tag = node.tagName.toLowerCase();

      if (
        !testId &&
        !role &&
        !name &&
        !text &&
        ["section", "main", "nav", "header"].includes(tag)
      ) {
        continue;
      }

      const key = `${x}:${y}:${w}:${h}:${tag}:${testId ?? ""}`;

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      elements.push({
        x,
        y,
        w,
        h,
        tag,
        ...(testId ? { testId } : {}),
        ...(role ? { role } : {}),
        ...(name ? { name } : {}),
        ...(text ? { text } : {}),
      });

      if (elements.length >= 1500) {
        break;
      }
    }

    return {
      docWidth,
      docHeight,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      elements,
    };
  }, ELEMENT_SELECTOR);

  return {
    ...raw,
    elements: raw.elements.map(el => ({
      ...el,
      ...(el.name ? { name: redact(el.name) } : {}),
      ...(el.text ? { text: redact(el.text) } : {}),
    })),
  };
};

const specificityScore = (el: ElementBox): number => {
  const area = Math.max(1, el.w * el.h);
  // Prefer smaller, tighter boxes; give a tie-breaking bonus for explicit `data-test-id`
  // and semantic roles so a button beats its anonymous wrapper.
  const bonus =
    (el.testId ? 0.55 : 1) * (el.role || el.tag === "button" || el.tag === "a" ? 0.8 : 1);

  return area * bonus;
};

/** Returns the most specific element containing CSS coordinate `(x, y)`. */
export const resolveElementAtPoint = (
  elements: readonly ElementBox[],
  x: number,
  y: number,
): ElementBox | undefined => {
  const hits = elements.filter(
    el => x >= el.x && x <= el.x + el.w && y >= el.y && y <= el.y + el.h,
  );

  if (hits.length === 0) {
    return undefined;
  }

  hits.sort((a, b) => specificityScore(a) - specificityScore(b));

  return hits[0];
};

const overlapArea = (a: Rect, b: Rect): number => {
  const xOverlap = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
  const yOverlap = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

  return xOverlap * yOverlap;
};

/** Returns up to `limit` most relevant elements overlapping a dragged region box. */
export const resolveElementsInBox = (
  elements: readonly ElementBox[],
  box: Rect,
  limit = 3,
): ElementBox[] => {
  const scored = elements
    .map(el => {
      const area = overlapArea(el, box);

      if (area <= 0) {
        return undefined;
      }

      const elArea = Math.max(1, el.w * el.h);
      const coverage = area / elArea;

      return { el, coverage, score: specificityScore(el) / Math.max(0.1, coverage) };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  scored.sort((a, b) => a.score - b.score);

  return scored.slice(0, limit).map(item => item.el);
};

/** Formats an element box into a compact selector-like label for UI chips and prompts. */
export const formatElementLabel = (el: ElementBox): string => {
  const parts: string[] = [el.tag];

  if (el.testId) {
    parts.push(`[data-test-id="${el.testId}"]`);
  }

  if (el.role && el.role !== el.tag) {
    parts.push(`[role="${el.role}"]`);
  }

  const label = el.name ?? el.text;

  return label ? `${parts.join("")} ("${label}")` : parts.join("");
};
