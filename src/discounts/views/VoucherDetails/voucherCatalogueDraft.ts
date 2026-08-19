import { type CatalogueInput } from "@dashboard/graphql";

export type VoucherCatalogueKind = "categories" | "collections" | "products" | "variants";

export interface CatalogueMembershipBucket<T extends { id: string } = { id: string }> {
  idsToAdd: string[];
  idsToRemove: string[];
  toDisplay: T[];
}

export interface VoucherCatalogueDraft {
  categories: CatalogueMembershipBucket;
  collections: CatalogueMembershipBucket;
  products: CatalogueMembershipBucket;
  variants: CatalogueMembershipBucket;
  /**
   * Staged full country-code list. `null` means countries are unchanged from the server.
   */
  countryCodes: string[] | null;
}

export const createEmptyCatalogueMembershipBucket = <
  T extends { id: string } = { id: string },
>(): CatalogueMembershipBucket<T> => ({
  idsToAdd: [],
  idsToRemove: [],
  toDisplay: [],
});

export const createEmptyVoucherCatalogueDraft = (): VoucherCatalogueDraft => ({
  categories: createEmptyCatalogueMembershipBucket(),
  collections: createEmptyCatalogueMembershipBucket(),
  products: createEmptyCatalogueMembershipBucket(),
  variants: createEmptyCatalogueMembershipBucket(),
  countryCodes: null,
});

/** Snapshot for comparisons/tests — do not mutate; prefer `createEmpty*` factories for state. */
export const EMPTY_CATALOGUE_MEMBERSHIP_BUCKET: CatalogueMembershipBucket =
  createEmptyCatalogueMembershipBucket();

export const EMPTY_VOUCHER_CATALOGUE_DRAFT: VoucherCatalogueDraft =
  createEmptyVoucherCatalogueDraft();

const withId = (ids: string[], id: string): string[] => (ids.includes(id) ? ids : [...ids, id]);
const withoutId = (ids: string[], id: string): string[] => ids.filter(existing => existing !== id);

export const hasCatalogueMembershipChanges = (bucket: CatalogueMembershipBucket): boolean =>
  bucket.idsToAdd.length > 0 || bucket.idsToRemove.length > 0;

export const hasVoucherCatalogueDraftChanges = (draft: VoucherCatalogueDraft): boolean =>
  hasCatalogueMembershipChanges(draft.categories) ||
  hasCatalogueMembershipChanges(draft.collections) ||
  hasCatalogueMembershipChanges(draft.products) ||
  hasCatalogueMembershipChanges(draft.variants);

export const hasVoucherCountriesDraftChanges = (draft: VoucherCatalogueDraft): boolean =>
  draft.countryCodes !== null;

export const adjustCatalogueCount = (
  serverCount: number | null | undefined,
  bucket: CatalogueMembershipBucket,
): number => Math.max(0, (serverCount ?? 0) + bucket.idsToAdd.length - bucket.idsToRemove.length);

export const stageCatalogueAdd = <T extends { id: string }>(
  bucket: CatalogueMembershipBucket<T>,
  items: T[],
): CatalogueMembershipBucket<T> => {
  if (items.length === 0) {
    return bucket;
  }

  const existingDisplayIds = new Set(bucket.toDisplay.map(item => item.id));
  const itemsToAdd = items.filter(item => !existingDisplayIds.has(item.id));

  if (itemsToAdd.length === 0) {
    return bucket;
  }

  let idsToAdd = bucket.idsToAdd;
  let idsToRemove = bucket.idsToRemove;

  for (const item of itemsToAdd) {
    if (idsToRemove.includes(item.id)) {
      idsToRemove = withoutId(idsToRemove, item.id);
    } else {
      idsToAdd = withId(idsToAdd, item.id);
    }
  }

  return {
    idsToAdd,
    idsToRemove,
    toDisplay: [...bucket.toDisplay, ...itemsToAdd],
  };
};

export const stageCatalogueRemove = <T extends { id: string }>(
  bucket: CatalogueMembershipBucket<T>,
  ids: string[],
): CatalogueMembershipBucket<T> => {
  if (ids.length === 0) {
    return bucket;
  }

  let idsToAdd = bucket.idsToAdd;
  let idsToRemove = bucket.idsToRemove;
  let toDisplay = bucket.toDisplay;

  for (const id of ids) {
    const wasStagedAdd = idsToAdd.includes(id);

    idsToAdd = withoutId(idsToAdd, id);
    idsToRemove = wasStagedAdd ? idsToRemove : withId(idsToRemove, id);
    toDisplay = toDisplay.filter(item => item.id !== id);
  }

  return { idsToAdd, idsToRemove, toDisplay };
};

interface ConnectionEdge<T> {
  node: T;
}

interface ConnectionLike<T> {
  edges: Array<ConnectionEdge<T>>;
  pageInfo?: unknown;
  __typename?: string;
}

export const applyCatalogueBucketToConnection = <T extends { id: string }>(
  connection: ConnectionLike<T> | null | undefined,
  bucket: CatalogueMembershipBucket,
): ConnectionLike<T> | null | undefined => {
  if (!hasCatalogueMembershipChanges(bucket) && bucket.toDisplay.length === 0) {
    return connection;
  }

  const removeSet = new Set(bucket.idsToRemove);
  const serverEdges = (connection?.edges ?? []).filter(edge => !removeSet.has(edge.node.id));
  const serverIds = new Set(serverEdges.map(edge => edge.node.id));
  const stagedEdges = bucket.toDisplay
    .filter(item => !serverIds.has(item.id) && !removeSet.has(item.id))
    .map(node => ({ node: node as T }));

  if (!connection && stagedEdges.length === 0) {
    return connection;
  }

  return {
    ...(connection ?? { edges: [] }),
    edges: [...stagedEdges, ...serverEdges],
  };
};

export const isIdAssignedWithDraft = (
  id: string,
  serverAssigned: boolean,
  bucket: CatalogueMembershipBucket,
): boolean => {
  if (bucket.idsToRemove.includes(id)) {
    return false;
  }

  if (bucket.idsToAdd.includes(id)) {
    return true;
  }

  return serverAssigned;
};

export const getCatalogueAddInput = (draft: VoucherCatalogueDraft): CatalogueInput | null => {
  const categories = draft.categories.idsToAdd;
  const collections = draft.collections.idsToAdd;
  const products = draft.products.idsToAdd;
  const variants = draft.variants.idsToAdd;
  const hasAdds =
    categories.length > 0 || collections.length > 0 || products.length > 0 || variants.length > 0;

  if (!hasAdds) {
    return null;
  }

  return { categories, collections, products, variants };
};

export const getCatalogueRemoveInput = (draft: VoucherCatalogueDraft): CatalogueInput | null => {
  const categories = draft.categories.idsToRemove;
  const collections = draft.collections.idsToRemove;
  const products = draft.products.idsToRemove;
  const variants = draft.variants.idsToRemove;
  const hasRemoves =
    categories.length > 0 || collections.length > 0 || products.length > 0 || variants.length > 0;

  if (!hasRemoves) {
    return null;
  }

  return { categories, collections, products, variants };
};
