import { useIntl } from "react-intl";

import { ProductCreateData } from "../components/ProductCreatePage";
import {
  ProductVariantType,
  validateProductCreateData,
  validateProductVariant,
} from "./validation";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
}));

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
  it("returns empty errors when data is undefined", () => {
    // Arrange
    const data = undefined;
    // Act
    const errors = validateProductCreateData(data);

    // Assert
    expect(errors).toEqual([]);
  });
});
