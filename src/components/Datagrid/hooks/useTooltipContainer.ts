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

  tooltipRef.current = tooltip;

  const clearShowTimeout = useCallback(() => {
    window.clearTimeout(showTimeoutRef.current);
  }, []);

  useEffect(() => () => clearShowTimeout(), [clearShowTimeout]);

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

  return { tooltip, setTooltip, scheduleTooltip, clearTooltip };
};
