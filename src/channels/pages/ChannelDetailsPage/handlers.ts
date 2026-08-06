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

    const shippingZonesIdsToAdd = zonesToAdd.reduce(
      (ids, zone) =>
        data.shippingZonesIdsToRemove.includes(zone.id)
          ? ids
          : getUpdatedIdsWithNewId(ids, zone.id),
      data.shippingZonesIdsToAdd,
    );
    const shippingZonesIdsToRemove = zonesToAdd.reduce(
      (ids, zone) =>
        data.shippingZonesIdsToRemove.includes(zone.id)
          ? getUpdatedIdsWithoutNewId(ids, zone.id)
          : ids,
      data.shippingZonesIdsToRemove,
    );

    set({
      ...data,
      shippingZonesIdsToRemove,
      shippingZonesIdsToAdd,
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
    const wasStagedAdd = data.shippingZonesIdsToAdd.includes(zoneId);

    set({
      ...data,
      shippingZonesIdsToAdd: getUpdatedIdsWithoutNewId(data.shippingZonesIdsToAdd, zoneId),
      shippingZonesIdsToRemove: wasStagedAdd
        ? data.shippingZonesIdsToRemove
        : getUpdatedIdsWithNewId(data.shippingZonesIdsToRemove, zoneId),
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

    const warehousesIdsToAdd = warehousesToAdd.reduce(
      (ids, warehouse) =>
        data.warehousesIdsToRemove.includes(warehouse.id)
          ? ids
          : getUpdatedIdsWithNewId(ids, warehouse.id),
      data.warehousesIdsToAdd,
    );
    const warehousesIdsToRemove = warehousesToAdd.reduce(
      (ids, warehouse) =>
        data.warehousesIdsToRemove.includes(warehouse.id)
          ? getUpdatedIdsWithoutNewId(ids, warehouse.id)
          : ids,
      data.warehousesIdsToRemove,
    );

    set({
      ...data,
      warehousesIdsToRemove,
      warehousesIdsToAdd,
      warehousesToDisplay: [...data.warehousesToDisplay, ...(warehousesToAdd as ChannelWarehouses)],
    });
  };
}

export function createWarehouseRemoveHandler(
  data: FormData,
  set: (data: Partial<FormData>) => void,
) {
  return (warehouseId: string) => {
    const wasStagedAdd = data.warehousesIdsToAdd.includes(warehouseId);

    set({
      ...data,
      warehousesIdsToAdd: getUpdatedIdsWithoutNewId(data.warehousesIdsToAdd, warehouseId),
      warehousesIdsToRemove: wasStagedAdd
        ? data.warehousesIdsToRemove
        : getUpdatedIdsWithNewId(data.warehousesIdsToRemove, warehouseId),
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
