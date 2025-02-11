import { UrlToken } from "../UrlToken";
import { getFetchingPrams, toPageFetchingParams, toVouchersFetchingParams } from "./fetchingParams";

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

  it("should return voucher fetching params", () => {
    // Arrange
    const type = "voucher";

    // Act
    const fetchingParams = getFetchingPrams(type);

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
    const fetchingParams = getFetchingPrams(type);

    // Assert
    expect(fetchingParams).toEqual({
      pageTypes: [],
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
