import { ProductTypeKindEnum } from "@dashboard/graphql";
import { type ProductTypeForm } from "@dashboard/productTypes/components/ProductTypeDetailsPage/ProductTypeDetailsPage";

import {
  getVariantSelectionFromAssigned,
  isProductTypeUpdateFormPristine,
} from "./productTypePageForm";

const initialData: ProductTypeForm = {
  hasVariants: true,
  isShippingRequired: false,
  kind: ProductTypeKindEnum.NORMAL,
  metadata: [],
  name: "E-books",
  privateMetadata: [],
  productAttributes: [{ label: "Author", value: "attr-1" }],
  taxClassId: "tax-1",
  variantAttributes: [{ label: "Size", value: "attr-2" }],
  weight: 1,
};

const initialVariantSelection = ["variant-1"];

describe("getVariantSelectionFromAssigned", () => {
  it("returns sorted ids for attributes with variant selection enabled", () => {
    // Arrange & Act
    const selection = getVariantSelectionFromAssigned([
      {
        variantSelection: false,
        attribute: { id: "b" },
      },
      {
        variantSelection: true,
        attribute: { id: "a" },
      },
    ]);

    // Assert
    expect(selection).toEqual(["a"]);
  });
});

describe("isProductTypeUpdateFormPristine", () => {
  it("returns true when only attribute lists differ", () => {
    // Arrange
    const current: ProductTypeForm = {
      ...initialData,
      productAttributes: [{ label: "Publisher", value: "attr-3" }],
    };

    // Act
    const pristine = isProductTypeUpdateFormPristine(
      current,
      initialData,
      initialVariantSelection,
      initialVariantSelection,
    );

    // Assert
    expect(pristine).toBe(true);
  });

  it("returns false when name changes", () => {
    // Arrange
    const current: ProductTypeForm = {
      ...initialData,
      name: "Print books",
    };

    // Act
    const pristine = isProductTypeUpdateFormPristine(
      current,
      initialData,
      initialVariantSelection,
      initialVariantSelection,
    );

    // Assert
    expect(pristine).toBe(false);
  });

  it("returns false when variant selection changes", () => {
    // Arrange
    const current: ProductTypeForm = {
      ...initialData,
    };

    // Act
    const pristine = isProductTypeUpdateFormPristine(
      current,
      initialData,
      ["variant-1", "variant-2"],
      initialVariantSelection,
    );

    // Assert
    expect(pristine).toBe(false);
  });

  it("returns true when edits are reverted", () => {
    // Arrange
    const current: ProductTypeForm = {
      ...initialData,
      name: "E-books",
      weight: 1,
    };

    // Act
    const pristine = isProductTypeUpdateFormPristine(
      current,
      initialData,
      initialVariantSelection,
      initialVariantSelection,
    );

    // Assert
    expect(pristine).toBe(true);
  });
});
