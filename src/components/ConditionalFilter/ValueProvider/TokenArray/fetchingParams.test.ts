import { UrlToken } from "../UrlToken";
import { getFetchingPrams, toVouchersFetchingParams } from "./fetchingParams";

describe("TokenArray / fetchingParams", () => {
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
});

describe("TokenArray / fetchingParams / toFetchingParams", () => {
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
