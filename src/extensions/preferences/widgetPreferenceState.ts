import { type ResolvedPreferenceState } from "./types";

export const isWidgetShown = (state: ResolvedPreferenceState): boolean => state !== "hidden";

export const isWidgetPinned = (state: ResolvedPreferenceState): boolean => state === "pinned";

export const setWidgetShown = (
  current: ResolvedPreferenceState,
  shown: boolean,
): ResolvedPreferenceState => {
  if (!shown) {
    return "hidden";
  }

  return current === "hidden" ? "default" : current;
};

export const toggleWidgetPinned = (current: ResolvedPreferenceState): ResolvedPreferenceState => {
  if (current === "hidden") {
    return "hidden";
  }

  return current === "pinned" ? "default" : "pinned";
};
