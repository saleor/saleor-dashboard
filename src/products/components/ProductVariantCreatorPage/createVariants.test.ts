import {
  createVariantFlatMatrixDimension,
  createVariants
} from "./createVariants";
import { attributes, channels, thirdStep } from "./fixtures";
import { ChannelPrice, ProductVariantCreateFormData } from "./form";

describe("Creates variant matrix", () => {
  it("with proper size", () => {
    const attributes = thirdStep.attributes;

    const matrix = createVariantFlatMatrixDimension([[]], attributes);

    expect(matrix).toHaveLength(
      attributes.reduce((acc, attribute) => acc * attribute.values.length, 1)
    );
  });

  it("with constant price and stock", () => {
    const channels: ChannelPrice[] = [{ channelId: "1", price: "2" }];
    const stock = [80, 40, 30];

    const data: ProductVariantCreateFormData = {
      ...thirdStep,
      price: {
        ...thirdStep.price,
        channels,
        mode: "all"
      },
      stock: {
        ...thirdStep.stock,
        mode: "all",
        value: stock
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
      expect(variant.channelListings[0].price).toBe(channels[0].price);
      variant.stocks.forEach((_, stockIndex) => {
        expect(variant.stocks[stockIndex].quantity).toBe(stock[stockIndex]);
      });
    });
  });

  it("with constant stock and attribute dependent price", () => {
    const stock = [80, 40, 30];
    const attribute = attributes.find(
      attribute => attribute.id === thirdStep.attributes[0].id
    );

    const data: ProductVariantCreateFormData = {
      ...thirdStep,
      price: {
        ...thirdStep.price,
        attribute: attribute.id,
        mode: "attribute",
        values: attribute.values.map((attributeValue, index) => ({
          slug: attributeValue,
          value: channels.map(channel => ({
            channelId: channel.id,
            price: (channel.price + index).toString()
          }))
        }))
      },
      stock: {
        ...thirdStep.stock,
        mode: "all",
        value: stock
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
      variant.stocks.forEach((_, stockIndex) => {
        expect(variant.stocks[stockIndex].quantity).toBe(stock[stockIndex]);
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
          variant.channelListings.map((channel, index) => {
            expect(channel.price).toBe(
              (channels[index].price + attributeValueIndex).toString()
            );
          });
        });
    });
  });

  it("with constant price and attribute dependent stock", () => {
    const price: ChannelPrice[] = [{ channelId: "1", price: "2" }];
    const stock = [80, 40, 30];
    const attribute = attributes.find(
      attribute => attribute.id === thirdStep.attributes[0].id
    );

    const data: ProductVariantCreateFormData = {
      ...thirdStep,
      price: {
        ...thirdStep.price,
        channels: price,
        mode: "all"
      },
      stock: {
        ...thirdStep.stock,
        attribute: attribute.id,
        mode: "attribute",
        values: attribute.values.map((attributeValue, attributeValueIndex) => ({
          slug: attributeValue,
          value: stock.map(
            (_, stockIndex) => stock[stockIndex] * (attributeValueIndex + 1)
          )
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
      expect(variant.channelListings).toBe(price);
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
          variant.stocks.forEach((_, stockIndex) => {
            expect(variant.stocks[stockIndex].quantity).toBe(
              stock[stockIndex] * (attributeValueIndex + 1)
            );
          });
        });
    });
  });

  it("with attribute dependent price and stock", () => {
    const stock = [80, 40, 30];
    const attribute = attributes.find(
      attribute => attribute.id === thirdStep.attributes[0].id
    );

    const data: ProductVariantCreateFormData = {
      ...thirdStep,
      price: {
        ...thirdStep.price,
        attribute: attribute.id,
        mode: "attribute",
        values: attribute.values.map((attributeValue, index) => ({
          slug: attributeValue,
          value: channels.map(channel => ({
            channelId: channel.id,
            price: (channel.price + index).toString()
          }))
        }))
      },
      stock: {
        ...thirdStep.stock,
        attribute: attribute.id,
        mode: "attribute",
        values: attribute.values.map((attributeValue, attributeValueIndex) => ({
          slug: attributeValue,
          value: stock.map(
            (_, stockIndex) => stock[stockIndex] * (attributeValueIndex + 1)
          )
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
          variant.channelListings.map((channel, index) => {
            expect(channel.price).toBe(
              (channels[index].price + attributeValueIndex).toString()
            );
          });
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
          variant.stocks.forEach((_, stockIndex) => {
            expect(variant.stocks[stockIndex].quantity).toBe(
              stock[stockIndex] * (attributeValueIndex + 1)
            );
          });
        });
    });
  });
});
