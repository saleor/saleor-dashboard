import { Products } from "./types";
import { isProductSelected } from "./utils";

describe("isProductSelected", () => {
  it("should return false if product id is not provided", () => {
    // Arrange
    const selectedProducts = [{ id: "1" }, { id: "2" }] as Products;
    const productId = undefined;

    // Act
    const result = isProductSelected(selectedProducts, productId);

    // Assert
    expect(result).toEqual(false);
  });

  it("should return false if product id is not in selected products", () => {
    // Arrange
    const selectedProducts = [{ id: "1" }, { id: "2" }] as Products;
    const productId = "3";

    // Act
    const result = isProductSelected(selectedProducts, productId);

    // Assert
    expect(result).toEqual(false);
  });

  it("should return false if no selected product", () => {
    // Arrange
    const selectedProducts = [] as Products;
    const productId = "1";

    // Act
    const result = isProductSelected(selectedProducts, productId);

    // Assert
    expect(result).toEqual(false);
  });

  it("should return true if product id is in selected products", () => {
    // Arrange
    const selectedProducts = [{ id: "1" }, { id: "2" }] as Products;
    const productId = "2";

    // Act
    const result = isProductSelected(selectedProducts, productId);

    // Assert
    expect(result).toEqual(true);
  });
});
