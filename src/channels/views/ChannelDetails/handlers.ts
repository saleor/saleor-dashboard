import {
  ChannelReorderWarehousesMutationVariables,
  WarehouseFragment,
} from "@saleor/graphql";
import { ReorderEvent } from "@saleor/types";

export function createChannelWarehousesReorderHandler(
  channelId: string,
  warehouses: WarehouseFragment[],
  reorderChannelWarehouses: (
    variables: ChannelReorderWarehousesMutationVariables,
  ) => void,
) {
  return ({ newIndex, oldIndex }: ReorderEvent) => {
    const oldWarehousesOrder = [...warehouses];

    reorderChannelWarehouses({
      move: {
        id: oldWarehousesOrder[oldIndex].id,
        sortOrder: newIndex - oldIndex,
      },
      channelId,
    });
  };
}
