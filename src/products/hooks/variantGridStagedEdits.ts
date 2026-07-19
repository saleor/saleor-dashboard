import {
  type DatagridChange,
  type DatagridChangeOpts,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { type ProductDetailsVariantFragment } from "@dashboard/graphql";

export interface VariantColumnUpdate {
  column: string;
  data: unknown;
}

export interface VariantGridStagedEditsState {
  snapshots: Map<string, ProductDetailsVariantFragment>;
  removedIds: Set<string>;
  updatesById: Map<string, VariantColumnUpdate[]>;
}

export const createEmptyVariantGridStagedEdits = (): VariantGridStagedEditsState => ({
  snapshots: new Map(),
  removedIds: new Set(),
  updatesById: new Map(),
});

export const hasPendingVariantGridEdits = (state: VariantGridStagedEditsState): boolean =>
  state.removedIds.size > 0 || state.updatesById.size > 0;

export const countPendingVariantGridEdits = (state: VariantGridStagedEditsState): number => {
  const updatedIds = [...state.updatesById.keys()].filter(id => !state.removedIds.has(id));

  return state.removedIds.size + updatedIds.length;
};

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

  return { snapshots, removedIds, updatesById };
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
}

/**
 * Build handler inputs for cross-page deletes/updates from the staged store.
 * Create (`added`) stays page-local and is taken from the live datagrid opts.
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
