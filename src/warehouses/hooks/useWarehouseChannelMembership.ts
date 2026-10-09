import { useApolloClient } from "@apollo/client";
import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import {
  useWarehouseChannelMembershipCountsQuery,
  useWarehouseChannelMembershipMatrixQuery,
} from "@dashboard/graphql";
import { useEffect, useState } from "react";

import {
  buildMembershipProbe,
  buildWarehouseLinkUpdates,
  channelIdsFromMatrix,
  channelIdsPresentInProbe,
  chunkList,
  MEMBERSHIP_PROBE_CHUNK_SIZE,
  MEMBERSHIP_UPDATE_CHUNK_SIZE,
  membershipQueryPlan,
  warehouseLinkBatchSucceeded,
} from "../warehouseChannelMembership";

export interface WarehouseChannelRef {
  id: string;
  name: string;
}

interface WarehouseChannelChangeResult {
  ok: number;
  failed: number;
}

const probeWarehouseChannels = async (
  client: ReturnType<typeof useApolloClient>,
  warehouseId: string,
  channelIds: string[],
): Promise<string[]> => {
  const present: string[] = [];

  for (const chunk of chunkList(channelIds, MEMBERSHIP_PROBE_CHUNK_SIZE)) {
    const probe = buildMembershipProbe(chunk);
    const result = await client.query<Record<string, { totalCount?: number | null }>>({
      query: probe.document,
      variables: probe.variables(warehouseId),
      fetchPolicy: "network-only",
    });

    present.push(...channelIdsPresentInProbe(chunk, result.data));
  }

  return present;
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
  const [probeIds, setProbeIds] = useState<string[] | null>(null);
  const [probeError, setProbeError] = useState(false);
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

      setProbeIds(null);
      setProbeError(false);
      probeWarehouseChannels(client, warehouseId, channelIds)
        .then((ids): void => {
          if (!cancelled) {
            setProbeIds(ids);
          }
        })
        .catch((): void => {
          if (!cancelled) {
            setProbeError(true);
          }
        });

      return (): void => {
        cancelled = true;
      };
    },
    [client, channelIdsKey, plan, probeToken, warehouseId],
  );

  const memberIds = ((): string[] | undefined => {
    if (plan === "fast" && matrix.data?.channels && warehouseId) {
      return channelIdsFromMatrix({ warehouseId, channels: matrix.data.channels });
    }

    if (plan === "probe" && probeIds) {
      return probeIds;
    }

    return undefined;
  })();

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
      setProbeIds(await probeWarehouseChannels(client, warehouseId, channelIdsKey.split("\0")));
    }
  };

  const updateMembershipBatch = async ({
    targetWarehouseId,
    channelIds,
    action,
  }: {
    targetWarehouseId: string;
    channelIds: string[];
    action: "add" | "remove";
  }): Promise<boolean[]> => {
    const results: boolean[] = [];

    for (const chunk of chunkList(channelIds, MEMBERSHIP_UPDATE_CHUNK_SIZE)) {
      try {
        const batch = buildWarehouseLinkUpdates({
          entityIds: chunk,
          action,
          linkVia: "channel",
        });
        const result = await client.mutate<
          Record<string, { errors?: unknown[] | null; channel?: { id: string } | null } | null>
        >({
          mutation: batch.document,
          variables: batch.variables(targetWarehouseId),
          errorPolicy: "all",
        });

        results.push(...warehouseLinkBatchSucceeded(chunk, result.data ?? undefined, "channel"));
      } catch {
        results.push(...chunk.map(() => false));
      }
    }

    return results;
  };

  const assignChannels = async (channelIds: string[]): Promise<WarehouseChannelChangeResult> => {
    if (!warehouseId || channelIds.length === 0) {
      return { ok: 0, failed: 0 };
    }

    setAssigning(true);

    try {
      const results = await updateMembershipBatch({
        targetWarehouseId: warehouseId,
        channelIds,
        action: "add",
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
      const [ok] = await updateMembershipBatch({
        targetWarehouseId: warehouseId,
        channelIds: [channelId],
        action: "remove",
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
