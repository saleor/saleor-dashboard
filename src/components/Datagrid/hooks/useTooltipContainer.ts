import { useState } from "react";

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UseTooltipContainerState {
  title: string;
  bounds: Bounds;
}

export const useTooltipContainer = () => {
  const [tooltip, setTooltipState] = useState<UseTooltipContainerState | undefined>(undefined);
  const setTooltip = (title: string, bounds: Bounds) => {
    setTooltipState({
      title,
      bounds,
    });
  };
  const clearTooltip = () => {
    setTooltipState(undefined);
  };

  return { tooltip, setTooltip, clearTooltip };
};
