import { ProductTypeKindEnum } from "@dashboard/graphql";

import { buildProductTypeSaveComposition, hasProductTypeSaveComposition } from "./saveComposition";

const initialData = {
  name: "E-books",
  kind: ProductTypeKindEnum.NORMAL,
  isShippingRequired: false,
  taxClassId: "tax-1",
  weight: 1 as number | undefined,
};

const initialVariantSelection = ["variant-1"];

describe("buildProductTypeSaveComposition", () => {
  it("is empty when save-gated fields match", () => {
    // Arrange & Act
    const composition = buildProductTypeSaveComposition(
      initialData,
      initialData,
      initialVariantSelection,
      initialVariantSelection,
    );

    // Assert
    expect(composition).toEqual({
      hasGeneral: false,
      hasShipping: false,
      hasTaxes: false,
      hasVariantSelection: false,
    });
    expect(hasProductTypeSaveComposition(composition)).toBe(false);
  });

  it("marks general when name or kind changes", () => {
    // Arrange & Act
    const nameComposition = buildProductTypeSaveComposition(
      { ...initialData, name: "Print books" },
      initialData,
      initialVariantSelection,
      initialVariantSelection,
    );
    const kindComposition = buildProductTypeSaveComposition(
      { ...initialData, kind: ProductTypeKindEnum.GIFT_CARD },
      initialData,
      initialVariantSelection,
      initialVariantSelection,
    );

    // Assert
    expect(nameComposition.hasGeneral).toBe(true);
    expect(kindComposition.hasGeneral).toBe(true);
    expect(nameComposition.hasShipping).toBe(false);
  });

  it("marks shipping when weight or shipping required changes", () => {
    // Arrange & Act
    const composition = buildProductTypeSaveComposition(
      { ...initialData, isShippingRequired: true, weight: 2 },
      initialData,
      initialVariantSelection,
      initialVariantSelection,
    );

    // Assert
    expect(composition.hasShipping).toBe(true);
    expect(composition.hasGeneral).toBe(false);
  });

  it("marks taxes when the tax class changes", () => {
    // Arrange & Act
    const composition = buildProductTypeSaveComposition(
      { ...initialData, taxClassId: "tax-2" },
      initialData,
      initialVariantSelection,
      initialVariantSelection,
    );

    // Assert
    expect(composition.hasTaxes).toBe(true);
  });

  it("marks variant selection when picker checkboxes change", () => {
    // Arrange & Act
    const composition = buildProductTypeSaveComposition(
      initialData,
      initialData,
      ["variant-1", "variant-2"],
      initialVariantSelection,
    );

    // Assert
    expect(composition.hasVariantSelection).toBe(true);
    expect(hasProductTypeSaveComposition(composition)).toBe(true);
  });
});
