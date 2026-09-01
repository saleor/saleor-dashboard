import { type NavigationPin } from "./types";

export const getNavigationPinItemId = (pin: NavigationPin): string => `${pin.target}:${pin.id}`;

export const findNavigationPinByItemId = (
  pins: readonly NavigationPin[],
  itemId: string,
): NavigationPin | undefined => pins.find(pin => getNavigationPinItemId(pin) === itemId);
