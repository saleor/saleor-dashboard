import { ChannelWarehouse } from "@dashboard/channels/pages/ChannelDetailsPage/types";
import { calculateItemsOrderMoves } from "@dashboard/channels/views/ChannelDetails/handlers";
import { useChannelReorderWarehousesMutation, WarehouseFragment } from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import getChannelsErrorMessage from "@dashboard/utils/errors/channels";
import { useIntl } from "react-intl";

export const useChannelWarehousesReorder = () => {
  const notify = useNotifier();
  const intl = useIntl();

  const [reorderChannelWarehouses, reorderChannelWarehousesOpts] =
    useChannelReorderWarehousesMutation({
      onCompleted: data => {
        const errors = data?.channelReorderWarehouses?.errors ?? [];

        if (errors.length) {
          errors.forEach(error =>
            notify({
              status: "error",
              text: getChannelsErrorMessage(error, intl),
            }),
          );
        }
      },
    });

  const handleChannelWarehousesReorder = ({
    warehousesToDisplay,
    warehouses,
    channelId,
  }: {
    channelId: string;
    warehouses: WarehouseFragment[];
    warehousesToDisplay: ChannelWarehouse[];
  }) => {
    const moves = calculateItemsOrderMoves(warehouses, warehousesToDisplay);

    if (!moves.length) {
      return;
    }

    return reorderChannelWarehouses({
      variables: {
        channelId,
        moves,
      },
    });
  };

  return {
    reorderChannelWarehouses: handleChannelWarehousesReorder,
    reorderChannelWarehousesOpts,
  };
};
