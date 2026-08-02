import { type FormData } from "@dashboard/channels/components/ChannelForm";
import { getByUnmatchingId } from "@dashboard/misc";
import { type ReorderAction, type ReorderEvent } from "@dashboard/types";
import { move } from "@dashboard/utils/lists";

import { type ChannelShippingZones, type ChannelWarehouses } from "./types";
import { getUpdatedIdsWithNewId, getUpdatedIdsWithoutNewId } from "./utils";

type AssignableItem = { id: string; name: string };

export function createShippingZoneAddHandler(
  data: FormData,
  set: (data: Partial<FormData>) => void,
) {
  return (zones: AssignableItem[]) => {
    if (zones.length === 0) {
      return;
    }

    const existingIds = new Set(data.shippingZonesToDisplay?.map(zone => zone.id) ?? []);
    const zonesToAdd = zones.filter(zone => !existingIds.has(zone.id));

    if (zonesToAdd.length === 0) {
      return;
    }

    set({
      ...data,
      shippingZonesIdsToRemove: zonesToAdd.reduce(
        (ids, zone) => getUpdatedIdsWithoutNewId(ids, zone.id),
        data.shippingZonesIdsToRemove,
      ),
      shippingZonesIdsToAdd: zonesToAdd.reduce(
        (ids, zone) => getUpdatedIdsWithNewId(ids, zone.id),
        data.shippingZonesIdsToAdd,
      ),
      shippingZonesToDisplay: [
        ...(data.shippingZonesToDisplay ?? []),
        ...zonesToAdd,
      ] as ChannelShippingZones,
    });
  };
}

export function createShippingZoneRemoveHandler(
  data: FormData,
  set: (data: Partial<FormData>) => void,
) {
  return (zoneId: string) => {
    set({
      ...data,
      shippingZonesIdsToAdd: getUpdatedIdsWithoutNewId(data.shippingZonesIdsToAdd, zoneId),
      shippingZonesIdsToRemove: getUpdatedIdsWithNewId(data.shippingZonesIdsToRemove, zoneId),
      shippingZonesToDisplay: data.shippingZonesToDisplay!.filter(getByUnmatchingId(zoneId)),
    });
  };
}

export function createWarehouseAddHandler(data: FormData, set: (data: Partial<FormData>) => void) {
  return (warehouses: AssignableItem[]) => {
    if (warehouses.length === 0) {
      return;
    }

    const existingIds = new Set(data.warehousesToDisplay.map(warehouse => warehouse.id));
    const warehousesToAdd = warehouses.filter(warehouse => !existingIds.has(warehouse.id));

    if (warehousesToAdd.length === 0) {
      return;
    }

    set({
      ...data,
      warehousesIdsToRemove: warehousesToAdd.reduce(
        (ids, warehouse) => getUpdatedIdsWithoutNewId(ids, warehouse.id),
        data.warehousesIdsToRemove,
      ),
      warehousesIdsToAdd: warehousesToAdd.reduce(
        (ids, warehouse) => getUpdatedIdsWithNewId(ids, warehouse.id),
        data.warehousesIdsToAdd,
      ),
      warehousesToDisplay: [...data.warehousesToDisplay, ...(warehousesToAdd as ChannelWarehouses)],
    });
  };
}

export function createWarehouseRemoveHandler(
  data: FormData,
  set: (data: Partial<FormData>) => void,
) {
  return (warehouseId: string) => {
    set({
      ...data,
      warehousesIdsToAdd: getUpdatedIdsWithoutNewId(data.warehousesIdsToAdd, warehouseId),
      warehousesIdsToRemove: getUpdatedIdsWithNewId(data.warehousesIdsToRemove, warehouseId),
      warehousesToDisplay: data.warehousesToDisplay.filter(getByUnmatchingId(warehouseId)),
    });
  };
}

export function createWarehouseReorderHandler(
  data: FormData,
  set: (data: Partial<FormData>) => void,
): ReorderAction {
  return ({ oldIndex, newIndex }: ReorderEvent) => {
    const updatedWarehousesToDisplay = move(
      data.warehousesToDisplay[oldIndex],
      data.warehousesToDisplay,
      (a, b) => a.id === b.id,
      newIndex,
    );

    set({
      ...data,
      warehousesToDisplay: updatedWarehousesToDisplay,
    });
  };
}
