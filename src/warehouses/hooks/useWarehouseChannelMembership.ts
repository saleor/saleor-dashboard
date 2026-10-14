import { useApolloClient } from "@apollo/client";
import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import {
  useWarehouseChannelMembershipCountsQuery,
  useWarehouseChannelMembershipMatrixQuery,
} from "@dashboard/graphql";
import { useEffect, useState } from "react";

import {
  buildMembershipProbe,
  channelIdsPresentInProbe,
  chunkList,
  MEMBERSHIP_PROBE_CHUNK_SIZE,
  membershipQueryPlan,
  resolveMemberIds,
  runPool,
  runWarehouseLinkUpdates,
} from "../warehouseChannelMembership";

export interface WarehouseChannelRef {
  id: string;
  name: string;
}

interface WarehouseChannelChangeResult {
  ok: number;
  failed: number;
}

/** How many probe requests to keep in flight at once. */
const PROBE_CONCURRENCY = 4;

const probeWarehouseChannels = async (
  client: ReturnType<typeof useApolloClient>,
  warehouseId: string,
  channelIds: string[],
): Promise<string[]> => {
  const present = await runPool(
    chunkList(channelIds, MEMBERSHIP_PROBE_CHUNK_SIZE),
    PROBE_CONCURRENCY,
    async chunk => {
      const probe = buildMembershipProbe(chunk);
      const result = await client.query<Record<string, { totalCount?: number | null }>>({
        query: probe.document,
        variables: probe.variables(warehouseId),
        fetchPolicy: "network-only",
      });

      return channelIdsPresentInProbe(chunk, result.data);
    },
  );

  return present.flat();
};

const changeResult = (ok: number, failed: number): "error" | "partial_success" | "success" => {
  if (failed === 0) {
    return "success";
  }

  return ok === 0 ? "error" : "partial_success";
};

