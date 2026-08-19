import {
  type DatagridChange,
  type DatagridChangeOpts,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import {
  type ProductDetailsVariantFragment,
  type ProductVariantBulkCreateInput,
} from "@dashboard/graphql";

export interface VariantColumnUpdate {
  column: string;
  data: unknown;
}

export interface VariantGridStagedEditsState {
  snapshots: Map<string, ProductDetailsVariantFragment>;
  removedIds: Set<string>;
  updatesById: Map<string, VariantColumnUpdate[]>;
  /** Generator (and future) creates waiting for product Save — survive pagination. */
  creates: ProductVariantBulkCreateInput[];
}

export const createEmptyVariantGridStagedEdits = (): VariantGridStagedEditsState => ({
  snapshots: new Map(),
  removedIds: new Set(),
  updatesById: new Map(),
  creates: [],
});

export const hasPendingVariantGridEdits = (state: VariantGridStagedEditsState): boolean =>
  state.removedIds.size > 0 || state.updatesById.size > 0 || state.creates.length > 0;

export const countPendingVariantGridEdits = (state: VariantGridStagedEditsState): number => {
  const updatedIds = [...state.updatesById.keys()].filter(id => !state.removedIds.has(id));

  return state.removedIds.size + updatedIds.length + state.creates.length;
};

export const countPendingVariantGridCreates = (state: VariantGridStagedEditsState): number =>
  state.creates.length;

/**
 * Maps a datagrid visual row (post-removal, excluding added rows) to a variant id
 * on the current page.
 */
export const resolveVariantIdForUpdateRow = ({
  row,
  variants,
  added,
  removed,
}: {
  row: number;
  variants: ProductDetailsVariantFragment[];
  added: number[];
  removed: number[];
}): string | null => {
  if (added.includes(row)) {
    return null;
  }

  const dataRow = variants.filter((_, index) => !removed.includes(index))[row];

  return dataRow?.id ?? null;
};

/**
 * Merge current-page datagrid changes into the ID-keyed store.
 * Page-local `added` rows are ignored here (they have no server id yet).
 */
export const syncVariantGridStagedEditsFromPage = (
  state: VariantGridStagedEditsState,
  variants: ProductDetailsVariantFragment[],
  data: DatagridChangeOpts,
): VariantGridStagedEditsState => {
  const snapshots = new Map(state.snapshots);
  const removedIds = new Set(state.removedIds);
  const updatesById = new Map(state.updatesById);

  variants.forEach(variant => {
    snapshots.set(variant.id, variant);
  });

  const pageIds = new Set(variants.map(variant => variant.id));

  // Replace this page's contribution to removals.
  pageIds.forEach(id => {
    removedIds.delete(id);
  });
  data.removed.forEach(index => {
    const id = variants[index]?.id;

    if (id) {
      removedIds.add(id);
      updatesById.delete(id);
    }
  });

  // Replace this page's contribution to column updates.
  pageIds.forEach(id => {
    if (!removedIds.has(id)) {
      updatesById.delete(id);
    }
  });

  const updatesForId = new Map<string, VariantColumnUpdate[]>();

  data.updates.forEach(update => {
    const variantId = resolveVariantIdForUpdateRow({
      row: update.row,
      variants,
      added: data.added,
      removed: data.removed,
    });

    if (!variantId || removedIds.has(variantId)) {
      return;
    }

    const columnUpdates = updatesForId.get(variantId) ?? [];
    const existingIndex = columnUpdates.findIndex(item => item.column === update.column);

    const nextUpdate: VariantColumnUpdate = {
      column: update.column,
      data: update.data,
    };

    if (existingIndex === -1) {
      columnUpdates.push(nextUpdate);
    } else {
      columnUpdates[existingIndex] = nextUpdate;
    }

    updatesForId.set(variantId, columnUpdates);
  });

  updatesForId.forEach((columnUpdates, variantId) => {
    updatesById.set(variantId, columnUpdates);
  });

  return { snapshots, removedIds, updatesById, creates: state.creates };
};

/**
 * Rebuild index-based datagrid state for the variants currently on screen.
 */
export const rehydrateVariantGridDatagridOpts = (
  state: VariantGridStagedEditsState,
  variants: ProductDetailsVariantFragment[],
): DatagridChangeOpts => {
  const removed: number[] = [];

  variants.forEach((variant, index) => {
    if (state.removedIds.has(variant.id)) {
      removed.push(index);
    }
  });

  const updates: DatagridChange[] = [];
  let visualRow = 0;

  variants.forEach(variant => {
    if (state.removedIds.has(variant.id)) {
      return;
    }

    const columnUpdates = state.updatesById.get(variant.id) ?? [];

    columnUpdates.forEach(columnUpdate => {
      updates.push({
        column: columnUpdate.column,
        data: columnUpdate.data,
        row: visualRow,
      });
    });

    visualRow += 1;
  });

  return {
    added: [],
    removed,
    updates,
  };
};

export interface VariantGridSubmitPayload {
  removedVariantIds: string[];
  updateVariants: ProductDetailsVariantFragment[];
  updateChanges: DatagridChangeOpts;
  /** Staged bulk creates from the generator (and similar) waiting for Save. */
  stagedCreates: ProductVariantBulkCreateInput[];
}

/**
 * Build handler inputs for cross-page deletes/updates/creates from the staged store.
 * Page-local datagrid `added` rows are still taken from the live datagrid opts.
 */
export const buildVariantGridSubmitPayload = (
  state: VariantGridStagedEditsState,
): VariantGridSubmitPayload => {
  const removedVariantIds = [...state.removedIds];
  const updateVariants: ProductDetailsVariantFragment[] = [];
  const updates: DatagridChange[] = [];

  [...state.updatesById.entries()].forEach(([variantId, columnUpdates]) => {
    if (state.removedIds.has(variantId)) {
      return;
    }

    const snapshot = state.snapshots.get(variantId);

    if (!snapshot) {
      return;
    }

    const row = updateVariants.length;

    updateVariants.push(snapshot);
    columnUpdates.forEach(columnUpdate => {
      updates.push({
        column: columnUpdate.column,
        data: columnUpdate.data,
        row,
      });
    });
  });

  return {
    removedVariantIds,
    updateVariants,
    updateChanges: {
      added: [],
      removed: [],
      updates,
    },
    stagedCreates: [...state.creates],
  };
};

/** Mark variants for deletion across pages (by id). */
export const stageVariantRemovalsInStore = (
  state: VariantGridStagedEditsState,
  ids: string[],
): VariantGridStagedEditsState => {
  if (ids.length === 0) {
    return state;
  }

  const removedIds = new Set(state.removedIds);
  const updatesById = new Map(state.updatesById);

  ids.forEach(id => {
    removedIds.add(id);
    updatesById.delete(id);
  });

  return {
    ...state,
    removedIds,
    updatesById,
  };
};

const attributeSignature = (input: ProductVariantBulkCreateInput): string => {
  const attributes = input.attributes ?? [];

  return attributes
    .map(attribute => {
      const values = [
        ...(attribute.values ?? []),
        attribute.dropdown?.value,
        attribute.swatch?.value,
        attribute.plainText,
        attribute.boolean === undefined ? undefined : String(attribute.boolean),
        attribute.numeric,
        attribute.date,
        attribute.dateTime,
      ]
        .filter((value): value is string => Boolean(value))
        .sort()
        .join(",");

      return `${attribute.id}:${values}`;
    })
    .sort()
    .join("|");
};

/**
 * Append generator (or other) bulk-create inputs to the staged draft.
 * Drops rows that collide with an already staged create (same attributes or SKU).
 */
export const stageVariantCreatesInStore = (
  state: VariantGridStagedEditsState,
  inputs: ProductVariantBulkCreateInput[],
): { state: VariantGridStagedEditsState; stagedCount: number; skippedCount: number } => {
  if (inputs.length === 0) {
    return { state, stagedCount: 0, skippedCount: 0 };
  }

  const { unique, skippedCount } = dedupeBulkCreateInputs(inputs, state.creates);

  if (unique.length === 0) {
    return { state, stagedCount: 0, skippedCount };
  }

  return {
    state: {
      ...state,
      creates: [...state.creates, ...unique],
    },
    stagedCount: unique.length,
    skippedCount,
  };
};

/**
 * Drop bulk-create inputs that collide with an existing set (by attribute signature or SKU).
 * Used when merging page-local adds with staged generator creates before Save.
 */
export const dedupeBulkCreateInputs = (
  inputs: ProductVariantBulkCreateInput[],
  alreadyPresent: ProductVariantBulkCreateInput[] = [],
): { unique: ProductVariantBulkCreateInput[]; skippedCount: number } => {
  const existingSignatures = new Set(alreadyPresent.map(attributeSignature));
  const existingSkus = new Set(
    alreadyPresent.map(create => create.sku).filter((sku): sku is string => Boolean(sku)),
  );

  const unique: ProductVariantBulkCreateInput[] = [];
  let skippedCount = 0;

  inputs.forEach(input => {
    const signature = attributeSignature(input);
    const sku = input.sku ?? undefined;

    if (existingSignatures.has(signature) || (sku && existingSkus.has(sku))) {
      skippedCount += 1;

      return;
    }

    existingSignatures.add(signature);

    if (sku) {
      existingSkus.add(sku);
    }

    unique.push(input);
  });

  return { unique, skippedCount };
};

/** Clear accepted generator creates after the API has persisted them. */
export const clearStagedVariantCreates = (
  state: VariantGridStagedEditsState,
): VariantGridStagedEditsState => ({
  ...state,
  creates: [],
});

/** Replace the full staged creates list (draft datagrid edits). */
export const replaceStagedVariantCreates = (
  state: VariantGridStagedEditsState,
  creates: ProductVariantBulkCreateInput[],
): VariantGridStagedEditsState => ({
  ...state,
  creates,
});

/** Drop staged creates by index (draft-grid remove selected). */
export const removeStagedVariantCreatesAtIndexes = (
  state: VariantGridStagedEditsState,
  indexes: number[],
): VariantGridStagedEditsState => {
  if (indexes.length === 0) {
    return state;
  }

  const toRemove = new Set(indexes);

  return {
    ...state,
    creates: state.creates.filter((_, index) => !toRemove.has(index)),
  };
};
