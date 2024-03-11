import { ChannelPriceData } from "@dashboard/channels/utils";
import { useFetchAllWarehouses } from "@dashboard/hooks/useFetchAllWarehouse";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export const useAllWarehouses = (channels: ChannelPriceData[]) => {
  const channelsIds = channels.map(channel => channel.id);

  const warehouses = useFetchAllWarehouses({
    displayLoader: true,
    skip: !channelsIds.length,
    variables: {
      first: 100,
      filter: {
        channels: channelsIds,
      },
    },
  });

  return mapEdgesToItems(warehouses?.data?.warehouses) || [];
};
