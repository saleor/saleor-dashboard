import { useIntl } from "react-intl";

import { ProductCreateData } from "../components/ProductCreatePage";
import {
  ProductVariantType,
  validatePriorPrice,
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

describe("validatePriorPrice", () => {
  it("returns false when prior price is empty", () => {
    // Arrange & Act
    const result = validatePriorPrice("", "100");

    // Assert
    expect(result).toBe(false);
  });

  it("returns false when selling price is empty", () => {
    // Arrange & Act
    const result = validatePriorPrice("150", "");

    // Assert
    expect(result).toBe(false);
  });

  it("returns false when both prices are empty", () => {
    // Arrange & Act
    const result = validatePriorPrice("", "");

    // Assert
    expect(result).toBe(false);
  });

  it("returns true when prior price is less than selling price", () => {
    // Arrange & Act
    const result = validatePriorPrice("50", "100");

    // Assert
    expect(result).toBe(true);
  });

  it("returns false when prior price is equal to selling price", () => {
    // Arrange & Act
    const result = validatePriorPrice("100", "100");

    // Assert
    expect(result).toBe(false);
  });

  it("returns false when prior price is greater than selling price", () => {
    // Arrange & Act
    const result = validatePriorPrice("150", "100");

    // Assert
    expect(result).toBe(false);
  });

  it("handles decimal prices correctly", () => {
    // Arrange & Act
    const result1 = validatePriorPrice("99.99", "100.00");
    const result2 = validatePriorPrice("150.50", "100.00");

    // Assert
    expect(result1).toBe(true);
    expect(result2).toBe(false);
  });
});

describe("validateProductVariant with priorPrice", () => {
  it("returns validation error when prior price is less than selling price", () => {
    const intl = useIntl();

    // Arrange
    const data = {
      channelListings: [
        {
          id: "channel1",
          value: {
            price: "100",
            priorPrice: "50",
          },
        },
      ],
      variantName: "variant name",
    } as unknown as ProductVariantType;

    // Act
    const errors = validateProductVariant(data, intl);

    // Assert
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual({
      __typename: "ProductError",
      attributes: [],
      code: "INVALID",
      field: "channel1-channel-priorPrice",
      message: "Prior price must be greater than or equal to selling price",
    });
  });

  it("returns no validation error when prior price is greater than selling price", () => {
    const intl = useIntl();

    // Arrange
    const data = {
      channelListings: [
        {
          id: "channel1",
          value: {
            price: "100",
            priorPrice: "150",
          },
        },
      ],
      variantName: "variant name",
    } as unknown as ProductVariantType;

    // Act
    const errors = validateProductVariant(data, intl);

    // Assert
    expect(errors).toHaveLength(0);
  });

  it("returns no validation error when prior price is empty", () => {
    const intl = useIntl();

    // Arrange
    const data = {
      channelListings: [
        {
          id: "channel1",
          value: {
            price: "100",
            priorPrice: "",
          },
        },
      ],
      variantName: "variant name",
    } as unknown as ProductVariantType;

    // Act
    const errors = validateProductVariant(data, intl);

    // Assert
    expect(errors).toHaveLength(0);
  });

  it("returns validation error for multiple channels with invalid prior prices", () => {
    const intl = useIntl();

    // Arrange
    const data = {
      channelListings: [
        {
          id: "channel1",
          value: {
            price: "100",
            priorPrice: "50",
          },
        },
        {
          id: "channel2",
          value: {
            price: "200",
            priorPrice: "100",
          },
        },
      ],
      variantName: "variant name",
    } as unknown as ProductVariantType;

    // Act
    const errors = validateProductVariant(data, intl);

    // Assert
    expect(errors).toHaveLength(2);
    expect(errors[0].field).toBe("channel1-channel-priorPrice");
    expect(errors[1].field).toBe("channel2-channel-priorPrice");
  });
});
