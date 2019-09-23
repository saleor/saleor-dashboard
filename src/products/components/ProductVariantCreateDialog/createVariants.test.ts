import {
  createVariantFlatMatrixDimension,
  createVariants
} from "./createVariants";
import { thirdStep } from "./fixtures";
import { ProductVariantCreateFormData } from "./form";

describe("Creates variant matrix", () => {
  it("with proper size", () => {
    const attributes = thirdStep.attributes;

    const matrix = createVariantFlatMatrixDimension([[]], attributes);

    expect(matrix).toHaveLength(
      attributes.reduce((acc, attribute) => acc * attribute.values.length, 1)
    );
  });

  it("with constant price and stock", () => {
    const price = "49.99";
    const stock = 80;

    const data: ProductVariantCreateFormData = {
      ...thirdStep,
      price: {
        ...thirdStep.price,
        all: true,
        value: price
      },
      stock: {
        ...thirdStep.stock,
        all: true,
        value: stock.toString()
      }
    };

    const variants = createVariants(data);
    variants.forEach(variant => {
      expect(variant.priceOverride).toBe(price);
      expect(variant.quantity).toBe(stock);
    });
  });
});
