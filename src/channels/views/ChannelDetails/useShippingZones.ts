import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  PermissionEnum,
  useChannelShippingZonesQuery,
  useShippingZonesCountQuery,
} from "@dashboard/graphql";
import useShippingZonesSearch from "@dashboard/searches/useShippingZonesSearch";

export const useShippingZones = (channelId?: string) => {
  const userPermissions = useUserPermissions();
  const canLoadShippingZones = hasPermissions(userPermissions!, [PermissionEnum.MANAGE_SHIPPING]);
  const { data: shippingZonesCountData, loading: shippingZonesCountLoading } =
    useShippingZonesCountQuery({ skip: !canLoadShippingZones });
  const { data: channelShippingZonesData, loading: channelsShippingZonesLoading } =
    useChannelShippingZonesQuery({
      variables: {
        filter: {
          channels: [channelId!],
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
