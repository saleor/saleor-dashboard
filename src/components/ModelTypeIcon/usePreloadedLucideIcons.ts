import { useEffect, useState } from "react";

import { preloadLucideIcons } from "./loadLucideIcon";

/**
 * For canvas consumers, which draw synchronously and cannot await an icon import. Returns a
 * counter that changes once the requested icons are cached, so the caller can rebuild its cell
 * content and repaint. Until then the canvas draws the fallback glyph.
 */
export const usePreloadedLucideIcons = (names: readonly string[]): number => {
  const key = [...new Set(names)].sort().join(",");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!key) {
      return;
    }

    let cancelled = false;

    preloadLucideIcons(key.split(",")).then(() => {
      if (!cancelled) {
        setVersion(current => current + 1);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return version;
};
