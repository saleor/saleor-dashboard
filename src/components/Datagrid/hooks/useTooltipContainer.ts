import { type Item } from "@glideapps/glide-data-grid";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type TooltipSide = "top" | "right" | "bottom" | "left";
export type TooltipAlign = "center" | "end" | "start";

interface UseTooltipContainerState {
  align?: TooltipAlign;
  content: ReactNode;
  bounds: Bounds;
  location: Item;
  side?: TooltipSide;
}

/** Matches typical hover-tooltip latency — long enough to avoid flash while scanning. */
export const CELL_TOOLTIP_SHOW_DELAY_MS = 400;

export const useTooltipContainer = () => {
  const [tooltip, setTooltipState] = useState<UseTooltipContainerState | undefined>(undefined);
  const showTimeoutRef = useRef<number>();
  const tooltipRef = useRef(tooltip);

  const clearShowTimeout = useCallback(() => {
    window.clearTimeout(showTimeoutRef.current);
  }, []);

  useEffect(
    function syncTooltipRef() {
      tooltipRef.current = tooltip;
    },
    [tooltip],
  );

  useEffect(
    function clearShowTimeoutOnUnmount() {
      return () => clearShowTimeout();
    },
    [clearShowTimeout],
  );

  const clearTooltip = useCallback(() => {
    clearShowTimeout();
    setTooltipState(undefined);
  }, [clearShowTimeout]);

  const setTooltip = useCallback(
    (
      content: ReactNode,
      bounds: Bounds,
      location: Item,
      side?: TooltipSide,
      align?: TooltipAlign,
    ) => {
      clearShowTimeout();
      setTooltipState({
        content,
        bounds,
        location,
        side,
        align,
      });
    },
    [clearShowTimeout],
  );

  /**
   * Delayed open for cell hover. If a tooltip is already open, updates immediately
   * so scanning adjacent cells stays responsive after the first pause.
   */
  const scheduleTooltip = useCallback(
    (
      content: ReactNode,
      bounds: Bounds,
      location: Item,
      side?: TooltipSide,
      align?: TooltipAlign,
    ) => {
      clearShowTimeout();

      const next: UseTooltipContainerState = {
        content,
        bounds,
        location,
        side,
        align,
      };

      if (tooltipRef.current) {
        setTooltipState(next);

        return;
      }

      showTimeoutRef.current = window.setTimeout(() => {
        setTooltipState(next);
      }, CELL_TOOLTIP_SHOW_DELAY_MS);
    },
    [clearShowTimeout],
  );

  // Header click tooltips stay open until dismissed — clear on outside pointer or Escape.
  // Defer listener attach so the opening click is not treated as a dismiss.
  useEffect(
    function dismissTooltipOnOutsideInteraction() {
      if (!tooltip) {
        return;
      }

      const onPointerDown = () => {
        clearTooltip();
      };
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          clearTooltip();
        }
      };

      const attachId = window.setTimeout(() => {
        window.addEventListener("pointerdown", onPointerDown, true);
      }, 0);

      window.addEventListener("keydown", onKeyDown);

      return () => {
        window.clearTimeout(attachId);
        window.removeEventListener("pointerdown", onPointerDown, true);
        window.removeEventListener("keydown", onKeyDown);
      };
    },
    [clearTooltip, tooltip],
  );

  return { tooltip, setTooltip, scheduleTooltip, clearTooltip };
};
