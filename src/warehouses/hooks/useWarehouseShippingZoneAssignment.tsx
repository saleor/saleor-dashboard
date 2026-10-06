import { useApolloClient } from "@apollo/client";
import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { AssignShippingZoneDialog } from "@dashboard/components/AssignShippingZoneDialog/AssignShippingZoneDialog";
import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import {
  PermissionEnum,
  UpdateShippingZoneDocument,
  type UpdateShippingZoneMutation,
  useWarehouseShippingZonesToAssignQuery,
} from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { messages } from "@dashboard/warehouses/messages";
import {
  CHANNEL_ASSIGN_CONCURRENCY,
  runPool,
} from "@dashboard/warehouses/warehouseChannelMembership";
import { type ReactNode, useState } from "react";
import { useIntl } from "react-intl";

const PAGE_SIZE = 20;

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
      first: PAGE_SIZE,
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

    try {
      const results = await runPool(zoneIds, CHANNEL_ASSIGN_CONCURRENCY, async zoneId => {
        const result = await client.mutate<UpdateShippingZoneMutation>({
          mutation: UpdateShippingZoneDocument,
          variables: {
            id: zoneId,
            input:
              action === "assign"
                ? { addWarehouses: [warehouseId] }
                : { removeWarehouses: [warehouseId] },
          },
        });

        const updated = result.data?.shippingZoneUpdate;

        return Boolean(updated && updated.errors.length === 0 && updated.shippingZone);
      });
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

  const loaded = zonesQuery.data?.shippingZones?.edges.map(edge => edge.node) ?? [];

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

              const seen = new Set<string>();
              const edges = [...(previous.shippingZones?.edges ?? []), ...nextZones.edges].filter(
                edge => {
                  if (seen.has(edge.node.id)) {
                    return false;
                  }

                  seen.add(edge.node.id);

                  return true;
                },
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
