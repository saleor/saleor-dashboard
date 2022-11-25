import { useUserPermissions } from "@saleor/auth/hooks/useUserPermissions";
import { hasPermissions } from "@saleor/components/RequirePermissions";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import {
  PermissionEnum,
  useChannelShippingZonesQuery,
  useShippingZonesCountQuery,
} from "@saleor/graphql";
import useShippingZonesSearch from "@saleor/searches/useShippingZonesSearch";

export const useShippingZones = (channelId?: string) => {
  const userPermissions = useUserPermissions();
  const canLoadShippingZones = hasPermissions(userPermissions, [
    PermissionEnum.MANAGE_SHIPPING,
  ]);

  const {
    data: shippingZonesCountData,
    loading: shippingZonesCountLoading,
  } = useShippingZonesCountQuery({ skip: !canLoadShippingZones });

  const {
    data: channelShippingZonesData,
    loading: channelsShippingZonesLoading,
  } = useChannelShippingZonesQuery({
    variables: {
      filter: {
        channels: [channelId],
      },
    },
    skip: !channelId || !canLoadShippingZones,
  });

  const {
    loadMore: fetchMoreShippingZones,
    search: searchShippingZones,
    result: searchShippingZonesResult,
  } = useShippingZonesSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
    skip: !canLoadShippingZones,
  });

  return {
    shippingZonesCountData,
    shippingZonesCountLoading,
    channelShippingZonesData,
    channelsShippingZonesLoading,
    fetchMoreShippingZones,
    searchShippingZones,
    searchShippingZonesResult,
  };
};
