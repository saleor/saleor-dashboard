import {
  createVariantFlatMatrixDimension,
  createVariants
} from "./createVariants";
import { attributes, thirdStep } from "./fixtures";
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
    expect(variants).toHaveLength(
      thirdStep.attributes.reduce(
        (acc, attribute) => acc * attribute.values.length,
        1
      )
    );

    variants.forEach(variant => {
      expect(variant.priceOverride).toBe(price);
      expect(variant.quantity).toBe(stock);
    });
  });

  it("with constant stock and attribute dependent price", () => {
    const price = 49.99;
    const stock = 80;
    const attribute = attributes.find(
      attribute => attribute.id === thirdStep.attributes[0].id
    );

    const data: ProductVariantCreateFormData = {
      ...thirdStep,
      price: {
        ...thirdStep.price,
        all: false,
        attribute: attribute.id,
        values: attribute.values.map((attributeValue, attributeValueIndex) => ({
          slug: attributeValue,
          value: (price * (attributeValueIndex + 1)).toString()
        }))
      },
      stock: {
        ...thirdStep.stock,
        all: true,
        value: stock.toString()
      }
    };

    const variants = createVariants(data);
    expect(variants).toHaveLength(
      thirdStep.attributes.reduce(
        (acc, attribute) => acc * attribute.values.length,
        1
      )
    );

    variants.forEach(variant => {
      expect(variant.quantity).toBe(stock);
    });

    attribute.values.forEach((attributeValue, attributeValueIndex) => {
      variants
        .filter(
          variant =>
            variant.attributes.find(
              variantAttribute => variantAttribute.id === attribute.id
            ).values[0] === attributeValue
        )
        .forEach(variant => {
          expect(variant.priceOverride).toBe(
            (price * (attributeValueIndex + 1)).toString()
          );
        });
    });
  });

  it("with constant price and attribute dependent stock", () => {
    const price = "49.99";
    const stock = 80;
    const attribute = attributes.find(
      attribute => attribute.id === thirdStep.attributes[0].id
    );

    const data: ProductVariantCreateFormData = {
      ...thirdStep,
      price: {
        ...thirdStep.price,
        all: true,
        value: price
      },
      stock: {
        ...thirdStep.stock,
        all: false,
        attribute: attribute.id,
        values: attribute.values.map((attributeValue, attributeValueIndex) => ({
          slug: attributeValue,
          value: (stock * (attributeValueIndex + 1)).toString()
        }))
      }
    };

    const variants = createVariants(data);
    expect(variants).toHaveLength(
      thirdStep.attributes.reduce(
        (acc, attribute) => acc * attribute.values.length,
        1
      )
    );

    variants.forEach(variant => {
      expect(variant.priceOverride).toBe(price);
    });

    attribute.values.forEach((attributeValue, attributeValueIndex) => {
      variants
        .filter(
          variant =>
            variant.attributes.find(
              variantAttribute => variantAttribute.id === attribute.id
            ).values[0] === attributeValue
        )
        .forEach(variant => {
          expect(variant.quantity).toBe(stock * (attributeValueIndex + 1));
        });
    });
  });

  it("with attribute dependent price and stock", () => {
    const price = 49.99;
    const stock = 80;
    const attribute = attributes.find(
      attribute => attribute.id === thirdStep.attributes[0].id
    );

    const data: ProductVariantCreateFormData = {
      ...thirdStep,
      price: {
        ...thirdStep.price,
        all: false,
        attribute: attribute.id,
        values: attribute.values.map((attributeValue, attributeValueIndex) => ({
          slug: attributeValue,
          value: (price * (attributeValueIndex + 1)).toString()
        }))
      },
      stock: {
        ...thirdStep.stock,
        all: false,
        attribute: attribute.id,
        values: attribute.values.map((attributeValue, attributeValueIndex) => ({
          slug: attributeValue,
          value: (stock * (attributeValueIndex + 1)).toString()
        }))
      }
    };

    const variants = createVariants(data);
    expect(variants).toHaveLength(
      thirdStep.attributes.reduce(
        (acc, attribute) => acc * attribute.values.length,
        1
      )
    );

    attribute.values.forEach((attributeValue, attributeValueIndex) => {
      variants
        .filter(
          variant =>
            variant.attributes.find(
              variantAttribute => variantAttribute.id === attribute.id
            ).values[0] === attributeValue
        )
        .forEach(variant => {
          expect(variant.priceOverride).toBe(
            (price * (attributeValueIndex + 1)).toString()
          );
        });
    });

    attribute.values.forEach((attributeValue, attributeValueIndex) => {
      variants
        .filter(
          variant =>
            variant.attributes.find(
              variantAttribute => variantAttribute.id === attribute.id
            ).values[0] === attributeValue
        )
        .forEach(variant => {
          expect(variant.quantity).toBe(stock * (attributeValueIndex + 1));
        });
    });
  });
});
