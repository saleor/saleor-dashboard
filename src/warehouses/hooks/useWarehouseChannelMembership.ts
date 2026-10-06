import { useApolloClient } from "@apollo/client";
import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import {
  useWarehouseChannelMembershipCountsQuery,
  useWarehouseChannelMembershipMatrixQuery,
  WarehouseChannelMembershipUpdateDocument,
  type WarehouseChannelMembershipUpdateMutation,
} from "@dashboard/graphql";
import { useEffect, useState } from "react";

import {
  buildMembershipProbe,
  CHANNEL_ASSIGN_CONCURRENCY,
  channelIdsFromMatrix,
  channelIdsPresentInProbe,
  chunkList,
  MEMBERSHIP_PROBE_CHUNK_SIZE,
  membershipQueryPlan,
  runPool,
} from "../warehouseChannelMembership";

export interface WarehouseChannelRef {
  id: string;
  name: string;
}

export interface WarehouseChannelChangeResult {
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

  useEffect(
    function loadWarehouseChannelProbe() {
      if (!warehouseId || plan !== "probe" || !counts.data?.channels) {
        return;
      }

      let cancelled = false;

      setProbeIds(null);
      setProbeError(false);
      probeWarehouseChannels(
        client,
        warehouseId,
        counts.data.channels.map(channel => channel.id),
      )
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
    [client, counts.data?.channels, plan, probeToken, warehouseId],
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

  const refresh = async (): Promise<void> => {
    const nextCounts = await counts.refetch();
    const nextChannels = nextCounts.data.channels ?? [];
    const nextPlan = membershipQueryPlan({
      channelCount: nextChannels.length,
      warehouseCount: nextCounts.data.warehouses?.totalCount ?? null,
    });

    if (nextPlan === "fast") {
      await matrix.refetch();

      return;
    }

    if (warehouseId) {
      setProbeIds(
        await probeWarehouseChannels(
          client,
          warehouseId,
          nextChannels.map(channel => channel.id),
        ),
      );
    }
  };

  const updateMembership = async (
    channelId: string,
    input: { addWarehouses?: string[]; removeWarehouses?: string[] },
  ): Promise<boolean> => {
    const result = await client.mutate<WarehouseChannelMembershipUpdateMutation>({
      mutation: WarehouseChannelMembershipUpdateDocument,
      variables: { id: channelId, input },
    });

    return (result.data?.channelUpdate?.errors.length ?? 1) === 0;
  };

  const assignChannels = async (channelIds: string[]): Promise<WarehouseChannelChangeResult> => {
    if (!warehouseId || channelIds.length === 0) {
      return { ok: 0, failed: 0 };
    }

    setAssigning(true);

    try {
      const results = await runPool(channelIds, CHANNEL_ASSIGN_CONCURRENCY, channelId =>
        updateMembership(channelId, { addWarehouses: [warehouseId] }),
      );
      const ok = results.filter(Boolean).length;
      const failed = results.length - ok;

      trackEvent("warehouse_channels_changed", {
        action: "assign",
        channel_count: channelIds.length,
        result: changeResult(ok, failed),
      });
      await refresh();

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
      const ok = await updateMembership(channelId, { removeWarehouses: [warehouseId] });

      trackEvent("warehouse_channels_changed", {
        action: "remove",
        channel_count: 1,
        result: ok ? "success" : "error",
      });
      await refresh();

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
