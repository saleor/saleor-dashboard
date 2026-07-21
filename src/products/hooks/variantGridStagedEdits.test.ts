import { type DatagridChangeOpts } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { type ProductDetailsVariantFragment } from "@dashboard/graphql";

import {
  buildVariantGridSubmitPayload,
  createEmptyVariantGridStagedEdits,
  hasPendingVariantGridEdits,
  rehydrateVariantGridDatagridOpts,
  stageVariantRemovalsInStore,
  syncVariantGridStagedEditsFromPage,
} from "./variantGridStagedEdits";

const createVariant = (
  id: string,
  overrides: Partial<ProductDetailsVariantFragment> = {},
): ProductDetailsVariantFragment =>
  ({
    id,
    name: id,
    sku: id,
    ...overrides,
  }) as ProductDetailsVariantFragment;

describe("variantGridStagedEdits", () => {
  it("syncs updates and removals by variant id across pages", () => {
    // Arrange
    let state = createEmptyVariantGridStagedEdits();
    const page1 = [createVariant("v1"), createVariant("v2")];
    const page1Changes: DatagridChangeOpts = {
      added: [],
      removed: [1],
      updates: [{ column: "sku", row: 0, data: { value: "NEW-SKU" } }],
    };

    // Act
    state = syncVariantGridStagedEditsFromPage(state, page1, page1Changes);

    // Assert
    expect(state.removedIds.has("v2")).toBe(true);
    expect(state.updatesById.get("v1")).toEqual([{ column: "sku", data: { value: "NEW-SKU" } }]);
    expect(hasPendingVariantGridEdits(state)).toBe(true);

    // Arrange — move to another page and sync an edit there
    const page2 = [createVariant("v3")];
    const page2Changes: DatagridChangeOpts = {
      added: [],
      removed: [],
      updates: [{ column: "name", row: 0, data: { value: "Renamed" } }],
    };

    // Act
    state = syncVariantGridStagedEditsFromPage(state, page2, page2Changes);

    // Assert — page1 staged edits survive
    expect(state.removedIds.has("v2")).toBe(true);
    expect(state.updatesById.get("v1")).toEqual([{ column: "sku", data: { value: "NEW-SKU" } }]);
    expect(state.updatesById.get("v3")).toEqual([{ column: "name", data: { value: "Renamed" } }]);
  });

  it("rehydrates index-based opts for the current page", () => {
    // Arrange
    let state = createEmptyVariantGridStagedEdits();

    state = syncVariantGridStagedEditsFromPage(state, [createVariant("v1"), createVariant("v2")], {
      added: [],
      removed: [0],
      updates: [{ column: "sku", row: 0, data: { value: "X" } }],
    });
    // After removing index 0, visual row 0 is v2 — but sync mapped update before we think...
    // In real datagrid, updates use post-removal indices. Simulate: remove v1, update v2 at row 0.
    state = createEmptyVariantGridStagedEdits();
    state = syncVariantGridStagedEditsFromPage(state, [createVariant("v1"), createVariant("v2")], {
      added: [],
      removed: [0],
      updates: [{ column: "sku", row: 0, data: { value: "X" } }],
    });

    // Act
    const rehydrated = rehydrateVariantGridDatagridOpts(state, [
      createVariant("v1"),
      createVariant("v2"),
      createVariant("v3"),
    ]);

    // Assert
    expect(rehydrated.removed).toEqual([0]);
    expect(rehydrated.updates).toEqual([{ column: "sku", row: 0, data: { value: "X" } }]);
  });

  it("builds submit payload from snapshots across pages", () => {
    // Arrange
    let state = createEmptyVariantGridStagedEdits();

    state = syncVariantGridStagedEditsFromPage(state, [createVariant("v1")], {
      added: [],
      removed: [],
      updates: [{ column: "sku", row: 0, data: { value: "A" } }],
    });
    state = syncVariantGridStagedEditsFromPage(state, [createVariant("v2")], {
      added: [],
      removed: [0],
      updates: [],
    });

    // Act
    const payload = buildVariantGridSubmitPayload(state);

    // Assert
    expect(payload.removedVariantIds).toEqual(["v2"]);
    expect(payload.updateVariants.map(variant => variant.id)).toEqual(["v1"]);
    expect(payload.updateChanges.updates).toEqual([
      { column: "sku", row: 0, data: { value: "A" } },
    ]);
  });

  it("stages removals by id without requiring the variant to be on the current page", () => {
    // Arrange
    let state = createEmptyVariantGridStagedEdits();

    state = syncVariantGridStagedEditsFromPage(state, [createVariant("v1")], {
      added: [],
      removed: [],
      updates: [{ column: "name", row: 0, data: { value: "Keep me" } }],
    });

    // Act
    state = stageVariantRemovalsInStore(state, ["v2", "v3"]);

    // Assert
    expect(state.removedIds.has("v2")).toBe(true);
    expect(state.removedIds.has("v3")).toBe(true);
    expect(state.updatesById.get("v1")).toEqual([{ column: "name", data: { value: "Keep me" } }]);
  });
});
