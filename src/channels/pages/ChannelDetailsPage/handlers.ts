import { FormData } from "@saleor/channels/components/ChannelForm";
import { SearchData } from "@saleor/hooks/makeTopLevelSearch";
import { getParsedSearchData } from "@saleor/hooks/makeTopLevelSearch/utils";
import {
  getById,
  getByUnmatchingId,
} from "@saleor/orders/components/OrderReturnPage/utils";
import { ReorderAction, ReorderEvent } from "@saleor/types";
import { move } from "@saleor/utils/lists";

import { getUpdatedIdsWithNewId, getUpdatedIdsWithoutNewId } from "./utils";

export function createShippingZoneAddHandler(
  data: FormData,
  searchShippingZonesData: SearchData,
  set: (data: Partial<FormData>) => void,
  triggerChange: () => void,
) {
  return (zoneId: string) => {
    triggerChange();

    set({
      ...data,
      shippingZonesIdsToRemove: getUpdatedIdsWithoutNewId(
        data.shippingZonesIdsToRemove,
        zoneId,
      ),
      shippingZonesIdsToAdd: getUpdatedIdsWithNewId(
        data.shippingZonesIdsToAdd,
        zoneId,
      ),
      shippingZonesToDisplay: [
        ...data.shippingZonesToDisplay,
        getParsedSearchData({ data: searchShippingZonesData }).find(
          getById(zoneId),
        ),
      ],
    });
  };
}

export function createShippingZoneRemoveHandler(
  data: FormData,
  set: (data: Partial<FormData>) => void,
  triggerChange: () => void,
) {
  return (zoneId: string) => {
    triggerChange();

    set({
      ...data,
      shippingZonesIdsToAdd: getUpdatedIdsWithoutNewId(
        data.shippingZonesIdsToAdd,
        zoneId,
      ),
      shippingZonesIdsToRemove: getUpdatedIdsWithNewId(
        data.shippingZonesIdsToRemove,
        zoneId,
      ),
      shippingZonesToDisplay: data.shippingZonesToDisplay.filter(
        getByUnmatchingId(zoneId),
      ),
    });
  };
}

export function createWarehouseAddHandler(
  data: FormData,
  searchWarehousesData: SearchData,
  set: (data: Partial<FormData>) => void,
  triggerChange: () => void,
) {
  return (warehouseId: string) => {
    triggerChange();

    set({
      ...data,
      warehousesIdsToRemove: getUpdatedIdsWithoutNewId(
        data.warehousesIdsToRemove,
        warehouseId,
      ),
      warehousesIdsToAdd: getUpdatedIdsWithNewId(
        data.warehousesIdsToAdd,
        warehouseId,
      ),
      warehousesToDisplay: [
        ...data.warehousesToDisplay,
        getParsedSearchData({ data: searchWarehousesData }).find(
          getById(warehouseId),
        ),
      ],
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
      warehousesIdsToAdd: getUpdatedIdsWithoutNewId(
        data.warehousesIdsToAdd,
        warehouseId,
      ),
      warehousesIdsToRemove: getUpdatedIdsWithNewId(
        data.warehousesIdsToRemove,
        warehouseId,
      ),
      warehousesToDisplay: data.warehousesToDisplay.filter(
        getByUnmatchingId(warehouseId),
      ),
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
