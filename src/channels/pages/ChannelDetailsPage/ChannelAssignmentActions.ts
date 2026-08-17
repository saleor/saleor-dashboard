import { type MutableRefObject } from "react";

export interface ChannelAssignableItem {
  id: string;
  name: string;
}

/** Form-staged assign actions — dialogs call these instead of mutating the channel. */
export interface ChannelAssignmentActions {
  assignWarehouses: (warehouses: ChannelAssignableItem[]) => void;
  assignShippingZones: (zones: ChannelAssignableItem[]) => void;
}

export interface ChannelDisplayedAssignmentIds {
  warehouseIds: string[];
  shippingZoneIds: string[];
}

export type ChannelAssignmentActionsRef = MutableRefObject<ChannelAssignmentActions | null>;

export const assignmentIdsEqual = (
  a: ChannelDisplayedAssignmentIds,
  b: ChannelDisplayedAssignmentIds,
): boolean =>
  a.warehouseIds.length === b.warehouseIds.length &&
  a.shippingZoneIds.length === b.shippingZoneIds.length &&
  a.warehouseIds.every((id, index) => id === b.warehouseIds[index]) &&
  a.shippingZoneIds.every((id, index) => id === b.shippingZoneIds[index]);
