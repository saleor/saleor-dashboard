import { useCallback, useEffect, useRef, useState } from "react";

import { type ChannelSectionId } from "./channelSectionIds";
import { resolveActiveSectionIndex } from "./resolveActiveSectionIndex";

interface UseChannelSectionScrollSpyArgs {
  sectionIds: ChannelSectionId[];
}

/** Offset from the content scrollport top used as the “current section” line. */
const SECTION_MARKER_OFFSET_PX = 48;

const getScrollParent = (element: HTMLElement | null): HTMLElement | null => {
  let parent = element?.parentElement ?? null;

  while (parent) {
    const { overflowY } = getComputedStyle(parent);

    if (overflowY === "auto" || overflowY === "scroll") {
      return parent;
    }

    parent = parent.parentElement;
  }

  return null;
};

const resolveActiveSectionId = (
  root: HTMLElement,
  elements: HTMLElement[],
): ChannelSectionId | undefined => {
  const index = resolveActiveSectionIndex({
    sectionTops: elements.map(element => element.getBoundingClientRect().top),
    markerY: root.getBoundingClientRect().top + SECTION_MARKER_OFFSET_PX,
    nearBottom: root.scrollTop + root.clientHeight >= root.scrollHeight - 4,
  });

  if (index < 0) {
    return undefined;
  }

  return elements[index]?.id as ChannelSectionId | undefined;
};

/**
 * Scroll a section into view inside DetailPageLayout.Content only.
 * Avoid `scrollIntoView` — it also scrolls outer ancestors and shifts TopNav.
 */
export const scrollToChannelSection = (sectionId: ChannelSectionId): void => {
  const element = document.getElementById(sectionId);

  if (!element) {
    return;
  }

  const root = getScrollParent(element);

  if (!root) {
    return;
  }

  const scrollMarginTop = Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
  const rootRect = root.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const nextTop = root.scrollTop + (elementRect.top - rootRect.top) - scrollMarginTop;

  root.scrollTo({ top: Math.max(0, nextTop), behavior: "smooth" });
};

/**
 * Tracks which channel section is in view via scroll position (stable; no
 * IntersectionObserver thrash). Click selection locks until smooth scroll ends.
 */
export const useChannelSectionScrollSpy = ({
  sectionIds,
}: UseChannelSectionScrollSpyArgs): {
  activeId: ChannelSectionId | undefined;
  selectSection: (sectionId: ChannelSectionId) => void;
} => {
  const [activeId, setActiveId] = useState<ChannelSectionId | undefined>(sectionIds[0]);
  const activeIdRef = useRef(activeId);
  const lockedUntilRef = useRef(0);

  useEffect(
    function syncActiveIdRef() {
      activeIdRef.current = activeId;
    },
    [activeId],
  );

  useEffect(
    function syncActiveSectionOnScroll() {
      if (sectionIds.length === 0) {
        return;
      }

      const elements = sectionIds
        .map(id => document.getElementById(id))
        .filter((el): el is HTMLElement => !!el);

      if (elements.length === 0) {
        return;
      }

      const root = getScrollParent(elements[0]);

      if (!root) {
        return;
      }

      let frameId = 0;

      const updateActiveSection = (): void => {
        if (Date.now() < lockedUntilRef.current) {
          return;
        }

        const nextId = resolveActiveSectionId(root, elements);

        if (nextId && nextId !== activeIdRef.current) {
          activeIdRef.current = nextId;
          setActiveId(nextId);
        }
      };

      const onScroll = (): void => {
        cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(updateActiveSection);
      };

      updateActiveSection();
      root.addEventListener("scroll", onScroll, { passive: true });

      return function removeChannelSectionScrollListener(): void {
        cancelAnimationFrame(frameId);
        root.removeEventListener("scroll", onScroll);
      };
    },
    [sectionIds],
  );

  const selectSection = useCallback((sectionId: ChannelSectionId) => {
    activeIdRef.current = sectionId;
    setActiveId(sectionId);
    // Ignore spy updates while smooth scroll is in progress.
    lockedUntilRef.current = Date.now() + 900;
    scrollToChannelSection(sectionId);
  }, []);

  return { activeId, selectSection };
};
