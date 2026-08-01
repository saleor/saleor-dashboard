import { type FormData } from "@dashboard/channels/components/ChannelForm";
import { getByUnmatchingId } from "@dashboard/misc";
import { type ReorderAction, type ReorderEvent } from "@dashboard/types";
import { move } from "@dashboard/utils/lists";

import { getUpdatedIdsWithNewId, getUpdatedIdsWithoutNewId } from "./utils";

export function createShippingZoneRemoveHandler(
  data: FormData,
  set: (data: Partial<FormData>) => void,
  triggerChange: () => void,
) {
  return (zoneId: string) => {
    triggerChange();
    set({
      ...data,
      shippingZonesIdsToAdd: getUpdatedIdsWithoutNewId(data.shippingZonesIdsToAdd, zoneId),
      shippingZonesIdsToRemove: getUpdatedIdsWithNewId(data.shippingZonesIdsToRemove, zoneId),
      shippingZonesToDisplay: data.shippingZonesToDisplay!.filter(getByUnmatchingId(zoneId)),
    });
  };
}

export function createWarehouseRemoveHandler(
  data: FormData,
  set: (data: Partial<FormData>) => void,
  triggerChange: () => void,
) {
  return (warehouseId: string) => {
    triggerChange();
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