export const useWarehouseChannelMembership = (
  warehouseId: string | undefined,
): {
  status: "loading" | "error" | "ready";
  channels: WarehouseChannelRef[];
  allChannels: WarehouseChannelRef[];
  assigning: boolean;
  removingId: string | undefined;
  retry: () => void;
  assignChannels: (channelIds: string[]) => Promise<WarehouseChannelChangeResult>;
  removeChannel: (channelId: string) => Promise<WarehouseChannelChangeResult>;
} => {
  const client = useApolloClient();
  const { trackEvent } = useAnalytics();
  const counts = useWarehouseChannelMembershipCountsQuery({
    skip: !warehouseId,
    errorPolicy: "all",
  });
  const channelCount = counts.data?.channels?.length;
  const warehouseCount = counts.data ? (counts.data.warehouses?.totalCount ?? null) : undefined;
  const plan =
    channelCount === undefined || warehouseCount === undefined
      ? undefined
      : membershipQueryPlan({ channelCount, warehouseCount });
  const matrix = useWarehouseChannelMembershipMatrixQuery({
    skip: !warehouseId || plan !== "fast",
    errorPolicy: "all",
  });
  // Keyed by warehouse: navigating between warehouses keeps this hook mounted, and a late
  // probe must never answer for a different warehouse than the one it asked about.
  const [probe, setProbe] = useState<{
    warehouseId: string;
    ids: string[] | null;
    failed: boolean;
  } | null>(null);
  const currentProbe = probe && probe.warehouseId === warehouseId ? probe : null;
  const probeIds = currentProbe?.ids ?? null;
  const probeError = currentProbe?.failed ?? false;
  const [probeToken, setProbeToken] = useState(0);
  const [assigning, setAssigning] = useState(false);
  const [removingId, setRemovingId] = useState<string | undefined>();
  const allChannels = counts.data?.channels ?? [];
  const names = new Map(allChannels.map(channel => [channel.id, channel.name]));
  // String key stays stable when Apollo re-emits the same channel ids after a write.
  const channelIdsKey = allChannels.map(channel => channel.id).join("\0");

  useEffect(
    function loadWarehouseChannelProbe() {
      if (!warehouseId || plan !== "probe" || !channelIdsKey) {
        return;
      }

      const channelIds = channelIdsKey.split("\0");
      let cancelled = false;

      setProbe({ warehouseId, ids: null, failed: false });
      probeWarehouseChannels(client, warehouseId, channelIds)
        .then((ids): void => {
          if (!cancelled) {
            setProbe({ warehouseId, ids, failed: false });
          }
        })
        .catch((): void => {
          if (!cancelled) {
            setProbe({ warehouseId, ids: null, failed: true });
          }
        });

      return (): void => {
        cancelled = true;
      };
    },
    [client, channelIdsKey, plan, probeToken, warehouseId],
  );

  const memberIds = resolveMemberIds({
    plan,
    warehouseId,
    matrixChannels: matrix.data?.channels,
    probeIds,
    channelCount: allChannels.length,
  });

  const status = ((): "loading" | "error" | "ready" => {
    if (!warehouseId || (counts.loading && !counts.data?.channels)) {
      return "loading";
    }

    if (!counts.data?.channels) {
      return "error";
    }

    if (plan === "fast") {
      if (matrix.error) {
        return "error";
      }

      return memberIds ? "ready" : "loading";
    }

    if (probeError) {
      return "error";
    }

    return memberIds ? "ready" : "loading";
  })();

  const channels =
    status === "ready" && memberIds ? memberIds.map(id => ({ id, name: names.get(id) ?? id })) : [];

  /** Channel/warehouse counts do not change on assign — only membership does. */
  const refreshMembership = async (): Promise<void> => {
    if (plan === "fast") {
      await matrix.refetch();

      return;
    }

    if (warehouseId && channelIdsKey) {
      const ids = await probeWarehouseChannels(client, warehouseId, channelIdsKey.split("\0"));

      // Tagged with the warehouse it was asked for, so it is ignored after navigating away.
      setProbe({ warehouseId, ids, failed: false });
    }
  };

  const assignChannels = async (channelIds: string[]): Promise<WarehouseChannelChangeResult> => {
    if (!warehouseId || channelIds.length === 0) {
      return { ok: 0, failed: 0 };
    }

    setAssigning(true);

    try {
      const results = await runWarehouseLinkUpdates({
        client,
        warehouseId,
        entityIds: channelIds,
        action: "add",
        linkVia: "channel",
      });
      const ok = results.filter(Boolean).length;
      const failed = results.length - ok;

      trackEvent("warehouse_channels_changed", {
        action: "assign",
        channel_count: channelIds.length,
        result: changeResult(ok, failed),
      });

      try {
        await refreshMembership();
      } catch {
        // Writes already landed; the list may stay briefly stale.
      }

      return { ok, failed };
    } finally {
      setAssigning(false);
    }
  };

  const removeChannel = async (channelId: string): Promise<WarehouseChannelChangeResult> => {
    if (!warehouseId) {
      return { ok: 0, failed: 0 };
    }

    setRemovingId(channelId);

    try {
      const [ok] = await runWarehouseLinkUpdates({
        client,
        warehouseId,
        entityIds: [channelId],
        action: "remove",
        linkVia: "channel",
      });

      trackEvent("warehouse_channels_changed", {
        action: "remove",
        channel_count: 1,
        result: ok ? "success" : "error",
      });

      try {
        await refreshMembership();
      } catch {
        // Writes already landed; the list may stay briefly stale.
      }

      return ok ? { ok: 1, failed: 0 } : { ok: 0, failed: 1 };
    } finally {
      setRemovingId(undefined);
    }
  };

  return {
    status,
    channels,
    allChannels,
    assigning,
    removingId,
    retry: (): void => {
      void counts.refetch();

      if (plan === "fast") {
        void matrix.refetch();

        return;
      }

      setProbeToken((token): number => token + 1);
    },
    assignChannels,
    removeChannel,
  };
};
