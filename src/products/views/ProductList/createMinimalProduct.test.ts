import { createMinimalProduct } from "./createMinimalProduct";

describe("createMinimalProduct", () => {
  const productCreate = jest.fn();
  const productVariantCreate = jest.fn();
  const productDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a variant product with name and type only", async () => {
    // Arrange
    productCreate.mockResolvedValue({
      data: { productCreate: { product: { id: "p1" }, errors: [] } },
    });

    // Act
    const result = await createMinimalProduct({
      name: "Bean Juice",
      productTypeId: "pt1",
      hasVariants: true,
      productCreate,
      productVariantCreate,
      productDelete,
    });

    // Assert
    expect(result).toEqual({ productId: "p1", errors: [] });
    expect(productCreate).toHaveBeenCalledWith({
      input: { name: "Bean Juice", productType: "pt1" },
    });
    expect(productVariantCreate).not.toHaveBeenCalled();
  });

  it("creates a default variant for simple product types", async () => {
    // Arrange
    productCreate.mockResolvedValue({
      data: { productCreate: { product: { id: "p1" }, errors: [] } },
    });
    productVariantCreate.mockResolvedValue({
      data: { productVariantCreate: { productVariant: { id: "v1" }, errors: [] } },
    });

    // Act
    const result = await createMinimalProduct({
      name: "Mug",
      productTypeId: "pt-simple",
      hasVariants: false,
      productCreate,
      productVariantCreate,
      productDelete,
    });

    // Assert
    expect(result.productId).toBe("p1");
    expect(productVariantCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        input: { attributes: [], name: "Mug", product: "p1" },
      }),
    );
    expect(productDelete).not.toHaveBeenCalled();
  });

  it("rolls back the product when default variant create fails", async () => {
    // Arrange
    productCreate.mockResolvedValue({
      data: { productCreate: { product: { id: "p1" }, errors: [] } },
    });
    productVariantCreate.mockResolvedValue({
      data: {
        productVariantCreate: {
          productVariant: null,
          errors: [{ message: "Attribute required", field: "attributes" }],
        },
      },
    });
    productDelete.mockResolvedValue({ data: { productDelete: { errors: [] } } });

    // Act
    const result = await createMinimalProduct({
      name: "Mug",
      productTypeId: "pt-simple",
      hasVariants: false,
      productCreate,
      productVariantCreate,
      productDelete,
    });

    // Assert
    expect(result.productId).toBeNull();
    expect(result.errors).toEqual([
      expect.objectContaining({ message: "Attribute required", field: "attributes" }),
    ]);
    expect(productDelete).toHaveBeenCalledWith({ id: "p1" });
  });

  it("returns productCreate errors without creating a variant", async () => {
    // Arrange
    productCreate.mockResolvedValue({
      data: {
        productCreate: {
          product: null,
          errors: [{ message: "Name required", field: "name" }],
        },
      },
    });

    // Act
    const result = await createMinimalProduct({
      name: "",
      productTypeId: "pt1",
      hasVariants: false,
      productCreate,
      productVariantCreate,
      productDelete,
    });

    // Assert
    expect(result.productId).toBeNull();
    expect(productVariantCreate).not.toHaveBeenCalled();
    expect(productDelete).not.toHaveBeenCalled();
  });
});
