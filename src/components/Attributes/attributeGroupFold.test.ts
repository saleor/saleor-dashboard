import {
  ATTRIBUTE_GROUP_FOLD_STORAGE_KEY,
  isAttributeGroupExpanded,
  withAttributeGroupExpanded,
} from "./attributeGroupFold";

describe("attribute group fold", () => {
  it("stays collapsed until this type has been opened", () => {
    // Arrange
    const folds = withAttributeGroupExpanded({
      folds: {},
      view: "product",
      typeId: "shoes",
      attributeId: "related",
      expanded: true,
    });

    // Assert
    expect(ATTRIBUTE_GROUP_FOLD_STORAGE_KEY).toBe("attributeReferenceGroupFold");
    expect(
      isAttributeGroupExpanded({
        folds,
        view: "product",
        typeId: "shoes",
        attributeId: "related",
      }),
    ).toBe(true);
    expect(
      isAttributeGroupExpanded({
        folds,
        view: "product",
        typeId: "bags",
        attributeId: "related",
      }),
    ).toBe(false);
    expect(
      isAttributeGroupExpanded({
        folds,
        view: "variant",
        typeId: "shoes",
        attributeId: "related",
      }),
    ).toBe(false);
    expect(
      isAttributeGroupExpanded({
        folds: {},
        view: "product",
        typeId: "shoes",
        attributeId: "related",
      }),
    ).toBe(false);
  });
});
