import { ProductTypeKindEnum } from "@dashboard/graphql";
import { type ProductTypeForm } from "@dashboard/productTypes/components/ProductTypeDetailsPage/ProductTypeDetailsPage";

import {
  buildProductTypeSaveInput,
  buildVariantSelectionOperations,
  findProductTypeAttributeName,
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

describe("findProductTypeAttributeName", () => {
  it("finds variant attributes on the assigned list, not only variantAttributes", () => {
    // Arrange
    const productType = {
      productAttributes: [{ id: "p-1", name: "Brand" }],
      variantAttributes: [],
      assignedVariantAttributes: [
        { variantSelection: true, attribute: { id: "v-1", name: "Size" } },
      ],
    };

    // Act & Assert
    expect(findProductTypeAttributeName(productType, "v-1")).toBe("Size");
    expect(findProductTypeAttributeName(productType, "p-1")).toBe("Brand");
    expect(findProductTypeAttributeName(productType, undefined)).toBeUndefined();
  });
});

describe("buildProductTypeSaveInput", () => {
  it("omits live attribute membership and hasVariants", () => {
    // Arrange & Act
    const input = buildProductTypeSaveInput(initialData);

    // Assert
    expect(input).toEqual({
      isShippingRequired: false,
      name: "E-books",
      kind: ProductTypeKindEnum.NORMAL,
      taxClass: "tax-1",
      weight: 1,
    });
    expect(input).not.toHaveProperty("hasVariants");
    expect(input).not.toHaveProperty("productAttributes");
    expect(input).not.toHaveProperty("variantAttributes");
  });
});

describe("buildVariantSelectionOperations", () => {
  it("uses the live assigned list, not a stale form snapshot", () => {
    // Arrange & Act
    const operations = buildVariantSelectionOperations(
      [
        { variantSelection: true, attribute: { id: "attr-1" } },
        { variantSelection: false, attribute: { id: "attr-2" } },
      ],
      ["attr-2"],
    );

    // Assert
    expect(operations).toEqual([
      { id: "attr-1", variantSelection: false },
      { id: "attr-2", variantSelection: true },
    ]);
  });
});

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
