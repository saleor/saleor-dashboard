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

export const DEFAULT_MODEL_TYPE_TAB_SEPARATOR = " — ";

export const GROUP_TAB_ID_PREFIX = "group:";

export const getGroupTabId = (prefix: string) => `${GROUP_TAB_ID_PREFIX}${prefix}`;

const splitModelTypeName = (
  name: string,
  separator: string,
): { prefix: string; suffix: string } | null => {
  const index = name.indexOf(separator);

  if (index === -1) {
    return null;
  }

  const prefix = name.slice(0, index).trim();
  const suffix = name.slice(index + separator.length).trim();

  if (!prefix || !suffix) {
    return null;
  }

  return { prefix, suffix };
};

export const groupModelTypeTabs = (
  pageTypes: ModelTypeRef[],
  options: GroupModelTypeTabsOptions = {},
): ModelTabNode[] => {
  const separator = options.separator ?? DEFAULT_MODEL_TYPE_TAB_SEPARATOR;
  const enabled = options.enabled ?? true;

  if (!enabled || pageTypes.length === 0) {
    return pageTypes.map(pageType => ({
      kind: "type",
      id: pageType.id,
      name: pageType.name,
    }));
  }

  const buckets = new Map<string, ModelTypeSubtype[]>();

  pageTypes.forEach(pageType => {
    const parts = splitModelTypeName(pageType.name, separator);

    if (!parts) {
      return;
    }

    const existing = buckets.get(parts.prefix) ?? [];

    existing.push({
      id: pageType.id,
      name: pageType.name,
      suffix: parts.suffix,
    });
    buckets.set(parts.prefix, existing);
  });

  const groupedPrefixes = new Set(
    [...buckets.entries()].filter(([, members]) => members.length >= 2).map(([prefix]) => prefix),
  );
  const emittedGroups = new Set<string>();
  const nodes: ModelTabNode[] = [];

  pageTypes.forEach(pageType => {
    const parts = splitModelTypeName(pageType.name, separator);

    if (!parts || !groupedPrefixes.has(parts.prefix)) {
      nodes.push({
        kind: "type",
        id: pageType.id,
        name: pageType.name,
      });

      return;
    }

    if (emittedGroups.has(parts.prefix)) {
      return;
    }

    emittedGroups.add(parts.prefix);

    const subtypes = buckets.get(parts.prefix) ?? [];

    nodes.push({
      kind: "group",
      id: getGroupTabId(parts.prefix),
      prefix: parts.prefix,
      subtypes,
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
