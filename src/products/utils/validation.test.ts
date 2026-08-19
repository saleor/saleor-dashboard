import { type AttributeInput } from "@dashboard/components/Attributes";
import { ProductErrorCode, type ProductErrorWithAttributesFragment } from "@dashboard/graphql";
import { useIntl } from "react-intl";

import { type ProductCreateData } from "../components/ProductCreatePage";
import {
  expandRequiredAttributeErrors,
  type ProductVariantType,
  validateProductCreateData,
  validateProductVariant,
} from "./validation";

describe("validateProductCreateData", () => {
  it("returns errors when there is no productType or name", () => {
    // Arrange
    const data = { productType: "" } as unknown as ProductCreateData;
    // Act
    const errors = validateProductCreateData(data);

    // Assert
    expect(errors).toEqual([
      {
        __typename: "ProductError",
        attributes: [],
        code: "REQUIRED",
        field: "productType",
        message: null,
      },
      {
        __typename: "ProductError",
        attributes: [],
        code: "REQUIRED",
        field: "name",
        message: null,
      },
    ]);
  });
  it("returns errors when there is no prices for channels in simple product", () => {
    // Arrange
    const data = {
      productType: {
        hasVariants: false,
      },
      name: "something",
      channelListings: [
        { id: "chann-1", price: "" },
        { id: "chann-2", price: "" },
      ],
    } as unknown as ProductCreateData;
    // Act
    const errors = validateProductCreateData(data);

    // Assert
    expect(errors).toEqual([
      {
        __typename: "ProductError",
        attributes: [],
        code: "REQUIRED",
        field: "chann-1-channelListing-price",
        message: null,
      },
      {
        __typename: "ProductError",
        attributes: [],
        code: "REQUIRED",
        field: "chann-2-channelListing-price",
        message: null,
      },
    ]);
  });
  it("returns errors when there is no prices for channels in product with variants", () => {
    // Arrange
    const data = {
      productType: {
        hasVariants: true,
      },
      name: "something",
      channelListings: [
        { id: "chann-1", price: "" },
        { id: "chann-2", price: "" },
      ],
    } as unknown as ProductCreateData;
    // Act
    const errors = validateProductCreateData(data);

    // Assert
    expect(errors).toEqual([]);
  });
  it("returns empty errors when data is undefined", () => {
    // Arrange
    const data = undefined;
    // Act
    const errors = validateProductCreateData(data);

    // Assert
    expect(errors).toEqual([]);
  });
});

describe("validateProductVariant", () => {
  it("returns 'required' errors on product variant form if price is not provided", () => {
    const intl = useIntl();

    // Arrange
    const data = {
      channelListings: [
        {
          id: "channel1",
          value: {
            price: "",
          },
        },
        {
          id: "channel2",
          value: {
            price: null,
          },
        },
      ],
      variantName: "variant name",
    } as unknown as ProductVariantType;

    // Act
    const variantErrors = validateProductVariant(data, intl);

    // Assert
    expect(variantErrors[0]).toEqual({
      __typename: "ProductError",
      attributes: [],
      code: "REQUIRED",
      field: "channel1-channelListing-price",
      message: "This field cannot be blank",
    });
    expect(variantErrors[1]).toEqual({
      __typename: "ProductError",
      attributes: [],
      code: "REQUIRED",
      field: "channel2-channelListing-price",
      message: "This field cannot be blank",
    });
  });

  it("returns a required error for each empty required attribute", () => {
    const intl = useIntl();

    // Arrange
    const data = {
      channelListings: [{ id: "channel1", value: { price: "10" } }],
      variantName: "Large",
      attributes: [
        {
          id: "attr-color",
          label: "Color",
          value: [],
          data: { isRequired: true, values: [] },
        },
        {
          id: "attr-size",
          label: "Size",
          value: ["unset"],
          data: { isRequired: true, values: [] },
        },
        {
          id: "attr-material",
          label: "Material",
          value: ["cotton"],
          data: { isRequired: true, values: [] },
        },
        {
          id: "attr-note",
          label: "Note",
          value: [],
          data: { isRequired: false, values: [] },
        },
      ],
    } as unknown as ProductVariantType;

    // Act
    const variantErrors = validateProductVariant(data, intl);

    // Assert
    expect(variantErrors).toEqual([
      {
        __typename: "ProductError",
        attributes: ["attr-color"],
        code: "REQUIRED",
        field: "attributes",
        message: "This field cannot be blank",
      },
      {
        __typename: "ProductError",
        attributes: ["attr-size"],
        code: "REQUIRED",
        field: "attributes",
        message: "This field cannot be blank",
      },
    ]);
  });
});

describe("expandRequiredAttributeErrors", () => {
  it("splits a generic attributes REQUIRED error into one error per empty required attribute", () => {
    // Arrange
    const errors: ProductErrorWithAttributesFragment[] = [
      {
        __typename: "ProductError",
        code: ProductErrorCode.REQUIRED,
        field: "attributes",
        message: "All required attributes must take a value.",
        attributes: [],
      },
    ];
    const attributes = [
      {
        id: "attr-color",
        label: "Color",
        value: [],
        data: { isRequired: true, values: [] },
      },
      {
        id: "attr-size",
        label: "Size",
        value: ["unset"],
        data: { isRequired: true, values: [] },
      },
      {
        id: "attr-note",
        label: "Note",
        value: [],
        data: { isRequired: false, values: [] },
      },
    ] as unknown as AttributeInput[];

    // Act
    const expanded = expandRequiredAttributeErrors(errors, attributes);

    // Assert
    expect(expanded).toEqual([
      {
        __typename: "ProductError",
        code: ProductErrorCode.REQUIRED,
        field: "attributes",
        message: "All required attributes must take a value.",
        attributes: ["attr-color"],
      },
      {
        __typename: "ProductError",
        code: ProductErrorCode.REQUIRED,
        field: "attributes",
        message: "All required attributes must take a value.",
        attributes: ["attr-size"],
      },
    ]);
  });

  it("leaves errors that already name attributes unchanged", () => {
    // Arrange
    const errors: ProductErrorWithAttributesFragment[] = [
      {
        __typename: "ProductError",
        code: ProductErrorCode.REQUIRED,
        field: "attributes",
        message: "This field cannot be blank",
        attributes: ["attr-color"],
      },
    ];
    const attributes = [
      {
        id: "attr-color",
        label: "Color",
        value: [],
        data: { isRequired: true, values: [] },
      },
    ] as unknown as AttributeInput[];

    // Act
    const expanded = expandRequiredAttributeErrors(errors, attributes);

    // Assert
    expect(expanded).toEqual(errors);
  });
});
