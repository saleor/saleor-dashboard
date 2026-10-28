import { useCallback, useSyncExternalStore } from "react";

import { type SidebarBreakpoint } from "./SidebarContext";

/**
 * - `drawer`: phones; the navigation opens over the page from a menu button.
 * - `rail`: tablets and pages that ask for room; icons only, the full navigation opens over the page.
 * - `column`: the full sidebar, which the viewer can collapse to the rail.
 */
export type SidebarLayout = "drawer" | "rail" | "column";

const RAIL_QUERY = "(min-width: 768px)";
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

  if (!window.matchMedia(RAIL_QUERY).matches) {
    return "drawer";
  }

  return window.matchMedia(COLUMN_QUERY[breakpoint]).matches ? "column" : "rail";
};

/** Rendering one layout instead of hiding the others with CSS keeps the collapse shortcut to the column. */
export const useSidebarLayout = (breakpoint: SidebarBreakpoint): SidebarLayout => {
  const subscribe = useCallback(
    (onChange: () => void): (() => void) => {
      if (!canMatchMedia()) {
        return () => {};
      }

      const queries = [RAIL_QUERY, COLUMN_QUERY[breakpoint]].map(query => window.matchMedia(query));

      queries.forEach(query => query.addEventListener("change", onChange));

      return (): void => queries.forEach(query => query.removeEventListener("change", onChange));
    },
    [breakpoint],
  );

  return useSyncExternalStore(subscribe, () => getLayout(breakpoint));
};
