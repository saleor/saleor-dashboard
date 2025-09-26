import { TokenType, UrlToken } from "../UrlToken";
import {
  emptyFetchingParams,
  getEmptyFetchingPrams,
  toAttributesFetchingParams,
  toCollectionFetchingParams,
  toFetchingParams,
  toGiftCardsFetchingParams,
  toPageFetchingParams,
  toProductTypesFetchingParams,
  toStaffMembersFetchingParams,
  toVouchersFetchingParams,
} from "./fetchingParams";

describe("TokenArray / fetchingParams / getEmptyFetchingPrams", () => {
  it("should return product fetching params", () => {
    // Arrange
    const type = "product";

    // Act
    const fetchingParams = getEmptyFetchingPrams(type);

    // Assert
    expect(fetchingParams).toEqual({
      category: [],
      collection: [],
      channel: [],
      productType: [],
      attribute: {},
      attributeReference: {},
    });
  });

  it("should return order fetching params", () => {
    // Arrange
    const type = "order";

    // Act
    const fetchingParams = getEmptyFetchingPrams(type);

    // Assert
    expect(fetchingParams).toEqual({
      status: [],
      fulfillmentStatus: [],
      authorizeStatus: [],
      chargeStatus: [],
      channels: [],
      customer: [],
      ids: [],
      metadata: [],
      number: [],
      userEmail: [],
      voucherCode: [],
      linesCount: [],
      checkoutId: [],
      linesMetadata: [],
      transactionsMetadata: [],
      transactionsPaymentType: [],
      transactionsCardBrand: [],
      fulfillmentsMetadata: [],
      fulfillmentWarehouse: [],
      billingPhoneNumber: [],
      billingCountry: [],
      shippingPhoneNumber: [],
      shippingCountry: [],
    });
  });

  it("should return voucher fetching params", () => {
    // Arrange
    const type = "voucher";

    // Act
    const fetchingParams = getEmptyFetchingPrams(type);

    // Assert
    expect(fetchingParams).toEqual({
      channel: [],
      discountType: [],
      voucherStatus: [],
    });
  });

  it("should return page fetching params", () => {
    // Arrange
    const type = "page";

    // Act
    const fetchingParams = getEmptyFetchingPrams(type);

    // Assert
    expect(fetchingParams).toEqual({
      pageTypes: [],
    });
  });

  it("should return gift cards fetching params", () => {
    // Arrange
    const type = "gift-cards";

    // Act
    const fetchingParams = getEmptyFetchingPrams(type);

    // Assert
    expect(fetchingParams).toEqual({
      currency: [],
      products: [],
      tags: [],
      usedBy: [],
    });
  });

  it("should return gift product tyes fetching params", () => {
    // Arrange
    const type = "product-types";

    // Act
    const fetchingParams = getEmptyFetchingPrams(type);

    // Assert
    expect(fetchingParams).toEqual({
      typeOfProduct: [],
      configurable: [],
    });
  });
});

describe("TokenArray / fetchingParams / toVouchersFetchingParams", () => {
  it("should return fetching params", () => {
    // Arrange
    const params = {
      channel: [],
      discountType: [],
      voucherStatus: [],
    };

    const token = {
      conditionKind: "is",
      name: "channel",
      type: "s",
      value: "channel-1",
    } as UrlToken;

    // Act
    const fetchingParams = toVouchersFetchingParams(params, token);

    // Assert
    expect(fetchingParams).toEqual({
      channel: ["channel-1"],
      discountType: [],
      voucherStatus: [],
    });
  });
});

describe("TokenArray / fetchingParams / toPageFetchingParams", () => {
  it("should return fetching params", () => {
    // Arrange
    const params = {
      pageTypes: ["page-type-1", "page-type-2"],
    };

    const token = {
      conditionKind: "in",
      name: "pageTypes",
      type: "s",
      value: ["page-type-1", "page-type-2"],
    } as UrlToken;

    // Act
    const fetchingParams = toPageFetchingParams(params, token);

    // Assert
    expect(fetchingParams).toEqual({
      pageTypes: ["page-type-1", "page-type-2"],
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

describe("TokenArray / fetchingParams / toCollectionFetchingParams", () => {
  it("should return  fetching params", () => {
    // Arrange
    const params = {
      channel: [],
      metadata: [],
      published: [],
    };

    const token = {
      conditionKind: "in",
      name: "channel",
      type: "s",
      value: "chan-1",
    } as UrlToken;

    // Act
    const fetchingParams = toCollectionFetchingParams(params, token);

    // Assert
    expect(fetchingParams).toEqual({
      channel: ["chan-1"],
      metadata: [],
      published: [],
    });
  });
});

describe("TokenArray / fetchingParams / toProductTypesFetchingParams", () => {
  it("should return  fetching params", () => {
    // Arrange
    const params = {
      typeOfProduct: [],
      configurable: [],
    };

    const token = {
      conditionKind: "is",
      name: "typeOfProduct",
      type: "s",
      value: "SHIPPABLE",
    } as UrlToken;

    // Act
    const fetchingParams = toProductTypesFetchingParams(params, token);

    // Assert
    expect(fetchingParams).toEqual({
      typeOfProduct: ["SHIPPABLE"],
      configurable: [],
    });
  });
});

describe("TokenArray / fetchingParams / toStaffMembersFetchingParams", () => {
  it("should return  fetching params", () => {
    // Arrange
    const params = {
      staffMemberStatus: [],
    };

    const token = {
      conditionKind: "in",
      name: "staffMemberStatus",
      type: "s",
      value: "active",
    } as UrlToken;

    // Act
    const fetchingParams = toStaffMembersFetchingParams(params, token);

    // Assert
    expect(fetchingParams).toEqual({
      staffMemberStatus: ["active"],
    });
  });
});

describe("TokenArray / fetchingParams / toAttributesFetchingParams", () => {
  it("should return  fetching params", () => {
    // Arrange
    const params = {
      channel: [],
      attributeType: [],
    };

    const token = {
      conditionKind: "in",
      name: "channel",
      type: "s",
      value: "chan-1",
    } as UrlToken;

    // Act
    const fetchingParams = toAttributesFetchingParams(params, token);

    // Assert
    expect(fetchingParams).toEqual({
      channel: ["chan-1"],
      attributeType: [],
    });
  });
});

describe("TokenArray / fetchingParams / toFetchingParams - REFERENCE attribute", () => {
  it("should add values to `attributeReference` for REFERENCE token, not `attribute` key", () => {
    // Arrange
    const params = { ...emptyFetchingParams };
    const token = {
      conditionKind: "is",
      name: "ref-attr",
      type: TokenType.ATTRIBUTE_REFERENCE,
      value: ["ref-value-1", "ref-value-2"],
      isAttribute: () => true,
      hasDynamicValues: () => true,
      isLoadable: () => true,
    } as UrlToken;

    // Act
    const result = toFetchingParams(params, token);

    // Assert
    expect(result.attributeReference["ref-attr"]).toEqual(["ref-value-1", "ref-value-2"]);
    expect(result.attribute["ref-attr"]).toBeUndefined();
  });
});
