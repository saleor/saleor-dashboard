import { useApolloClient } from "@apollo/client";
import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { AssignShippingZoneDialog } from "@dashboard/components/AssignShippingZoneDialog/AssignShippingZoneDialog";
import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum, useWarehouseShippingZonesToAssignQuery } from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { WarehouseShippingZonesAllDialog } from "@dashboard/warehouses/components/WarehouseShippingZonesCard/WarehouseShippingZonesAllDialog";
import { messages } from "@dashboard/warehouses/messages";
import { runWarehouseLinkUpdates } from "@dashboard/warehouses/warehouseChannelMembership";
import { type ReactNode, useState } from "react";
import { useIntl } from "react-intl";

import { useWarehouseShippingZonesAll } from "./useWarehouseShippingZonesAll";

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
  /** Opens every linked zone in a dialog; the card shows a preview. */
  openAll: () => void;
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
  const [allOpen, setAllOpen] = useState(false);
  const allZones = useWarehouseShippingZonesAll({ warehouseId, open: allOpen });
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

  /**
   * One flag per zone id: whether its link changed. `onLinked` runs once the links are done,
   * before the reload; `busy` covers both so the card stays locked until it shows the result.
   */
  const changeZones = async (
    zoneIds: string[],
    action: "assign" | "remove",
    onLinked?: () => void,
  ): Promise<boolean[]> => {
    if (!warehouseId || zoneIds.length === 0) {
      onLinked?.();

      return [];
    }

    setBusy(true);

    let changed: boolean[] = zoneIds.map(() => false);

    try {
      const results = await runWarehouseLinkUpdates({
        client,
        warehouseId,
        entityIds: zoneIds,
        action: action === "assign" ? "add" : "remove",
        linkVia: "shippingZone",
      });

      changed = results;

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
    }

    onLinked?.();

    try {
      await onChanged();
    } catch {
      // The toast already reported the mutation. A failed reload leaves the list stale.
    } finally {
      setBusy(false);
    }

    return changed;
  };

  const assignedIds = new Set(assignedZoneIds);
  // Same id can appear once per filtered channel — collapse before the dialog.
  const loaded = uniqueById(
    zonesQuery.data?.shippingZones?.edges.map(edge => edge.node) ?? [],
    zone => zone.id,
  );

  return {
    canManage,
    busy,
    openAssign: () => setOpen(true),
    openAll: () => setAllOpen(true),
    remove: (zoneId: string): void => {
      void changeZones([zoneId], "remove");
    },
    dialog: (
      <>
        <WarehouseShippingZonesAllDialog
          open={allOpen}
          zones={allZones.zones}
          loading={allZones.loading}
          hasMore={allZones.hasMore}
          warehouseChannelIds={channelIds}
          canManage={canManage}
          disabled={busy}
          onFetchMore={allZones.fetchMore}
          onRemove={zoneId => {
            void changeZones([zoneId], "remove").then(([ok]) => {
              if (ok) {
                allZones.markRemoved(zoneId);
              }
            });
          }}
          onClose={() => setAllOpen(false)}
        />
        <AssignShippingZoneDialog
          open={open}
          confirmButtonState={busy ? "loading" : "default"}
          shippingZones={loaded}
          excludeContainer={zone => assignedIds.has(zone.id)}
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
          // Keeps the dialog open and loading until every zone is linked. It closes before the
          // reload, which would otherwise hide the just-linked rows from the open list.
          onSubmit={selected =>
            new Promise<void>(resolve => {
              void changeZones(
                selected.map(zone => zone.id),
                "assign",
                resolve,
              );
            })
          }
        />
      </>
    ),
  };
};
