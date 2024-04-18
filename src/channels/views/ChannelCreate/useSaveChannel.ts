import { MutationFunction } from "@apollo/client";
import { useUser } from "@dashboard/auth";
import { ChannelWarehouses } from "@dashboard/channels/pages/ChannelDetailsPage/types";
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
  createChannel: MutationFunction<ChannelCreateMutation, Exact<{ input: ChannelCreateInput }>>;
  reorderChannelWarehouses: MutationFunction<
    ChannelReorderWarehousesMutation,
    Exact<{
      channelId: string;
      moves: ReorderInput | ReorderInput[];
    }>
  >;
}

export const useSaveChannel = ({ createChannel, reorderChannelWarehouses }: SaveChannelConfig) => {
  const { refetchUser } = useUser();

  return async (input: ChannelCreateInput, warehousesToDisplay: ChannelWarehouses) => {
    const createChannelMutation = createChannel({
      variables: {
        input,
      },
    });
    const result = await createChannelMutation;
    const errors = await extractMutationErrors(createChannelMutation);

    if (!errors?.length) {
      const moves = calculateItemsOrderMoves(
        result.data?.channelCreate?.channel?.warehouses || [],
        warehousesToDisplay,
      );
      const channelId = result.data?.channelCreate?.channel?.id;
      if (channelId) {
        await reorderChannelWarehouses({
          variables: { channelId, moves },
        });
      }

      if (refetchUser) {
        await refetchUser();
      }
    }

    return errors;
  };
};
