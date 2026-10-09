import { useApolloClient } from "@apollo/client";
import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { AssignShippingZoneDialog } from "@dashboard/components/AssignShippingZoneDialog/AssignShippingZoneDialog";
import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum, useWarehouseShippingZonesToAssignQuery } from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { messages } from "@dashboard/warehouses/messages";
import {
  buildWarehouseLinkUpdates,
  chunkList,
  MEMBERSHIP_UPDATE_CHUNK_SIZE,
  warehouseLinkBatchSucceeded,
} from "@dashboard/warehouses/warehouseChannelMembership";
import { type ReactNode, useState } from "react";
import { useIntl } from "react-intl";

const PAGE_SIZE = 20;
/** Cap so a warehouse with many channels does not request unbounded pages. */
const MAX_PAGE_SIZE = 100;

/**
 * Saleor's `shippingZones(filter: { channels })` returns one edge per matching
 * channel, so a zone shared by N warehouse channels appears N times with the
 * same id. Keep first occurrence only.
 */
export const uniqueById = <TItem,>(items: TItem[], getId: (item: TItem) => string): TItem[] => {
  const seen = new Set<string>();

  return items.filter(item => {
    const id = getId(item);

    if (seen.has(id)) {
      return false;
    }

    seen.add(id);

    return true;
  });
};

/** Aim for ~PAGE_SIZE unique zones after the per-channel edge duplication. */
export const shippingZonesAssignPageSize = (channelCount: number): number =>
  Math.min(MAX_PAGE_SIZE, PAGE_SIZE * Math.max(channelCount, 1));

export const zonesAvailableToAssign = <TZone extends { id: string }>(
  zones: TZone[],
  assignedIds: string[],
): TZone[] => {
  const assigned = new Set(assignedIds);

  return zones.filter(zone => !assigned.has(zone.id));
};

/** Links this location to shipping zones through shippingZoneUpdate. */
export const useWarehouseShippingZoneAssignment = ({
  warehouseId,
  channelIds,
  assignedZoneIds,
  onChanged,
}: {
  warehouseId: string;
  channelIds: string[];
  assignedZoneIds: string[];
  onChanged: () => Promise<void>;
}): {
  canManage: boolean;
  busy: boolean;
  openAssign: () => void;
  remove: (zoneId: string) => void;
  dialog: ReactNode;
} => {
  const client = useApolloClient();
  const intl = useIntl();
  const notify = useNotifier();
  const { trackEvent } = useAnalytics();
  const permissions = useUserPermissions();
  const canManage = hasPermissions(permissions ?? [], [PermissionEnum.MANAGE_SHIPPING]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const zonesQuery = useWarehouseShippingZonesToAssignQuery({
    skip: !open || channelIds.length === 0,
    fetchPolicy: "cache-and-network",
    variables: {
      first: shippingZonesAssignPageSize(channelIds.length),
      filter: {
        channels: channelIds,
        ...(search ? { search } : {}),
      },
    },
  });

  const changeZones = async (zoneIds: string[], action: "assign" | "remove"): Promise<void> => {
    if (!warehouseId || zoneIds.length === 0) {
      return;
    }

    setBusy(true);

    const results: boolean[] = [];

    try {
      for (const chunk of chunkList(zoneIds, MEMBERSHIP_UPDATE_CHUNK_SIZE)) {
        try {
          const batch = buildWarehouseLinkUpdates({
            entityIds: chunk,
            action: action === "assign" ? "add" : "remove",
            linkVia: "shippingZone",
          });
          const result = await client.mutate<
            Record<
              string,
              { errors?: unknown[] | null; shippingZone?: { id: string } | null } | null
            >
          >({
            mutation: batch.document,
            variables: batch.variables(warehouseId),
            errorPolicy: "all",
          });

          results.push(
            ...warehouseLinkBatchSucceeded(chunk, result.data ?? undefined, "shippingZone"),
          );
        } catch {
          results.push(...chunk.map(() => false));
        }
      }

      const failed = results.filter(ok => !ok).length;
      const result =
        failed === 0 ? "success" : failed === results.length ? "error" : "partial_success";

      trackEvent("warehouse_shipping_zones_changed", {
        action,
        result,
        zone_count: zoneIds.length,
      });
      notify({
        status: result === "success" ? "success" : "error",
        text: intl.formatMessage(
          result === "success" ? messages.zonesAssigned : messages.zonesAssignFailed,
        ),
      });
    } catch {
      notify({
        status: "error",
        text: intl.formatMessage(messages.zonesAssignFailed),
      });
    } finally {
      setBusy(false);
    }

    try {
      await onChanged();
    } catch {
      // The toast already reported the mutation. A failed reload leaves the list stale.
    }
  };

  // Same id can appear once per filtered channel — collapse before the dialog.
  const loaded = uniqueById(
    zonesQuery.data?.shippingZones?.edges.map(edge => edge.node) ?? [],
    zone => zone.id,
  );

  return {
    canManage,
    busy,
    openAssign: () => setOpen(true),
    remove: (zoneId: string): void => {
      void changeZones([zoneId], "remove");
    },
    dialog: (
      <AssignShippingZoneDialog
        open={open}
        confirmButtonState={busy ? "loading" : "default"}
        shippingZones={loaded}
        excludeContainer={zone => zonesAvailableToAssign([zone], assignedZoneIds).length === 0}
        loading={zonesQuery.loading}
        hasMore={zonesQuery.data?.shippingZones?.pageInfo.hasNextPage ?? false}
        onFetchMore={() => {
          const cursor = zonesQuery.data?.shippingZones?.pageInfo.endCursor;

          if (!cursor) {
            return;
          }

          void zonesQuery.fetchMore({
            variables: { after: cursor },
            updateQuery: (previous, { fetchMoreResult }) => {
              const nextZones = fetchMoreResult?.shippingZones;

              if (!nextZones) {
                return previous;
              }

              const edges = uniqueById(
                [...(previous.shippingZones?.edges ?? []), ...nextZones.edges],
                edge => edge.node.id,
              );

              return {
                ...previous,
                shippingZones: {
                  ...nextZones,
                  edges,
                },
              };
            },
          });
        }}
        onFetch={setSearch}
        onClose={() => {
          setSearch("");
          setOpen(false);
        }}
        onSubmit={selected => {
          void changeZones(
            selected.map(zone => zone.id),
            "assign",
          );
        }}
      />
    ),
  };
};
