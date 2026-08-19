import { type Ripple } from "@dashboard/ripples/types";
import { type ComponentType } from "react";

export type CornerRippleComponentProps = {
  /** Must be the same ripple used for host selection / storage. */
  model: Ripple;
};

export type CornerRippleEntry = {
  model: Ripple;
  Component: ComponentType<CornerRippleComponentProps>;
};

/**
 * Picks the single corner ripple to show when several are still eligible.
 * Newest `dateAdded` wins so the latest promo surfaces first; TTL for queued
 * entries only starts once their component mounts and calls setFirstSeenFlag.
 */
export const selectActiveCornerRipple = <T extends { model: Ripple }>(
  entries: readonly T[],
  getShouldShow: (ripple: Ripple) => boolean,
): T | undefined => {
  const eligible = entries.filter(entry => getShouldShow(entry.model));

  if (eligible.length === 0) {
    return undefined;
  }

  return eligible.reduce((best, current) => {
    const bestTime = best.model.dateAdded.getTime();
    const currentTime = current.model.dateAdded.getTime();

    if (currentTime > bestTime) {
      return current;
    }

    if (currentTime === bestTime && current.model.ID.localeCompare(best.model.ID) < 0) {
      return current;
    }

    return best;
  });
};
