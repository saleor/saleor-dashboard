export const ALL_MODELS_TAB_ID = "__all__";

export interface ModelTypeRef {
  id: string;
  name: string;
}

export interface ModelTypeSubtype {
  id: string;
  name: string;
  suffix: string;
}

export type ModelTabNode =
  | { kind: "type"; id: string; name: string }
  | { kind: "group"; id: string; prefix: string; subtypes: ModelTypeSubtype[] };

export interface GroupModelTypeTabsOptions {
  separator?: string;
  enabled?: boolean;
}

/** Default value shown in the separator input (comma-separated list). */
export const DEFAULT_MODEL_TYPE_TAB_SEPARATOR = "—, :, -";

export const MODEL_TYPE_TAB_SEPARATOR_LIST_DELIMITER = ",";

export const GROUP_TAB_ID_PREFIX = "group:";

export const getGroupTabId = (prefix: string) =>
  `${GROUP_TAB_ID_PREFIX}${prefix.toLocaleLowerCase()}`;

const normalizeSeparatorPart = (part: string, index: number): string =>
  index === 0 ? part : part.trimStart();

const splitSeparatorList = (value: string): string[] => {
  if (!value.includes(MODEL_TYPE_TAB_SEPARATOR_LIST_DELIMITER)) {
    return [value];
  }

  const parts = value
    .split(MODEL_TYPE_TAB_SEPARATOR_LIST_DELIMITER)
    .map(normalizeSeparatorPart)
    .filter(Boolean);

  if (parts.length > 0) {
    return parts;
  }

  return [value];
};

export const parseModelTypeTabSeparators = (value: string): string[] => {
  if (!value.trim()) {
    return [];
  }

  return splitSeparatorList(value);
};

interface ModelTypeBucket {
  displayPrefix: string;
  subtypes: ModelTypeSubtype[];
}

const getBucketKey = (prefix: string) => prefix.toLocaleLowerCase();

interface ModelTypeNameSplit {
  prefix: string;
  suffix: string;
}

const splitModelTypeName = (name: string, separators: string[]): ModelTypeNameSplit | null => {
  let bestIndex = -1;
  let bestSeparator = "";

  for (const separator of separators) {
    const index = name.indexOf(separator);

    if (index === -1) {
      continue;
    }

    if (
      bestIndex === -1 ||
      index < bestIndex ||
      (index === bestIndex && separator.length > bestSeparator.length)
    ) {
      bestIndex = index;
      bestSeparator = separator;
    }
  }

  if (bestIndex === -1) {
    return null;
  }

  const prefix = name.slice(0, bestIndex).trim();
  const suffix = name.slice(bestIndex + bestSeparator.length).trim();

  if (!prefix || !suffix) {
    return null;
  }

  return { prefix, suffix };
};

export const groupModelTypeTabs = (
  pageTypes: ModelTypeRef[],
  options: GroupModelTypeTabsOptions = {},
): ModelTabNode[] => {
  const separators = parseModelTypeTabSeparators(options.separator ?? "");
  const enabled = options.enabled ?? true;

  if (!enabled || pageTypes.length === 0 || separators.length === 0) {
    return pageTypes.map(pageType => ({
      kind: "type",
      id: pageType.id,
      name: pageType.name,
    }));
  }

  const buckets = new Map<string, ModelTypeBucket>();

  pageTypes.forEach(pageType => {
    const parts = splitModelTypeName(pageType.name, separators);

    if (!parts) {
      return;
    }

    const bucketKey = getBucketKey(parts.prefix);
    const subtype: ModelTypeSubtype = {
      id: pageType.id,
      name: pageType.name,
      suffix: parts.suffix,
    };
    const existing = buckets.get(bucketKey);

    if (existing) {
      existing.subtypes.push(subtype);

      return;
    }

    buckets.set(bucketKey, {
      displayPrefix: parts.prefix,
      subtypes: [subtype],
    });
  });

  const emittedGroups = new Set<string>();
  const nodes: ModelTabNode[] = [];

  pageTypes.forEach(pageType => {
    const parts = splitModelTypeName(pageType.name, separators);

    if (!parts) {
      nodes.push({
        kind: "type",
        id: pageType.id,
        name: pageType.name,
      });

      return;
    }

    const bucketKey = getBucketKey(parts.prefix);

    if (emittedGroups.has(bucketKey)) {
      return;
    }

    emittedGroups.add(bucketKey);

    const bucket = buckets.get(bucketKey);

    if (!bucket) {
      return;
    }

    nodes.push({
      kind: "group",
      id: getGroupTabId(bucket.displayPrefix),
      prefix: bucket.displayPrefix,
      subtypes: bucket.subtypes,
    });
  });

  return nodes;
};

export const getModelTabNodeId = (node: ModelTabNode): string => node.id;

export const getModelTabNodeSelection = (node: ModelTabNode): string[] => {
  if (node.kind === "type") {
    return [node.id];
  }

  return node.subtypes.map(subtype => subtype.id);
};

export const getActiveSubtypeInGroup = (
  group: Extract<ModelTabNode, { kind: "group" }>,
  selectedIds: string[],
): ModelTypeSubtype | undefined => {
  if (selectedIds.length !== 1) {
    return undefined;
  }

  return group.subtypes.find(subtype => subtype.id === selectedIds[0]);
};

export const isGroupAllSelected = (
  group: Extract<ModelTabNode, { kind: "group" }>,
  selectedIds: string[],
): boolean => {
  const uniqueSelectedIds = [...new Set(selectedIds)];

  if (uniqueSelectedIds.length !== group.subtypes.length) {
    return false;
  }

  const subtypeIds = new Set(group.subtypes.map(subtype => subtype.id));

  return uniqueSelectedIds.every(id => subtypeIds.has(id));
};

export const isModelTabNodeActive = (node: ModelTabNode, selectedIds: string[]): boolean => {
  if (node.kind === "type") {
    return selectedIds.length === 1 && selectedIds[0] === node.id;
  }

  const subtypeIds = new Set(node.subtypes.map(subtype => subtype.id));

  if (selectedIds.length === 0) {
    return false;
  }

  if (!selectedIds.every(id => subtypeIds.has(id))) {
    return false;
  }

  return isGroupAllSelected(node, selectedIds) || selectedIds.length === 1;
};

export const resolveActiveTabCountKey = (
  selectedIds: string[],
  pageTypes: ModelTypeRef[],
  options: GroupModelTypeTabsOptions = {},
): string => {
  if (selectedIds.length === 0) {
    return ALL_MODELS_TAB_ID;
  }

  if (selectedIds.length === 1) {
    return selectedIds[0];
  }

  const nodes = groupModelTypeTabs(pageTypes, options);

  const activeGroup = nodes.find(
    (node): node is Extract<ModelTabNode, { kind: "group" }> =>
      node.kind === "group" && isGroupAllSelected(node, selectedIds),
  );

  return activeGroup?.id ?? ALL_MODELS_TAB_ID;
};

export const aggregateCounts = (
  ids: string[],
  counts: Record<string, { value: number; hasMore: boolean } | undefined>,
): { value: number; hasMore: boolean } | undefined => {
  if (ids.length === 0) {
    return undefined;
  }

  let value = 0;
  let hasMore = false;
  let hasAny = false;

  ids.forEach(id => {
    const count = counts[id];

    if (!count) {
      return;
    }

    hasAny = true;
    value += count.value;
    hasMore = hasMore || count.hasMore;
  });

  if (!hasAny) {
    return undefined;
  }

  return { value, hasMore };
};
