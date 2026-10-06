import { type DocumentNode, gql } from "@apollo/client";

/** Fast path loads every channel's warehouse ids. Above this product, probe this warehouse only. */
export const WAREHOUSE_CHANNEL_MEMBERSHIP_LIMIT = 5000;

export const MEMBERSHIP_PROBE_CHUNK_SIZE = 20;

export const CHANNEL_ASSIGN_CONCURRENCY = 4;

export const membershipQueryPlan = ({
  channelCount,
  warehouseCount,
}: {
  channelCount: number;
  warehouseCount: number | null;
}): "fast" | "probe" => {
  if (warehouseCount === null) {
    return "probe";
  }

  return channelCount * warehouseCount <= WAREHOUSE_CHANNEL_MEMBERSHIP_LIMIT ? "fast" : "probe";
};

export const chunkList = <TItem>(items: TItem[], size: number): TItem[][] => {
  if (size <= 0) {
    return [items];
  }

  const chunks: TItem[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
};

export const channelIdsFromMatrix = ({
  warehouseId,
  channels,
}: {
  warehouseId: string;
  channels: Array<{ id: string; warehouses: Array<{ id: string }> }>;
}): string[] =>
  channels
    .filter(channel => channel.warehouses.some(warehouse => warehouse.id === warehouseId))
    .map(channel => channel.id);

/**
 * One alias per channel. Channel ids travel as variables, so a name cannot change the query.
 */
export const buildMembershipProbe = (
  channelIds: string[],
): { document: DocumentNode; variables: (warehouseId: string) => Record<string, string[]> } => {
  const variableDefinitions = channelIds.map((_, index) => `$c${index}: [ID!]`).join(", ");
  const fields = channelIds
    .map(
      (_, index) =>
        `c${index}: warehouses(first: 1, filter: { ids: $warehouseId, channels: $c${index} }) { totalCount }`,
    )
    .join("\n");
  const source = [
    "query WarehouseChannelMembershipProbe($warehouseId: [ID!]!, ",
    variableDefinitions,
    ") {",
    fields,
    "}",
  ].join("\n");
  const document = gql(source);

  return {
    document,
    variables: (warehouseId: string): Record<string, string[]> => {
      const variables: Record<string, string[]> = { warehouseId: [warehouseId] };

      channelIds.forEach((channelId, index) => {
        variables[`c${index}`] = [channelId];
      });

      return variables;
    },
  };
};

export const channelIdsPresentInProbe = (
  channelIds: string[],
  data: Record<string, { totalCount?: number | null } | null | undefined> | null | undefined,
): string[] => channelIds.filter((_, index) => (data?.[`c${index}`]?.totalCount ?? 0) > 0);

export const runPool = async <TItem, TResult>(
  items: TItem[],
  limit: number,
  worker: (item: TItem) => Promise<TResult>,
): Promise<TResult[]> => {
  const results: TResult[] = new Array(items.length);
  let nextIndex = 0;
  const run = async (): Promise<void> => {
    while (nextIndex < items.length) {
      const index = nextIndex;

      nextIndex += 1;
      results[index] = await worker(items[index]);
    }
  };
  const workers = Math.min(Math.max(limit, 1), items.length);

  await Promise.all(Array.from({ length: workers }, () => run()));

  return results;
};
