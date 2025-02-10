import { UrlToken } from "../UrlToken";
import { getFetchingPrams, toGiftCardsFetchingParams } from "./fetchingParams";

describe("TokenArray / fetchingParams / getFetchingPrams", () => {
  it("should return product fetching params", () => {
    // Arrange
    const type = "product";

    // Act
    const fetchingParams = getFetchingPrams(type);

    // Assert
    expect(fetchingParams).toEqual({
      category: [],
      collection: [],
      channel: [],
      productType: [],
      attribute: {},
    });
  });

  it("should return order fetching params", () => {
    // Arrange
    const type = "order";

    // Act
    const fetchingParams = getFetchingPrams(type);

    // Assert
    expect(fetchingParams).toEqual({
      paymentStatus: [],
      status: [],
      authorizeStatus: [],
      chargeStatus: [],
      channels: [],
      customer: [],
      ids: [],
    });
  });

  it("should return gift cards fetching params", () => {
    // Arrange
    const type = "gift-cards";

    // Act
    const fetchingParams = getFetchingPrams(type);

    // Assert
    expect(fetchingParams).toEqual({
      currency: [],
      products: [],
      tags: [],
      usedBy: [],
    });
  });
});

describe("TokenArray / fetchingParams / toGiftCardsFetchingParams", () => {
  it("should return  fetching params", () => {
    // Arrange
    const params = {
      currency: [],
      products: [],
      tags: [],
      usedBy: [],
    };

    const token = {
      conditionKind: "in",
      name: "products",
      type: "s",
      value: ["product-1", "product-2", "product-3"],
    } as UrlToken;

    // Act
    const fetchingParams = toGiftCardsFetchingParams(params, token);

    // Assert
    expect(fetchingParams).toEqual({
      currency: [],
      products: ["product-1", "product-2", "product-3"],
      tags: [],
      usedBy: [],
    });
  });
});
