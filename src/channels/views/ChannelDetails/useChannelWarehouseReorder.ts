import { type ChannelWarehouse } from "@dashboard/channels/pages/ChannelDetailsPage/types";
import { calculateItemsOrderMoves } from "@dashboard/channels/views/ChannelDetails/handlers";
import {
  type ChannelErrorFragment,
  useChannelReorderWarehousesMutation,
  type WarehouseFragment,
} from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { extractMutationErrors } from "@dashboard/misc";
import getChannelsErrorMessage from "@dashboard/utils/errors/channels";
import { useIntl } from "react-intl";

export const useChannelWarehousesReorder = () => {
  const notify = useNotifier();
  const intl = useIntl();

  const [reorderChannelWarehouses, reorderChannelWarehousesOpts] =
    useChannelReorderWarehousesMutation();

  const handleChannelWarehousesReorder = async ({
    warehousesToDisplay,
    warehouses,
    channelId,
  }: {
    channelId: string;
    warehouses: WarehouseFragment[];
    warehousesToDisplay: ChannelWarehouse[];
  }): Promise<ChannelErrorFragment[]> => {
    const moves = calculateItemsOrderMoves(warehouses, warehousesToDisplay);

    if (!moves.length) {
      return [];
    }

    const errors = await extractMutationErrors(
      reorderChannelWarehouses({
        variables: {
          channelId,
          moves,
        },
      }),
    );

    errors.forEach(error =>
      notify({
        status: "error",
        text: getChannelsErrorMessage(error, intl),
      }),
    );

    return errors;
  };

  return {
    reorderChannelWarehouses: handleChannelWarehousesReorder,
    reorderChannelWarehousesOpts,
  };
};
