import {
  buildProductSaveComposition,
  hasProductSaveComposition,
  PRODUCT_DETAILS_SAVE_FIELDS,
} from "./saveComposition";

const emptyInput = {
  changedFieldNames: [] as string[],
  descriptionDirty: false,
  attributesDirty: false,
  dirtyChannelCount: 0,
  variantEditCount: 0,
  variantCreateCount: 0,
  variantDeleteCount: 0,
};

describe("buildProductSaveComposition", () => {
  it.each([...PRODUCT_DETAILS_SAVE_FIELDS])(
    "marks details when productUpdate field %s changed",
    field => {
      // Arrange / Act
      const composition = buildProductSaveComposition({
        ...emptyInput,
        changedFieldNames: [field],
      });

      // Assert
      expect(composition.hasDetails).toBe(true);
      expect(hasProductSaveComposition(composition)).toBe(true);
    },
  );

  it("ignores non-productUpdate fields such as sku in changedFieldNames", () => {
    // Arrange / Act
    const composition = buildProductSaveComposition({
      ...emptyInput,
      changedFieldNames: ["sku", "trackInventory", "isPreorder"],
    });

    // Assert
    expect(composition.hasDetails).toBe(false);
    expect(hasProductSaveComposition(composition)).toBe(false);
  });

  it("marks details for description or attribute edits without scalar field changes", () => {
    // Arrange / Act
    const fromDescription = buildProductSaveComposition({
      ...emptyInput,
      descriptionDirty: true,
    });
    const fromAttributes = buildProductSaveComposition({
      ...emptyInput,
      attributesDirty: true,
    });

    // Assert
    expect(fromDescription.hasDetails).toBe(true);
    expect(fromAttributes.hasDetails).toBe(true);
  });

  it("aggregates channel and variant pending work independently of details", () => {
    // Arrange / Act
    const composition = buildProductSaveComposition({
      ...emptyInput,
      dirtyChannelCount: 2,
      variantEditCount: 3,
      variantCreateCount: 1,
      variantDeleteCount: 4,
    });

    // Assert
    expect(composition).toEqual({
      hasDetails: false,
      dirtyChannelCount: 2,
      variantEditCount: 3,
      variantCreateCount: 1,
      variantDeleteCount: 4,
    });
    expect(hasProductSaveComposition(composition)).toBe(true);
  });

  it("clamps negative counts to zero", () => {
    // Arrange / Act
    const composition = buildProductSaveComposition({
      ...emptyInput,
      dirtyChannelCount: -1,
      variantEditCount: -2,
      variantCreateCount: -3,
      variantDeleteCount: -4,
    });

    // Assert
    expect(composition.dirtyChannelCount).toBe(0);
    expect(composition.variantEditCount).toBe(0);
    expect(composition.variantCreateCount).toBe(0);
    expect(composition.variantDeleteCount).toBe(0);
    expect(hasProductSaveComposition(composition)).toBe(false);
  });

  it("is empty only when every segment is clean", () => {
    // Arrange / Act
    const composition = buildProductSaveComposition(emptyInput);

    // Assert
    expect(hasProductSaveComposition(composition)).toBe(false);
  });

  it.each([
    ["details", { ...emptyInput, changedFieldNames: ["name"] }],
    ["channels", { ...emptyInput, dirtyChannelCount: 1 }],
    ["variant edits", { ...emptyInput, variantEditCount: 1 }],
    ["variant creates", { ...emptyInput, variantCreateCount: 1 }],
    ["variant deletes", { ...emptyInput, variantDeleteCount: 1 }],
  ] as const)("has unsaved work when only %s is dirty", (_label, input) => {
    // Arrange / Act
    const composition = buildProductSaveComposition(input);

    // Assert
    expect(hasProductSaveComposition(composition)).toBe(true);
  });
});
