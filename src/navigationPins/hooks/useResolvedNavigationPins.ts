import { useMemo } from "react";

import { type NavigationPin, type PinScope, type ResolvedNavigationPin } from "../types";
import { useNavigationPins } from "./useNavigationPins";
import { usePinnedModelTypeNames } from "./usePinnedModelTypeNames";

const withScope = (pins: NavigationPin[], scope: PinScope) => pins.map(pin => ({ ...pin, scope }));

/**
 * Organization pins render before user pins. When the same model type is pinned to the same
 * section by both, the organization pin wins so the row is not duplicated.
 */
export const useResolvedNavigationPins = (): ResolvedNavigationPin[] => {
  const { userPins, organizationPins } = useNavigationPins();

  const ordered = useMemo(
    () => [...withScope(organizationPins, "organization"), ...withScope(userPins, "user")],
    [organizationPins, userPins],
  );

  const names = usePinnedModelTypeNames(ordered.map(pin => pin.id));

  return useMemo(() => {
    const seen = new Set<string>();

    return ordered.reduce<ResolvedNavigationPin[]>((acc, pin) => {
      const key = `${pin.target}:${pin.id}`;
      const name = names[pin.id];

      // No name means the model type was deleted or is unreadable — drop the row entirely.
      if (seen.has(key) || !name) {
        return acc;
      }

      seen.add(key);

      return [...acc, { ...pin, name }];
    }, []);
  }, [ordered, names]);
};
