import { type ProductVariantSibling } from "@dashboard/products/hooks/useProductVariantSiblings";
import { type RefObject, useLayoutEffect, useMemo, useState } from "react";

export type PinnedActiveReason = "not-loaded" | "out-of-viewport";

interface UsePinnedActiveVariantProps {
  currentId?: string;
  currentVariant: ProductVariantSibling | null;
  variants: ProductVariantSibling[];
  scrollContainerRef: RefObject<HTMLDivElement>;
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
 * Pin the current variant above the scroll list when it is not visible —
 * either not loaded yet, or loaded but scrolled out of the viewport.
 */
export const usePinnedActiveVariant = ({
  currentId,
  currentVariant,
  variants,
  scrollContainerRef,
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
    function observeActiveRowVisibility() {
      if (!currentId || !loadedActive) {
        const frame = requestAnimationFrame(() => {
          setVisibility({ forId: currentId, inViewport: false });
        });

        return () => cancelAnimationFrame(frame);
      }

      const container = scrollContainerRef.current;
      const row = container?.querySelector<HTMLElement>(
        `[data-variant-id="${CSS.escape(currentId)}"]`,
      );

      if (!container || !row) {
        const frame = requestAnimationFrame(() => {
          setVisibility({ forId: currentId, inViewport: false });
        });

        return () => cancelAnimationFrame(frame);
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry) {
            return;
          }

          setVisibility({ forId: currentId, inViewport: entry.isIntersecting });
        },
        { root: container, threshold: 0 },
      );

      observer.observe(row);

      return () => observer.disconnect();
    },
    [currentId, loadedActive, scrollContainerRef, variants.length],
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
