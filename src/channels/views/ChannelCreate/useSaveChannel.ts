import { MutationFunction } from "@apollo/client";
import { useUser } from "@dashboard/auth";
import {
  ChannelCreateInput,
  ChannelCreateMutation,
  ChannelReorderWarehousesMutation,
  Exact,
  ReorderInput,
} from "@dashboard/graphql";
import { extractMutationErrors } from "@dashboard/misc";

import { calculateItemsOrderMoves } from "../ChannelDetails/handlers";

interface SaveChannelConfig {
  createChannel: MutationFunction<
    ChannelCreateMutation,
    Exact<{ input: ChannelCreateInput }>
  >;
  reorderChannelWarehouses: MutationFunction<
    ChannelReorderWarehousesMutation,
    Exact<{
      channelId: string;
      moves: ReorderInput | ReorderInput[];
    }>
  >;
  refetchUser;
}

export const useSaveChannel = ({
  createChannel,
  reorderChannelWarehouses,
}: SaveChannelConfig) => {
  const { refetchUser } = useUser();

  return async (input: ChannelCreateInput, warehousesToDisplay) => {
    const createChannelMutation = createChannel({
      variables: {
        input,
      },
    });

    const result = await createChannelMutation;
    const errors = await extractMutationErrors(createChannelMutation);

    if (!errors?.length) {
      const moves = calculateItemsOrderMoves(
        result.data?.channelCreate.channel?.warehouses,
        warehousesToDisplay,
      );

      await reorderChannelWarehouses({
        variables: {
          channelId: result.data?.channelCreate.channel?.id,
          moves,
        },
      });

      await refetchUser();
    }

    return errors;
  };
};
