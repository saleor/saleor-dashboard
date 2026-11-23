import { type ProductVariantSibling } from "@dashboard/products/hooks/useProductVariantSiblings";
import { type RefObject, useLayoutEffect, useMemo, useState } from "react";

type PinnedActiveReason = "not-loaded" | "out-of-viewport";

interface UsePinnedActiveVariantProps {
  currentId?: string;
  currentVariant: ProductVariantSibling | null;
  variants: ProductVariantSibling[];
  scrollContainerRef: RefObject<HTMLDivElement>;
  /**
   * False while there is no list to compare the open variant against: its first page is
   * still loading, or the list is folded away. Nothing is pinned then.
   */
  enabled: boolean;
}

interface UsePinnedActiveVariantResult {
  shouldPin: boolean;
  pinnedVariant: ProductVariantSibling | null;
  pinReason: PinnedActiveReason | null;
}

interface ViewportVisibility {
  /** Variant id this measurement belongs to. */
  forId: string | undefined;
  /** null = not measured yet for `forId`. */
  inViewport: boolean | null;
}

/**
 * Whether any part of the row shows inside the list's scroll area. Null when the list takes
 * no space (hidden, or not laid out), where there is nothing to be in or out of view of.
 */
const measureRowVisibility = (container: HTMLElement, row: HTMLElement): boolean | null => {
  const containerRect = container.getBoundingClientRect();

  if (containerRect.height === 0) {
    return null;
  }

  const rowRect = row.getBoundingClientRect();

  return rowRect.bottom > containerRect.top && rowRect.top < containerRect.bottom;
};

/**
 * Pin the current variant above the scroll list when it is not visible —
 * either beyond the loaded pages, or loaded but scrolled out of the viewport.
 */
export const usePinnedActiveVariant = ({
  currentId,
  currentVariant,
  variants,
  scrollContainerRef,
  enabled,
}: UsePinnedActiveVariantProps): UsePinnedActiveVariantResult => {
  const loadedActive = useMemo(
    () => (currentId ? (variants.find(variant => variant.id === currentId) ?? null) : null),
    [currentId, variants],
  );

  const [visibility, setVisibility] = useState<ViewportVisibility>({
    forId: undefined,
    inViewport: null,
  });

  // Drop stale measurements as soon as the selection changes so a previous
  // "out of view" result cannot flash a pin for the newly clicked row.
  if (currentId !== visibility.forId) {
    setVisibility({ forId: currentId, inViewport: null });
  }

  const isInViewport = visibility.forId === currentId ? visibility.inViewport : null;

  useLayoutEffect(
    function trackActiveRowVisibility() {
      // Without a row there is nothing to measure: a variant beyond the loaded pages is
      // pinned for that reason alone, and must not leave an "out of view" behind for
      // the moment its row does appear.
      if (!enabled || !currentId || !loadedActive) {
        return;
      }

      const container = scrollContainerRef.current;
      const row = container?.querySelector<HTMLElement>(
        `[data-variant-id="${CSS.escape(currentId)}"]`,
      );

      if (!container || !row) {
        return;
      }

      const report = (inViewport: boolean | null): void => {
        setVisibility(previous =>
          previous.forId === currentId && previous.inViewport === inViewport
            ? previous
            : { forId: currentId, inViewport },
        );
      };

      // Measure before the browser paints, so the list never shows a pin it is about to
      // take back (or the reverse). The observer then follows scrolling.
      report(measureRowVisibility(container, row));

      const observer = new IntersectionObserver(
        ([entry]) => {
          // A row taken out of the list reports "not intersecting" on its way out; that
          // says nothing about the row that replaces it.
          if (entry && row.isConnected) {
            report(entry.isIntersecting);
          }
        },
        { root: container, threshold: 0 },
      );

      observer.observe(row);

      return () => observer.disconnect();
    },
    [enabled, currentId, loadedActive, scrollContainerRef, variants.length],
  );

  const pinnedVariant = loadedActive ?? currentVariant;
  const pinReason: PinnedActiveReason | null = !pinnedVariant
    ? null
    : loadedActive
      ? "out-of-viewport"
      : "not-loaded";

  // Not loaded → always pin. Loaded → pin only after we know it is out of view
  // (never while measurement is still null — that caused the click flash).
  const shouldPin = Boolean(
    enabled &&
    currentId &&
    pinnedVariant &&
    (pinReason === "not-loaded" || (pinReason === "out-of-viewport" && isInViewport === false)),
  );

  return {
    shouldPin,
    pinnedVariant: shouldPin ? pinnedVariant : null,
    pinReason: shouldPin ? pinReason : null,
  };
};
