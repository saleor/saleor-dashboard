import { ProductCreateData } from "../components/ProductCreatePage";
import { validateProductCreateData } from "./validation";

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
        field: "chann-1-channel-price",
        message: null,
      },
      {
        __typename: "ProductError",
        attributes: [],
        code: "REQUIRED",
        field: "chann-2-channel-price",
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
});
