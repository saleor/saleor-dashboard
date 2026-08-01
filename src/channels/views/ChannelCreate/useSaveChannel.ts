import { type MutationFunction } from "@apollo/client";
import { useUser } from "@dashboard/auth/useUser";
import { type ChannelWarehouses } from "@dashboard/channels/pages/ChannelDetailsPage/types";
import {
  type ChannelCreateInput,
  type ChannelCreateMutation,
  type ChannelErrorFragment,
  type ChannelReorderWarehousesMutation,
  type Exact,
  type ReorderInput,
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

interface SaveChannelResult {
  errors: ChannelErrorFragment[];
  channelId?: string;
}

export const useSaveChannel = ({ createChannel, reorderChannelWarehouses }: SaveChannelConfig) => {
  const { refetchUser } = useUser();

  return async (
    input: ChannelCreateInput,
    warehousesToDisplay: ChannelWarehouses,
  ): Promise<SaveChannelResult> => {
    const createChannelMutation = createChannel({
      variables: {
        input,
      },
    });
    const result = await createChannelMutation;
    const errors = await extractMutationErrors(createChannelMutation);
    const channelId = result.data?.channelCreate?.channel?.id;

    if (!errors?.length && channelId) {
      const moves = calculateItemsOrderMoves(
        result.data?.channelCreate?.channel?.warehouses || [],
        warehousesToDisplay,
      );

      if (moves.length) {
        await reorderChannelWarehouses({
          variables: { channelId, moves },
        });
      }

      if (refetchUser) {
        await refetchUser();
      }
    }

    return { errors, channelId };
  };
};
