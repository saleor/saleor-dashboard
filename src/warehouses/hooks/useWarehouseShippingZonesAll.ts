import { useWarehouseShippingZonesPageQuery } from "@dashboard/graphql";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen/useModalDialogOpen";
import {
  warehouseZoneMemberships,
  type ZoneChannelMembership,
} from "@dashboard/warehouses/zonesUnlinkedByChannelRemoval";
import { useState } from "react";

/** Differs from the details query's 100 so the two connections stay apart in the cache. */
const PAGE_SIZE = 50;

/** Every zone linked to the warehouse, loaded page by page while the full list is open. */
export const useWarehouseShippingZonesAll = ({
  warehouseId,
  open,
}: {
  warehouseId: string;
  open: boolean;
}): {
  zones: ZoneChannelMembership[];
  loading: boolean;
  hasMore: boolean;
  fetchMore: () => void;
  /** Hide a zone removed from the open list without reloading every page. */
  markRemoved: (zoneId: string) => void;
} => {
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [fetchMoreFailed, setFetchMoreFailed] = useState(false);
  const query = useWarehouseShippingZonesPageQuery({
    skip: !open || !warehouseId,
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    variables: { id: warehouseId, first: PAGE_SIZE },
  });

  useModalDialogOpen(open, {
    onOpen: () => {
      setRemovedIds([]);
      setFetchMoreFailed(false);
    },
  });

  const connection = query.data?.warehouse?.shippingZones;
  const removed = new Set(removedIds);
  const zones = warehouseZoneMemberships(connection).zones.filter(zone => !removed.has(zone.id));
  const cursor = connection?.pageInfo.endCursor;
  // A failed page stops automatic loading, so a search cannot retry it in a loop.
  const hasMore = Boolean(connection?.pageInfo.hasNextPage && cursor) && !fetchMoreFailed;

  return {
    zones,
    loading: query.loading,
    hasMore,
    fetchMore: (): void => {
      if (!hasMore || query.loading) {
        return;
      }

      query
        .fetchMore({
          variables: { after: cursor },
          updateQuery: (previous, { fetchMoreResult }) => {
            const previousZones = previous.warehouse?.shippingZones;
            const nextZones = fetchMoreResult?.warehouse?.shippingZones;

            if (!previous.warehouse || !previousZones || !nextZones) {
              return previous;
            }

            const loadedIds = new Set(previousZones.edges.map(edge => edge.node.id));

            return {
              ...previous,
              warehouse: {
                ...previous.warehouse,
                shippingZones: {
                  ...nextZones,
                  edges: [
                    ...previousZones.edges,
                    ...nextZones.edges.filter(edge => !loadedIds.has(edge.node.id)),
                  ],
                },
              },
            };
          },
        })
        .catch(() => setFetchMoreFailed(true));
    },
    markRemoved: (zoneId: string): void => {
      setRemovedIds(current => [...current, zoneId]);
    },
  };
};
