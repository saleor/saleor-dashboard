import { type DatagridChangeOpts } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { type ProductDetailsVariantFragment } from "@dashboard/graphql";

import {
  buildVariantGridSubmitPayload,
  clearStagedVariantCreates,
  countPendingVariantGridEdits,
  createEmptyVariantGridStagedEdits,
  dedupeBulkCreateInputs,
  hasPendingVariantGridEdits,
  rehydrateVariantGridDatagridOpts,
  removeStagedVariantCreatesAtIndexes,
  stageVariantCreatesInStore,
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
    expect(payload.stagedCreates).toEqual([]);
  });

  it("stages generator creates across pagination and skips duplicates", () => {
    // Arrange
    let state = createEmptyVariantGridStagedEdits();
    const first = {
      name: "Red / S",
      sku: "RED-S",
      attributes: [{ id: "color", values: ["red"] }],
    };
    const duplicate = {
      name: "Red / S again",
      sku: "RED-S",
      attributes: [{ id: "color", values: ["red"] }],
    };
    const second = {
      name: "Blue / S",
      sku: "BLUE-S",
      attributes: [{ id: "color", values: ["blue"] }],
    };

    // Act
    const firstStage = stageVariantCreatesInStore(state, [first, duplicate]);

    state = firstStage.state;

    const secondStage = stageVariantCreatesInStore(state, [second, first]);

    state = secondStage.state;

    // Assert
    expect(firstStage.stagedCount).toBe(1);
    expect(firstStage.skippedCount).toBe(1);
    expect(secondStage.stagedCount).toBe(1);
    expect(secondStage.skippedCount).toBe(1);
    expect(state.creates).toHaveLength(2);
    expect(countPendingVariantGridEdits(state)).toBe(2);
    expect(buildVariantGridSubmitPayload(state).stagedCreates).toEqual([first, second]);
  });

  it("dedupes grid and staged create inputs before BulkCreate", () => {
    // Arrange
    const gridRow = {
      name: "Red",
      sku: "RED",
      attributes: [{ id: "color", values: ["red"] }],
    };
    const stagedDup = {
      name: "Red staged",
      sku: "RED",
      attributes: [{ id: "color", values: ["red"] }],
    };
    const stagedNew = {
      name: "Blue",
      sku: "BLUE",
      attributes: [{ id: "color", values: ["blue"] }],
    };

    // Act
    const { unique, skippedCount } = dedupeBulkCreateInputs([gridRow, stagedDup, stagedNew]);

    // Assert
    expect(unique).toEqual([gridRow, stagedNew]);
    expect(skippedCount).toBe(1);
  });

  it("clears staged creates after BulkCreate succeeded so retry cannot duplicate them", () => {
    // Arrange
    let state = createEmptyVariantGridStagedEdits();

    state = stageVariantCreatesInStore(state, [
      { name: "Red", sku: "RED", attributes: [{ id: "color", values: ["red"] }] },
    ]).state;
    state = stageVariantRemovalsInStore(state, ["v-keep-removal"]);

    // Act
    state = clearStagedVariantCreates(state);

    // Assert
    expect(state.creates).toEqual([]);
    expect(state.removedIds.has("v-keep-removal")).toBe(true);
  });

  it("removes staged creates by index for the draft list", () => {
    // Arrange
    let state = createEmptyVariantGridStagedEdits();

    state = stageVariantCreatesInStore(state, [
      { name: "Red", sku: "RED", attributes: [{ id: "color", values: ["red"] }] },
      { name: "Blue", sku: "BLUE", attributes: [{ id: "color", values: ["blue"] }] },
      { name: "Green", sku: "GREEN", attributes: [{ id: "color", values: ["green"] }] },
    ]).state;

    // Act
    state = removeStagedVariantCreatesAtIndexes(state, [0, 2]);

    // Assert
    expect(state.creates).toEqual([
      { name: "Blue", sku: "BLUE", attributes: [{ id: "color", values: ["blue"] }] },
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

  describe("countPendingVariantGridEdits", () => {
    it("counts distinct variants, not individual cell edits", () => {
      // Arrange — two columns edited on the same variant
      let state = createEmptyVariantGridStagedEdits();

      state = syncVariantGridStagedEditsFromPage(state, [createVariant("v1")], {
        added: [],
        removed: [],
        updates: [
          { column: "sku", row: 0, data: { value: "A" } },
          { column: "name", row: 0, data: { value: "Renamed" } },
        ],
      });

      // Act / Assert
      expect(countPendingVariantGridEdits(state)).toBe(1);
    });

    it("counts each edited and deleted variant once", () => {
      // Arrange
      let state = createEmptyVariantGridStagedEdits();

      state = syncVariantGridStagedEditsFromPage(
        state,
        [createVariant("v1"), createVariant("v2"), createVariant("v3")],
        {
          added: [],
          removed: [2],
          updates: [
            { column: "sku", row: 0, data: { value: "A" } },
            { column: "sku", row: 1, data: { value: "B" } },
          ],
        },
      );

      // Act / Assert — v1 + v2 edited, v3 deleted
      expect(countPendingVariantGridEdits(state)).toBe(3);
    });

    it("does not double-count a variant that is both updated and deleted", () => {
      // Arrange
      let state = createEmptyVariantGridStagedEdits();

      state = syncVariantGridStagedEditsFromPage(state, [createVariant("v1")], {
        added: [],
        removed: [],
        updates: [{ column: "sku", row: 0, data: { value: "A" } }],
      });
      state = stageVariantRemovalsInStore(state, ["v1"]);

      // Act / Assert
      expect(state.updatesById.has("v1")).toBe(false);
      expect(countPendingVariantGridEdits(state)).toBe(1);
    });
  });
});
