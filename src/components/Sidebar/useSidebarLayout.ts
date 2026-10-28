import { useCallback, useSyncExternalStore } from "react";

import { type SidebarBreakpoint } from "./SidebarContext";

/**
 * - `drawer`: the navigation opens over the page from a menu button.
 * - `column`: the full sidebar, which the viewer can collapse to the rail.
 */
export type SidebarLayout = "drawer" | "column";

const COLUMN_QUERY: Record<SidebarBreakpoint, string> = {
  default: "(min-width: 1024px)",
  // Pages with wide content (e.g. refunds) give up the full sidebar sooner.
  wide: "(min-width: 1200px)",
};

const canMatchMedia = (): boolean => typeof window.matchMedia === "function";

const getLayout = (breakpoint: SidebarBreakpoint): SidebarLayout => {
  if (!canMatchMedia()) {
    return "column";
  }

  return window.matchMedia(COLUMN_QUERY[breakpoint]).matches ? "column" : "drawer";
};

/** Rendering one layout (instead of hiding the others with CSS) mounts the menu, and its hotkeys, once. */
export const useSidebarLayout = (breakpoint: SidebarBreakpoint): SidebarLayout => {
  const subscribe = useCallback(
    (onChange: () => void): (() => void) => {
      if (!canMatchMedia()) {
        return () => {};
      }

      const query = window.matchMedia(COLUMN_QUERY[breakpoint]);

      query.addEventListener("change", onChange);

      return (): void => query.removeEventListener("change", onChange);
    },
    [breakpoint],
  );

  return useSyncExternalStore(subscribe, () => getLayout(breakpoint));
};
