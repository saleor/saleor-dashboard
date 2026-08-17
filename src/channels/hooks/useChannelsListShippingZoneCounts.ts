import { buildChannelShippingZoneCountMap } from "@dashboard/channels/utils/channelListSetup";
import { useChannelsListShippingCoverageQuery } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useMemo } from "react";

interface UseChannelsListShippingZoneCountsArgs {
  skip?: boolean;
}

interface UseChannelsListShippingZoneCountsResult {
  shippingZoneCountsByChannelId: Map<string, number> | undefined;
  shippingCoverageLoading: boolean;
}

/**
 * One-shot zone→channel coverage for the channels list (API max first: 100).
 *
 * Intentionally does **not** paginate: walking every zone on list mount is
 * dangerous for large shops. If `hasNextPage`, counts stay `undefined`
 * (shipping status unknown) so we never invent false “needs shipping” blockers
 * from a partial page — same rule as missing MANAGE_SHIPPING.
 */
export const useChannelsListShippingZoneCounts = ({
  skip = false,
}: UseChannelsListShippingZoneCountsArgs = {}): UseChannelsListShippingZoneCountsResult => {
  const { data, loading } = useChannelsListShippingCoverageQuery({
    skip,
  });

  const shippingZoneCountsByChannelId = useMemo((): Map<string, number> | undefined => {
    const connection = data?.shippingZones;

    if (skip || !connection || connection.pageInfo.hasNextPage) {
      return undefined;
    }

    return buildChannelShippingZoneCountMap(mapEdgesToItems(connection));
  }, [data, skip]);

  return {
    shippingZoneCountsByChannelId,
    shippingCoverageLoading: !skip && loading,
  };
};
