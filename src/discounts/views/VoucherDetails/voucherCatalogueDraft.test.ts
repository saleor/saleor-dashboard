import {
  adjustCatalogueCount,
  applyCatalogueBucketToConnection,
  EMPTY_CATALOGUE_MEMBERSHIP_BUCKET,
  EMPTY_VOUCHER_CATALOGUE_DRAFT,
  getCatalogueAddInput,
  getCatalogueRemoveInput,
  hasVoucherCatalogueDraftChanges,
  hasVoucherCountriesDraftChanges,
  isIdAssignedWithDraft,
  stageCatalogueAdd,
  stageCatalogueRemove,
} from "./voucherCatalogueDraft";

describe("voucherCatalogueDraft", () => {
  it("stages adds and cancels a prior remove of the same id", () => {
    // Arrange
    const removed = stageCatalogueRemove(EMPTY_CATALOGUE_MEMBERSHIP_BUCKET, ["c1"]);

    // Act
    const result = stageCatalogueAdd(removed, [{ id: "c1" }]);

    // Assert
    expect(result.idsToRemove).toEqual([]);
    expect(result.idsToAdd).toEqual([]);
    expect(result.toDisplay).toEqual([{ id: "c1" }]);
  });

  it("stages removes and cancels a prior add of the same id", () => {
    // Arrange
    const added = stageCatalogueAdd(EMPTY_CATALOGUE_MEMBERSHIP_BUCKET, [{ id: "c1" }]);

    // Act
    const result = stageCatalogueRemove(added, ["c1"]);

    // Assert
    expect(result.idsToAdd).toEqual([]);
    expect(result.idsToRemove).toEqual([]);
    expect(result.toDisplay).toEqual([]);
  });

  it("adjusts counts from staged membership", () => {
    // Arrange
    const bucket = stageCatalogueAdd(
      stageCatalogueRemove(EMPTY_CATALOGUE_MEMBERSHIP_BUCKET, ["a"]),
      [{ id: "b" }],
    );

    // Act / Assert
    expect(adjustCatalogueCount(3, bucket)).toBe(3);
  });

  it("overlays connection edges with staged add/remove", () => {
    // Arrange
    const connection = {
      edges: [{ node: { id: "a" } }, { node: { id: "b" } }],
    };
    const bucket = stageCatalogueAdd(
      stageCatalogueRemove(EMPTY_CATALOGUE_MEMBERSHIP_BUCKET, ["a"]),
      [{ id: "c" }],
    );

    // Act
    const result = applyCatalogueBucketToConnection(connection, bucket);

    // Assert
    expect(result?.edges.map(edge => edge.node.id)).toEqual(["c", "b"]);
  });

  it("builds catalogue mutation inputs from draft diffs", () => {
    // Arrange
    const draft = {
      ...EMPTY_VOUCHER_CATALOGUE_DRAFT,
      categories: stageCatalogueAdd(EMPTY_CATALOGUE_MEMBERSHIP_BUCKET, [{ id: "c1" }]),
      products: stageCatalogueRemove(EMPTY_CATALOGUE_MEMBERSHIP_BUCKET, ["p1"]),
    };

    // Act / Assert
    expect(getCatalogueAddInput(draft)).toEqual({
      categories: ["c1"],
      collections: [],
      products: [],
      variants: [],
    });
    expect(getCatalogueRemoveInput(draft)).toEqual({
      categories: [],
      collections: [],
      products: ["p1"],
      variants: [],
    });
    expect(hasVoucherCatalogueDraftChanges(draft)).toBe(true);
    expect(hasVoucherCountriesDraftChanges(draft)).toBe(false);
  });

  it("treats draft membership as assigned for picker exclusion", () => {
    // Arrange
    const bucket = stageCatalogueAdd(EMPTY_CATALOGUE_MEMBERSHIP_BUCKET, [{ id: "c1" }]);
    const removed = stageCatalogueRemove(EMPTY_CATALOGUE_MEMBERSHIP_BUCKET, ["c2"]);

    // Assert
    expect(isIdAssignedWithDraft("c1", false, bucket)).toBe(true);
    expect(isIdAssignedWithDraft("c2", true, removed)).toBe(false);
    expect(isIdAssignedWithDraft("c3", true, EMPTY_CATALOGUE_MEMBERSHIP_BUCKET)).toBe(true);
  });
});
